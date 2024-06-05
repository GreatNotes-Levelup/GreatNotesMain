import express from 'express';
import notes from './routes/notes.js';
import auth from './routes/auth.js';
import cors from 'cors';
import path from 'path';

import { configDotenv } from 'dotenv';
import authMiddleware from './middleware/authMiddleware.js';

configDotenv();
const app = express();
const port = process.env.PORT ?? 8080;

app.use(express.json());
//Print node env
console.log(`Node environment: ${process.env.ENV}`);

app.use(cors({
  origin: process.env.NODE_ENV === 'development'
  ? `http://localhost:${port}`
  : `${process.env.DOMAIN}`, 
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

const listener = app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

if (process.env.AWS_CLIENT_ID === undefined) {
  console.error('Check your AWS env vars');
}

if (process.env.DB_USER === undefined) {
  console.error('Check your DB env vars');
}

if (process.env.DOMAIN === undefined && process.env.ENV === 'production') {
  console.error('DOMAIN is undefined.')
  listener.close()
  process.exit(1)
}