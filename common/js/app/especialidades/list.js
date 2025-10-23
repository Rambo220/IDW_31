// Este archivo muestra el listado de especialidades en la tabla,
// permite buscar por nombre y eliminar una si no está en uso.

import { listEspecialidades, deleteEspecialidad } from '../medicos/service.js';

// Referencias a los elementos del HTML
const cuerpoTabla = document.getElementById('tbody-especialidades');
const filtro = document.getElementById('filtro');

// Función para armar una fila de la tabla
function crearFila(e) {
  return `
    <tr>
      <td>${e.id}</td>
      <td>${e.nombre}</td>
      <td class="text-end">
        <a class="btn btn-sm btn-warning" href="especialidad-form.html?id=${e.id}">Editar</a>
        <button class="btn btn-sm btn-outline-danger" data-action="delete" data-id="${e.id}">Eliminar</button>
      </td>
    </tr>
  `;
}

// Ordeno alfabéticamente las especialidades
function obtenerOrdenadas() {
  const datos = listEspecialidades() || [];
  return datos.slice().sort((a, b) => (a.nombre || '').localeCompare(b.nombre || ''));
}

// Filtro según lo que escriba el usuario
function obtenerFiltradas() {
  const texto = (filtro?.value || '').toLowerCase().trim();
  const base = obtenerOrdenadas();
  if (!texto) return base;
  return base.filter(e => (e.nombre || '').toLowerCase().includes(texto));
}

// Muestra la tabla en pantalla
function mostrarTabla(items) {
  if (!cuerpoTabla) return;

  if (!items.length) {
    cuerpoTabla.innerHTML = `
      <tr>
        <td colspan="3" class="text-center text-secondary py-4">
          No hay especialidades para mostrar
        </td>
      </tr>`;
    return;
  }

  cuerpoTabla.innerHTML = items.map(crearFila).join('');
}

// Actualiza la vista general
function refrescar() {
  mostrarTabla(obtenerFiltradas());
}

// Evento para eliminar una especialidad
cuerpoTabla?.addEventListener('click', (e) => {
  const btn = e.target.closest('button[data-action="delete"]');
  if (!btn) return;

  const id = Number(btn.dataset.id);
  if (!Number.isFinite(id)) return;

  const confirmar = confirm('¿Seguro que desea eliminar esta especialidad?');
  if (!confirmar) return;

  const resultado = deleteEspecialidad(id);

  if (resultado?.ok) {
    refrescar();
  } else if (resultado?.reason === 'en_uso') {
    alert('No se puede eliminar: hay médicos asociados a esta especialidad.');
  } else {
    alert('No se pudo eliminar la especialidad.');
  }
});

// Filtro en vivo
filtro?.addEventListener('input', refrescar);

// Primera carga de la tabla
refrescar();
