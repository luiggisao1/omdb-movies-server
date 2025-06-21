import { Router } from "express";
import {
	getMovies,
	getTrendingMoviesController,
} from "../controllers/moviesController";

const moviesRouter = Router();

moviesRouter.get("/", getMovies);

moviesRouter.get("/trending", getTrendingMoviesController);

export default moviesRouter;
