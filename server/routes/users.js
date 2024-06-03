import pool from "../services/db_pool.cjs";
import {verify} from "../services/jwt.js";
import { getUserContext } from "../services/userContext.js";
import { Router } from "express";

const router = Router();

router.get("/", async (req, res) => {
  // if (req.headers.authorization === null) {
  //   res.status(403).json("No Token");
  //   return;
  // }
  // if (!await verify(req.headers.authorization)) {
  //   res.status(403).json("Unauthorized");
  //   return;
  // }
  const client = await pool.connect();
  try {
    let rows = await client.query("SELECT * FROM public.\"Users\"");
    res.json(rows.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json("Internal DB error");
  }
  finally {
    client.release();
  }
});

router.post('/create-user', async (req, res) => {
  const user = getUserContext();

  if (!user) {
    throw new Error('User context is not set');
  }

  const { userId, username, email } = user;

  const client = await pool.connect();
  try {
    const userCheck = await client.query(
      'SELECT * FROM public."Users" WHERE user_id = $1',
      [username]
    );

    if (userCheck.rows.length > 0) {
      res.status(200).json("User already exists");
      return;
    }

    const insertUser = await client.query(
      'INSERT INTO public."Users" (user_id, username, email, created_at) VALUES ($1, $2, $3, NOW()) RETURNING *',
      [userId,username, email] 
    );
    res.status(201).json(insertUser.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json("Internal DB error");
  } finally {
    client.release();
  }
});

export default router;