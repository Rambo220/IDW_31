// Formulario de Alta/Edición de médicos.

import {
  listEspecialidades,
  listObrasSociales,
  getMedicoById,
  createMedico,
  updateMedico,
  listMedicos,
} from './service.js';


function setError(form, name, msg = '') {
  const el = form?.querySelector(`.form-text[data-for="${name}"]`);
  if (el) el.textContent = msg;
}

function clearErrors(form) {
  const fields = ['nombre','apellido','matricula','especialidadId','email','telefono','descripcion','valorConsulta','obrasSociales','fotografia'];
  fields.forEach(n => setError(form, n, ''));
}

function getMultiSelectIds(selectEl) {
  return Array.from(selectEl.selectedOptions).map(opt => Number(opt.value));
}

function setMultiSelectIds(selectEl, ids = []) {
  const setIds = new Set((ids || []).map(Number));
  Array.from(selectEl.options).forEach(opt => {
    opt.selected = setIds.has(Number(opt.value));
  });
}
//Variables globales

const params = new URLSearchParams(location.search);
const editingIdRaw = params.get('id');
const editingId = editingIdRaw ? Number(editingIdRaw) : null;

const form = document.getElementById('form-medico');
const title = document.getElementById('form-title');

const selEspecialidad = document.getElementById('especialidadId');
const selObras        = document.getElementById('obrasSociales');

const fotoFile     = document.getElementById('fotoFile');      
const fotoHidden   = document.getElementById('fotografia');    
const fotoPreview  = document.getElementById('fotoPreview');   

//Carga de selects

function loadEspecialidades() {
  const esps = listEspecialidades() || [];
  const options = esps.map(e => `<option value="${e.id}">${e.nombre}</option>`).join('');
  selEspecialidad.innerHTML = `<option value="" disabled selected>Seleccione...</option>` + options;
}

function loadObras() {
  const obras = listObrasSociales() || [];
  selObras.innerHTML = obras.map(o => `<option value="${o.id}">${o.nombre}</option>`).join('');
}

//Foto

fotoFile?.addEventListener('change', () => {
  const file = fotoFile.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    fotoHidden.value = reader.result || '';
    if (fotoHidden.value) {
      fotoPreview.src = fotoHidden.value;
      fotoPreview.style.display = 'block';
    } else {
      fotoPreview.removeAttribute('src');
      fotoPreview.style.display = 'none';
    }
  };
  reader.readAsDataURL(file);
});

//Carga si es edición 

function loadIfEditing() {
  if (!editingId) {
    if (title) title.textContent = 'Nuevo Médico';
    return;
  }
  if (!Number.isFinite(editingId)) {
    alert('ID inválido');
    location.href = 'medicos.html';
    return;
  }

  const medico = getMedicoById(editingId);
  if (!medico) {
    alert('Médico no encontrado');
    location.href = 'medicos.html';
    return;
  }

  if (title) title.textContent = `Editar Médico #${editingId}`;

  form.nombre.value          = medico.nombre ?? '';
  form.apellido.value        = medico.apellido ?? '';
  form.matricula.value       = medico.matricula ?? '';
  form.especialidadId.value  = medico.especialidadId ?? '';
  form.email.value           = medico.email ?? '';
  form.telefono.value        = medico.telefono ?? '';
  form.descripcion.value     = medico.descripcion ?? '';
  form.valorConsulta.value   = medico.valorConsulta ?? '';
  form.activo.checked        = Boolean(medico.activo);

  setMultiSelectIds(selObras, medico.obrasSociales ?? []);
  form.fotografia.value = medico.fotografia ?? '';
  if (form.fotografia.value) {
    fotoPreview.src = form.fotografia.value;
    fotoPreview.style.display = 'block';
  }

  if (form.especialidadId.value) {
    const ph = selEspecialidad.querySelector('option[disabled][selected]');
    if (ph) ph.removeAttribute('selected');
  }
}

