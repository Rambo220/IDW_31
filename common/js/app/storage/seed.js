// Estado inicial exportado para inicializar LocalStorage
export const INITIAL_STATE = {
  medicos: [
    {}
  ],
  especialidades: [
    { id: 1, nombre: 'Clínica Médica' },
    { id: 2, nombre: 'Pediatría' },
    { id: 3, nombre: 'Cardiología' },
    { id: 4, nombre: 'Dermatología' },
    { id: 5, nombre: 'Traumatología' }
  ],
  turnos: [],
  meta: { nextIds: { medico: 4, especialidad: 6, turno: 1 } }
};