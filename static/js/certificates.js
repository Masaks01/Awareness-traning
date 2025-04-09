document.addEventListener("DOMContentLoaded", () => {
    const username = localStorage.getItem("brukernavn");
    const display = document.getElementById("username-display");
    if (username && display) {
        display.textContent = `Bruker: ${username}`;
    }

    fetch("/api/certificates")
        .then(response => response.json())
        .then(data => {
            const grid = document.getElementById("certificate-grid");
            const noCertMsg = document.getElementById("no-certificates");

            if (!data || data.length === 0) {
                noCertMsg.style.display = "block";
                return;
            }

            noCertMsg.style.display = "none";

            const scoreRank = { A: 4, B: 3, C: 2, D: 1, F: 0 };
            const bestPerModule = new Map();

            data.forEach(cert => {
                const module = cert.module_name;
                const existing = bestPerModule.get(module);

                const currentScore = scoreRank[cert.score] ?? -1;
                const existingScore = scoreRank[existing?.score] ?? -1;

                if (!existing || currentScore > existingScore) {
                    bestPerModule.set(module, cert);
                }
            });

            for (const cert of bestPerModule.values()) {
                const card = document.createElement("div");
                card.className = "certificate-card";
                card.innerHTML = `
                    <h2>${cert.module_name.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}</h2>
                    <div class="certificate-info">
                        <p><strong>Fullført:</strong> ✅</p>
                        <p><strong>Score:</strong> ${cert.score || "–"}</p>
                        <p><strong>Dato:</strong> ${new Date(cert.last_updated).toLocaleDateString("no-NO")}</p>
                        <p><strong>Tilbakemelding: </strong>${generateFeedback(cert.score)}</p>

                    </div>
                `;
                grid.appendChild(card);
            }
        })
        .catch(error => {
            console.error("Feil ved henting av sertifikater:", error);
        });
});

function generateFeedback(score) {
    switch (score) {
        case "A":
            return "Du har en meget god forståelse for emnet";
        case "B":
            return "Du har god forståelse for emnet";
        case "C":
            return "Du har en grei forstålse. Det kan være lurt å repetere modulen";
    }
}