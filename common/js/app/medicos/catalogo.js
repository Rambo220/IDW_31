import { listMedicos, getEspecialidadNombreById } from './service.js';

const tbody = document.getElementById('tbody-catalogo');
const filtro = document.getElementById('filtro');

function render(items) {
  tbody.innerHTML = '';
  if (!items.length) {
    tbody.innerHTML = `<tr><td colspan="6" class="text-center text-secondary">No hay profesionales para mostrar</td></tr>`;
    return;
  }
  for (const m of items) {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${m.apellido}</td>
      <td>${m.nombre}</td>
      <td>${getEspecialidadNombreById(m.especialidadId)}</td>
      <td>${m.matricula}</td>
      <td>${m.email}${m.telefono ? `<br>${m.telefono}` : ''}</td>
      <td>${m.activo ? 'Sí' : 'No'}</td>
    `;
    tbody.appendChild(tr);
  }
}

function getFiltered() {
  const q = (filtro?.value || '').toLowerCase().trim();
  const data = listMedicos().filter(m => m.activo);
  if (!q) return data;
  return data.filter(m => {
    const esp = getEspecialidadNombreById(m.especialidadId);
    return (
      m.nombre.toLowerCase().includes(q) ||
      m.apellido.toLowerCase().includes(q) ||
      esp.toLowerCase().includes(q)
    );
  });
}

function refresh() {
  render(getFiltered());
}

filtro?.addEventListener('input', refresh);
refresh();