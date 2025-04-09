let isLogin = true;

document.addEventListener("DOMContentLoaded", () => {
  const submitButton = document.getElementById("submit-button");
  const toggleLink = document.getElementById("toggle-link");
  const loginForm = document.getElementById("login-form");

  loginForm.addEventListener("submit", handleSubmit);
  toggleLink.addEventListener("click", toggleForm);
});

function toggleForm(event) {
  if (event) event.preventDefault();
  isLogin = !isLogin;

  document.getElementById("form-title").textContent = isLogin ? "Logg inn" : "Registrer bruker";
  document.getElementById("submit-button").textContent = isLogin ? "Logg inn" : "Registrer";
  document.getElementById("toggle-form").innerHTML = isLogin
    ? 'Har du ikke en bruker? <a href="#" id="toggle-link">Registrer deg</a>'
    : 'Har du allerede en bruker? <a href="#" id="toggle-link">Logg inn</a>';

  document.getElementById("toggle-link").addEventListener("click", toggleForm);
}

function showMessage(text, color = "red", duration = 5000) {
  const messageBox = document.getElementById("login-message");
  messageBox.innerText = text;
  messageBox.style.color = color;

  setTimeout(() => {
    messageBox.innerText = "";
  }, duration);
}

function handleSubmit(event) {
  event.preventDefault(); 

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const submitButton = document.getElementById("submit-button");

  if (!username || !password) {
    showMessage("Vennligst fyll ut både brukernavn og passord.");
    return;
  }

  if (!isLogin && password.length < 8) {
    showMessage("Passordet må være minst 8 tegn.");
    return;
  }

  submitButton.disabled = true;
  submitButton.textContent = isLogin ? "Logger inn..." : "Registrerer...";

  const endpoint = isLogin ? "/api/login" : "/api/register";

  fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  })
    .then(res => res.json())
    .then(data => {
      if (data.status === "success") {
        if (isLogin) {
          localStorage.setItem("brukernavn", username);
          window.location.href = "/dashbord";
        } else {
          showMessage("Bruker registrert! Du kan nå logge inn.", "green");
          toggleForm(); 
        }
      } else {
        showMessage(data.message || "En feil oppstod.");
      }
    })
    .catch(() => {
      showMessage("Kunne ikke kontakte server.");
    })
    .finally(() => {
      submitButton.disabled = false;
      submitButton.textContent = isLogin ? "Logg inn" : "Registrer";
    });
}