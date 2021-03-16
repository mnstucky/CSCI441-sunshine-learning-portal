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

async function addTestUser() {
  const text =
    "INSERT INTO student_info VALUES ('999999', 'studenttestaccount@yahoo.com', '$2b$12$D2sT1ii8.rUBIsyQ6TF8RuaSQHieuzDa7e4kad3MIoSqOLu7M7ksi', 'Testy', 'Tester', 5, 'Test Teacher', 'teachertestaccount@yahoo.com', 'Test School', '123 Test Street', '999-999-9999')";
  try {
    const res = await pool.query(text);
  } catch (err) {
    console.error(err);
  }
}

async function deleteTestUser() {
  const text =
    "DELETE FROM student_info WHERE studentid = '999999'";
  try {
    const res = await pool.query(text);
  } catch (err) {
    console.error(err);
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
exports.addTestUser = addTestUser;
exports.deleteTestUser = deleteTestUser;