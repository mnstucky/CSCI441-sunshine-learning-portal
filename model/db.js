// Load database services
const { Pool } = require("pg");
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function getUserById(userId) {
  const text = "SELECT * FROM student_info WHERE studentid = $1";
  const values = [userId];
  try {
    const res = await pool.query(text, values);
    return res.rows[0];
  } catch (err) {
    console.error(err.stack);
  }
}

exports.pool = pool;
exports.getUserById = getUserById;
