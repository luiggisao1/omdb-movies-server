import { type FirebaseOptions, initializeApp } from "firebase/app";
import {
	collection,
	type DocumentData,
	doc,
	FieldPath,
	getDoc,
	getDocs,
	getFirestore,
	increment,
	limit,
	orderBy,
	type QueryDocumentSnapshot,
	query,
	type SnapshotOptions,
	setDoc,
	updateDoc,
} from "firebase/firestore";

const firebaseConfig: FirebaseOptions = {
	apiKey: process.env.FIREBASE_API_KEY || "",
	authDomain: process.env.FIREBASE_AUTH_DOMAIN || "",
	projectId: process.env.FIREBASE_PROJECT_ID || "",
	storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "",
	messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "",
	appId: process.env.FIREBASE_APP_ID || "",
};

const firebase = initializeApp(firebaseConfig);
const db = getFirestore(firebase);

class SearchCount {
	count: number;
	movie_id: string;
	poster_url?: string;

	constructor(count: number, movie_id: string, poster_url?: string) {
		this.count = count;
		this.movie_id = movie_id;
		this.poster_url = poster_url;
	}
}

const movieConverter = {
	toFirestore: (movie: SearchCount) => {
		return {
			count: movie.count,
			movie_id: movie.movie_id,
			poster_url: movie.poster_url,
		};
	},
	fromFirestore: (
		snapshot: QueryDocumentSnapshot<SearchCount>,
		options: SnapshotOptions,
	) => {
		const data = snapshot.data(options);
		return new SearchCount(data.count, data.movie_id, data.poster_url);
	},
};

export const updateSearchcount = async (
	searchTerm: string,
	movieId: string,
	posterPath?: string,
) => {
	try {
		const moviesCollection = collection(db, "movies");
		const searchTermDoc = doc(moviesCollection, searchTerm).withConverter(
			movieConverter,
		);
		const querySnapshot = await getDoc(searchTermDoc);

		if (querySnapshot.exists()) {
			await updateDoc(searchTermDoc, {
				count: increment(1),
			});
		} else {
			const moviePoster = `https://image.tmdb.org/t/p/w500/${posterPath}`;
			await setDoc(searchTermDoc, new SearchCount(1, movieId, moviePoster));
		}
	} catch (e) {
		console.error(e);
	}
};

export const getTrendingMovies = async (): Promise<SearchCount[]> => {
	try {
		const countField = new FieldPath("count");
		const moviesCollection = collection(db, "movies").withConverter(
			movieConverter,
		);
		const q = query<SearchCount, DocumentData>(
			moviesCollection,
			orderBy(countField, "desc"),
			limit(5),
		);
		const querySnapshot = await getDocs(q);

		return querySnapshot.docs.map((doc) => doc.data());
	} catch (e) {
		console.error(e);
		throw new Error("Failed to fetch trending movies");
	}
};
