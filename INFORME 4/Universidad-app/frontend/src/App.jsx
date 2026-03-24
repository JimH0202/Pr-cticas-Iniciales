import React, { useState } from 'react';
import LoginPage from './pages/LoginPage';

function App() {
  const [user, setUser] = useState(null);

  const handleLoginSuccess = (loggedUser, token) => {
    setUser(loggedUser);
    console.log('Usuario logueado:', loggedUser);
  };

  console.log('App render, user:', user);

  if (!user) {
    return (
      <div>
        <h1 style={{ textAlign: 'center', marginTop: 40 }}>Página de Login</h1>
        <LoginPage onLoginSuccess={handleLoginSuccess} />
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
