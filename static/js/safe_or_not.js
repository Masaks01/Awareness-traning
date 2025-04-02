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
    const completed = score >= 0.7;
    const username = localStorage.getItem("brukernavn");

    fetch('/api/progresjon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            username: username,
            module_name: 'Sveip_trusselen_vekk',
            completed: completed
        })
    });

    sessionStorage.setItem("scorePercent", percent);

    window.location.href = "/resultat";
}

document.addEventListener('DOMContentLoaded', () => {
    const name = localStorage.getItem("brukernavn");
    if (name) {
        const view = document.getElementById("username-display");
        if (view) {
            view.innerText = `Bruker: ${name}`;
        }
    }
});

window.onload = fetchAll;