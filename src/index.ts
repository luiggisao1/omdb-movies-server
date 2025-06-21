import cors from "cors";
import express from "express";
import moviesRouter from "./routes/movies";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/movies", moviesRouter);

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});

export default app;
