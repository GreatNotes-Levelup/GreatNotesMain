import pool from "../services/db_pool.cjs";

export async function createUser(req, res) {
  
  const client = await pool.connect();
  try {
    const userCheck = await client.query(
      'SELECT * FROM public."Users" WHERE user_id = $1',
      [username]
    );

    if (userCheck.rows.length > 0) {
      console.log("User already exists");
    }
    else{
       await client.query(
      'INSERT INTO public."Users" (user_id, username, email, created_at) VALUES ($1, $2, $3, NOW()) RETURNING *',
      [userId, username, email]
      );
    }
  } catch (err) {
    console.error(err);
    throw new Error("Internal DB error");
  } finally {
    client.release();
  }
}
