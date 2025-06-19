import express from 'express';
import { Request, Response } from 'express';

// Create a new express application
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for parsing JSON bodies
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// Define a simple route
app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
