import { getMedicoById, getEspecialidadNombreById } from './service.js';

// Leo el id desde la URL (ej: medico-detalle.html?id=3)
const params = new URLSearchParams(location.search);
const idRaw = params.get('id');
const id = idRaw ? Number(idRaw) : NaN;

// Referencias a elementos de la vista
const dl = document.getElementById('detalle-medico'); // <dl> donde pinto pares dt/dd
const editarLink = document.getElementById('editar-link'); // botón "Editar"

// Función utilitaria para armar una fila dt/dd (me evita repetir string largo)
function row(label, value) {
  return `
    <dt class="col-sm-3">${label}</dt>
    <dd class="col-sm-9">${value}</dd>
  `;
}

// Convierto el estado en un badge de Bootstrap para que se vea más claro
function estadoBadge(activo) {
  const cls = activo ? 'bg-success' : 'bg-secondary';
  const txt = activo ? 'Activo' : 'Inactivo';
  return `<span class="badge ${cls}">${txt}</span>`;
}

// Render principal
function render() {
  // guard por si no existe el contenedor
  if (!dl) return;

  // Si el id no está o no es número, informo y oculto Editar
  if (!Number.isFinite(id) || id <= 0) {
    dl.innerHTML = `<div class="text-danger">ID inválido o no provisto.</div>`;
    if (editarLink) editarLink.style.display = 'none';
    return;
  }

  // Busco el médico por ID
  const m = getMedicoById(id);

  // Si no lo encuentro, muestro mensaje + oculto botón editar
  if (!m) {
    dl.innerHTML = `<div class="text-danger">Médico no encontrado.</div>`;
    if (editarLink) editarLink.style.display = 'none';
    return;
  }

  // Si existe, actualizo el link de "Editar" para que apunte al mismo id
  if (editarLink) {
    editarLink.href = `medico-form.html?id=${m.id}`;
    editarLink.style.display = ''; // por si estaba oculto
  }

  // Armo el HTML del detalle usando pequeños helpers para no repetir
  const espNombre = getEspecialidadNombreById(m.especialidadId) || '—';
  const emailHTML = m.email ? `<a href="mailto:${m.email}">${m.email}</a>` : '—';
  const telHTML = m.telefono && m.telefono.trim() ? m.telefono : '—';
  const descripcionHTML = m.descripcion && m.descripcion.trim() ? m.descripcion : '—';
  const valorConsultaHTML = m.valorConsulta ? `$${m.valorConsulta.toFixed(2)}` : '—';

  dl.innerHTML = [
    row('ID', m.id),
    row('Apellido', m.apellido || '—'),
    row('Nombre', m.nombre || '—'),
    row('Especialidad', espNombre),
    row('Matrícula', m.matricula ?? '—'),
    row('Email', emailHTML),
    row('Teléfono', telHTML),
    row('Descripción', descripcionHTML),
    row('Valor de consulta', valorConsultaHTML),
    row('Estado', estadoBadge(!!m.activo)),
  ].join('');
}

// Disparo el render al cargar la página
document.addEventListener('DOMContentLoaded', render);