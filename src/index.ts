import express from 'express';
import cors from 'cors';
import { Request, Response } from 'express';
import moviesRouter from './router/movies';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.use('/movies', moviesRouter)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
