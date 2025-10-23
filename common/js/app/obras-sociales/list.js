// Listado + Editar + Eliminar
import { listObrasSociales, deleteObraSocial } from '../medicos/service.js';

const tbody = document.getElementById('obras-sociales-table');

function rowHTML(os) {
  return `
    <tr>
      <td>${os.id}</td>
      <td>${os.nombre}</td>
      <td>${os.descripcion || '—'}</td>
      <td class="text-nowrap d-flex gap-2">
        <a class="btn btn-sm btn-warning" href="obra-social-form.html?id=${os.id}">
          <i class="bi bi-pencil-square"></i> Editar
        </a>
        <button class="btn btn-sm btn-outline-danger" data-action="delete" data-id="${os.id}">
          <i class="bi bi-trash"></i> Eliminar
        </button>
      </td>
    </tr>`;
}

function render() {
  const data = (listObrasSociales() || [])
    .slice()
    .sort((a,b)=>(a.nombre||'').localeCompare(b.nombre||''));

  if (!data.length) {
    tbody.innerHTML = `
      <tr><td colspan="4" class="text-center text-secondary py-4">
        No hay obras sociales registradas
      </td></tr>`;
    return;
  }
  tbody.innerHTML = data.map(rowHTML).join('');
}

tbody?.addEventListener('click', (e) => {
  const btn = e.target.closest('button[data-action="delete"]');
  if (!btn) return;
  const id = Number(btn.dataset.id);
  if (!Number.isFinite(id)) return;

  if (!confirm('¿Eliminar la obra social?')) return;

  const res = deleteObraSocial(id);
  if (res?.ok) {
    render();
  } else if (res?.reason === 'en_uso') {
    alert('No se puede eliminar: hay médicos que la usan.');
  } else {
    alert('No se pudo eliminar. Intentá de nuevo.');
  }
});

document.addEventListener('DOMContentLoaded', render);
