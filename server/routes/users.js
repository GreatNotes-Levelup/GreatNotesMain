import authMiddleware from "../middleware/authMiddleware.js";
import pool from "../services/db_pool.cjs";
import { Router } from "express";

const router = Router();

router.get("/", authMiddleware, async (req, res) => {
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