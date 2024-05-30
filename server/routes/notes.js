import { Router } from "express";
import s3Client from "../awsClient.js";
import { GetObjectCommand, PutObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';
import multer from "multer";
import dotenv from 'dotenv';

dotenv.config();

const router = Router();
const upload = multer();

const bucketName = process.env.AWS_S3_BUCKET_NAME;

// Modified endpoint to post a file to the bucket with a folder structure based on username
router.post('/upload-file', upload.single('file'), async (req, res) => {
  const username = req.query.username; 
  if (!username) {
    return res.status(400).send("Username is required");
  }

  try {
    const fileName = req.query.fileName || `${Date.now()}-${req.file.originalname}`;
    const filePath = `${username}/${fileName}`; 
    const uploadParams = { Key: filePath, Bucket: bucketName, Body: req.file.buffer };
    const command = new PutObjectCommand(uploadParams);
    const response = await s3Client.send(command);
    if (response.$metadata.httpStatusCode === 200) {
      res.send("success");
    } else {
      res.status(response.$metadata.httpStatusCode).send("Failed to upload the file");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

// Endpoint to list files for a given username
router.get('/user-files', async (req, res) => {
  const username = req.query.username;
  if (!username) {
    return res.status(400).send("Username is required");
  }

  try {
    const command = new ListObjectsV2Command({
      Bucket: bucketName,
      Prefix: `${username}/`
    });
    const response = await s3Client.send(command);
    const files = response.Contents.map(item => item.Key.replace(`${username}/`, ''));
    res.send(files);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

// New endpoint to get the actual contents of a file given the filename
router.get('/file-contents', async (req, res) => {
  const username = req.query.username;
  const fileName = req.query.fileName;
  
  if (!username) {
    return res.status(400).send("Username is required");
  }
  if (!fileName) {
    return res.status(400).send("Filename is required");
  }

  try {
    const filePath = `${username}/${fileName}`;
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: filePath
    });
    const response = await s3Client.send(command);
    const bodyStream = response.Body;

    // Convert the stream to a buffer
    const chunks = [];
    for await (const chunk of bodyStream) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    // Send the file as a response
    res.writeHead(200, {
      'Content-Disposition': `attachment; filename=${fileName}`,
      'Content-Type': response.ContentType
    });
    res.end(buffer);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

export default router;
