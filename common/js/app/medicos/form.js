import { listEspecialidades, getMedicoById, createMedico, updateMedico } from './service.js';

const params = new URLSearchParams(location.search);
const editingId = params.get('id');

const title = document.getElementById('form-title');
const form = document.getElementById('form-medico');
const selEspecialidad = document.getElementById('especialidadId');

function loadEspecialidades() {
  const options = listEspecialidades()
    .map(e => `<option value="${e.id}">${e.nombre}</option>`)
    .join('');
  selEspecialidad.innerHTML = `<option value="" disabled selected>Seleccione...</option>` + options;
}

function setError(name, msg = '') {
  const el = form.querySelector(`.form-text[data-for="${name}"]`);
  if (el) el.textContent = msg;
}

function validate(data) {
  let ok = true;
  setError('nombre', '');
  setError('apellido', '');
  setError('matricula', '');
  setError('especialidadId', '');
  setError('email', '');

  if (!data.nombre?.trim()) { setError('nombre', 'Campo requerido'); ok = false; }
  if (!data.apellido?.trim()) { setError('apellido', 'Campo requerido'); ok = false; }
  if (!data.matricula || isNaN(Number(data.matricula))) { setError('matricula', 'Ingrese una matrícula válida'); ok = false; }
  if (!data.especialidadId) { setError('especialidadId', 'Seleccione una especialidad'); ok = false; }
  if (!data.email?.includes('@')) { setError('email', 'Email inválido'); ok = false; }

  return ok;
}

function loadIfEditing() {
  if (!editingId) return;
  title.textContent = `Editar Médico #${editingId}`;
  const medico = getMedicoById(editingId);
  if (!medico) {
    alert('Médico no encontrado');
    location.href = 'medicos.html';
    return;
  }
  form.nombre.value = medico.nombre;
  form.apellido.value = medico.apellido;
  form.matricula.value = medico.matricula;
  form.especialidadId.value = medico.especialidadId;
  form.email.value = medico.email;
  form.telefono.value = medico.telefono ?? '';
  form.activo.checked = Boolean(medico.activo);
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = {
    nombre: form.nombre.value,
    apellido: form.apellido.value,
    matricula: form.matricula.value,
    especialidadId: form.especialidadId.value,
    email: form.email.value,
    telefono: form.telefono.value,
    activo: form.activo.checked
  };

  if (!validate(data)) return;

  if (editingId) {
    updateMedico(Number(editingId), data);
    alert('Médico actualizado');
  } else {
    createMedico(data);
    alert('Médico creado');
  }
  location.href = 'medicos.html';
});

loadEspecialidades();
loadIfEditing();