import React, { useState } from 'react';
import { login } from '../services/apiClient';
import '../styles.css';

function LoginPage({ onLoginSuccess, onShowRegister, onShowForgotPassword }) {
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

      onLoginSuccess(user, token);

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
    <div className="login-container">
      <h2 className="login-title">Iniciar sesión</h2>

      {error && <div className="login-error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label>Registro / Email</label>
          <input
            value={registro}
            onChange={(e) => setRegistro(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <label>Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" disabled={loading} className="login-button">
          {loading ? 'Conectando...' : 'Iniciar sesión'}
        </button>
      </form>

      <div className="login-links">
        <button type="button" onClick={onShowRegister}>
          Crear una cuenta
        </button>

        <button type="button" onClick={onShowForgotPassword}>
          Olvidé mi contraseña
        </button>
      </div>
    </div>
  );
}

export default LoginPage;