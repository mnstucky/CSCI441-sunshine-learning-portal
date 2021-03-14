// Load database services
const { getTestMessageUrl } = require("nodemailer");
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
    return undefined;
  }
}

async function getQuestionsByTrack(track) {
  const text = "SELECT * FROM question WHERE trackid = $1";
  const values = [track];
  try {
    const res = await pool.query(text, values);
    return res.rows;
  } catch (err) {
    console.error(err.stack);
  }
}

async function getQuestionById(id) {
  const text = "SELECT * from question WHERE questionid = $1";
  const values = [id];
  try {
    const res = await pool.query(text, values);
    return res.rows;
  } catch (err) {
    console.error(err.stack);
  }
}

async function getTracks() {
  const text = "SELECT * from learning_tracks";
  try {
    const res = await pool.query(text);
    return res.rows;
  } catch (err) {
    console.error(err.stack);
  }
}

async function getTrackName(trackId) {
  const text = "SELECT * from learning_tracks WHERE trackid = $1";
  const values = [trackId];
  try {
    const res = await pool.query(text, values);
    return res.rows[0].trackname;
  } catch (err) {
    console.error(err.stack);
  }
}

exports.pool = pool;
exports.getUserById = getUserById;
exports.getQuestionsByTrack = getQuestionsByTrack;
exports.getQuestionById = getQuestionById;
exports.getTracks = getTracks;
exports.getTrackName = getTrackName;