import express from 'express';
import notes from './routes/notes.js';
import auth from './routes/auth.js';
import cors from 'cors';
import path from 'path';

import { configDotenv } from 'dotenv';
import authMiddleware from './middleware/authMiddleware.js';

configDotenv();
const app = express();

app.use(express.json());
//Print node env
console.log(`Node environment: ${process.env.NODE_ENV}`);

app.use(cors({
  origin: process.env.NODE_ENV === 'development'
  ? 'http://localhost:3000'
  : 'https://great-notes.projects.bbdgrad.com', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'] 
}));

app.use('/api/notes', authMiddleware, notes);
app.use('/api/auth', auth);

app.use(express.static('dist'));
const __dirname = path.resolve(path.dirname(''));
app.get('/*', (req, res) => {
  res.sendFile(__dirname + '/dist/index.html');
});

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

if (process.env.AWS_CLIENT_ID === undefined) {
  console.error('Check your AWS env vars');
}

if (process.env.DB_USER === undefined) {
  console.error('Check your DB env vars');
}
