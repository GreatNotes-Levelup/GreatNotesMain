import express from 'express';
import notes from './routes/notes.js';
import auth from './routes/auth.js';
import users from './routes/users.js';
import cors from 'cors';
import path from 'path';
import authMiddleware from './middleware/authMiddleware.js';
import { rateLimit } from 'express-rate-limit'

import { configDotenv } from 'dotenv';

configDotenv();
const app = express();
const tokenLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 500, 
	standardHeaders: 'draft-7', 
	legacyHeaders: false, 
  keyGenerator: (req, res) => res.locals.user.username,
})

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 50, 
	standardHeaders: 'draft-7', 
	legacyHeaders: false,
})

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

// Endpoints for authorizing user - Limits on IP address
app.use('/api/auth', authLimiter);
app.use('/api/auth', auth);

// Main API Endpoints - Limits on username for user
app.use('/api', authMiddleware);
app.use('/api', tokenLimiter);  
app.use('/api/notes', notes);

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
