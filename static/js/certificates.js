document.addEventListener("DOMContentLoaded", () => {
    const username = localStorage.getItem("brukernavn");
    const display = document.getElementById("username-display");
    if (username && display) {
        display.textContent = `Bruker: ${username}`;
    }

    fetch("/api/certificates")
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById("certificate-body");
            const noCertMsg = document.getElementById("no-certificates");

            if (!data || data.length === 0) {
                noCertMsg.style.display = "block";
                return;
            }

            noCertMsg.style.display = "none";

            const latestPerModule = new Map();
            data.forEach(cert => {
                latestPerModule.set(cert.module_name, cert);
            });

            for (const cert of latestPerModule.values()) {
                const row = document.createElement("tr");

                row.innerHTML = `
                    <td>${cert.module_name.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}</td>
                    <td>✅</td>
                    <td>${cert.score || "–"}</td>
                    <td>${new Date(cert.last_updated).toLocaleDateString("no-NO")}</td>
                `;

                tableBody.appendChild(row);
            }
        })
        .catch(error => {
            console.error("Feil ved henting av sertifikater:", error);
        });
});