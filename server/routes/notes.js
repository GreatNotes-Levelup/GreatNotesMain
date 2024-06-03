import { Router } from "express";
import s3Client from "../awsClient.js";
import { GetObjectCommand, PutObjectCommand, ListObjectsV2Command, HeadObjectCommand } from '@aws-sdk/client-s3';
import multer from "multer";
import dotenv from 'dotenv';
import { getUserContext } from "../services/userContext.js";
import pool from "../services/db_pool.cjs";

dotenv.config();

const router = Router();
// const upload = multer();

// const bucketName = process.env.AWS_S3_BUCKET_NAME;

// // Check if a file exists in the S3 bucket
// const checkFileExists = async (filePath) => {
//   try {
//     const command = new HeadObjectCommand({
//       Bucket: bucketName,
//       Key: filePath
//     });
//     await s3Client.send(command);
//     return true;
//   } catch (error) {
//     if (error.name === 'NotFound') {
//       return false;
//     }
//     throw error;
//   }
// };

// // Create a new note
// router.post('/create-note', upload.single('file'), async (req, res) => {
//   const user = getUserContext();

//   if (!user) {
//     throw new Error('User context is not set');
//   }

//   const { userId, username, email } = user;

//   if (!username) {
//     return res.status(400).send("Username is required");
//   }

//   const fileName = req.query.fileName || `${Date.now()}-${req.file.originalname}`;
//   const filePath = `${username}/${fileName}`;

//   try {

//     const fileExists = await checkFileExists(filePath);
//     if (fileExists) {
//       return res.status(400).send("File already exists");
//     }

//     const uploadParams = { Key: filePath, Bucket: bucketName, Body: req.file.buffer };
//     const command = new PutObjectCommand(uploadParams);
//     const response = await s3Client.send(command);
//     if (response.$metadata.httpStatusCode === 200) {
//       res.send("success");
//     } else {
//       res.status(response.$metadata.httpStatusCode).send("Failed to upload the file");
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).send(error);
//   }
// });

// // Update an existing note
// router.put('/update-file', upload.single('file'), async (req, res) => {
//   const username = req.query.username; 
//   const fileName = req.query.fileName;

//   if (!username) {
//     return res.status(400).send("Username is required");
//   }
//   if (!fileName) {
//     return res.status(400).send("Filename is required");
//   }

//   const filePath = `${username}/${fileName}`;

//   try {
//     const fileExists = await checkFileExists(filePath);
//     if (!fileExists) {
//       return res.status(400).send("File does not exist");
//     }

//     const uploadParams = { Key: filePath, Bucket: bucketName, Body: req.file.buffer };
//     const command = new PutObjectCommand(uploadParams);
//     const response = await s3Client.send(command);
//     if (response.$metadata.httpStatusCode === 200) {
//       res.send("success");
//     } else {
//       res.status(response.$metadata.httpStatusCode).send("Failed to update the file");
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).send(error);
//   }
// });

// // List all notes for user
// router.get('/user-files', async (req, res) => {
//   const username = req.query.username;
//   if (!username) {
//     return res.status(400).send("Username is required");
//   }

//   try {
//     const command = new ListObjectsV2Command({
//       Bucket: bucketName,
//       Prefix: `${username}/`
//     });
//     const response = await s3Client.send(command);
//     const files = response.Contents.map(item => item.Key.replace(`${username}/`, ''));
//     res.send(files);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send(error);
//   }
// });

// // Read note contents
// router.get('/file-contents', async (req, res) => {
//   const username = req.query.username;
//   const fileName = req.query.fileName;

//   if (!username) {
//     return res.status(400).send("Username is required");
//   }
//   if (!fileName) {
//     return res.status(400).send("Filename is required");
//   }

//   try {
//     const filePath = `${username}/${fileName}`;
//     const command = new GetObjectCommand({
//       Bucket: bucketName,
//       Key: filePath
//     });
//     const response = await s3Client.send(command);
//     const bodyStream = response.Body;

//     const chunks = [];
//     for await (const chunk of bodyStream) {
//       chunks.push(chunk);
//     }
//     const buffer = Buffer.concat(chunks);

//     res.writeHead(200, {
//       'Content-Disposition': `attachment; filename=${fileName}`,
//       'Content-Type': response.ContentType
//     });
//     res.end(buffer);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send(error);
//   }
// });

// Endpoint to create or update a note
router.post('/save-note', async (req, res) => {
  const { content_url } = req.body;
  const user = getUserContext();

  if (!user) {
    throw new Error('User context is not set');
  }

  const { userId, username, email } = user;

  if (!username) {
    return res.status(400).send("Username is required");
  }

  const is_public = false; 
  const currentTime = new Date();

  try {
    // Check if note exists
    const existingNoteResult = await pool.query(
      `SELECT * FROM "Notes" WHERE content = $1 AND owner_id = $2`,
      [content_url, userId]
    );

    if (existingNoteResult.rows.length > 0) {
      // Update the existing note
      const result = await pool.query(
        `UPDATE "Notes" SET content = $1, updated_at = $2 WHERE note_id = $3 RETURNING *`,
        [content_url, currentTime, existingNoteResult.rows[0].note_id]
      );

      return res.json(result.rows[0]);
    } else {
      // Create a new note
      const result = await pool.query(
        `INSERT INTO "Notes" (owner_id, content, created_at, updated_at, is_public) 
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [userId, content_url, currentTime, currentTime, is_public]
      );

      return res.status(201).json(result.rows[0]);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//get all user notes
router.get('/user-notes', async (req, res) => {

  const user = getUserContext();

  if (!user) {
    throw new Error('User context is not set');
  }

  const { userId, username, email } = user;

  if (!username) {
    return res.status(400).send("Username is required");
  }

  try {
    const result = await pool.query(
      `SELECT * FROM "Notes" WHERE owner_id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No notes found for this user' });
    }

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Endpoint to delete a note
router.delete('/delete-note', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `DELETE FROM "Notes" WHERE note_id = $1 RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Note not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


export default router;
