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
  //const text = "SELECT trackid FROM learning_results WHERE studentid = $1";
  const text = "SELECT learning_results.trackid, learning_tracks.trackname FROM learning_results LEFT JOIN learning_tracks ON learning_results.trackid = learning_tracks.trackid WHERE studentid = $1 ORDER BY trackname";
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
  //const text = "SELECT studentid, postscore FROM learning_results WHERE trackid = $1 ORDER BY postscore DESC LIMIT 10";
  const text = "SELECT learning_results.studentid, learning_results.postscore, student_info.firstname, student_info.lastname FROM learning_results LEFT JOIN student_info ON learning_results.studentid = student_info.studentid WHERE trackid = $1 ORDER BY postscore DESC LIMIT 10";
  const values = [trackId];
  try {
    const res = await pool.query(text, values);
    return res.rows;
  } catch (err) {
    console.error(err.stack);
  }
}

async function getBadges(userId) {
  const text = "SELECT trackname, badgetype FROM badges WHERE studentid = $1";
  const values = [userId];
  try {
    const res = await pool.query(text, values);
    return res.rows;
  } catch (err) {
    console.error(err.stack);
  }
}

async function getAllTestResults(userId) {
  const text = "SELECT * FROM learning_results WHERE studentid = $1";
  const values = [userId];
  try {
    const res = await pool.query(text, values);
    return res.rows;
  } catch (err) {
    console.error(err.stack);
  }
}

async function getThreads() {
  const text = "select threadid, DATE(createdtime), studentid, title, status from discussion_thread";
  try {
    const res = await pool.query(text);
    return res.rows;
  } catch (err) {
    console.error(err.stack);
  }
}

async function getTotalPosts(threadid) {
  const text = "SELECT count(*) FROM discussion_post WHERE threadid = $1";
  const values = [threadid];
  try {
    const res = await pool.query(text, values);
    return res.rows;
  } catch (err) {
    console.error(err.stack);
  }
}

async function getPosts(threadid) {
  const text = "SELECT * FROM discussion_post WHERE threadid = $1 ORDER BY createdtime";
  const values = [threadid];
  try {
    const res = await pool.query(text, values);
    return res.rows;
  } catch (err) {
    console.error(err.stack);
  }
}

async function getUnreadPostCount(threadid) {
  const text = "SELECT count(*) FROM discussion_post LEFT JOIN discussion_tracker ON cast(discussion_post.studentid AS integer) = discussion_tracker.userid WHERE discussion_post.threadid = $1 AND discussion_post.createdtime < discussion_tracker.viewtime";
  const values = [threadid];
  try {
    const res = await pool.query(text, values);
    return res.rows;
  } catch (err) {
    console.error(err.stack);
  }
}

async function getUnreadReplyCount(threadid) {
  const text = "SELECT count(*) FROM discussion_post LEFT JOIN discussion_tracker ON cast(discussion_post.studentid AS integer) = discussion_tracker.userid LEFT JOIN discussion_thread ON discussion_thread.threadid = discussion_post.threadid WHERE threadid = $1 AND discussion_post.createdtime < discussion_tracker.viewtime";
  const values = [threadid];
  try {
    const res = await pool.query(text, values);
    return res.rows;
  } catch (err) {
    console.error(err.stack);
  }
}

async function addThread(userId, threadTitle) {
  const text = "INSERT INTO discussion_thread VALUES ((select max(threadid)+1 from discussion_thread), $1, $2, current_timestamp, 'open')";
  const values = [userId, threadTitle];
  try {
    const res = await pool.query(text, values);
    console.log(`Created new thread`);
    return res;
  } catch (err) {
    console.error(err.stack);
  }
}

async function addPost(userId, threadId, postText) {
  const text = "INSERT INTO discussion_post VALUES ((select max(postid)+1 from discussion_post), $1, $2, $3, current_timestamp, current_timestamp)";
  const values = [threadId, userId, postText];
  try {
    const res = await pool.query(text, values);
    console.log(`Created new post`);
    return res;
  } catch (err) {
    console.error(err.stack);
  }
}

async function addTracker(userId, threadId) {
  let text = "UPDATE discussion_tracker VALUES ((select max(trackerid)+1 from discussion_tracker), $1, current_timestamp, $2) WHERE userid = $1 AND threadid = $2";
  text = "INSERT INTO discussion_tracker VALUES ((select max(trackerid)+1 from discussion_tracker), $1, current_timestamp, $2) WHERE NOT EXISTS userid = $1 AND threadid = $2";
  const values = [userId, threadId];
  try {
    const res = await pool.query(text, values);
    console.log(`Tracker updated`);
  } catch (err) {
    console.error(err.stack);
  }
}

async function getThreadName(threadId) {
  const text = "SELECT title FROM discussion_thread WHERE threadid = $1";
  const values = [threadId];
  try {
    const res = await pool.query(text, values);
    return res.rows[0].title;
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
exports.getBadges = getBadges;
exports.getAllTestResults = getAllTestResults;
exports.getThreads = getThreads;
exports.getTotalPosts = getTotalPosts;
exports.getUnreadPostCount = getUnreadPostCount;
exports.getUnreadReplyCount = getUnreadReplyCount;
exports.addThread = addThread;
exports.addPost = addPost;
exports.addTracker = addTracker;
exports.getPosts = getPosts;
exports.getThreadName = getThreadName;