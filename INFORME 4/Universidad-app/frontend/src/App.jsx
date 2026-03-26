import React, { useState } from 'react';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import HomePage from './pages/HomePage';
import Navbar from './components/Navbar';
import CreatePublicationPage from './pages/CreatePublicationPage';

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('jwtToken') || null);
  const [page, setPage] = useState('login');
  const [currentPage, setCurrentPage] = useState('home');
  const [searchedUserId, setSearchedUserId] = useState(null);
  const [publicaciones, setPublicaciones] = useState([]);

  // Una función para crear publicaciones
  const handleCreatePost = (newPost) => {
    setPublicaciones(prev => [newPost, ...prev]);
    setCurrentPage('home');
  };

  const handleLoginSuccess = (loggedUser, userToken) => {
    setUser(loggedUser);
    setToken(userToken);
    setCurrentPage('home');
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('jwtToken');
    setPage('login');
    setCurrentPage('home');
    setSearchedUserId(null);
  };

  const handleNavigate = (destination) => {
    setCurrentPage(destination);
    setSearchedUserId(null);
  };

  const handleSearchUser = (userId) => {
    setSearchedUserId(userId);
    setCurrentPage('userProfile');
  };

  // LOGIN / AUTH
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
          <RegisterPage onBackToLogin={() => setPage('login')} />
        )}

        {page === 'forgot' && (
          <ForgotPasswordPage onBackToLogin={() => setPage('login')} />
        )}
      </div>
    );
  }

  // APP
  return (
    <div className="App">
      <Navbar 
        user={user}
        onLogout={handleLogout}
        onNavigate={handleNavigate}
        onSearchUser={handleSearchUser}
      />

      {currentPage === 'home' && (
        <HomePage publicaciones={publicaciones} token={token} />
      )}

      {currentPage === 'createPublication' && (
        <CreatePublicationPage 
          user={user}
          onCreate={handleCreatePost}
        />
      )}

      {currentPage === 'myProfile' && (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
          <h2>Mi Perfil</h2>
          <p>Por implementar...</p>
        </div>
      )}

      {currentPage === 'userProfile' && (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
          <h2>Perfil del Usuario</h2>
          <p>ID: {searchedUserId}</p>
        </div>
      )}
    </div>
  );
}

export default App;