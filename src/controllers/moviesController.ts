import axios from "axios";
import type { Request, Response } from "express";
import { getTrendingMovies, updateSearchcount } from "../firebase/firebase";

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = process.env.TMDB_API_KEY;
const API_OPTIONS = {
	method: "GET",
	headers: {
		accept: "application/json",
		Authorization: `Bearer ${API_KEY}`,
	},
};

const session = axios.create();

const getMovies = async (req: Request, res: Response) => {
	const query = req.query.query as string | undefined;
	const url = query
		? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}&sort_by=popularity.desc`
		: `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

	const response = await session.request({ url, ...API_OPTIONS });
	if (query) {
		const movie = response.data.results[0];
		await updateSearchcount(query, movie.id, movie.poster_path);
	}

	res.send(response.data);
};

const getTrendingMoviesController = async (_: Request, res: Response) => {
	try {
		const trendingMovies = await getTrendingMovies();
		res.status(200).json(trendingMovies);
	} catch (error) {
		console.error("Error fetching trending movies:", error);
		res.status(500).json({ error: "Failed to fetch trending movies" });
	}
};

export { getMovies, getTrendingMoviesController };
