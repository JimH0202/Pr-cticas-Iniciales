import React, { useState } from 'react';
import { register } from '../services/apiClient';
import '../styles.css';

function RegisterPage({ onBackToLogin }) {
  const [registro, setRegistro] = useState('');
  const [nombres, setNombres] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const result = await register({
        registro,
        nombres,
        apellidos,
        password,
        email
      });

      //Mensaje de éxito
      setSuccess('Cuenta creada correctamente, redirigiendo...');

      // Limpiar campos
      setRegistro('');
      setNombres('');
      setApellidos('');
      setPassword('');
      setEmail('');

      //Redirección A Login después de un breve retraso (para mostrar el mensaje de éxito)
      setTimeout(() => {
        if (typeof onBackToLogin === 'function') {
          onBackToLogin();
        }
      }, 1200); //estos son 1.2 segundos

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
    <div className="register-container">
      <h2 className="register-title">Crear cuenta</h2>

      {error && <div className="register-error">{error}</div>}
      {success && <div className="register-success">{success}</div>}

      <form onSubmit={handleSubmit}>
        <div className="register-grid">

          <div className="input-group">
            <label>Registro académico</label>
            <input
              value={registro}
              onChange={(e) => setRegistro(e.target.value)}
              type="text"
              required
            />
          </div>

          <div className="input-group">
            <label>Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
            />
          </div>

          <div className="input-group">
            <label>Nombres</label>
            <input
              value={nombres}
              onChange={(e) => setNombres(e.target.value)}
              type="text"
              required
            />
          </div>

          <div className="input-group">
            <label>Apellidos</label>
            <input
              value={apellidos}
              onChange={(e) => setApellidos(e.target.value)}
              type="text"
              required
            />
          </div>

          <div className="input-group full-width">
            <label>Contraseña</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              required
            />
          </div>

        </div>

        <button type="submit" disabled={loading} className="register-button">
          {loading ? 'Registrando...' : 'Crear cuenta'}
        </button>
      </form>

      <div className="register-footer">
        <button type="button" onClick={onBackToLogin}>
          ¿Ya tienes cuenta? Inicia sesión
        </button>
      </div>
    </div>
  );
}

export default RegisterPage;