import { listMedicos, deleteMedico, getEspecialidadNombreById } from './service.js';

const tbody = document.getElementById('tbody-medicos');
const filtro = document.getElementById('filtro');

function renderTable(items) {
  tbody.innerHTML = '';
  if (!items.length) {
    tbody.innerHTML = `<tr><td colspan="7" class="text-center text-secondary">No hay médicos</td></tr>`;
    return;
  }

  for (const m of items) {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${m.id}</td>
      <td>${m.apellido}</td>
      <td>${m.nombre}</td>
      <td>${getEspecialidadNombreById(m.especialidadId)}</td>
      <td>${m.matricula}</td>
      <td>${m.activo ? 'Sí' : 'No'}</td>
      <td class="d-flex gap-2">
        <a class="btn btn-sm btn-primary" href="medico-detalle.html?id=${m.id}">Ver</a>
        <a class="btn btn-sm btn-warning" href="medico-form.html?id=${m.id}">Editar</a>
        <button class="btn btn-sm btn-danger" data-action="delete" data-id="${m.id}">Eliminar</button>
      </td>
    `;
    tbody.appendChild(tr);
  }
}

function getFiltered() {
  const q = (filtro?.value || '').toLowerCase().trim();
  const data = listMedicos();
  if (!q) return data;

  return data.filter(m => {
    const esp = getEspecialidadNombreById(m.especialidadId);
    return (
      m.nombre.toLowerCase().includes(q) ||
      m.apellido.toLowerCase().includes(q) ||
      String(m.matricula).includes(q) ||
      esp.toLowerCase().includes(q)
    );
  });
}

function refresh() {
  renderTable(getFiltered());
}

tbody.addEventListener('click', (e) => {
  const btn = e.target.closest('button[data-action="delete"]');
  if (!btn) return;
  const id = Number(btn.dataset.id);
  const ok = confirm('¿Seguro que desea eliminar este médico?');
  if (!ok) return;
  const removed = deleteMedico(id);
  if (removed) refresh();
});

filtro?.addEventListener('input', refresh);
refresh();