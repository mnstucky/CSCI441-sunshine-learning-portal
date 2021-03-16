const { getUserTracks } = require("../model/db");

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

exports.selectRandomQuestions = selectRandomQuestions;
exports.selectUserTracks = selectUserTracks;