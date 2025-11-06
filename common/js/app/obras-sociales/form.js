// Alta / Edición
import {
  createObraSocial,
  updateObraSocial,
  getObraSocialById,
  listObrasSociales,
} from '../medicos/service.js';

const params = new URLSearchParams(location.search);
const editingId = params.get('id') ? Number(params.get('id')) : null;

const form  = document.getElementById('form-obra-social');
const title = document.getElementById('form-title');

function setError(name, msg=''){ const el=form?.querySelector(`.form-text[data-for="${name}"]`); if(el) el.textContent=msg; }
function clearErrors(){ ['nombre','descripcion'].forEach(n=>setError(n,'')); }

function loadIfEditing(){
  if(!editingId){ title.textContent='Nueva Obra Social'; return; }
  if(!Number.isFinite(editingId)){ alert('ID inválido'); location.href='obras-sociales.html'; return; }
  const os=getObraSocialById(editingId);
  if(!os){ alert('Obra social no encontrada'); location.href='obras-sociales.html'; return; }
  title.textContent=`Editar Obra Social #${editingId}`;
  form.nombre.value=os.nombre ?? '';
  form.descripcion.value=os.descripcion ?? '';
}

function serialize(){ return {
  nombre:(form.nombre.value||'').trim(),
  descripcion:(form.descripcion.value||'').trim(),
}; }

function validate(data){
  clearErrors(); let ok=true, first=null;
  if(!data.nombre){ setError('nombre','El nombre es obligatorio'); first=first||form.nombre; ok=false; }
  if(!editingId){
    const exists=(listObrasSociales()||[]).some(os=>(os.nombre||'').toLowerCase()===data.nombre.toLowerCase());
    if(exists){ setError('nombre','Ya existe una obra social con ese nombre'); first=first||form.nombre; ok=false; }
  }
  if(data.descripcion==='' && form.descripcion.value!==''){ setError('descripcion','La descripción no puede ser solo espacios'); first=first||form.descripcion; ok=false; }
  return {ok, firstInvalid:first};
}

function persist(data){
  if(editingId){ updateObraSocial(editingId,data); alert('Obra social actualizada'); }
  else { createObraSocial(data); alert('Obra social creada'); }
  location.href='obras-sociales.html';
}

function init(){
  if(!form) return;
  loadIfEditing();
  ['input','change'].forEach(evt=>{
    form.nombre.addEventListener(evt, ()=>clearErrors());
    form.descripcion.addEventListener(evt, ()=>clearErrors());
  });
  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const data=serialize();
    const {ok, firstInvalid}=validate(data);
    if(!ok){ firstInvalid?.focus(); return; }
    persist(data);
  });
}

document.addEventListener('DOMContentLoaded', init);
