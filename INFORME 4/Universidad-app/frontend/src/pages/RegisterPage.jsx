import React, { useState } from 'react';
import { register } from '../services/apiClient';

function RegisterPage({ onRegisterSuccess, onBackToLogin }) {
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
      const result = await register({ registro, nombres, apellidos, password, email });
      setSuccess(result.message);
      setRegistro('');
      setNombres('');
      setApellidos('');
      setPassword('');
      setEmail('');
      if (typeof onRegisterSuccess === 'function') {
        onRegisterSuccess(result.user);
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
    <div style={{ maxWidth: 320, margin: '45px auto', padding: 16, border: '1px solid #ddd', borderRadius: 12, backgroundColor: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', textAlign: 'center' }}>
      <h2 style={{ marginBottom: 12, fontSize: 21 }}>Crear cuenta</h2>
      {error && <div style={{ color: '#b30000', marginBottom: 10, fontSize: 13 }}>{error}</div>}
      {success && <div style={{ color: '#006600', marginBottom: 10, fontSize: 13 }}>{success}</div>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 10 }}>
          <label htmlFor="registro" style={{ fontSize: 14, fontWeight: 500 }}>Registro académico</label>
          <input
            id="registro"
            value={registro}
            onChange={(e) => setRegistro(e.target.value)}
            type="text"
            required
            style={{ width: '90%', padding: 8, marginTop: 6, borderRadius: 6, border: '1px solid #ccc', margin: '6px auto', display: 'block' }}
          />
        </div>

        <div style={{ marginBottom: 10 }}>
          <label htmlFor="nombres" style={{ fontSize: 14, fontWeight: 500 }}>Nombres</label>
          <input
            id="nombres"
            value={nombres}
            onChange={(e) => setNombres(e.target.value)}
            type="text"
            required
            style={{ width: '90%', padding: 8, marginTop: 6, borderRadius: 6, border: '1px solid #ccc', margin: '6px auto', display: 'block' }}
          />
        </div>

        <div style={{ marginBottom: 10 }}>
          <label htmlFor="apellidos" style={{ fontSize: 14, fontWeight: 500 }}>Apellidos</label>
          <input
            id="apellidos"
            value={apellidos}
            onChange={(e) => setApellidos(e.target.value)}
            type="text"
            required
            style={{ width: '90%', padding: 8, marginTop: 6, borderRadius: 6, border: '1px solid #ccc', margin: '6px auto', display: 'block' }}
          />
        </div>

        <div style={{ marginBottom: 10 }}>
          <label htmlFor="password" style={{ fontSize: 14, fontWeight: 500 }}>Contraseña</label>
          <input
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            required
            style={{ width: '90%', padding: 8, marginTop: 6, borderRadius: 6, border: '1px solid #ccc', margin: '6px auto', display: 'block' }}
          />
        </div>

        <div style={{ marginBottom: 14 }}>
          <label htmlFor="email" style={{ fontSize: 14, fontWeight: 500 }}>Correo electrónico</label>
          <input
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
            style={{ width: '90%', padding: 8, marginTop: 6, borderRadius: 6, border: '1px solid #ccc', margin: '6px auto', display: 'block' }}
          />
        </div>

        <button type="submit" disabled={loading} style={{ width: '90%', padding: '10px 12px', borderRadius: 6, backgroundColor: '#0066cc', color: '#fff', border: 'none', fontWeight: 600, margin: '14px auto', display: 'block' }}>
          {loading ? 'Registrando...' : 'Crear cuenta'}
        </button>
      </form>

      <div style={{ textAlign: 'center', marginTop: 12 }}>
        <button type="button" onClick={onBackToLogin} style={{ background: 'none', border: 'none', color: '#0066cc', padding: 0, cursor: 'pointer', fontSize: 13 }}>
          ¿Ya tienes cuenta? Inicia sesión
        </button>
      </div>

      <p style={{ marginTop: 14, fontSize: 12, color: '#666', textAlign: 'center' }}>
        Usando datos mock. El registro no persiste entre sesiones.
      </p>
    </div>
  );
}

export default RegisterPage;