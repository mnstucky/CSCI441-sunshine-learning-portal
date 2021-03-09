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

exports.selectRandomQuestions = selectRandomQuestions;
