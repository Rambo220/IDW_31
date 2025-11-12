const form = document.getElementById("loginForm");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const usuario = form.usuario.value.trim();
  const password = form.password.value.trim();

  // Credenciales fijas simuladas
  if (usuario === "admin" && password === "1234") {
    localStorage.setItem("isAdmin", "true");
    alert("Bienvenido, administrador ");
    location.href = "turnos.html";
  } else {
    alert("Usuario o contraseña incorrectos.");
  }
});
