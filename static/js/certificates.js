document.addEventListener("DOMContentLoaded", () => {
    fetch("/api/certificates")
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById("certificate-body");
            const noCertMsg = document.getElementById("no-certificates");

            if (data.length === 0) {
                noCertMsg.style.display = "block";
                return;
            } else {
                noCertMsg.style.display = "none";
            }

            data.forEach(cert => {
                const row = document.createElement("tr");

                const moduleCell = document.createElement("td");
                moduleCell.textContent = cert.module_name
                    .replace(/_/g, " ")
                    .replace(/\b\w/g, l => l.toUpperCase());

                const completedCell = document.createElement("td");
                completedCell.textContent = "✅";

                const scoreCell = document.createElement("td");
                scoreCell.textContent = cert.score || "–"; 

                const dateCell = document.createElement("td");
                dateCell.textContent = new Date(cert.last_updated).toLocaleDateString("no-NO");

                row.appendChild(moduleCell);
                row.appendChild(completedCell);
                row.appendChild(scoreCell);
                row.appendChild(dateCell);

                tableBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error("Feil ved henting av sertifikater:", error);
        });
});

document.addEventListener('DOMContentLoaded', () => {
    const username = localStorage.getItem("brukernavn");
    if (username) {
        const display = document.getElementById("username-display");
        if (display) {
            display.textContent = `Bruker: ${username}`;
        }
    }
  });