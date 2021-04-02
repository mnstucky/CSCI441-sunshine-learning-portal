//const { addUserToTrack } = require("../model/db");

document.addEventListener("readystatechange", (e) => {
  if (e.target.readyState === "complete") {
    loadOpenTracks();
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

async function loadOpenTracks() {
  // pull data for open tracks
  const data = await fetch(`/api?action=getopentracks`);
  const formatted = await data.json();
  for (var key in formatted) {
    const table = document.getElementById("tracksBody");
    let tableRow = table.insertRow();
    let tableUser = tableRow.insertCell(0);
    tableUser.innerHTML = formatted[key].trackname;
    tableRow.addEventListener("click", function() {
      subscribeUserToTrack(formatted[key].trackid);
    });
  }
}

async function subscribeUserToTrack(trackid){
  if (confirm("Would you like to subscribe to the selected tracK?")) {
    const data = await fetch(`/api?action=adduserToTrack`);
    let studentid = '123456';
    let track = trackid;
    //const data = await fetch(`/api?action=adduserToTrack&studentid=${studentid}&trackid=${track}`);
    location.reload();
  } else {
      // do nothing
  }
}


async function startTrack(trackId, trackName) {
  // When the user starts a track, hide extra information
  hideDefaultDisplay();
  document.querySelector(".nextButton").disabled = true;
  // Display the track name in the heading
  displayTrackNameHeading(trackName);
  // Get data for track
  const results = await getResults(trackId);
  const learningMaterials = await getLearningMaterials(trackId);
  if (results.pretestscore == null) {
    takePretest(trackId, learningMaterials, results);
  } else if (results.practicescore1 == null) {
    displayFirstMaterials(trackId, learningMaterials, results);
  } else if (results.practicescore2 == null) {
    displaySecondMaterials(trackId, learningMaterials, results);
  } else if (results.practicescore3 == null) {
    displayThirdMaterials(trackId, learningMaterials, results);
  } else {
    takePostTest(trackId);
  }

}

async function takePretest(trackId, learningMaterials, results) {
  setSubheader("Pretest");
  const myQuestions = await getRandomQuestions(trackId);
  displayQuestions(myQuestions);
  const submitButton = document.querySelector(".submitButton");
  let correctAnswers = 0;
  submitButton.onclick = async (event) => {
    submitButton.disabled = true;
    correctAnswers = gradeTest(myQuestions);
    displayResults(correctAnswers);
    await sendScoreToDatabase(trackId, "pretestscore", correctAnswers);
    enableNextButton(
      displayFirstMaterials,
      learningMaterials,
      trackId,
      results
    );
  };
}

async function displayFirstMaterials(trackId, learningMaterials, results) {
  clearScreen();
  setSubheader("Learning Materials");
  const nextButton = document.querySelector(".nextButton");
  nextButton.disabled = false;
  nextButton.classList.remove("d-none");
  nextButton.disabled = true;
  const myQuestion = await getRandomQuestion(trackId);
  displayMaterials("video1", learningMaterials);
  displayQuestion(myQuestion);
  const submitButton = document.querySelector(".submitButton");
  let correctAnswer;
  submitButton.onclick = async (event) => {
    submitButton.disabled = true;
    correctAnswer = gradeQuestion(myQuestion);
    displayResult(correctAnswer);
    const correctAnswers = correctAnswer ? 1 : 0;
    await sendScoreToDatabase(trackId, "practicescore1", correctAnswers);
    enableNextButton(
      displaySecondMaterials,
      learningMaterials,
      trackId,
      results
    );
  };
}

async function displaySecondMaterials(trackId, learningMaterials, results) {
  clearScreen();
  const nextButton = document.querySelector(".nextButton");
  nextButton.disabled = false;
  nextButton.classList.remove("d-none");
  nextButton.disabled = true;
  const myQuestion = await getRandomQuestion(trackId);
  displayMaterials("learningtext", learningMaterials);
  displayQuestion(myQuestion);
  const submitButton = document.querySelector(".submitButton");
  let correctAnswer;
  submitButton.onclick = async (event) => {
    submitButton.disabled = true;
    correctAnswer = gradeQuestion(myQuestion);
    displayResult(correctAnswer);
    const correctAnswers = correctAnswer ? 1 : 0;
    await sendScoreToDatabase(trackId, "practicescore2", correctAnswers);
    enableNextButton(
      displayThirdMaterials,
      learningMaterials,
      trackId,
      results
    );
  };
}

async function displayThirdMaterials(trackId, learningMaterials, results) {
  clearScreen();
  const nextButton = document.querySelector(".nextButton");
  nextButton.disabled = false;
  nextButton.classList.remove("d-none");
  nextButton.disabled = true;
  const myQuestion = await getRandomQuestion(trackId);
  displayMaterials("video2", learningMaterials);
  displayQuestion(myQuestion);
  const submitButton = document.querySelector(".submitButton");
  let correctAnswer;
  submitButton.onclick = async (event) => {
    submitButton.disabled = true;
    correctAnswer = gradeQuestion(myQuestion);
    displayResult(correctAnswer);
    const correctAnswers = correctAnswer ? 1 : 0;
    await sendScoreToDatabase(trackId, "practicescore3", correctAnswers);
    enableNextButton(takePostTest, {}, trackId, results);
  };
}

async function takePostTest(trackId) {
  clearScreen();
  const rawResults = await fetch(`/api?action=getresults&track=${trackId}`);
  const results = await rawResults.json();
  const nextButton = document.querySelector(".nextButton");
  // nextButton.disabled = true;
  const subHeader = document.querySelector("h2");
  subHeader.innerText = "Post Test";
  if (results.pretestscore === 5) {
    nextButton.classList.add("d-none");
    const quizDiv = document.querySelector("#quiz");
    quizDiv.innerHTML =
      "<p>Congratulations! Your pretest score qualifies you to skip the post-test. This track will be marked as completed, with a score of 100%.</p>";
    await sendScoreToDatabase(trackId, "postscore", 5);
  } else {
    const myQuestions = await getRandomQuestions(trackId);
    displayQuestions(myQuestions);
    nextButton.classList.add("d-none");
    const submitButton = document.querySelector(".submitButton");
    let correctAnswers = 0;
    submitButton.onclick = async (event) => {
      submitButton.disabled = true;
      correctAnswers = gradeTest(myQuestions);
      displayResults(correctAnswers);
      await sendScoreToDatabase(trackId, "postscore", correctAnswers);
    };
  }
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

async function sendScoreToDatabase(trackid, test, score) {
  const dataToPut = {
    trackid,
    test,
    score,
  };
  const putResponse = await fetch("/api/results/", {
    credentials: "same-origin",
    method: "PUT",
    headers: new Headers({
      "Content-Type": "application/json",
    }),
    body: JSON.stringify(dataToPut),
  });
}

function displayMaterials(material, learningMaterials) {
  const materialsContainer = document.getElementById("materials");
  materialsContainer.innerHTML = learningMaterials[material];
}

function enableNextButton(callback, learningMaterials, trackId, results) {
  const nextButton = document.querySelector(".nextButton");
  nextButton.disabled = false;
  nextButton.onclick = (event) => {
    callback(trackId, learningMaterials, results);
  };
}

function setSubheader(text) {
  const subHeader = document.querySelector("h2");
  subHeader.textContent = text;
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

async function getResults(trackId) {
  const rawResults = await fetch(`/api?action=getresults&track=${trackId}`);
  const results = await rawResults.json();
  return results;
}

async function getLearningMaterials(trackId) {
  const rawlearningMaterials = await fetch(
    `/api/?action=getlearningmaterials&track=${trackId}`
  );
  let learningMaterials = await rawlearningMaterials.json();
  learningMaterials = learningMaterials[0];
  return learningMaterials;
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
  output.push("<br><h3>Test Your Knowledge!</h3><br>");
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
