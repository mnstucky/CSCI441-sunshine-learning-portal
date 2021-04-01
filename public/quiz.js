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

async function startTrack(trackId, trackName) {
  // When the user starts a track, hide extra information
  hideDefaultDisplay();
  document.querySelector(".nextButton").disabled = true;
  // Display the track name in the heading
  displayTrackNameHeading(trackName);
  // Get data for track
  const rawResults = await fetch(`/api?action=getresults&track=${trackId}`);
  const results = await rawResults.json();
  const rawlearningMaterials = await fetch(
    `/api/?action=getlearningmaterials&track=${trackId}`
  );
  let learningMaterials = await rawlearningMaterials.json();
  learningMaterials = learningMaterials[0];
  // results takes the form:
  // { postscore: 0
  // practicescore1: 0
  // practicescore2: 0
  // practicescore3: 0
  // pretestscore: 0
  // studentid: "123456"
  // trackid: 4 }
  if (results.pretestscore === 0) {
    takePretest(trackId, learningMaterials, results);
  } else {
    displayFirstMaterials(learningMaterials, trackId, results);
  }
}

async function takePretest(trackId, learningMaterials, results) {
  const subHeader = document.querySelector("h2");
  subHeader.textContent = "Pretest";
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
  let correctAnswers = 0;
  submitButton.onclick = async (event) => {
    submitButton.disabled = true;
    correctAnswers = gradeTest(myQuestions);
    displayResults(correctAnswers);
    const dataToPut = {
      trackid: trackId,
      test: "pretestscore",
      score: correctAnswers,
    };
    const putResponse = await fetch("/api/results/", {
      credentials: "same-origin",
      method: "PUT",
      headers: new Headers({
        "Content-Type": "application/json",
      }),
      body: JSON.stringify(dataToPut),
    });
    const nextButton = document.querySelector(".nextButton");
    nextButton.disabled = false;
    nextButton.onclick = (event) => {
      subHeader.textContent = "Learning Materials";
      displayFirstMaterials(learningMaterials, trackId, results);
    };
  };
}

function gradeTest(myQuestions) {
  let numCorrect = 0;
  let currentQuestion = 0;
  const allAnswerSets = document.querySelectorAll(".answers");
  for (const answerSet of allAnswerSets) {
    const correctAnswerLetter = myQuestions[currentQuestion].answer;
    for (const possibleAnswer of answerSet.children) {
      const radioButton = possibleAnswer.children[0];
      const possibleAnswerLetter = radioButton.id;
      if (correctAnswerLetter === possibleAnswerLetter) {
        if (radioButton.checked) {
          numCorrect += 1;
          possibleAnswer.style.color = "lightgreen";
        } else {
          possibleAnswer.style.color = "red";
        }
      }
    }
    currentQuestion += 1;
  }
  return numCorrect;
}

async function displayFirstMaterials(learningMaterials, trackId, results) {
  clearScreen();
  const nextButton = document.querySelector(".nextButton");
  nextButton.classList.remove("d-none");
  nextButton.disabled = true;
  const myQuestion = await getRandomQuestion(trackId);
  const materialsContainer = document.getElementById("materials");
  materialsContainer.innerHTML = learningMaterials.video1;
  displayQuestion(myQuestion);
  const submitButton = document.querySelector(".submitButton");
  let correctAnswer;
  submitButton.onclick = async (event) => {
    submitButton.disabled = true;
    correctAnswer = gradeQuestion(myQuestion);
    displayResult(correctAnswer);
    const correctAnswers = correctAnswer ? 1 : 0;
    const dataToPut = {
      trackid: trackId,
      test: "practicescore1",
      score: correctAnswers,
    };
    const putResponse = await fetch("/api/results/", {
      credentials: "same-origin",
      method: "PUT",
      headers: new Headers({
        "Content-Type": "application/json",
      }),
      body: JSON.stringify(dataToPut),
    });
    const nextButton = document.querySelector(".nextButton");
    nextButton.disabled = false;
    nextButton.onclick = (event) => {
      displaySecondMaterials(learningMaterials, trackId, results);
    };
  };
}

async function displaySecondMaterials(learningMaterials, trackId, results) {
  clearScreen();
  const nextButton = document.querySelector(".nextButton");
  nextButton.disabled = true;
  const myQuestion = await getRandomQuestion(trackId);
  const materialsContainer = document.getElementById("materials");
  materialsContainer.innerHTML = learningMaterials.learningtext;
  displayQuestion(myQuestion);
  const submitButton = document.querySelector(".submitButton");
  let correctAnswer;
  submitButton.onclick = async (event) => {
    submitButton.disabled = true;
    correctAnswer = gradeQuestion(myQuestion);
    displayResult(correctAnswer);
    const correctAnswers = correctAnswer ? 1 : 0;
    const dataToPut = {
      trackid: trackId,
      test: "practicescore2",
      score: correctAnswers,
    };
    const putResponse = await fetch("/api/results/", {
      credentials: "same-origin",
      method: "PUT",
      headers: new Headers({
        "Content-Type": "application/json",
      }),
      body: JSON.stringify(dataToPut),
    });
    const nextButton = document.querySelector(".nextButton");
    nextButton.disabled = false;
    nextButton.onclick = (event) => {
      displayThirdMaterials(learningMaterials, trackId, results);
    };
  };
}

