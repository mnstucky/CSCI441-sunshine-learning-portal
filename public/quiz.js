document.addEventListener("readystatechange", e => {
    if (e.target.readyState === "complete") {
      buildQuiz();
    }
});

function getChoiceName(index) {
  switch (index) {
    case 0: return "choicea";
      break;
    case 1: return "choiceb";
      break;
    case 2: return "choicec";
      break;
    case 3: return "choiced";
  }
}

function getChoiceLetter(index) {
  switch (index) {
    case 0: return "A";
      break;
    case 1: return "B";
      break;
    case 2: return "C";
      break;
    case 3: return "D";
  }
}

  async function buildQuiz(){
    // variable to store the HTML output
    const output = [];

    const rawQuestions = await fetch("/api?action=getquestions&track=3&num=5");
    const myQuestions = await rawQuestions.json();
    console.log(myQuestions);

    // for each question...
    myQuestions.forEach(
      (currentQuestion, questionNumber) => {

        const answers = [];
        for (let i = 0; i < 4; ++i) {
          const currentAnswer = 
            `<label>
              <input type="radio" name="question${questionNumber}" value="${getChoiceName(i)}">
              ${getChoiceLetter(i)} :
              ${currentQuestion[getChoiceName(i)]}
            </label>`;
          answers.push(currentAnswer);
        }

        // add this question and its answers to the output
        output.push(
          `<div class="question"> ${currentQuestion.question} </div>
          <div class="answers"> ${answers} </div>`
        );
      }
    );

    console.log(output);
    // finally combine our output list into one string of HTML and put it on the page
    quizContainer.innerHTML = output.join('');
  }

  function showResults(){

    // gather answer containers from our quiz
    const answerContainers = quizContainer.querySelectorAll('.answers');

    // keep track of user's answers
    let numCorrect = 0;

    // for each question...
    myQuestions.forEach( (currentQuestion, questionNumber) => {

      // find selected answer
      const answerContainer = answerContainers[questionNumber];
      const selector = `input[name=question${questionNumber}]:checked`;
      const userAnswer = (answerContainer.querySelector(selector) || {}).value;

      // if answer is correct
      if(userAnswer === currentQuestion.correctAnswer){
        // add to the number of correct answers
        numCorrect++;

        // color the answers green
        answerContainers[questionNumber].style.color = 'lightgreen';
      }
      // if answer is wrong or blank
      else{
        // color the answers red
        answerContainers[questionNumber].style.color = 'red';
      }
    });

    // show number of correct answers out of total
    resultsContainer.innerHTML = `${numCorrect} out of ${myQuestions.length}`;
  }

  const quizContainer = document.getElementById('quiz');
  const resultsContainer = document.getElementById('results');
  const submitButton = document.getElementById('submit');


  // Event listeners
  submitButton.addEventListener('click', showResults);