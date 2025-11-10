import { listMedicos, getEspecialidadNombreById } from './service.js';

const root   = document.getElementById('catalogo-medicos');
const inputQ = document.getElementById('filtro-catalogo');

if (root) {
  const PLACEHOLDER = 'common/img/doctor-placeholder.jpg';

  const norm = (s) =>
    String(s || '')
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .toLowerCase().trim();

  // Mapeo exacto solicitado: nombre completo -> archivo
  const NAME_TO_IMG = {
    'ramiro borgo':    'd1.jpg',
    'martin mansilla': 'd2.jpg',
    'fabian brites':   'd3.jpg',
    'lucia benavente': 'd4.jpg',
    'martin bourlot':  'd5.jpg',
    'ayelen doubna':   'd6.jpg', 
  };

  // Normaliza rutas/base64 ya almacenadas en la BD
  function normalizeFoto(f) {
    if (!f) return '';
    const s = String(f).trim();
    if (
      s.startsWith('data:') || s.startsWith('http') || s.startsWith('blob:') ||
      s.startsWith('/') || s.startsWith('./') || s.startsWith('../') || s.startsWith('common/')
    ) return s;

    const looksBase64 = /^[A-Za-z0-9+/=\s]+$/.test(s) && s.length > 100;
    return looksBase64 ? `data:image/jpeg;base64,${s}` : s;
  }

  function fotoPorNombre(m) {
    const clave = norm(`${m?.nombre} ${m?.apellido}`);
    const file  = NAME_TO_IMG[clave];
    return file ? `common/img/doctores/${file}` : '';
  }

  function getFotoSrc(m) {
    // prioridad: campo en BD -> mapeo por nombre -> placeholder
    const first = m?.fotografia || m?.fotografiaBase64 || m?.foto || '';
    return normalizeFoto(first) || fotoPorNombre(m) || PLACEHOLDER;
  }

  const base = () => (listMedicos() || [])
    .filter(m => m?.activo !== false)
    .sort((a, b) =>
      (a.apellido || '').localeCompare(b.apellido || '') ||
      (a.nombre   || '').localeCompare(b.nombre   || '')
    );

  const trunc = (txt, max = 140) => {
    const t = String(txt || '').trim();
    return t.length <= max ? t : t.slice(0, max).trim() + '…';
  };

  const buildCard = (m) => {
    const nombre = [m.nombre, m.apellido].filter(Boolean).join(' ') || 'Profesional';
    const esp    = getEspecialidadNombreById(m.especialidadId) || 'Sin especialidad';
    const foto   = getFotoSrc(m);
    const desc   = trunc(m.descripcion || '—');

    return `
      <div class="col-12 col-sm-6 col-lg-4 d-flex">
        <div class="card shadow-sm w-100 h-100">
          <img src="${foto}" class="card-img-top" alt="Foto de ${nombre}" loading="lazy"
               onerror="this.onerror=null;this.src='${PLACEHOLDER}'">
          <div class="card-body text-center">
            <h5 class="card-title mb-1">${nombre}</h5>
            <p class="text-muted mb-2">${esp}</p>
            <p class="card-text">${desc}</p>
          </div>
        </div>
      </div>
    `;
  };

  const render = (items) => {
    root.innerHTML = items.length
      ? items.map((m) => buildCard(m)).join('')
      : `
        <div class="col-12">
          <div class="alert alert-warning">No hay profesionales para mostrar.</div>
        </div>`;
  };

  const applyFilter = () => {
    const q = (inputQ?.value || '').toLowerCase().trim();
    const items = base().filter(m => {
      const esp = (getEspecialidadNombreById(m.especialidadId) || '').toLowerCase();
      return (
        (m.nombre   || '').toLowerCase().includes(q) ||
        (m.apellido || '').toLowerCase().includes(q) ||
        esp.includes(q)
      );
    });
    render(q ? items : base());
  };

  // Primera carga
  render(base());

  // Filtro con pequeño debounce
  let t;
  inputQ?.addEventListener('input', () => {
    clearTimeout(t);
    t = setTimeout(applyFilter, 150);
  });

  window.addEventListener('storage', () => render(base()));
}
