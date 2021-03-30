document.addEventListener("readystatechange", (e) => {
  if (e.target.readyState === "complete") {
    const quizButtons = document
      .querySelectorAll(".startTrack")
      .forEach((button) => {
        button.addEventListener("click", (event) => {
          const trackId = event.target.id;
          const trackName = event.target.innerText;
          startTrack(trackId, trackName);
        });
      });
  }
});

function getChoiceName(index) {
  switch (index) {
    case 0:
      return "choicea";
      break;
    case 1:
      return "choiceb";
      break;
    case 2:
      return "choicec";
      break;
    case 3:
      return "choiced";
  }
}

function getChoiceLetter(index) {
  switch (index) {
    case 0:
      return "A";
      break;
    case 1:
      return "B";
      break;
    case 2:
      return "C";
      break;
    case 3:
      return "D";
  }
}

async function startTrack(trackId, trackName) {
  // When the user starts a track, hide extra information
  hideDefaultDisplay();
  // Display the track name in the heading
  displayTrackNameHeading(trackName);
  // Get data for track
  const rawResults = await fetch(`/api?action=getresults&track=${trackId}`);
  const results = await rawResults.json();
  // results takes the form:
  // { postscore: 0
  // practicescore1: 0
  // practicescore2: 0
  // practicescore3: 0
  // pretestscore: 0
  // studentid: "123456"
  // trackid: 4 }
  if (results.pretestscore === 0) {
    takePretest(trackId);
  }
}

function hideDefaultDisplay() {
  const defaultDisplay = document.getElementById("defaultDisplay");
  defaultDisplay.classList.add("d-none");
}

function displayTrackNameHeading(trackName) {
  const header = document.querySelector("h1");
  header.innerText = trackName;
}

async function getRandomQuestions(trackId) {
  const rawQuestions = await fetch(
    `/api?action=getquestions&track=${trackId}&num=5`
  );
  const myQuestions = await rawQuestions.json();
  return myQuestions;
}

function displayQuestions(myQuestions) {
// variable to store the HTML output
  const output = [];
  myQuestions.forEach((currentQuestion, questionNumber) => {
    const answers = [];
    for (let i = 0; i < 4; ++i) {
      const currentAnswer = `<label>
              <input type="radio" name="question${questionNumber}" id="${getChoiceLetter(i)}">
              ${getChoiceLetter(i)} :
              ${currentQuestion[getChoiceName(i)]}
            </label>`;
      answers.push(currentAnswer);
    }

    // add this question and its answers to the output
    output.push(
      `<div class="question"> ${currentQuestion.question} </div>
          <div class="answers"> ${answers.join("")} </div>`
    );
  });
  output.push('<button class="submitButton">Submit</button');
  // finally combine our output list into one string of HTML and put it on the page
  const quizContainer = document.getElementById("quiz");
  quizContainer.innerHTML = output.join("");
}

async function takePretest(trackId) {
  const myQuestions = await getRandomQuestions(trackId);
  // myQuestions takes the form of an array of objects, such as: 
  // { answer: "C"
  // choicea: "Cara ordered 7 pizza for her birthday party. Her parents ate 1/2 of a pizza before the party. How much pizza is left for the party?"
  // choiceb: "Walt has 7 hamsters. Each hamster weighs 1/2 kilogram. What is the total weight of the hamsters?"
  // choicec: "Jenae has 1/2 kilogram of trail mix. She splits her trail mix evenly between 7 friends. How much trail mix will each friend get?"
  // choiced: "Jack ordered 7 cupcakes for his class. His parents ate 1/2 of a cupcakes before the school. How many cupcakes are left for the class?"
  // question: "Which problem can we solve with 1/2 ÷7?"
  // questionid: 12
  // trackid: 4 }
  displayQuestions(myQuestions);
  const submitButton = document.querySelector(".submitButton");
  submitButton.addEventListener("click", (event) => {
    gradeTest(myQuestions);
  });
}

function gradeTest(myQuestions) {
  let numCorrect = 0;
  let currentQuestion = 0;
  const allAnswerSets = document.querySelectorAll(".answers");
  console.log(allAnswerSets);
  for (const answerSet of allAnswerSets) {
    const correctAnswerLetter = myQuestions[currentQuestion].answer;
    for (const possibleAnswer of answerSet.children) {
      const radioButton = possibleAnswer.children[0];
      const possibleAnswerLetter = radioButton.id;
      if (correctAnswerLetter === possibleAnswerLetter) {
        if (radioButton.checked) {
          numCorrect += 1;
        } else {
        }
      }
    }
    currentQuestion += 1;
  }
  alert(numCorrect);
}

function showResults() {
  // gather answer containers from our quiz

  // keep track of user's answers
  let numCorrect = 0;

  // for each question...
  myQuestions.forEach((currentQuestion, questionNumber) => {
    // find selected answer
    const answerContainer = answerContainers[questionNumber];
    const selector = `input[name=question${questionNumber}]:checked`;
    const userAnswer = (answerContainer.querySelector(selector) || {}).value;

    // if answer is correct
    if (userAnswer === currentQuestion.correctAnswer) {
      // add to the number of correct answers
      numCorrect++;

      // color the answers green
      answerContainers[questionNumber].style.color = "lightgreen";
    }
    // if answer is wrong or blank
    else {
      // color the answers red
      answerContainers[questionNumber].style.color = "red";
    }
  });

  // show number of correct answers out of total
  resultsContainer.innerHTML = `${numCorrect} out of ${myQuestions.length}`;
}

// Event listeners
submitButton.addEventListener("click", showResults);
