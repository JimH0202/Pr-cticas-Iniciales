import React, { useState } from 'react';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';

function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState('login'); // 🔥 control de navegación

  const handleLoginSuccess = (loggedUser, token) => {
    setUser(loggedUser);
    console.log('Usuario logueado:', loggedUser);
  };

  const handleLogout = () => {
    setUser(null);
    setPage('login');
  };

  if (!user) {
    return (
      <div>
        <h1 style={{ textAlign: 'center', marginTop: 40 }}>
          Universidad App
        </h1>

        {page === 'login' && (
          <LoginPage
            onLoginSuccess={handleLoginSuccess}
            onShowRegister={() => setPage('register')}
            onShowForgotPassword={() => setPage('forgot')}
          />
        )}

        {page === 'register' && (
          <RegisterPage
            onBackToLogin={() => setPage('login')}
          />
        )}

        {page === 'forgot' && (
          <ForgotPasswordPage
            onBackToLogin={() => setPage('login')}
          />
        )}
      </div>
    );
  }

  return (
    <div style={{ textAlign: 'center', marginTop: 50 }}>
      <h1>Bienvenido, {user.nombres || user.registro}</h1>
      <button onClick={handleLogout}>Cerrar sesión</button>
    </div>
  );
}

export default App;