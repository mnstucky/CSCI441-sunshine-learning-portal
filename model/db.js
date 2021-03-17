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

async function getLearningMaterials(trackId) {
  const text =
    "SELECT video1, learningtext, video2 FROM learning_tracks WHERE trackid = $1";
  const values = [trackId];
  try {
    const res = await pool.query(text, values);
    return res.rows;
  } catch (err) {
    console.error(err.stack);
  }
}

async function addUserToTrack(userId, trackId) {
  const text = "INSERT INTO learning_results VALUES ($1, $2, 0, 0, 0, 0, 0)";
  const values = [userId, trackId];
  try {
    const res = await pool.query(text, values);
    console.log(`User ${userId} added to track ${trackId}`);
  } catch (err) {
    console.error(err.stack);
  }
}

async function removeUserFromTrack(userId, trackId) {
  const text = "DELETE FROM learning_results WHERE studentid = $1 AND trackid = $2";
  const values = [userId, trackId];
  try {
    const res = await pool.query(text, values);
    console.log(`User ${userId} removed from track ${trackId}`);
  } catch (err) {
    console.error(err.stack);
  }
}
async function getUserTracks(userId) {
  const text = "SELECT trackid FROM learning_results WHERE studentid = $1";
  const values = [userId];
  try {
    const res = await pool.query(text, values);
    return res.rows;
  } catch (err) {
    console.error(err.stack);
  }
}

async function getPretestResult(userId, trackId) {
  const text =
    "SELECT pretestscore FROM learning_results WHERE studentid = $1 AND trackid = $2";
  const values = [userId, trackId];
  try {
    const res = await pool.query(text, values);
    return res.rows;
  } catch (err) {
    console.error(err.stack);
  }
}

async function getNumOfPretestQuestions(trackId) {
  const text =
    "SELECT pretestquestions FROM learning_tracks WHERE trackid = $1";
  const values = [trackId];
  try {
    const res = await pool.query(text, values);
    return res.rows;
  } catch (err) {
    console.error(err.stack);
  }
}

async function addTestResult(userId, trackId, test, score) {
  const text = `UPDATE learning_results SET ${test} = $1 WHERE studentid = $2 AND trackid = $3`;
  const values = [score, userId, trackId];
  try {
    const res = await pool.query(text, values);
    return res.rows;
  } catch (err) {
    console.error(err.stack);
  }
}

async function getTestResults(userId, trackId) {
  const text = "SELECT * FROM learning_results WHERE studentid = $1 AND trackid = $2";
  const values = [userId, trackId];
  try {
    const res = await pool.query(text, values);
    return res.rows[0]; 
  } catch (err) {
    console.error(err.stack);
  }
}

async function getTop10(trackId) {
  const text = "SELECT studentid, postscore FROM learning_results WHERE trackid = $1 ORDER BY postscore LIMIT 10";
  const values = [trackId];
  try {
    const res = await pool.query(text, values);
    return res.rows;
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
exports.getLearningMaterials = getLearningMaterials;
exports.addUserToTrack = addUserToTrack;
exports.removeUserFromTrack = removeUserFromTrack;
exports.getUserTracks = getUserTracks;
exports.getPretestResult = getPretestResult;
exports.getNumOfPretestQuestions = getNumOfPretestQuestions;
exports.addTestResult = addTestResult;
exports.getTestResults = getTestResults;
exports.getTop10 = getTop10;