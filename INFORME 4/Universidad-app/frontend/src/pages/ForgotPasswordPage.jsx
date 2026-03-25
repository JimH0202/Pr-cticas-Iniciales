import React, { useState } from 'react';
import '../styles.css';

function ForgotPasswordPage({ onBackToLogin }) {
  const [registro, setRegistro] = useState('');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleVerify = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (registro === '123' && email === '123@gmail.com') {
      setStep(2);
    } else {
      setError('Datos incorrectos');
    }
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 4) {
      setError('Contraseña muy corta');
      return;
    }

    setSuccess('Contraseña actualizada correctamente');

    setTimeout(() => {
      setStep(1);
      setNewPassword('');
      onBackToLogin();
    }, 1200);
  };

  return (
    <div className="forgot-container">
      <h2 className="forgot-title">Recuperar contraseña</h2>

      {error && <div className="forgot-error">{error}</div>}
      {success && <div className="forgot-success">{success}</div>}

      {step === 1 && (
        <form onSubmit={handleVerify}>
          <div className="input-group">
            <label>Registro académico</label>
            <input value={registro} onChange={(e) => setRegistro(e.target.value)} required />
          </div>

          <div className="input-group">
            <label>Correo electrónico</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <button className="forgot-button">Verificar</button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleChangePassword}>
          <div className="input-group">
            <label>Nueva contraseña</label>
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
          </div>

          <button className="forgot-button">Cambiar contraseña</button>
        </form>
      )}

      <div className="forgot-footer">
        <button onClick={onBackToLogin}>Volver a Iniciar sesión</button>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;