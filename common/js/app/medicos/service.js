import { getDB, saveDB } from '../storage/localStorage.js';

// -------- Especialidades ----------
export function listEspecialidades() {
  const db = getDB();
  return db?.especialidades ?? [];
}

export function getEspecialidadNombreById(id) {
  const esp = listEspecialidades().find(e => e.id === Number(id));
  return esp ? esp.nombre : 'N/D';
}

// -------- Médicos CRUD ----------
export function listMedicos() {
  const db = getDB();
  return db?.medicos ?? [];
}

export function getMedicoById(id) {
  return listMedicos().find(m => m.id === Number(id)) ?? null;
}

export function createMedico(data) {
  const db = getDB();
  if (!db) throw new Error('DB no inicializada');

  const id = db.meta?.nextIds?.medico ?? Date.now();
  const medico = {
    id,
    nombre: String(data.nombre || '').trim(),
    apellido: String(data.apellido || '').trim(),
    matricula: Number(data.matricula),
    especialidadId: Number(data.especialidadId),
    email: String(data.email || '').trim(),
    telefono: String(data.telefono || '').trim(),
    activo: Boolean(data.activo)
  };

  if (db.meta?.nextIds) db.meta.nextIds.medico = id + 1;

  db.medicos.push(medico);
  saveDB(db);
  return medico;
}

export function updateMedico(id, data) {
  const db = getDB();
  if (!db) throw new Error('DB no inicializada');

  const idx = db.medicos.findIndex(m => m.id === Number(id));
  if (idx === -1) throw new Error('Médico no encontrado');

  const current = db.medicos[idx];
  db.medicos[idx] = {
    ...current,
    nombre: String(data.nombre ?? current.nombre).trim(),
    apellido: String(data.apellido ?? current.apellido).trim(),
    matricula: data.matricula !== undefined ? Number(data.matricula) : current.matricula,
    especialidadId: data.especialidadId !== undefined ? Number(data.especialidadId) : current.especialidadId,
    email: String(data.email ?? current.email).trim(),
    telefono: String(data.telefono ?? current.telefono).trim(),
    activo: data.activo !== undefined ? Boolean(data.activo) : current.activo
  };

  saveDB(db);
  return db.medicos[idx];
}

export function deleteMedico(id) {
  const db = getDB();
  if (!db) throw new Error('DB no inicializada');
  const before = db.medicos.length;
  db.medicos = db.medicos.filter(m => m.id !== Number(id));
  saveDB(db);
  return db.medicos.length < before;
}