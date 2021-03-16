const { getUserTracks, getPretestResult, getNumOfPretestQuestions, addUserToTrack, removeUserFromTrack } = require("../model/db");

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
  data.forEach(value => {
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
  const userHasTrack = userTracks.find(id => id === Number(trackId));
  if (userHasTrack) {
    return false;
  } else {
    await addUserToTrack(userId, trackId);
    return true;
  }
}

async function unsubscribeFromTrack(userId, trackId) {
   const userTracks = await selectUserTracks(userId);
  const userHasTrack = userTracks.find(id => id === Number(trackId));
  if (userHasTrack) {
    await removeUserFromTrack(userId, trackId);
    return true;
  } else {
    return false;
  }

}
exports.selectRandomQuestions = selectRandomQuestions;
exports.selectUserTracks = selectUserTracks;
exports.canUserSkipTrack = canUserSkipTrack;
exports.subscribeToTrack = subscribeToTrack;
exports.unsubscribeFromTrack = unsubscribeFromTrack;