// Inicializa base de datos local (tu parte original)
import { initStorage } from './storage/localStorage.js';
import { INITIAL_STATE } from './storage/seed.js';

document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(location.search);
  if (params.get('resetbd') === '1') {
    localStorage.removeItem('idw_bd');
  }
  initStorage(INITIAL_STATE);
});

// MENÚ DINÁMICO (si hay sesión admin => siempre menú admin)
if (!window.__MENU_LOADED__) {
  window.__MENU_LOADED__ = true;

  document.addEventListener("DOMContentLoaded", () => {
    const nav = document.getElementById("navLinks") || document.getElementById("navLinksAdmin");
    const btnAdmin = document.getElementById("btnAdmin");
    const btnLogout = document.getElementById("btnLogout");

    const scope = document.body.dataset.scope || "public";

    if (scope === "admin") {
      return; // no tocar menú/redirects en admin
    }

    // Para público sí usamos el rol guardado en localStorage
    const isAdmin = localStorage.getItem("userRole") === "admin";

    const PUBLIC_MENU = [
      { nombre: "Inicio", href: "index.html" },
      { nombre: "Acerca de", href: "institucional.html" },
      { nombre: "Contacto", href: "contacto.html" },
      { nombre: "Catálogo", href: "catalogo.html" },
      { nombre: "Sacar turno", href: "reservar-turno.html" }
    ];

    const ADMIN_MENU = [
      { nombre: "Inicio", href: "index-admin.html" },
      { nombre: "Médicos", href: "medicos.html" },
      { nombre: "Obras Sociales", href: "obras-sociales.html" },
      { nombre: "Especialidades", href: "especialidades.html" },
      { nombre: "Turnos", href: "turnos.html" },
      { nombre: "Usuarios", href: "usuarios.html" }
    ];

    const menu = isAdmin ? ADMIN_MENU : PUBLIC_MENU;

    if (nav) {
      const current = window.location.pathname.split("/").pop() || "index.html";
      nav.innerHTML = menu
        .map(l => {
          const active = l.href.endsWith(current) ? "active" : "";
          return `<li class="nav-item"><a class="nav-link ${active}" href="${l.href}">${l.nombre}</a></li>`;
        })
        .join("");
    }

    // Botones
    if (btnAdmin) {
      btnAdmin.onclick = () => { window.location.href = "login.html"; };
      btnAdmin.style.display = isAdmin ? "none" : "inline-block";
    }

    if (btnLogout) {
      btnLogout.onclick = () => {
        localStorage.removeItem("userRole");
        alert("Sesión cerrada.");
        window.location.href = "index.html";
      };
      btnLogout.style.display = isAdmin ? "inline-block" : "none";
    }
  });
}
