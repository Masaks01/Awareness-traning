function fortsett() {
    const username = document.getElementById("username").value.trim();
    if (username) {
      localStorage.setItem("brukernavn", username);
      window.location.href = "/dashbord";
    } else {
      alert("Vennligst skriv inn brukernavn.");
    }
  }
