import React, { useState } from 'react';
import { login } from '../services/apiClient';

function LoginPage({ onLoginSuccess }) {
  const [registro, setRegistro] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { token, user } = await login({ registro, password });
      localStorage.setItem('jwtToken', token);
      localStorage.setItem('user', JSON.stringify(user));
      setRegistro('');
      setPassword('');
      if (typeof onLoginSuccess === 'function') {
        onLoginSuccess(user, token);
      }
    } catch (err) {
      if (err.response) {
        setError(err.response.data?.message || 'Error en el servidor');
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: '60px auto', padding: 20, border: '1px solid #ddd', borderRadius: 10, backgroundColor: '#ffffff' }}>
      <h2 style={{ marginBottom: 16 }}>Iniciar sesión</h2>
      {error && <div style={{ color: 'red', marginBottom: 10 }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label htmlFor="registro">Registro / Email</label>
          <input
            id="registro"
            value={registro}
            onChange={(e) => setRegistro(e.target.value)}
            type="text"
            required
            style={{ width: '100%', padding: 8, marginTop: 4 }}
          />
        </div>

        <div style={{ marginBottom: 18 }}>
          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            required
            style={{ width: '100%', padding: 8, marginTop: 4 }}
          />
        </div>

        <button type="submit" disabled={loading} style={{ width: '100%', padding: 10 }}>
          {loading ? 'Conectando...' : 'Iniciar sesión'}
        </button>
      </form>

      <p style={{ marginTop: 14, fontSize: 14, color: '#555' }}>
        Usando datos mock. Credenciales: est_2024001 / admin123 o prof_001 / prof123
      </p>
    </div>
  );
}

export default LoginPage;
