document.addEventListener('DOMContentLoaded', () => {
    const scorePercent = parseInt(sessionStorage.getItem("scorePercent"), 10);
    const moduleName = sessionStorage.getItem("moduleName");
    const username = localStorage.getItem("brukernavn");

    const gradeElement = document.getElementById("grade-letter");
    const feedbackElement = document.getElementById("feedback-message");
    const display = document.getElementById("username-display");
    const dashboardButton = document.getElementById("dashboard-button");

    let grade = "F";
    let passed = false;

    if (scorePercent >= 90) { grade = "A"; passed = true; }
    else if (scorePercent >= 80) { grade = "B"; passed = true; }
    else if (scorePercent >= 70) { grade = "C"; passed = true; }
    else if (scorePercent >= 60) { grade = "D"; }
    else if (scorePercent >= 50) { grade = "E"; }

    if (gradeElement) gradeElement.innerText = grade;
    if (feedbackElement) {
        feedbackElement.innerText = passed
            ? "Modulen er bestått, gratulerer!"
            : "Modulen er ikke bestått, prøv igjen!";
    }

    if (username && display) {
        display.textContent = `Bruker: ${username}`;
    }

    if (username && moduleName && grade) {
        fetch("/api/progresjon", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                username: username,
                module_name: moduleName,
                completed: passed,
                score: grade
            })
        })
        .then(res => res.json())
        .then(data => {
            console.log("Progresjon lagret:", data);
        })
        .catch(err => {
            console.error("Feil ved lagring av progresjon:", err);
        });
    } else {
        console.warn("Mangler data for innsending:", { username, moduleName, grade });
    }

    if (dashboardButton) {
        dashboardButton.addEventListener("click", function () {
            window.location.href = "/dashbord";
        });
    }
});
