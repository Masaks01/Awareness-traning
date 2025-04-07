document.addEventListener('DOMContentLoaded', async () => {
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

    const activeTab = document.querySelector('.tab.active');
    if (activeTab) {
        const tabId = activeTab.dataset.tab;
        document.getElementById(tabId).style.display = 'flex';
    }

    const username = localStorage.getItem("brukernavn");
    const display = document.getElementById("username-display");
    if (username && display) {
        display.textContent = `Bruker: ${username}`;
    }

    try {
        const response = await fetch('/api/rutiner');
        const data = await response.json();

        const containers = {
            reporting: document.getElementById('reporting'),
            password: document.getElementById('password'),
            indicators: document.getElementById('indicators'),
            prevention: document.getElementById('prevention')
        };

        data.forEach(({ category, routine }) => {
            const key = category.toLowerCase();
            const container = containers[key];
            if (container) {
                const steps = container.querySelectorAll('.step');
                const nextIndex = [...steps].findIndex(step => !step.querySelector('p').textContent);
                if (nextIndex !== -1) {
                    steps[nextIndex].querySelector('p').textContent = routine;
                }
            }
        });
    } catch (err) {
        console.error('Klarte ikke hente rutiner:', err);
    }
});
