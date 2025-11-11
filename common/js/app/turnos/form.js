// Este archivo maneja el alta y edición de turnos.

import { listMedicos, getTurnoById, createTurno, updateTurno, listTurnos } from '../medicos/service.js';

const form = document.getElementById('form-turno');
const selMedico = document.getElementById('medicoId');
const inputFecha = document.getElementById('fecha');
const selHora = document.getElementById('hora');
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

// --- MANEJO DE HORARIOS ---

function generarHoras() {
  const horas = [];
  for (let h = 8; h < 18; h++) {
    horas.push(`${String(h).padStart(2, '0')}:00`);
    horas.push(`${String(h).padStart(2, '0')}:30`);
  }
  return horas;
}

function poblarHorasBase() {
  const horas = generarHoras();
  selHora.innerHTML =
    '<option value="" disabled selected>Seleccione hora...</option>' +
    horas.map(h => `<option value="${h}">${h}</option>`).join('');
}

function fechaISOaFecha(iso) {
  return String(iso).split('T')[0];
}

function actualizarHorasDisponibles() {
  Array.from(selHora.options).forEach(opt => { if (opt.value) opt.disabled = false; });

  const medicoId = Number(selMedico.value);
  const fecha = (inputFecha.value || '').trim();
  if (!medicoId || !fecha) return;

  const turnosOcupados = (listTurnos() || [])
    .filter(t => {
      const esMismoMedico = Number(t.medicoId) === medicoId;
      const esMismaFecha = fechaISOaFecha(t.fechaISO) === fecha;
      // Si estamos editando, no consideramos el turno actual como "ocupado"
      const esTurnoActual = editId ? Number(t.id) === Number(editId) : false;
      return esMismoMedico && esMismaFecha && !esTurnoActual;
    });

  const horasOcupadas = new Set(
    turnosOcupados.map(t => String(t.fechaISO).split('T')[1].slice(0, 5))
  );

  Array.from(selHora.options).forEach(opt => {
    if (!opt.value) return;
    if (horasOcupadas.has(opt.value)) opt.disabled = true;
  });

  // Si la hora seleccionada ahora está deshabilitada, la deseleccionamos
  if (selHora.value && horasOcupadas.has(selHora.value)) {
    selHora.value = '';
  }
}

// --- MANEJO DE FECHA ---

function configurarMinFecha() {
  const hoy = new Date();
  const yyyy = hoy.getFullYear();
  const mm = String(hoy.getMonth() + 1).padStart(2, '0');
  const dd = String(hoy.getDate()).padStart(2, '0');
  inputFecha.min = `${yyyy}-${mm}-${dd}`;
}

// --- VALIDACIÓN Y ERRORES ---

function limpiarErrores() {
  form.querySelectorAll('.form-text[data-for]').forEach(e => e.textContent = '');
}

function mostrarError(campo, msg) {
  const el = form.querySelector(`.form-text[data-for="${campo}"]`);
  if (el) el.textContent = msg;
}

function validar(datos) {
  let ok = true;
  limpiarErrores();

  if (!datos.medicoId) { mostrarError('medicoId', 'Seleccione un médico'); ok = false; }
  if (!datos.fecha) { mostrarError('fecha', 'Seleccione una fecha'); ok = false; }
  if (!datos.hora) { mostrarError('hora', 'Seleccione una hora'); ok = false; }
  if (!datos.paciente?.trim()) { mostrarError('paciente', 'Campo requerido'); ok = false; }

  if (ok) {
    const fechaISO = `${datos.fecha}T${datos.hora}`;
    const duplicado = (listTurnos() || []).some(t => {
      const esMismoTurno = Number(t.medicoId) === Number(datos.medicoId) && t.fechaISO === fechaISO;
      // Si editamos, no comparamos consigo mismo
      const esTurnoActual = editId ? Number(t.id) === Number(editId) : false;
      return esMismoTurno && !esTurnoActual;
    });

    if (duplicado) {
      mostrarError('hora', 'Ese horario ya está reservado para este médico');
      ok = false;
    }
  }

  return ok;
}

// --- CARGA Y GUARDADO ---

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
  
  if (turno.fechaISO) {
    form.fecha.value = turno.fechaISO.split('T')[0];
    form.hora.value = turno.fechaISO.split('T')[1].slice(0, 5);
  }

  form.paciente.value = turno.paciente;
  form.contacto.value = turno.contacto;
  form.estado.value = turno.estado;

  actualizarHorasDisponibles();
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const datos = {
    medicoId: form.medicoId.value,
    fecha: form.fecha.value,
    hora: form.hora.value,
    paciente: form.paciente.value,
    contacto: form.contacto.value,
    estado: form.estado.value
  };

  if (!validar(datos)) return;

  const datosFinales = {
    medicoId: Number(datos.medicoId),
    fechaISO: `${datos.fecha}T${datos.hora}`,
    paciente: datos.paciente,
    contacto: datos.contacto,
    estado: datos.estado
  };

  if (editId) {
    updateTurno(Number(editId), datosFinales);
    alert('Turno actualizado correctamente');
  } else {
    createTurno(datosFinales);
    alert('Turno registrado correctamente');
  }

  location.href = 'turnos.html';
});

// --- INICIALIZACIÓN ---

function init() {
  cargarMedicos();
  poblarHorasBase();
  configurarMinFecha();
  
  if (editId) {
    cargarTurno();
  } else {
    // Para un turno nuevo, actualizamos las horas en cuanto se elija médico y fecha
    actualizarHorasDisponibles();
  }

  selMedico.addEventListener('change', actualizarHorasDisponibles);
  inputFecha.addEventListener('change', actualizarHorasDisponibles);
}

init();
