// Listado de turnos: muestro en tabla, filtro por texto y permito eliminar.

import { listTurnos, deleteTurno, getMedicoById } from '../medicos/service.js';

// Referencias al DOM
const tbody  = document.getElementById('tbody-turnos');
const filtro = document.getElementById('filtro');

// Formateo de fecha ISO a algo legible en AR
function formatearFechaHora(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  if (isNaN(d)) return iso; // por si viene algo raro
  const fecha = d.toLocaleDateString('es-AR', { weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric' });
  const hora  = d.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
  return `${fecha} ${hora}`;
}

// Nombre completo del médico a partir del id
function nombreMedico(medicoId) {
  const m = getMedicoById(medicoId);
  if (!m) return '—';
  return `${m.apellido}, ${m.nombre}`;
}

// Badge por estado
function badgeEstado(estado) {
  const e = String(estado || '').toLowerCase();
  let clase = 'secondary';
  if (e === 'pendiente')  clase = 'warning';
  if (e === 'confirmado') clase = 'success';
  if (e === 'cancelado')  clase = 'danger';
  return `<span class="badge bg-${clase} text-uppercase">${e || '—'}</span>`;
}

// Fila HTML
function filaHTML(t) {
  const tel = t.contacto ? `<a href="tel:${t.contacto.replace(/\s+/g,'')}">${t.contacto}</a>` : '—';
  return `
    <tr>
      <td>${t.id}</td>
      <td>${formatearFechaHora(t.fechaISO)}</td>
      <td>${nombreMedico(t.medicoId)}</td>
      <td>${t.paciente || '—'}</td>
      <td>${tel}</td>
      <td>${badgeEstado(t.estado)}</td>
      <td class="text-end">
        <a class="btn btn-sm btn-warning" href="turno-form.html?id=${t.id}">Editar</a>
        <button class="btn btn-sm btn-outline-danger" data-action="delete" data-id="${t.id}">Eliminar</button>
      </td>
    </tr>
  `;
}

// Ordeno por fecha (más próxima primero)
function obtenerOrdenados() {
  const datos = listTurnos() || [];
  return datos.slice().sort((a, b) => {
    const ta = new Date(a.fechaISO).getTime();
    const tb = new Date(b.fechaISO).getTime();
    return (isNaN(ta) ? 0 : ta) - (isNaN(tb) ? 0 : tb);
  });
}

// Filtro por texto: paciente, médico o estado
function obtenerFiltrados() {
  const q = (filtro?.value || '').toLowerCase().trim();
  const base = obtenerOrdenados();
  if (!q) return base;

  return base.filter(t => {
    const med = nombreMedico(t.medicoId).toLowerCase();
    const pac = String(t.paciente || '').toLowerCase();
    const est = String(t.estado || '').toLowerCase();
    return med.includes(q) || pac.includes(q) || est.includes(q);
  });
}

// Render
function render(items) {
  if (!tbody) return;

  if (!items.length) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="text-center text-secondary py-4">
          No hay turnos para mostrar
        </td>
      </tr>`;
    return;
  }

  tbody.innerHTML = items.map(filaHTML).join('');
}

// Refresco general
function refresh() {
  render(obtenerFiltrados());
}

// Eliminar turno (confirmación)
tbody?.addEventListener('click', (e) => {
  const btn = e.target.closest('button[data-action="delete"]');
  if (!btn) return;

  const id = Number(btn.dataset.id);
  if (!Number.isFinite(id)) return;

  const ok = confirm('¿Seguro que desea eliminar este turno?');
  if (!ok) return;

  const borrado = deleteTurno(id);
  if (borrado) {
    refresh();
  } else {
    alert('No se pudo eliminar el turno.');
  }
});

// Filtro en vivo
filtro?.addEventListener('input', refresh);

// Primera carga
refresh();
