const KEY = 'idw_db';

export function getDB() {
  const raw = localStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : null;
}

export function saveDB(db) {
  localStorage.setItem(KEY, JSON.stringify(db));
}

export function initStorage(initialState) {
  const existing = getDB();
  if (!existing) {
    saveDB(initialState);
  }
}

// Utilidad opcional de depuración
export function resetStorage() {
  localStorage.removeItem(KEY);
}