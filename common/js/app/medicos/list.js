import { listMedicos, deleteMedico, getEspecialidadNombreById } from './service.js';

// Guardo referencias a los elementos del DOM que uso
const tbody  = document.getElementById('tbody-medicos');
const filtro = document.getElementById('filtro');

// Uso un pequeño debounce para que el filtro no dispare render en cada tecla
let debounceId = null;
const debounce = (fn, ms = 150) => {
  clearTimeout(debounceId);
  debounceId = setTimeout(fn, ms);
};

// Esta función arma el HTML de una sola fila (me queda más prolijo)
function rowHTML(m) {
  const espNombre = getEspecialidadNombreById(m.especialidadId) || '-';
  const activoBadge = `<span class="badge ${m.activo ? 'bg-success' : 'bg-secondary'}">${m.activo ? 'Sí' : 'No'}</span>`;

  return `
    <tr>
      <td>${m.id}</td>
      <td>${m.apellido}</td>
      <td>${m.nombre}</td>
      <td>${espNombre}</td>
      <td>${m.matricula}</td>
      <td>${activoBadge}</td>
      <td class="text-nowrap d-flex gap-2">
        <a class="btn btn-sm btn-outline-info"
           href="medico-detalle.html?id=${m.id}"
           aria-label="Ver detalles de ${m.nombre} ${m.apellido}">
          Ver
        </a>
        <a class="btn btn-sm btn-warning"
           href="medico-form.html?id=${m.id}"
           aria-label="Editar a ${m.nombre} ${m.apellido}">
          Editar
        </a>
        <button class="btn btn-sm btn-outline-danger"
                data-action="delete"
                data-id="${m.id}"
                aria-label="Eliminar a ${m.nombre} ${m.apellido}">
          Eliminar
        </button>
      </td>
    </tr>
  `;
}

// Devuelvo la lista ordenada para que siempre se vea prolija (Apellido > Nombre)
function getSortedMedicos() {
  const data = listMedicos() || [];
  return data
    .slice() // hago copia para no tocar el original
    .sort((a, b) => {
      const ap = (a.apellido || '').localeCompare(b.apellido || '');
      return ap !== 0 ? ap : (a.nombre || '').localeCompare(b.nombre || '');
    });
}

// Filtro por nombre, apellido, matrícula o especialidad
function getFiltered() {
  const q = (filtro?.value || '').toLowerCase().trim();
  const base = getSortedMedicos();
  if (!q) return base;

  return base.filter(m => {
    const esp = (getEspecialidadNombreById(m.especialidadId) || '').toLowerCase();
    return (
      (m.nombre || '').toLowerCase().includes(q) ||
      (m.apellido || '').toLowerCase().includes(q) ||
      String(m.matricula || '').includes(q) ||
      esp.includes(q)
    );
  });
}

// Re-renderizo la tabla (uso un solo innerHTML para mejorar performance)
function renderTable(items) {
  if (!tbody) return;

  if (!items.length) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="text-center text-secondary py-4">No hay médicos</td>
      </tr>
    `;
    return;
  }

  const html = items.map(rowHTML).join('');
  tbody.innerHTML = html;
}

// Función única para refrescar la vista
function refresh() {
  renderTable(getFiltered());
}

// Delegación para el botón Eliminar (un listener para todas las filas)
tbody?.addEventListener('click', (e) => {
  const btn = e.target.closest('button[data-action="delete"]');
  if (!btn) return;

  const id = Number(btn.dataset.id);
  if (!Number.isFinite(id)) return;

  const ok = confirm('¿Seguro que desea eliminar este médico?');
  if (!ok) return;

  const removed = deleteMedico(id);
  if (removed) {
    refresh();
  } else {
    // por si la función de service falla, aviso
    alert('No se pudo eliminar. Intentá de nuevo.');
  }
});

// Filtro con debounce para que no parpadee tanto
filtro?.addEventListener('input', () => debounce(refresh, 150));

// primera carga de la tabla
refresh();
