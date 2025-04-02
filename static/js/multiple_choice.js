let currentIndex = 0;
let questions = [];
let correctAnswers = 0;

fetch('/api/sosial_manipulasjon')
  .then(res => res.json())
  .then(data => {
    questions = data;
    displayNextQuestion();
  });

function displayNextQuestion() {
  if (currentIndex >= questions.length) {
    displayResult();
    return;
  }

  const question = questions[currentIndex];
  const scenarioElement = document.getElementById("scenario-text");
  const buttons = document.querySelectorAll(".answer-button");

  scenarioElement.innerText = question.scenario_text;

  buttons[0].innerText = question.alt1;
  buttons[1].innerText = question.alt2;
  buttons[2].innerText = question.alt3;

  buttons.forEach((btn) => {
    const newBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(newBtn, btn);
  });

  document.querySelectorAll(".answer-button").forEach((btn, index) => {
    btn.addEventListener("click", () => {
      const selected = index + 1;
      if (selected === question.correct_alt) {
        correctAnswers++;
      }
      currentIndex++;
      displayNextQuestion();
    });
  });
}

function displayResult() {
  const scorePercent = Math.round((correctAnswers / questions.length) * 100);
  const passed = scorePercent >= 70;

  sessionStorage.setItem("scorePercent", scorePercent);
  sessionStorage.setItem("moduleName", "sosial_manipulasjon");

  const username = localStorage.getItem("brukernavn");
  if (username) {
    fetch('/api/progresjon', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: username,
        module_name: "sosial_manipulasjon",
        completed: passed
      })
    });
  }

  window.location.href = "/resultat";
}

document.addEventListener("DOMContentLoaded", () => {
  const name = localStorage.getItem("brukernavn");
  const display = document.getElementById("username-display");
  if (name && display) {
    display.innerText = `Bruker: ${name}`;
  }
});
