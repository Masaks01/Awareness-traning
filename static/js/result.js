document.addEventListener('DOMContentLoaded', () => {
    const scorePercent = parseInt(sessionStorage.getItem("scorePercent"), 10);
    const gradeElement = document.getElementById("grade-letter");
    const feedbackElement = document.getElementById("feedback-message");

    let grade = "F";
    let passed = false;

    if (scorePercent >= 90) { grade = "A"; passed = true; }
    else if (scorePercent >= 80) { grade = "B"; passed = true; }
    else if (scorePercent >= 70) { grade = "C"; passed = true; }
    else if (scorePercent >= 60) { grade = "D"; }
    else if (scorePercent >= 50) { grade = "E"; }

    gradeElement.innerText = grade;
    feedbackElement.innerText = passed
        ? "Modulen er bestått, gratulerer!"
        : "Modulen er ikke bestått, prøv igjen!";

    const username = localStorage.getItem("brukernavn");
    if (username) {
        const display = document.getElementById("username-display");
        if (display) {
            display.textContent = `Bruker: ${username}`;
        }
    }

    const dashboardButton = document.getElementById("dashboard-button");
    if (dashboardButton) {
        dashboardButton.addEventListener("click", function() {
            window.location.href = "/dashbord";
        });
    }
});
