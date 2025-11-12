const token = sessionStorage.getItem("accessToken");
// Si no hay token, redirige al login
if (!token) {
  alert("inicia sesión para acceder al panel de administración.");
  window.location.href = "login.html";
}
