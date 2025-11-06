// Formulario de especialidades: crear o editar

import {
  listEspecialidades,
  getEspecialidadById,
  createEspecialidad,
  updateEspecialidad
} from '../medicos/service.js';

// referencias al DOM
const titulo = document.getElementById('form-title');
const form   = document.getElementById('form-especialidad');
const params = new URLSearchParams(location.search);
const editingId = params.get('id'); // puede ser null

// muestro errores debajo del input
function setError(name, msg = '') {
  const el = form.querySelector(`.form-text[data-for="${name}"]`);
  if (el) el.textContent = msg;
}

// normalizo nombre (trim y sin dobles espacios)
function normalizarNombre(str) {
  return String(str || '')
    .trim()
    .replace(/\s+/g, ' ');
}

// validación: requerido y no duplicado (case-insensitive)
function validar(nombre) {
  setError('nombre', '');

  if (!nombre) {
    setError('nombre', 'Campo requerido');
    return false;
  }

  const actualId = editingId ? Number(editingId) : null;
  const existe = listEspecialidades().some(e =>
    e.nombre.toLowerCase() === nombre.toLowerCase() &&
    e.id !== actualId
  );

  if (existe) {
    setError('nombre', 'Ya existe una especialidad con ese nombre');
    return false;
  }

  return true;
}

// si estoy editando, cargo el dato actual
function cargarSiEditando() {
  if (!editingId) return;

  const esp = getEspecialidadById(editingId);
  if (!esp) {
    alert('Especialidad no encontrada');
    location.href = 'especialidades.html';
    return;
  }

  titulo.textContent = `Editar Especialidad #${esp.id}`;
  form.nombre.value = esp.nombre;
}

// submit del formulario
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const nombre = normalizarNombre(form.nombre.value);

  if (!validar(nombre)) return;

  if (editingId) {
    updateEspecialidad(Number(editingId), { nombre });
    alert('Especialidad actualizada');
  } else {
    createEspecialidad({ nombre });
    alert('Especialidad creada');
  }

  location.href = 'especialidades.html';
});

// inicio
cargarSiEditando();
