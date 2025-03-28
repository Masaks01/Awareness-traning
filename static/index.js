function fortsett() {
    const username = document.getElementById("username").value.trim();
    if (username) {
      // Valgfritt: lagre i localStorage hvis du vil bruke det videre
      localStorage.setItem("brukernavn", username);
      window.location.href = "/dashbord";
    } else {
      alert("Vennligst skriv inn brukernavn.");
    }
  }
