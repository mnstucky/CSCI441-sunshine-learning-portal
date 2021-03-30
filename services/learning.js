const {
  getUserTracks,
  getPretestResult,
  getNumOfPretestQuestions,
  addUserToTrack,
  removeUserFromTrack,
  addTestResult,
  getTestResults,
  getAllTestResults,
  getTrackName,
} = require("../model/db");

function selectRandomQuestions(questions, num) {
  if (questions.length < num) {
    num = questions.length;
  }
  const selectedQuestions = [];
  const usedIndices = [];
  while (selectedQuestions.length < num) {
    let index = Math.floor(Math.random() * num);
    if (usedIndices.includes(index)) {
      continue;
    }
    usedIndices.push(index);
    selectedQuestions.push(questions[index]);
  }
  return selectedQuestions;
}

async function selectUserTracks(id) {
  const data = await getUserTracks(id);
  const tracks = [];
  data.forEach((value) => {
    tracks.push(value.trackid);
  });
  return tracks;
}

async function canUserSkipTrack(userId, trackId) {
  const rawPretestScore = await getPretestResult(userId, trackId);
  const pretestScore = rawPretestScore[0].pretestScore;
  const rawNumOfPretestQuestions = await getNumOfPretestQuestions(trackId);
  const numOfPretestQuestions = rawNumOfPretestQuestions[0].pretestquestions;
  let permission = false;
  if (pretestScore > 0 && numOfPretestQuestions == pretestScore) {
    permission = true;
  }
  return permission;
}

async function subscribeToTrack(userId, trackId) {
  const userTracks = await selectUserTracks(userId);
  const userHasTrack = userTracks.find((id) => id === Number(trackId));
  if (userHasTrack) {
    return false;
  } else {
    await addUserToTrack(userId, trackId);
    return true;
  }
}

async function unsubscribeFromTrack(userId, trackId) {
  const userTracks = await selectUserTracks(userId);
  const userHasTrack = userTracks.find((id) => id === Number(trackId));
  if (userHasTrack) {
    await removeUserFromTrack(userId, trackId);
    return true;
  } else {
    return false;
  }
}

async function submitResult(userId, trackId, test, score) {
  // Test whether the user is subscribed to the given track; if not, return false
  const userTracks = await selectUserTracks(userId);
  const userHasTrack = userTracks.find((id) => id === Number(trackId));
  if (!userHasTrack) {
    return false;
  }
  // Test whether the user has selected a valid test; if not, return false
  const priorScores = await getTestResults(userId, trackId);
  const existingTest = Object.keys(priorScores).find(ele => ele === test);
  if (!existingTest) {
    return false;
  }
  // Test whether the user has previously submitted a score for the test; if so, return false
  // TODO: We may want to allow someone to submit multiple results for a pretest
  const priorScore = priorScores[test];
  if (!priorScore) {
    await addTestResult(userId, trackId, test, score);
    return true;
  } else {
    return false;
  }
}

async function getInProcessTracks(userId) {
  const userResults = await getAllTestResults(userId);
  const userTracks = [];
  for (const result of userResults) {
    if (!result.postscore) {
      const trackName = await getTrackName(result.trackid);
      userTracks.push({trackid: result.trackid, name: trackName});
    }
  }
  return userTracks;
}

async function getCompletedTracks(userId) {
  const userResults = await getAllTestResults(userId);
  const userTracks = [];
  for (const result of userResults) {
    if (result.postscore) {
      const trackName = await getTrackName(result.trackid);
      userTracks.push({track: trackName,
        score: result.postscore});
    }
  }
  return userTracks;
}

exports.selectRandomQuestions = selectRandomQuestions;
exports.selectUserTracks = selectUserTracks;
exports.canUserSkipTrack = canUserSkipTrack;
exports.subscribeToTrack = subscribeToTrack;
exports.unsubscribeFromTrack = unsubscribeFromTrack;
exports.submitResult = submitResult;
exports.getInProcessTracks = getInProcessTracks;
exports.getCompletedTracks = getCompletedTracks;