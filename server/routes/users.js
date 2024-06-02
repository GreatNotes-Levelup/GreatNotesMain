import pool from "../services/db_pool.cjs";
import {verify} from "../services/jwt.js";

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

export default router;