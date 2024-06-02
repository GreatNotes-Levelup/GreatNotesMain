import express from 'express';
import notes from './routes/notes.js';
import auth from './routes/auth.js';
import users from './routes/users.js';

import { configDotenv } from 'dotenv';

configDotenv();
const app = express();

app.use(express.json());

console.log(process.env.NODE_ENV);

app.use((req, res, next) => {
  res.setHeader(
    'Access-Control-Allow-Origin',
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000'
      : 'https://great-notes.projects.bbdgrad.com'
  );
  next();
});

app.use(express.static('dist'));
app.use('/api/notes', notes);
app.use('/api/auth', auth);
app.use('/api/users', users);

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
