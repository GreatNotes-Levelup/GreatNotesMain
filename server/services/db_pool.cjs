const { Pool } = require("pg");
require("dotenv").configDotenv();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: process.env.ENV === 'development' ? null : {
    rejectUnauthorized: false,
  },
});

module.exports = pool;