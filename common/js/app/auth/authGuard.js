// common/js/app/auth/authGuard.js
console.log("[authGuard] Protección activa ✅");

const token = sessionStorage.getItem("accessToken");

// Si no hay token, redirige al login
if (!token) {
  alert("⚠️ Debes iniciar sesión para acceder al panel de administración.");
  window.location.href = "login.html";
}
