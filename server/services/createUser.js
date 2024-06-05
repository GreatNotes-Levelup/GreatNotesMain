import pool from "../services/db_pool.cjs";
import jwt from 'jsonwebtoken';

export async function createUser(token) {

  const decodedToken = jwt.decode(token, { complete: true });

  const user_id = decodedToken.payload['cognito:username'];
  const email=decodedToken.payload['email'];
  const username = decodedToken.payload['name'];;

  const client = await pool.connect();
  try {
    const userCheck = await client.query(
      'SELECT * FROM public."Users" WHERE user_id = $1',
      [user_id]
    );

    if (userCheck.rows.length > 0) {
      console.log("User already exists");
    }
    else{
       await client.query(
      'INSERT INTO public."Users" (user_id, username, email, created_at) VALUES ($1, $2, $3, NOW()) RETURNING *',
      [user_id, username, email]
      );
    }
  } catch (err) {
    console.error(err);
    throw new Error("Internal DB error");
  } finally {
    client.release();
  }
}
