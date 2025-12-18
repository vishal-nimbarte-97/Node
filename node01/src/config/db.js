const { Pool } = require("pg");

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: String(process.env.DB_PASSWORD),
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT),
});

pool.connect()
  .then(() => console.log("✅ Database connected"))
  .catch(err => console.error("❌ DB connection error", err));

module.exports = pool;
