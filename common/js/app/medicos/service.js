import { ensureBD, getBD, saveBD } from '../storage/localStorage.js';

// Me aseguro de que la BD exista y tenga estructura mínima
ensureBD();

/* MÉDICOS */

// Listar todos
export function listMedicos() {
  const bd = getBD();
  return bd?.medicos ?? [];
}

// Obtener uno por id
export function getMedicoById(id) {
  const bd = getBD();
  return (bd?.medicos ?? []).find(m => m.id === Number(id)) ?? null;
}

// Crear médico
export function createMedico(data) {
  const bd = getBD();
  if (!bd) throw new Error('BD no inicializada');

  // id autoincremental si existe, si no uso timestamp
  let newId;
  if (bd.meta?.nextIds?.medico != null) {
    newId = bd.meta.nextIds.medico++;
  } else {
    newId = Date.now();
  }

  // Normalizo los datos antes de guardar
  const medico = {
    id: newId,
    nombre:         String(data.nombre || '').trim(),
    apellido:       String(data.apellido || '').trim(),
    matricula:      Number(data.matricula),
    especialidadId: Number(data.especialidadId),
    descripcion:    data.descripcion != null ? String(data.descripcion).trim() : '',
    obrasSociales:  Array.isArray(data.obrasSociales) ? data.obrasSociales.map(n => Number(n)) : [],
    fotografia:     String(data.fotografia || '').trim(),     // Base64
    valorConsulta:  data.valorConsulta != null ? Number(data.valorConsulta) : null,
    email:          String(data.email || '').trim(),
    telefono:       String(data.telefono || '').trim(),
    activo:         Boolean(data.activo),
  };

  bd.medicos.push(medico);
  saveBD(bd);
  return medico;
}

// Actualizar médico
export function updateMedico(id, data) {
  const bd = getBD();
  if (!bd) throw new Error('BD no inicializada');

  const idx = bd.medicos.findIndex(m => m.id === Number(id));
  if (idx === -1) throw new Error('Médico no encontrado');

  const current = bd.medicos[idx];
  bd.medicos[idx] = {
    ...current,
    nombre:         data.nombre         !== undefined ? String(data.nombre).trim()        : current.nombre,
    apellido:       data.apellido       !== undefined ? String(data.apellido).trim()      : current.apellido,
    matricula:      data.matricula      !== undefined ? Number(data.matricula)            : current.matricula,
    especialidadId: data.especialidadId !== undefined ? Number(data.especialidadId)       : current.especialidadId,
    descripcion:    data.descripcion    !== undefined ? String(data.descripcion).trim()   : current.descripcion,
    obrasSociales:  data.obrasSociales  !== undefined ? (Array.isArray(data.obrasSociales) ? data.obrasSociales.map(n => Number(n)) : []) : current.obrasSociales,
    fotografia:     data.fotografia     !== undefined ? String(data.fotografia).trim()    : current.fotografia,
    valorConsulta:  data.valorConsulta  !== undefined ? Number(data.valorConsulta)        : current.valorConsulta,
    email:          data.email          !== undefined ? String(data.email).trim()         : current.email,
    telefono:       data.telefono       !== undefined ? String(data.telefono).trim()      : current.telefono,
    activo:         data.activo         !== undefined ? Boolean(data.activo)              : current.activo,
  };

  saveBD(bd);
  return bd.medicos[idx];
}

// Eliminar médico
export function deleteMedico(id) {
  const bd = getBD();
  if (!bd) throw new Error('BD no inicializada');

  const before = bd.medicos.length;
  bd.medicos = bd.medicos.filter(m => m.id !== Number(id));
  saveBD(bd);

  return bd.medicos.length < before;
}

/*  ESPECIALIDADES  */

// Listar todas
export function listEspecialidades() {
  const bd = getBD();
  return bd?.especialidades ?? [];
}

// Obtener una por id 
export function getEspecialidadById(id) {
  const bd = getBD();
  return bd?.especialidades.find(e => e.id === Number(id)) ?? null;
}

// Nombre de especialidad por id
export function getEspecialidadNombreById(id) {
  const e = getEspecialidadById(id);
  return e ? e.nombre : 'N/D';
}

// Crear nueva especialidad
export function createEspecialidad(data) {
  const bd = getBD();
  if (!bd) throw new Error('BD no inicializada');

  let newId;
  if (bd.meta?.nextIds?.especialidad != null) {
    newId = bd.meta.nextIds.especialidad++;
  } else {
    newId = Date.now();
  }

  const esp = {
    id: newId,
    nombre: String(data.nombre || '').trim(),
  };

  bd.especialidades.push(esp);
  saveBD(bd);
  return esp;
}

// Actualizar especialidad
export function updateEspecialidad(id, data) {
  const bd = getBD();
  if (!bd) throw new Error('BD no inicializada');

  const idx = bd.especialidades.findIndex(e => e.id === Number(id));
  if (idx === -1) throw new Error('Especialidad no encontrada');

  const current = bd.especialidades[idx];
  bd.especialidades[idx] = {
    ...current,
    nombre: data.nombre !== undefined ? String(data.nombre).trim() : current.nombre,
  };

  saveBD(bd);
  return bd.especialidades[idx];
}

