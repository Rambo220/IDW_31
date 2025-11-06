// Catálogo público (lista médicos activos)

import { listMedicos, getEspecialidadNombreById } from './service.js';

const tbody  = document.getElementById('tbody-catalogo');
const filtro = document.getElementById('filtro');

function trunc(txt, max = 160) {
  const t = String(txt || '').trim();
  return t.length <= max ? t : t.slice(0, max).trim() + '…';
}

function rowHTML(m) {
  const espNombre = getEspecialidadNombreById(m.especialidadId) || '—';
  const desc      = m.descripcion ? trunc(m.descripcion) : '—';
  const emailHTML = m.email ? `<a href="mailto:${m.email}">${m.email}</a>` : '—';
  const telHTML   = m.telefono
    ? `<br><a href="tel:${m.telefono.replace(/\s+/g,'')}">${m.telefono}</a>`
    : '';

  const activoBadge = `<span class="badge ${m.activo ? 'bg-success' : 'bg-secondary'}">
    ${m.activo ? 'Sí' : 'No'}
  </span>`;

  return `
    <tr>
      <td>${m.apellido}</td>
      <td>${m.nombre}</td>
      <td>${espNombre}</td>
      <td>${desc}</td>
      <td>${m.matricula}</td>
      <td>${emailHTML}${telHTML}</td>
      <td>${activoBadge}</td>
    </tr>
  `;
}

function getSortedActivos() {
  const activos = (listMedicos() || []).filter(m => !!m.activo);
  return activos.slice().sort((a, b) => {
    const ap = (a.apellido || '').localeCompare(b.apellido || '');
    return ap !== 0 ? ap : (a.nombre || '').localeCompare(b.nombre || '');
  });
}

// Filtro por nombre, apellido o especialidad
function getFiltered() {
  const q = (filtro?.value || '').toLowerCase().trim();
  const base = getSortedActivos();
  if (!q) return base;

  return base.filter(m => {
    const esp = (getEspecialidadNombreById(m.especialidadId) || '').toLowerCase();
    return (
      (m.nombre   || '').toLowerCase().includes(q) ||
      (m.apellido || '').toLowerCase().includes(q) ||
      esp.includes(q)
    );
  });
}

function render(items) {
  if (!tbody) return;

  if (!items.length) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="text-center text-secondary py-4">
          No hay profesionales para mostrar
        </td>
      </tr>`;
    return;
  }
  tbody.innerHTML = items.map(rowHTML).join('');
}

function refresh() { render(getFiltered()); }

let debounceId = null;
function debounce(fn, ms = 150) {
  clearTimeout(debounceId);
  debounceId = setTimeout(fn, ms);
}

filtro?.addEventListener('input', () => debounce(refresh, 150));
refresh();
