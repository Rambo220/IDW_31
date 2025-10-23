// Reserva pública con horarios 08:00–18:00 cada 30' y bloqueo de duplicados.
// Calcula el precio (50 % si la obra social del paciente está aceptada por el médico).
// Si el paciente no tiene obra social, aplica un recargo del 25 %.

import {
  listMedicos,
  getMedicoById,
  listTurnos,
  createTurno,
  listObrasSociales,
} from '../medicos/service.js';

const form        = document.getElementById('form-reserva');
const selMedico   = document.getElementById('medicoId');
const inputFecha  = document.getElementById('fecha');          
const selHora     = document.getElementById('hora');           
const selObra     = document.getElementById('obraSocialId');   
const precioEl    = document.getElementById('precioConsulta'); 
const tbodyProx   = document.getElementById('tbody-proximos');


function setMsg(name, msg = '') {
  const el = form?.querySelector(`.form-text[data-for="${name}"]`);
  if (el) el.textContent = msg;
}
function clearMsgs() {
  ['medicoId','fecha','hora','paciente','contacto','obraSocialId'].forEach(n => setMsg(n, ''));
}

/*Catálogos*/
function cargarMedicos() {
  const medicos = (listMedicos() || []).filter(m => m.activo);
  console.log('👉 LISTA DE MÉDICOS:', medicos); // para verificar valorConsulta
  selMedico.innerHTML = '<option value="" disabled selected>Seleccione un médico...</option>';
  medicos.forEach(m => {
    const op = document.createElement('option');
    op.value = m.id;
    op.textContent = `${m.apellido}, ${m.nombre}`;
    selMedico.appendChild(op);
  });
}

function cargarObras() {
  const obras = listObrasSociales() || [];
  selObra.innerHTML = `<option value="">(Sin obra social)</option>` +
    obras.map(o => `<option value="${o.id}">${o.nombre}</option>`).join('');
}

/*Horas*/
function generarHoras() {
  const horas = [];
  for (let h = 8; h < 18; h++) {
    horas.push(`${String(h).padStart(2, '0')}:00`);
    if (h !== 17) horas.push(`${String(h).padStart(2, '0')}:30`);
    else horas.push('17:30');
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

  const ocupados = new Set(
    (listTurnos() || [])
      .filter(t => Number(t.medicoId) === medicoId && fechaISOaFecha(t.fechaISO) === fecha)
      .map(t => String(t.fechaISO).split('T')[1].slice(0,5))
  );

  Array.from(selHora.options).forEach(opt => {
    if (!opt.value) return;
    if (ocupados.has(opt.value)) opt.disabled = true;
  });

  if (selHora.value && ocupados.has(selHora.value)) selHora.value = '';
}

/*Fecha*/
function configurarMinFecha() {
  const hoy = new Date();
  const yyyy = hoy.getFullYear();
  const mm = String(hoy.getMonth() + 1).padStart(2, '0');
  const dd = String(hoy.getDate()).padStart(2, '0');
  const hoyISO = `${yyyy}-${mm}-${dd}`;
  inputFecha.min = hoyISO;
  if (!inputFecha.value) inputFecha.value = hoyISO;
}

/*Precio*/
function calcularPrecio() {
  const medicoId = Number(selMedico.value);
  if (!medicoId) {
    precioEl.textContent = '$ —';
    return null;
  }

  const medico = getMedicoById(medicoId);
  const base = Number(medico?.valorConsulta) || 0;

  if (base <= 0) {
    precioEl.textContent = '$ —';
    return null;
  }

  const obraId = selObra.value ? Number(selObra.value) : null;
  let final = base;

  const acepta = obraId != null && Array.isArray(medico?.obrasSociales)
    ? medico.obrasSociales.map(Number).includes(obraId)
    : false;

  if (acepta) {
    final = base * 0.5; // 50 % descuento
  } else if (!obraId) {
    final = base * 1.25; // 25 % recargo
  }

  precioEl.textContent = `$ ${final.toLocaleString('es-AR', { minimumFractionDigits: 2 })}`;
  return final;
}

/*Próximos turnos*/
function renderProximos() {
  const items = (listTurnos() || [])
    .slice()
    .sort((a, b) => new Date(a.fechaISO) - new Date(b.fechaISO))
    .slice(0, 10);

  if (!items.length) {
    tbodyProx.innerHTML = `<tr><td colspan="5" class="text-center text-secondary py-3">No hay turnos próximos</td></tr>`;
    return;
  }

  tbodyProx.innerHTML = items.map(t => {
    const d = new Date(t.fechaISO);
    const fecha = isNaN(d)
      ? t.fechaISO
      : d.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' }) +
        ' ' + d.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
    const med = getMedicoById(t.medicoId);
    const nombreMed = med ? `${med.apellido}, ${med.nombre}` : '—';
    const tel = t.contacto ? `<a href="tel:${t.contacto.replace(/\s+/g,'')}">${t.contacto}</a>` : '—';
    const est = String(t.estado || 'pendiente');
    const badge = est === 'pendiente' ? 'warning' : est === 'confirmado' ? 'success' : est === 'cancelado' ? 'danger' : 'secondary';
    return `
      <tr>
        <td>${fecha}</td>
        <td>${nombreMed}</td>
        <td>${t.paciente || '—'}</td>
        <td>${tel}</td>
        <td><span class="badge bg-${badge} text-uppercase">${est}</span></td>
      </tr>`;
  }).join('');
}

/*Validación + submit*/
function validar(datos) {
  clearMsgs();
  let ok = true;

  if (!datos.medicoId) setMsg('medicoId','Seleccione un médico'), ok = false;
  if (!datos.fecha)    setMsg('fecha','Seleccione una fecha'),   ok = false;
  if (!datos.hora)     setMsg('hora','Seleccione una hora'),     ok = false;
  if (!datos.paciente?.trim()) setMsg('paciente','Ingrese el nombre del paciente'), ok = false;

  if (ok) {
    const fechaISO = `${datos.fecha}T${datos.hora}`;
    const duplicado = (listTurnos() || []).some(t =>
      Number(t.medicoId) === Number(datos.medicoId) && t.fechaISO === fechaISO
    );
    if (duplicado) setMsg('hora', 'Ese horario ya está reservado para este médico'), ok = false;
  }
  return ok;
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const medicoId = selMedico.value;
  const fecha    = inputFecha.value;   
  const hora     = selHora.value;      
  const obraId   = selObra.value ? Number(selObra.value) : null;
  const precio   = calcularPrecio() || null;

  const datos = {
    medicoId,
    fecha,
    hora,
    paciente: form.paciente.value,
    contacto: form.contacto.value,
    obraSocialId: obraId,
  };

  if (!validar(datos)) return;

  const fechaISO = `${fecha}T${hora}`;
  createTurno({
    medicoId,
    fechaISO,
    paciente: datos.paciente,
    contacto: datos.contacto,
    estado: 'pendiente',
    obraSocialId: obraId,
    precioFinal: precio,
  });

  alert('Turno registrado ');
  form.reset();
  configurarMinFecha();
  poblarHorasBase();
  actualizarHorasDisponibles();
  calcularPrecio();
  renderProximos();
});

/*Eventos*/
selMedico?.addEventListener('change', () => { actualizarHorasDisponibles(); calcularPrecio(); });
inputFecha?.addEventListener('change', actualizarHorasDisponibles);
selObra?.addEventListener('change', calcularPrecio);

/*init*/
function init() {
  cargarMedicos();
  cargarObras();
  configurarMinFecha();
  poblarHorasBase();
  actualizarHorasDisponibles();
  calcularPrecio();
  renderProximos();
}
init();
