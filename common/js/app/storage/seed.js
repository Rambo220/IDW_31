// Este archivo define el contenido inicial de la base local (idw_bd).
// Se carga solo la primera vez que abro el sitio y contiene datos de prueba.

export const INITIAL_STATE = {
  // Lista de médicos precargados
  medicos: [
    {
      id: 1,
      nombre: "Ramiro",
      apellido: "Borgo",
      especialidadId: 3,
      matricula: 1001,
      email: "ramiro.borgo@idw.com",
      telefono: "+54 9 3454 111111",
      descripcion: "Médico clínico con enfoque integral en el bienestar general.",
      obrasSociales: [1, 3, 5],
      fotografia: "",
      valorConsulta: 28000.00,
      activo: true
    },
    {
      id: 2,
      nombre: "Martin",
      apellido: "Mansilla",
      especialidadId: 2,
      matricula: 1002,
      email: "martin.mansilla@idw.com",
      telefono: "+54 9 3454 222222",
      descripcion: "Pediatra especializado en control del desarrollo infantil.",
      obrasSociales: [2, 4, 6],
      fotografia: "",
      valorConsulta: 29500.00,
      activo: true
    },
    {
      id: 3,
      nombre: "Fabian",
      apellido: "Brites",
      especialidadId: 4,
      matricula: 1003,
      email: "fabian.brites@idw.com",
      telefono: "+54 9 3454 333333",
      descripcion: "Dermatólogo con experiencia en tratamientos estéticos y clínicos.",
      obrasSociales: [1, 2, 7],
      fotografia: "",
      valorConsulta: 31000.00,
      activo: true
    },
    {
      id: 4,
      nombre: "Lucia",
      apellido: "Benavente",
      especialidadId: 5,
      matricula: 1004,
      email: "lucia.benavente@idw.com",
      telefono: "+54 9 3454 444444",
      descripcion: "Traumatóloga enfocada en rehabilitación y lesiones deportivas.",
      obrasSociales: [3, 4, 8],
      fotografia: "",
      valorConsulta: 32000.00,
      activo: true
    },
    {
      id: 5,
      nombre: "Martin",
      apellido: "Bourlot",
      especialidadId: 5,
      matricula: 1005,
      email: "martin.bourlot@idw.com",
      telefono: "+54 9 3454 555555",
      descripcion: "Especialista en ortopedia y traumatología general.",
      obrasSociales: [1, 2, 3, 5],
      fotografia: "",
      valorConsulta: 28500.00,
      activo: true
    },
    {
      id: 6,
      nombre: "Ayelen",
      apellido: "Doubña",
      especialidadId: 6,
      matricula: 1006,
      email: "ayelen.doubna@idw.com",
      telefono: "+54 9 3454 666666",
      descripcion: "Ginecóloga con atención integral en salud reproductiva.",
      obrasSociales: [2, 4, 9],
      fotografia: "",
      valorConsulta: 30500.00,
      activo: true
    }
  ],

  // Lista de especialidades disponibles
  especialidades: [
    { id: 1, nombre: "Clínica Médica" },
    { id: 2, nombre: "Pediatría" },
    { id: 3, nombre: "Cardiología" },
    { id: 4, nombre: "Dermatología" },
    { id: 5, nombre: "Traumatología" },
    { id: 6, nombre: "Ginecología" }
  ],

  // Lista de obras sociales disponibles
  obrasSociales: [
    { id: 1, nombre: "OSECAC", descripcion: "Obra Social de Empleados de Comercio y Actividades Civiles." },
    { id: 2, nombre: "PAMI", descripcion: "Programa de Atención Médica Integral." },
    { id: 3, nombre: "OSDE", descripcion: "Organización de Servicios Directos Empresarios." },
    { id: 4, nombre: "Swiss Medical", descripcion: "Swiss Medical Medicina Privada S.A." },
    { id: 5, nombre: "Medifé", descripcion: "Medifé Asociación Civil." },
    { id: 6, nombre: "SanCor Salud", descripcion: "Asociación Mutual SanCor Salud." },
    { id: 7, nombre: "Omint", descripcion: "Omint S.A. de Servicios." },
    { id: 8, nombre: "Accord Salud", descripcion: "Accord Salud (marca de Unión Personal)." },
    { id: 9, nombre: "Avalian", descripcion: "Avalian (antes llamada ACA Salud)." }
  ],

  // Lista vacía de turnos (se van agregando en la app)
  turnos: [],

  // Contadores para generar IDs nuevos sin repetir
  meta: { nextIds: { medico: 7, especialidad: 7, turno: 1, obraSocial: 10 } }
};
