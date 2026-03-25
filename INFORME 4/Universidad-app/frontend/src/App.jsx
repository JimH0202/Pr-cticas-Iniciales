import React, { useState } from 'react';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import HomePage from './pages/HomePage';
import Navbar from './components/Navbar';

function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState('login'); // control de navegación (login, register, forgot)
  const [currentPage, setCurrentPage] = useState('home'); // control de páginas después del login (home, createPublication, myProfile, userProfile)
  const [searchedUserId, setSearchedUserId] = useState(null); // Para el perfil de usuario buscado

  const handleLoginSuccess = (loggedUser, token) => {
    setUser(loggedUser);
    setCurrentPage('home'); // Redirige a home después de login
    console.log('Usuario logueado:', loggedUser);
  };

  const handleLogout = () => {
    setUser(null);
    setPage('login');
    setCurrentPage('home');
    setSearchedUserId(null);
  };

  const handleNavigate = (destination) => {
    setCurrentPage(destination);
    setSearchedUserId(null); // Limpia búsqueda al navegar
  };

  const handleSearchUser = (userId) => {
    setSearchedUserId(userId);
    setCurrentPage('userProfile');
  };

  // Pantalla de autenticación (login, register, forgot password)
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

  // Pantalla principal después del login
  return (
    <div className="App">
      <Navbar 
        user={user}
        onLogout={handleLogout}
        onNavigate={handleNavigate}
        onSearchUser={handleSearchUser}
      />

      {currentPage === 'home' && <HomePage />}

      {currentPage === 'createPublication' && (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
          <h2>Crear Publicación</h2>
          <p>Por implementar: formulario para crear publicaciones</p>
        </div>
      )}

      {currentPage === 'myProfile' && (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
          <h2>Mi Perfil</h2>
          <p>Por implementar: perfil del usuario logueado con edición de datos</p>
        </div>
      )}

      {currentPage === 'userProfile' && (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
          <h2>Perfil del Usuario</h2>
          <p>Por implementar: perfil del usuario buscado (ID: {searchedUserId})</p>
        </div>
      )}
    </div>
  );
}

export default App;