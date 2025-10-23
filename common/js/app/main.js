// Inicializo la base de datos local (idw_bd) la primera vez que se entra al sitio.
import { initStorage } from './storage/localStorage.js';
import { INITIAL_STATE } from './storage/seed.js';

document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(location.search);
  if (params.get('resetbd') === '1') {
    localStorage.removeItem('idw_bd');
  }
  initStorage(INITIAL_STATE);
});
