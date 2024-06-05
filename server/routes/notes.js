import { Router } from "express";
import s3Client from "../awsClient.js";
import { GetObjectCommand, PutObjectCommand, ListObjectsV2Command, HeadObjectCommand } from '@aws-sdk/client-s3';
import multer from "multer";
import dotenv from 'dotenv';
import { getUserContext } from "../services/userContext.js";
import pool from "../services/db_pool.cjs";
import bodyParser from 'body-parser';
import authMiddleware from "../middleware/authMiddleware.js";

dotenv.config();

const router = Router();
router.use(bodyParser.json());

// Endpoint to get all notes for user
router.get('/all-user-notes', authMiddleware, async (req, res) => {
  const user = res.locals.user;

  try {
    const result = await pool.query('SELECT * FROM "Notes" WHERE owner_id = $1 ORDER BY "created_at" DESC', [user.username]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Endpoint to get notes shared with a user
router.get('/shared-notes', async (req, res) => {
  const user = getUserContext();

  if (!user) {
    throw new Error('User context is not set');
  }

  const { userId, username, email } = user;

  if (!userId) {
    return res.status(400).send("Not Logged In");
  }

  try {
    const result = await pool.query(`
      SELECT n.*
      FROM "Notes" n
      JOIN "NoteAccess" na ON n.note_id = na.note_id
      WHERE na.user_id = $1
    `, [userId]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Endpoint to check if a user has access to a note
router.get('/accessed-notes', async (req, res) => {
  const { id } = req.params;
  const user = getUserContext();

  if (!user) {
    throw new Error('User context is not set');
  }

  const { userId, username, email } = user;

  if (!userId) {
    return res.status(400).send("Not Logged In");
  }

  try {
    const result = await pool.query('SELECT * FROM "NoteAccess" WHERE note_id = $1 AND user_id = $2', [id, userId]);
    res.json(result.rowCount > 0);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Endpoint to get a note by its id
router.get('/notebyID', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('SELECT * FROM "Notes" WHERE note_id = $1', [id]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Endpoint to create a note
router.post('/create-note', async (req, res) => {
  const { title, description, content } = req.body;

  const user = getUserContext();

  if (!user) {
    throw new Error('User context is not set');
  }

  const { userId, username, email } = user;

  if (!userId) {
    return res.status(400).send("Not Logged In");
  }

  try {
    const result = await pool.query(`
      INSERT INTO "Notes" (title, description, owner_id, content, created_at, updated_at)
      VALUES ($1, $2, $3, $4, NOW(), NOW()) RETURNING *
    `, [title, description, userId, content]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Endpoint to add a person to the note access table
router.post('/add-access', async (req, res) => {
  const { id } = req.params;
  const { email } = req.body;

  try {
    // Get the user id from the email
    const userResult = await pool.query('SELECT user_id FROM "Users" WHERE email = $1', [email]);
    if (userResult.rowCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userId = userResult.rows[0].user_id;

    const result = await pool.query(`
      INSERT INTO "NoteAccess" (user_id, note_id)
      VALUES ($1, $2) RETURNING *
    `, [userId, id]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Endpoint to save (update) a note
router.put('/update-note/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, content } = req.body;

  try {
    const result = await pool.query(
      `UPDATE "Notes" 
       SET title = $1, description = $2, content = $3, updated_at = NOW()
       WHERE note_id = $4 
       RETURNING *`,
      [title, description, content, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Endpoint to delete a note
router.delete('/delete-note', async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query('DELETE FROM "Notes" WHERE note_id = $1', [id]);
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
