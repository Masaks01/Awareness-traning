let currentIndex = 0;
let questions = [];
let correctAnswers = 0;
let draggedCard = null;

fetch('/api/dra_og_slipp')
  .then(res => res.json())
  .then(data => {
    questions = data;
    showNextCard();
  });

function showNextCard() {
  const container = document.getElementById('card-container');
  container.innerHTML = "";

  if (currentIndex < questions.length) {
    const question = questions[currentIndex];

    const card = document.createElement('div');
    card.className = 'card';
    card.textContent = question.statement;
    card.setAttribute('draggable', true);
    card.dataset.correct = question.correct_choice ? question.correct_choice.trim().toLowerCase() : "";

    card.addEventListener('dragstart', () => {
      draggedCard = card;
    });

    card.addEventListener('dragend', () => {
      draggedCard = null;
    });

    container.appendChild(card);
  } else {
    showResult();
  }
}

document.querySelectorAll('.dropzone').forEach(zone => {
  zone.addEventListener('dragover', e => {
    e.preventDefault();
    zone.classList.add('drag-over');
  });

  zone.addEventListener('dragleave', () => {
    zone.classList.remove('drag-over');
  });

  zone.addEventListener('drop', () => {
    zone.classList.remove('drag-over');
    if (!draggedCard) return;

    const userAnswer = zone.dataset.action.trim().toLowerCase();
    const correctAnswer = draggedCard.dataset.correct;

    if (userAnswer === correctAnswer) {
      correctAnswers++;
    }

    zone.appendChild(draggedCard);
    draggedCard.setAttribute("draggable", false);
    draggedCard.style.cursor = "default";

    setTimeout(() => {
      currentIndex++;
      showNextCard();
    }, 300);
  });
});

function showResult() {
  const percent = Math.round((correctAnswers / questions.length) * 100);

  sessionStorage.setItem("scorePercent", percent);
  sessionStorage.setItem("moduleName", "dra_og_slipp");

  const username = localStorage.getItem("brukernavn");
  if (username) {
    fetch('/api/progresjon', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: username,
        module_name: 'dra_og_slipp',
        completed: percent >= 70
      })
    });
  }

  window.location.href = "/resultat";
}

document.addEventListener('DOMContentLoaded', () => {
  const name = localStorage.getItem("brukernavn");
  const display = document.getElementById("username-display");
  if (name && display) {
    display.innerText = `Bruker: ${name}`;
  }
});