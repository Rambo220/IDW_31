(() => {
  const BRAND_BG = "#0b3d91";
  const BRAND_BG_DARK = "#1b1b2e";
  const ADMIN_HOME = "index-admin.html";
  const LOGIN_PAGE = "login.html";

  const getAuth = () => {
    try { return JSON.parse(sessionStorage.getItem("authUser") || "null"); }
    catch { return null; }
  };

  const requireAuth = () => {
    const user = getAuth();
    if (!user) {
      const here = location.pathname.split("/").pop() || ADMIN_HOME;
      location.href = `${LOGIN_PAGE}?from=${encodeURIComponent(here)}`;
    }
  };

  const applyBrandColors = () => {
    const theme = document.body.getAttribute("data-theme") || "light";
    const bg = theme === "dark" ? BRAND_BG_DARK : BRAND_BG;
    document.querySelectorAll(".brand-bar").forEach(el => {
      el.style.backgroundColor = bg;
      el.classList.add("text-white");
    });
  };

  const setupTheme = () => {
    const icon = document.getElementById("d1-icon");
    const saved = localStorage.getItem("tema") || "light";
    document.body.setAttribute("data-theme", saved);
    if (icon) icon.className = saved === "dark" ? "bi bi-sun-fill" : "bi bi-moon-fill";
    applyBrandColors();

    const btnTheme = document.getElementById("btnTheme");
    if (btnTheme) {
      btnTheme.addEventListener("click", (e) => {
        e.preventDefault();
        const current = document.body.getAttribute("data-theme") || "light";
        const next = current === "light" ? "dark" : "light";
        document.body.setAttribute("data-theme", next);
        localStorage.setItem("tema", next);
        if (icon) icon.className = next === "dark" ? "bi bi-sun-fill" : "bi bi-moon-fill";
        applyBrandColors();
      });
    }
  };

  const setupNavbar = () => {
    const nav = document.getElementById("navLinksAdmin");
    if (nav) {
      const current = location.pathname.split("/").pop() || ADMIN_HOME;
      const items = [
        { nombre: "Inicio", href: "index-admin.html" },
        { nombre: "Médicos", href: "medicos.html" },
        { nombre: "Especialidades", href: "especialidades.html" },
        { nombre: "Turnos", href: "turnos.html" },
        { nombre: "Obras Sociales", href: "obras-sociales.html" },
        { nombre: "Usuarios", href: "usuarios.html" },
      ];
      nav.innerHTML = items.map(it =>
        `<li class="nav-item"><a class="nav-link ${it.href === current ? 'active' : ''}" href="${it.href}">${it.nombre}</a></li>`
      ).join("");
    }

    const user = getAuth();
    const welcome = document.getElementById("welcomeUser");
    if (welcome) welcome.textContent = `Hola, ${user?.firstName || 'Admin'}`;

    const btnLogout = document.getElementById("btnLogout");
    if (btnLogout) {
      btnLogout.addEventListener("click", (e) => {
        e.preventDefault();
        if (confirm("¿Deseás cerrar sesión?")) {
          sessionStorage.clear();
          localStorage.removeItem('userRole'); 
          location.href = "index.html";
        }
      });
    }
  };

  document.addEventListener("DOMContentLoaded", () => {
    requireAuth();
    setupNavbar();
    setupTheme();
  });
})();
