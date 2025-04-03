document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.tab');
    const contents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            contents.forEach(c => c.style.display = 'none');

            tab.classList.add('active');
            document.getElementById(tab.dataset.tab).style.display = 'flex';
        });
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