async function displayThirdMaterials(learningMaterials, trackId, results) {
  clearScreen();
  const nextButton = document.querySelector(".nextButton");
  nextButton.disabled = true;
  const myQuestion = await getRandomQuestion(trackId);
  const materialsContainer = document.getElementById("materials");
  materialsContainer.innerHTML = learningMaterials.video2;
  displayQuestion(myQuestion);
  const submitButton = document.querySelector(".submitButton");
  let correctAnswer;
  submitButton.onclick = async (event) => {
    submitButton.disabled = true;
    correctAnswer = gradeQuestion(myQuestion);
    displayResult(correctAnswer);
    const correctAnswers = correctAnswer ? 1 : 0;
    const dataToPut = {
      trackid: trackId,
      test: "practicescore3",
      score: correctAnswers,
    };
    const putResponse = await fetch("/api/results/", {
      credentials: "same-origin",
      method: "PUT",
      headers: new Headers({
        "Content-Type": "application/json",
      }),
      body: JSON.stringify(dataToPut),
    });
    const nextButton = document.querySelector(".nextButton");
    nextButton.disabled = false;
    nextButton.onclick = (event) => {
      takePostTest(trackId, results);
    };
  };
}

function gradeQuestion(question) {
  let correctAnswer = false;
  const allAnswerSets = document.querySelectorAll(".answers");
  for (const answerSet of allAnswerSets) {
    const correctAnswerLetter = question.answer;
    for (const possibleAnswer of answerSet.children) {
      const radioButton = possibleAnswer.children[0];
      const possibleAnswerLetter = radioButton.id;
      if (correctAnswerLetter === possibleAnswerLetter) {
        if (radioButton.checked) {
          correctAnswer = true;
          possibleAnswer.style.color = "lightgreen";
        } else {
          possibleAnswer.style.color = "red";
        }
      }
    }
  }
  return correctAnswer;
}

async function takePostTest(trackId, results) {
  clearScreen();
  const nextButton = document.querySelector(".nextButton");
  // nextButton.disabled = true;
  const subHeader = document.querySelector("h2");
  subHeader.innerText = "Post Test";
  if (results.pretestscore === 5) {
    nextButton.classList.add("d-none");
    const quizDiv = document.querySelector("#quiz");
    quizDiv.innerHTML =
      "<p>Congratulations! Your pretest score qualifies you to skip the post-test. This track will be marked as completed, with a score of 100%.</p>";
    const dataToPut = {
      trackid: trackId,
      test: "postscore",
      score: 5,
    };
    const putResponse = await fetch("/api/results/", {
      credentials: "same-origin",
      method: "PUT",
      headers: new Headers({
        "Content-Type": "application/json",
      }),
      body: JSON.stringify(dataToPut),
    });
  } else {
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
    nextButton.classList.add("d-none");
    const submitButton = document.querySelector(".submitButton");
    let correctAnswers = 0;
    submitButton.onclick = async (event) => {
      submitButton.disabled = true;
      correctAnswers = gradeTest(myQuestions);
      displayResults(correctAnswers);
      const dataToPut = {
        trackid: trackId,
        test: "postscore",
        score: correctAnswers,
      };
      const putResponse = await fetch("/api/results/", {
        credentials: "same-origin",
        method: "PUT",
        headers: new Headers({
          "Content-Type": "application/json",
        }),
        body: JSON.stringify(dataToPut),
      });
    };
  }
}

function clearScreen() {
  const materialsDiv = document.getElementById("materials");
  materialsDiv.innerHTML = "";
  const quizDiv = document.getElementById("quiz");
  quizDiv.innerHTML = "";
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = "";
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

async function getRandomQuestion(trackId) {
  const rawQuestion = await fetch(
    `/api?action=getquestions&track=${trackId}&num=1`
  );
  const myQuestion = await rawQuestion.json();
  return myQuestion[0];
}

function displayQuestions(myQuestions) {
  // variable to store the HTML output
  const output = [];
  myQuestions.forEach((currentQuestion, questionNumber) => {
    const answers = [];
    for (let i = 0; i < 4; ++i) {
      const currentAnswer = `<label>
              <input type="radio" name="question${questionNumber}" id="${getChoiceLetter(
        i
      )}">
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
  const nextButton = document.querySelector(".nextButton");
  nextButton.classList.remove("d-none");
}

function displayQuestion(myQuestion) {
  // variable to store the HTML output
  const output = [];
  output.push("<h3>Test Your Knowledge!</h3>");
  const answers = [];
  for (let i = 0; i < 4; ++i) {
    const currentAnswer = `<label>
            <input type="radio" name="question0" id="${getChoiceLetter(i)}">
            ${getChoiceLetter(i)} :
            ${myQuestion[getChoiceName(i)]}
          </label>`;
    answers.push(currentAnswer);
  }
  // add this question and its answers to the output
  output.push(
    `<div class="question"> ${myQuestion.question} </div>
          <div class="answers"> ${answers.join("")} </div>`
  );
  output.push('<button class="submitButton">Submit</button');
  // finally combine our output list into one string of HTML and put it on the page
  const quizContainer = document.getElementById("quiz");
  quizContainer.innerHTML = output.join("");
}

function displayResults(numCorrect) {
  const resultsContainer = document.getElementById("results");
  resultsContainer.innerHTML = `<p>You got ${numCorrect} correct answers.</p>`;
}

function displayResult(correctAnswer) {
  const resultsContainer = document.getElementById("results");
  resultsContainer.innerHTML = correctAnswer
    ? `<p>You got the question correct!</p>`
    : `<p>Sorry, wrong answer.</p>`;
}

function getChoiceName(index) {
  switch (index) {
    case 0:
      return "choicea";
    case 1:
      return "choiceb";
    case 2:
      return "choicec";
    case 3:
      return "choiced";
  }
}

function getChoiceLetter(index) {
  switch (index) {
    case 0:
      return "A";
    case 1:
      return "B";
    case 2:
      return "C";
    case 3:
      return "D";
  }
}
