document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');
  const userInput = document.getElementById('usuario');
  const passInput = document.getElementById('clave');

  if (!form || !userInput || !passInput) {
    console.error('Login: faltan elementos #loginForm / #usuario / #clave');
    return;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = userInput.value.trim();
    const password = passInput.value;
    const back = new URLSearchParams(location.search).get('from') || 'index-admin.html';

    if (!username || !password) {
      alert('Completá usuario y contraseña.');
      return;
    }

    try {
      const res = await fetch('https://dummyjson.com/auth/login', {
        method: 'POST',
        headers: {'Content-Type':'application/json', 'Accept':'application/json'},
        body: JSON.stringify({ username, password })
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Credenciales inválidas');
      }

      const data = await res.json();

      sessionStorage.setItem('authUser', JSON.stringify({
        id: data.id,
        firstName: data.firstName,
        lastName: data.lastName,
        username: data.username,
        email: data.email,
        token: data.token
      }));

      if (!localStorage.getItem('tema')) localStorage.setItem('tema', 'light');

      location.href = back;
    } catch (err) {
      console.error('Login error:', err);

      // Fallback OFFLINE: admin / admin
      if (username === 'admin' && password === 'admin') {
        sessionStorage.setItem('authUser', JSON.stringify({
          id: 0, firstName: 'Admin', lastName: '', username: 'admin', email: 'admin@example.com', token: 'demo'
        }));
        location.href = back;
        return;
      }

      alert(
        'No se pudo iniciar sesión: ' + err.message +
        '\n\nProbá DummyJSON (kminchelle / 0lelplR)\n' +
        'o el modo demo: admin / admin'
      );
    }
  });
});
