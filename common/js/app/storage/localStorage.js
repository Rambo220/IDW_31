

const KEY = 'idw_bd';

// Helpers básicos 
export function getBD() {
  const raw = localStorage.getItem(KEY);
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

export function saveBD(bd) {
  localStorage.setItem(KEY, JSON.stringify(bd));
}

//Seed base
import { INITIAL_STATE } from './seed.js';

// clon seguro (por si el navegador no tiene structuredClone)
const clone = (obj) =>
  typeof structuredClone === 'function'
    ? structuredClone(obj)
    : JSON.parse(JSON.stringify(obj));

export function ensureBD() {
  let bd = getBD();

  // Si no existe nada, parto del seed base
  if (!bd) {
    bd = clone(INITIAL_STATE);
  }

  // Normalizo estructura mínima
  bd.medicos        = bd.medicos        ?? [];
  bd.especialidades = bd.especialidades ?? [];
  bd.turnos         = bd.turnos         ?? [];
  bd.obrasSociales  = bd.obrasSociales  ?? [];
  bd.meta = bd.meta ?? { nextIds: { medico: 1, especialidad: 1, turno: 1, obraSocial: 1 } };

  bd.meta.nextIds.medico       = bd.meta.nextIds.medico       ?? 1;
  bd.meta.nextIds.especialidad = bd.meta.nextIds.especialidad ?? 1;
  bd.meta.nextIds.turno        = bd.meta.nextIds.turno        ?? 1;
  bd.meta.nextIds.obraSocial   = bd.meta.nextIds.obraSocial   ?? 1;

  //Obras Sociales prefijadas
  const baseOS = [
    { id: 1, nombre: "OSECAC",        descripcion: "Obra Social de Empleados de Comercio y Actividades Civiles." },
    { id: 2, nombre: "PAMI",          descripcion: "Programa de Atención Médica Integral." },
    { id: 3, nombre: "OSDE",          descripcion: "Organización de Servicios Directos Empresarios." },
    { id: 4, nombre: "Swiss Medical", descripcion: "Swiss Medical Medicina Privada S.A.." },
    { id: 5, nombre: "Medifé",        descripcion: "Medifé Asociación Civil." },
    { id: 6, nombre: "SanCor Salud",  descripcion: "Asociación Mutual SanCor Salud." },
    { id: 7, nombre: "Omint",         descripcion: "Omint S.A. de Servicios." },
    { id: 8, nombre: "Accord Salud",  descripcion: "Accord Salud (marca de Unión Personal)." },
    { id: 9, nombre: "Avalian",       descripcion: "Avalian (antes llamada ACA Salud)." }
  ];

  if (!bd.obrasSociales) bd.obrasSociales = [];

  // Agrega las que no existen aún, sin duplicar
  for (const os of baseOS) {
    const exists = bd.obrasSociales.some(o => o.nombre === os.nombre);
    if (!exists) bd.obrasSociales.push(os);
  }

  // Actualiza nextId
  const maxId = bd.obrasSociales.reduce((max, o) => Math.max(max, Number(o.id) || 0), 0);
  bd.meta.nextIds.obraSocial = Math.max(bd.meta.nextIds.obraSocial, maxId + 1);

  saveBD(bd);
  return bd;
}

// Para pruebas: borra la BD local
export function resetStorage() {
  localStorage.removeItem(KEY);
}

// Alias para compatibilidad con main.js
export const initStorage = ensureBD;
