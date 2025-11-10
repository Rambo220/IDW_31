(() => {
  window.IS_ADMIN = true;
  document.body?.setAttribute('data-admin', 'true');

  const BRAND_BG = "#0b3d91";
  const BRAND_BG_DARK = "#1b1b2e";
  const ADMIN_HOME = "index-admin.html";
  const LOGIN_PAGE = "login.html";

  const PUBLIC_LABELS = new Set([
    "Inicio","Acerca de","Acerca de ","Contacto","Catálogo","Sacar turno"
  ]);

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

  function forceAdminMenu() {
    const ul = document.getElementById('navLinksAdmin') ||
               document.querySelector('.navbar .navbar-collapse .navbar-nav');
    if (!ul) return;

    const current = location.pathname.split("/").pop() || ADMIN_HOME;
    const items = [
      { nombre: "Inicio",           href: "index-admin.html"   },
      { nombre: "Médicos",          href: "medicos.html"       },
      { nombre: "Especialidades",   href: "especialidades.html"},
      { nombre: "Turnos",           href: "turnos.html"        },
      { nombre: "Obras Sociales",   href: "obras-sociales.html"},
      { nombre: "Usuarios",         href: "usuarios.html"      },
    ];

    ul.innerHTML = items.map(it =>
      `<li class="nav-item"><a class="nav-link ${it.href === current ? 'active' : ''}" href="${it.href}">${it.nombre}</a></li>`
    ).join("");
  }

  function stripPublicStuff() {
    document.querySelectorAll('.nav-datetime').forEach(el => el.remove());
    document.querySelectorAll('.navbar .navbar-nav .nav-link').forEach(a => {
      const text = (a.textContent || '').trim();
      if (PUBLIC_LABELS.has(text)) a.closest('li')?.remove();
    });
    forceAdminMenu();
  }

  // Bienvenida + logout
  function setupNavbarExtras() {
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
  }

  document.addEventListener("DOMContentLoaded", () => {
    requireAuth();
    forceAdminMenu();
    stripPublicStuff();
    setupNavbarExtras();
    setupTheme();

    const navRoot = document.querySelector('.navbar');
    if (navRoot) {
      const observer = new MutationObserver(() => {
        observer.disconnect();
        stripPublicStuff();
        setTimeout(() => {
          observer.observe(navRoot, { childList: true, subtree: true });
        }, 0);
      });
      observer.observe(navRoot, { childList: true, subtree: true });
    }

    window.addEventListener('load', () => {
      stripPublicStuff();
      applyBrandColors();
    });
  });

  if (!getAuth()) {
    location.href = LOGIN_PAGE;
  }
})();
