let currentIndex = 0;
let questions = [];
let correctAnswers = 0;
let draggedCard = null;
let activeCards = [];

fetch('/api/dra_og_slipp')
  .then(res => res.json())
  .then(data => {
    questions = data;
    showNextCards();
  });

function showNextCards() {
  const container = document.getElementById('card-container');
  container.innerHTML = "";
  activeCards = [];

  const containerHeight = container.offsetHeight || 440;
  const cardHeight = 100;
  const gap = 16;
  const totalCardSpace = cardHeight + gap;

  const maxCards = Math.floor(containerHeight / totalCardSpace);
  const remaining = questions.length - currentIndex;
  const cardsToShow = Math.min(maxCards, remaining);

  for (let i = 0; i < cardsToShow; i++) {
    const question = questions[currentIndex + i];
    const card = createCard(question);
    container.appendChild(card);
    activeCards.push({ element: card, index: currentIndex + i });
  }
}

function createCard(question) {
  const card = document.createElement('div');
  card.className = 'card';
  card.textContent = question.statement;
  card.setAttribute('draggable', true);
  card.dataset.correct = question.correct_choice?.trim().toLowerCase() || "";

  card.addEventListener('dragstart', () => {
    draggedCard = card;
  });

  card.addEventListener('dragend', () => {
    draggedCard = null;
  });

  return card;
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

    const index = activeCards.find(ac => ac.element === draggedCard)?.index;
    if (index !== undefined && index === currentIndex) {
      currentIndex++;
    }

    const allAnswered = document.querySelectorAll('.card[draggable="true"]').length === 0
                     && currentIndex >= questions.length;

    if (allAnswered) {
      setTimeout(showResult, 300);
    } else {
      setTimeout(showNextCards, 300);
    }
  });
});

function showResult() {
  const percent = Math.round((correctAnswers / questions.length) * 100);
  sessionStorage.setItem("scorePercent", percent);
  sessionStorage.setItem("moduleName", "dra_og_slipp");
  window.location.href = "/resultat";
}

document.addEventListener('DOMContentLoaded', () => {
  const username = localStorage.getItem("brukernavn");
  if (username) {
    const display = document.getElementById("username-display");
    if (display) {
      display.textContent = `Bruker: ${username}`;
    }
  }
});