function actualizarIcono(esOscuro){
  const icono = document.getElementById("d1-icon");
  if (icono) {
    icono.className = esOscuro ? "bi bi-sun-fill" : "bi bi-moon-fill";
  }
}

const temaOscuro = () => {
  document.body.setAttribute("data-theme", "dark");
  localStorage.setItem("theme", "dark");
  actualizarIcono(true);
};

const temaClaro = () => {
  document.body.setAttribute("data-theme", "light");
  localStorage.setItem("theme", "light");
  actualizarIcono(false);
};

const cambiarTema = () => {
  document.body.getAttribute("data-theme") === "light"
    ? temaOscuro()
    : temaClaro();
};

document.addEventListener("DOMContentLoaded", () => {
  const temaGuardado = localStorage.getItem("theme") || "light";
  document.body.setAttribute("data-theme", temaGuardado);
  actualizarIcono(temaGuardado === "dark");
});
