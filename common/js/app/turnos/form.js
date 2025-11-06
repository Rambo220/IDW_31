// Este archivo maneja el alta y edición de turnos.

import { listMedicos, getTurnoById, createTurno, updateTurno } from '../medicos/service.js';

const form = document.getElementById('form-turno');
const selMedico = document.getElementById('medicoId');
const titulo = document.getElementById('form-title');

const params = new URLSearchParams(location.search);
const editId = params.get('id');

// Cargo los médicos en el select
function cargarMedicos() {
  const medicos = listMedicos().filter(m => m.activo);
  selMedico.innerHTML = '<option value="" disabled selected>Seleccione un médico...</option>';
  medicos.forEach(m => {
    const op = document.createElement('option');
    op.value = m.id;
    op.textContent = `${m.apellido}, ${m.nombre}`;
    selMedico.appendChild(op);
  });
}

// Limpia errores previos
function limpiarErrores() {
  form.querySelectorAll('.form-text[data-for]').forEach(e => e.textContent = '');
}

// Muestra errores si falta algo
function mostrarError(campo, msg) {
  const el = form.querySelector(`.form-text[data-for="${campo}"]`);
  if (el) el.textContent = msg;
}

// Validación simple de los datos
function validar(datos) {
  let ok = true;
  limpiarErrores();

  if (!datos.medicoId) { mostrarError('medicoId', 'Seleccione un médico'); ok = false; }
  if (!datos.fechaISO) { mostrarError('fechaISO', 'Seleccione fecha y hora'); ok = false; }
  if (!datos.paciente?.trim()) { mostrarError('paciente', 'Campo requerido'); ok = false; }

  return ok;
}

// Si estoy editando, cargo los datos existentes
function cargarTurno() {
  if (!editId) return;
  const turno = getTurnoById(editId);
  if (!turno) {
    alert('Turno no encontrado');
    location.href = 'turnos.html';
    return;
  }
  titulo.textContent = `Editar Turno #${editId}`;
  form.medicoId.value = turno.medicoId;
  form.fechaISO.value = turno.fechaISO;
  form.paciente.value = turno.paciente;
  form.contacto.value = turno.contacto;
  form.estado.value = turno.estado;
}

// Evento de guardado
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const datos = {
    medicoId: form.medicoId.value,
    fechaISO: form.fechaISO.value,
    paciente: form.paciente.value,
    contacto: form.contacto.value,
    estado: form.estado.value
  };

  if (!validar(datos)) return;

  if (editId) {
    updateTurno(Number(editId), datos);
    alert('Turno actualizado correctamente');
  } else {
    createTurno(datos);
    alert('Turno registrado correctamente');
  }

  location.href = 'turnos.html';
});

// Inicializo todo
cargarMedicos();
cargarTurno();
