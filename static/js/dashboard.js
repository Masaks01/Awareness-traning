document.addEventListener("DOMContentLoaded", () => {
    const username = localStorage.getItem("brukernavn");
    const usernameDisplay = document.getElementById("username-display");
    if (username && usernameDisplay) {
        usernameDisplay.textContent = `Bruker: ${username}`;
    }

    if (username) {
        fetch(`/api/progresjon/${username}`)
            .then(res => res.json())
            .then(progress => {
                const completedModules = new Set(progress.filter(p => p.completed).map(p => p.module_name));

                document.querySelectorAll("a[href]").forEach(link => {
                    const match = link.getAttribute("href").match(/\/([\w_]+)$/);
                    if (match && completedModules.has(match[1])) {
                        link.classList.add("completed");
                    }
                });
            });
    }

    const circle = document.getElementById("module-circle");
    const buttons = circle.querySelectorAll(".module-button");
    const radius = 200;
    const centerX = circle.offsetWidth / 2;
    const centerY = circle.offsetHeight / 2;

    buttons.forEach((button, i) => {
        const angle = (2 * Math.PI * i) / buttons.length;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        button.style.left = `${x}px`;
        button.style.top = `${y}px`;

        button.addEventListener("click", () => {
            const moduleName = button.textContent.trim();
            let completedModules = JSON.parse(localStorage.getItem("completedModules")) || [];
            if (!completedModules.includes(moduleName)) {
                completedModules.push(moduleName);
                localStorage.setItem("completedModules", JSON.stringify(completedModules));
                button.classList.add("completed");
            }
        });
    });
});
