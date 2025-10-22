import { getMedicoById, getEspecialidadNombreById } from './service.js';

const params = new URLSearchParams(location.search);
const id = Number(params.get('id'));
const dl = document.getElementById('detalle-medico');
const editarLink = document.getElementById('editar-link');

function render() {
  const m = getMedicoById(id);
  if (!m) {
    dl.innerHTML = '<div class="text-danger">Médico no encontrado.</div>';
    editarLink.style.display = 'none';
    return;
  }
  editarLink.href = `medico-form.html?id=${m.id}`;
  dl.innerHTML = `
    <dt class="col-sm-3">ID</dt><dd class="col-sm-9">${m.id}</dd>
    <dt class="col-sm-3">Apellido</dt><dd class="col-sm-9">${m.apellido}</dd>
    <dt class="col-sm-3">Nombre</dt><dd class="col-sm-9">${m.nombre}</dd>
    <dt class="col-sm-3">Especialidad</dt><dd class="col-sm-9">${getEspecialidadNombreById(m.especialidadId)}</dd>
    <dt class="col-sm-3">Matrícula</dt><dd class="col-sm-9">${m.matricula}</dd>
    <dt class="col-sm-3">Email</dt><dd class="col-sm-9">${m.email}</dd>
    <dt class="col-sm-3">Teléfono</dt><dd class="col-sm-9">${m.telefono || '—'}</dd>
    <dt class="col-sm-3">Estado</dt><dd class="col-sm-9">${m.activo ? 'Activo' : 'Inactivo'}</dd>
  `;
}

render();