function serializeForm() {
  return {

    nombre:         (form.nombre.value || '').trim(),
    apellido:       (form.apellido.value || '').trim(),
    matricula:      Number(form.matricula.value),
    especialidadId: Number(form.especialidadId.value),
    email:          (form.email.value || '').trim(),
    telefono:       (form.telefono.value || '').trim(),
    descripcion:    (form.descripcion.value || '').trim(),
    valorConsulta:  Number(form.valorConsulta.value),
    obrasSociales:  getMultiSelectIds(selObras),
    fotografia:     (form.fotografia.value || '').trim(), // Base64
    activo:         Boolean(form.activo.checked),
  };
}

function validate(data) {
  clearErrors(form);

  let ok = true;
  let firstInvalid = null;

  // Nombre 
  if (!data.nombre) {
    setError(form, 'nombre', 'Campo requerido');
    firstInvalid = firstInvalid || form.nombre;
    ok = false;
  }

  // Apellido 
  if (!data.apellido) {
    setError(form, 'apellido', 'Campo requerido');
    firstInvalid = firstInvalid || form.apellido;
    ok = false;
  }

  // Matrícula
  if (!Number.isFinite(data.matricula) || data.matricula <= 0 || !Number.isInteger(data.matricula)) {
    setError(form, 'matricula', 'Ingrese una matrícula (entero) válida');
    firstInvalid = firstInvalid || form.matricula;
    ok = false;
  }

  // Matrícula duplicada solo cuando es alta
  if (!editingId) {
    const existe = (listMedicos() || []).some(m => Number(m.matricula) === data.matricula);
    if (existe) {
      setError(form, 'matricula', 'Ya existe un médico con esa matrícula');
      firstInvalid = firstInvalid || form.matricula;
      ok = false;
    }
  }

  // Especialidad 
  if (!Number.isFinite(data.especialidadId) || data.especialidadId <= 0) {
    setError(form, 'especialidadId', 'Seleccioná una especialidad');
    firstInvalid = firstInvalid || form.especialidadId;
    ok = false;
  }

  // Email 
  const emailInput = form.email;
  if (!data.email) {
    setError(form, 'email', 'Email requerido');
    firstInvalid = firstInvalid || emailInput;
    ok = false;
  } else if (emailInput && !emailInput.checkValidity()) {
    setError(form, 'email', 'Formato de email inválido');
    firstInvalid = firstInvalid || emailInput;
    ok = false;
  }

  // Descripción opcional
  if (data.descripcion === '' && form.descripcion.value !== '') {
    setError(form, 'descripcion', 'La descripción no puede ser solo espacios');
    firstInvalid = firstInvalid || form.descripcion;
    ok = false;
  }

  // Obras sociales
  if (!data.obrasSociales || data.obrasSociales.length === 0) {
    setError(form, 'obrasSociales', 'Elegí al menos una obra social');
    firstInvalid = firstInvalid || selObras;
    ok = false;
  }

  // ValorConsulta
  if (!Number.isFinite(data.valorConsulta) || data.valorConsulta <= 0) {
    setError(form, 'valorConsulta', 'Ingrese un valor de consulta válido');
    firstInvalid = firstInvalid || form.valorConsulta;
    ok = false;
  }

  return { ok, firstInvalid };
}

function persist(data) {
  if (editingId) {
    updateMedico(editingId, data);
    alert('Médico actualizado');
  } else {
    createMedico(data);
    alert('Médico creado');
  }
  location.href = 'medicos.html';
}


function wireLiveHints() {
  const clear = () => clearErrors(form);
  ['input', 'change'].forEach(evt => {
    form.nombre.addEventListener(evt, clear);
    form.apellido.addEventListener(evt, clear);
    form.matricula.addEventListener(evt, clear);
    form.especialidadId.addEventListener(evt, clear);
    form.email.addEventListener(evt, clear);
    form.telefono.addEventListener(evt, clear);
    form.descripcion.addEventListener(evt, clear);
    form.valorConsulta.addEventListener(evt, clear);
    selObras.addEventListener(evt, clear);
    fotoFile?.addEventListener(evt, clear);
  });
}

function init() {
  if (!form || !selEspecialidad || !selObras) return;

  loadEspecialidades();
  loadObras();
  loadIfEditing();
  wireLiveHints();

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const data = serializeForm();
    const { ok, firstInvalid } = validate(data);
    if (!ok) {
      firstInvalid?.focus(); 
      return;
    }

    persist(data);
  });
}

init();
