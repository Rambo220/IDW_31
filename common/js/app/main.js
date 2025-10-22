// Inicializa LocalStorage en la primera visita usando una constante exportada.
import { INITIAL_STATE } from './storage/seed.js';
import { initStorage } from './storage/localStorage.js';

initStorage(INITIAL_STATE);