// Eliminar especialidad
export function deleteEspecialidad(id) {
  const bd = getBD();
  if (!bd) throw new Error('BD no inicializada');

  const enUso = (bd.medicos || []).some(m => Number(m.especialidadId) === Number(id));
  if (enUso) return { ok: false, reason: 'en_uso' };

  const antes = bd.especialidades.length;
  bd.especialidades = bd.especialidades.filter(e => e.id !== Number(id));
  saveBD(bd);

  return { ok: bd.especialidades.length < antes };
}

/*OBRAS SOCIALES */

// Listar todas
export function listObrasSociales() {
  const bd = getBD();
  return bd?.obrasSociales ?? [];
}

// Obtener una por id
export function getObraSocialById(id) {
  const bd = getBD();
  return (bd?.obrasSociales ?? []).find(os => os.id === Number(id)) ?? null;
}

// Crear nueva obra social
export function createObraSocial(data) {
  const bd = getBD();
  if (!bd) throw new Error('BD no inicializada');

  let newId;
  if (bd.meta?.nextIds?.obraSocial != null) {
    newId = bd.meta.nextIds.obraSocial++;
  } else {
    newId = Date.now();
  }

  const obraSocial = {
    id: newId,
    nombre: String(data.nombre || '').trim(),
    descripcion: String(data.descripcion || '').trim(),
  };

  bd.obrasSociales = bd.obrasSociales || [];
  bd.obrasSociales.push(obraSocial);
  saveBD(bd);
  return obraSocial;
}

// Actualizar obra social
export function updateObraSocial(id, data) {
  const bd = getBD();
  if (!bd) throw new Error('BD no inicializada');

  const idx = bd.obrasSociales.findIndex(os => os.id === Number(id));
  if (idx === -1) throw new Error('Obra social no encontrada');

  const current = bd.obrasSociales[idx];
  bd.obrasSociales[idx] = {
    ...current,
    nombre:      data.nombre      !== undefined ? String(data.nombre).trim()      : current.nombre,
    descripcion: data.descripcion !== undefined ? String(data.descripcion).trim() : current.descripcion,
  };

  saveBD(bd);
  return bd.obrasSociales[idx];
}

// Eliminar obra social
export function deleteObraSocial(id) {
  const bd = getBD();
  if (!bd) throw new Error('BD no inicializada');

  const enUso = (bd.medicos || []).some(m => Array.isArray(m.obrasSociales) && m.obrasSociales.includes(Number(id)));
  if (enUso) return { ok: false, reason: 'en_uso' };

  const antes = bd.obrasSociales.length;
  bd.obrasSociales = bd.obrasSociales.filter(os => os.id !== Number(id));
  saveBD(bd);

  return { ok: bd.obrasSociales.length < antes };
}

/*TURNOS*/

// Listar turnos
export function listTurnos() {
  const bd = getBD();
  return bd?.turnos ?? [];
}

// Obtener turno por id
export function getTurnoById(id) {
  const bd = getBD();
  return (bd?.turnos ?? []).find(t => t.id === Number(id)) ?? null;
}

// Crear turno
export function createTurno(data) {
  const bd = getBD();
  if (!bd) throw new Error('BD no inicializada');

  let newId;
  if (bd.meta?.nextIds?.turno != null) {
    newId = bd.meta.nextIds.turno++;
  } else {
    newId = Date.now();
  }

  const turno = {
    id: newId,
    medicoId:    Number(data.medicoId),
    paciente:    String(data.paciente || '').trim(),
    fechaISO:    String(data.fechaISO || '').trim(),
    contacto:    String(data.contacto || '').trim(),
    estado:      String(data.estado || 'pendiente').trim(),
    obraSocialId: data.obraSocialId != null ? Number(data.obraSocialId) : null,
    precioFinal:  data.precioFinal  != null ? Number(data.precioFinal)  : null
  };

  bd.turnos.push(turno);
  saveBD(bd);
  return turno;
}

// Actualizar turno
export function updateTurno(id, data) {
  const bd = getBD();
  if (!bd) throw new Error('BD no inicializada');

  const idx = bd.turnos.findIndex(t => t.id === Number(id));
  if (idx === -1) throw new Error('Turno no encontrado');

  const actual = bd.turnos[idx];
  bd.turnos[idx] = {
    ...actual,
    medicoId:     data.medicoId     !== undefined ? Number(data.medicoId)     : actual.medicoId,
    paciente:     data.paciente     !== undefined ? String(data.paciente).trim() : actual.paciente,
    fechaISO:     data.fechaISO     !== undefined ? String(data.fechaISO).trim() : actual.fechaISO,
    contacto:     data.contacto     !== undefined ? String(data.contacto).trim() : actual.contacto,
    estado:       data.estado       !== undefined ? String(data.estado).trim()   : actual.estado,
    obraSocialId: data.obraSocialId !== undefined ? (data.obraSocialId != null ? Number(data.obraSocialId) : null) : actual.obraSocialId,
    precioFinal:  data.precioFinal  !== undefined ? (data.precioFinal  != null ? Number(data.precioFinal)  : null) : actual.precioFinal,
  };

  saveBD(bd);
  return bd.turnos[idx];
}

// Eliminar turno
export function deleteTurno(id) {
  const bd = getBD();
  if (!bd) throw new Error('BD no inicializada');

  const antes = bd.turnos.length;
  bd.turnos = bd.turnos.filter(t => t.id !== Number(id));
  saveBD(bd);

  return bd.turnos.length < antes;
}
