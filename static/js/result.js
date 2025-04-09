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
        feedbackElement.innerText = generateFeedback(grade);
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

function generateFeedback(score) {
    switch (score) {
        case "A":
            return "Godt jobbet! Du har god forståelse for emnet!";
        case "B":
            return "Veldig bra! Du har god oversikt, men det er også fortsatt rom for forbedring.";
        case "C":
            return "Du har grei oversikt over emnet, modulen bør gjentas for å repetere sentrale punkter";
        case "D":
            return "Modulen er ikke bestått. Du er på vei, med mer øvelse vil du kunne bestå modulen";
        case "E":
            return "Modulen er ikke bestått. Du er på vei, med mer øvelse vil du kunne bestå modulen";
        case "F":
        default:
            return "Modulen er ikke bestått. Du er på vei, med mer øvelse vil du kunne bestå modulen";
    }
}
