console.log("[dummyLogin] cargado ✅");

// Referencias al formulario y campos
const form = document.getElementById("loginForm");
const userInput = document.getElementById("usuario");
const passInput = document.getElementById("clave");

form?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = userInput.value.trim();
  const password = passInput.value.trim();

  if (!username || !password) {
    alert("Completá usuario y contraseña.");
    return;
  }

  try {
    // Llamado a la API pública de DummyJSON
    const res = await fetch("https://dummyjson.com/auth/login", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();
    console.log("[dummyLogin] Respuesta del servidor:", data);

    // Si las credenciales son incorrectas
    if (!res.ok) {
      alert(data.message || "Error en el inicio de sesión. Verificá tus datos.");
      return;
    }

    // Guarda los datos en sessionStorage
    sessionStorage.setItem("authUser", JSON.stringify(data));
    sessionStorage.setItem("accessToken", data.token); // token 
    localStorage.setItem("userRole", "admin"); 

    alert(`Bienvenido/a ${data.firstName ?? username}!`);

    // Redirige al panel administrativo
    window.location.href = "index-admin.html";

  } catch (err) {
    console.error("[dummyLogin] Error en autenticación:", err);

    // Fallback por si DummyJSON no responde (modo local)
    const fakeToken = `fake-token-${Date.now()}`;
    sessionStorage.setItem("accessToken", fakeToken);
    sessionStorage.setItem("authUser", JSON.stringify({ username }));
    localStorage.setItem("userRole", "admin");

    alert(`Inicio de sesión local como ${username}.`);
    window.location.href = "index-admin.html";
  }
});
