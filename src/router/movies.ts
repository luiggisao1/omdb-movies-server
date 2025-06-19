import axios from "axios";
import { Router } from "express";

const moviesRouter = Router();

const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = process.env.TMDB_API_KEY;
const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`,
  }
};

const session = axios.create();

moviesRouter.get('/', async (req, res) => {
  const query = req.query.query as string | undefined;
  const url = !!query
    ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}&sort_by=popularity.desc`
    : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

  const response = await session.request({url, ...API_OPTIONS});

  res.send(response.data);
});

export default moviesRouter;
