import React, { useState } from 'react';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

function App() {
  const [user, setUser] = useState(null);
  const [showRegister, setShowRegister] = useState(false);

  const handleLoginSuccess = (loggedUser, token) => {
    setUser(loggedUser);
    console.log('Usuario logueado:', loggedUser);
  };

  const handleRegisterSuccess = (registeredUser) => {
    setUser(registeredUser);
    console.log('Usuario registrado:', registeredUser);
  };

  const handleBackToLogin = () => {
    setShowRegister(false);
  };

  const handleShowRegister = () => {
    setShowRegister(true);
  };

  console.log('App render, user:', user);

  if (!user) {
    return (
      <div>
        <h1 style={{ textAlign: 'center', marginTop: 40 }}>Universidad App</h1>
        {showRegister ? (
          <RegisterPage onRegisterSuccess={handleRegisterSuccess} onBackToLogin={handleBackToLogin} />
        ) : (
          <LoginPage onLoginSuccess={handleLoginSuccess} onShowRegister={handleShowRegister} />
        )}
      </div>
    );
  }

  return (
    <div style={{ textAlign: 'center', marginTop: 50 }}>
      <h1>Bienvenido, {user.nombres || user.registro}</h1>
      <p>Login exitoso. Próximamente: Dashboard con cursos y publicaciones.</p>
    </div>
  );
}

export default App;
