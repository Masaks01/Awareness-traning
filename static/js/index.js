function handleLogin() {
  const username = document.getElementById("username-input").value.trim();
  if (username) {
    localStorage.setItem("brukernavn", username);
    window.location.href = "/dashbord";
  } else {
    alert("Vennligst skriv inn brukernavn.");
  }
}

window.onload = () => {
  document.getElementById("username-input").focus();
};

document.getElementById("username-input").addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    handleLogin();
  }
});
