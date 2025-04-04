let questions = [];
let currentIndex = 0;
let correctAnswers = 0;

function fetchAll() {
    fetch('/api/Sveip_trusselen_vekk')
        .then(res => res.json())
        .then(data => {
            questions = data;
            currentIndex = 0;
            correctAnswers = 0;
            showNext();
        });
}

function showNext() {
    if (currentIndex < questions.length) {
        const q = questions[currentIndex];
        document.getElementById('epost').innerText = q.content;
    } else {
        showResult();
    }
}

function answer(isSafe) {
    const current = questions[currentIndex];
    const correct = (isSafe === !current.is_phishing);
    if (correct) correctAnswers++;

    const screen = document.querySelector(".screen");
    const direction = isSafe ? "animate-right" : "animate-left";
    screen.classList.add(direction);

    setTimeout(() => {
        screen.classList.remove(direction);
        currentIndex++;
        showNext();
        screen.style.opacity = "1"; 
        screen.style.transform = "translateX(0)";
    }, 400);
}

function showResult() {
    document.querySelector('.screen').style.display = "none";
    document.querySelector('.choice-buttons').style.display = "none";

    const score = correctAnswers / questions.length;
    const percent = Math.round(score * 100);

    sessionStorage.setItem("scorePercent", percent);
    sessionStorage.setItem("moduleName", "Sveip_trusselen_vekk");

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

    document.getElementById('unsafe-button').addEventListener('click', () => answer(false));
    document.getElementById('safe-button').addEventListener('click', () => answer(true));

    fetchAll();
});
