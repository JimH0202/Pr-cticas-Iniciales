import React, { useState, useEffect } from 'react';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import HomePage from './pages/HomePage';
import UserProfilePage from './pages/UserProfilePage';
import Navbar from './components/Navbar';
import CreatePublicationPage from './pages/CreatePublicationPage';
import { fetchPublicaciones, searchUserByRegistro } from './services/apiClient';

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('jwtToken') || null);
  const [page, setPage] = useState('login');
  const [currentPage, setCurrentPage] = useState('home');
  const [searchedUserId, setSearchedUserId] = useState(null);
  const [publicaciones, setPublicaciones] = useState([]);
  const [searchError, setSearchError] = useState('');

  // Cargar usuario desde localStorage al iniciar
  useEffect(() => {
    const savedToken = localStorage.getItem('jwtToken');
    const savedUser = localStorage.getItem('user');
    
    if (savedToken && savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        setToken(savedToken);
        setPage('home'); // Cambiar a la página principal si hay usuario guardado
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('user');
      }
    }
  }, []);

  // Cargar publicaciones cuando el usuario se loguea
  const loadPublicaciones = async () => {
    if (user && token) {
      try {
        const data = await fetchPublicaciones(token);
        setPublicaciones(data.publicaciones || []);
      } catch (error) {
        console.error('Error cargando publicaciones:', error);
      }
    }
  };

  useEffect(() => {
    if (user && token) {
      loadPublicaciones();
    }
  }, [user, token]);

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
    setPublicaciones([]);
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('user');
    setPage('login');
    setCurrentPage('home');
    setSearchedUserId(null);
  };

  const handleNavigate = (destination) => {
    if (destination === 'myProfile' && user) {
      setSearchedUserId(user.id);
      setCurrentPage('userProfile');
    } else {
      setCurrentPage(destination);
      setSearchedUserId(null);
    }
  };

  const handleSearchUser = async (registro) => {
    try {
      setSearchError('');
      const result = await searchUserByRegistro(token, registro);
      setSearchedUserId(result.user.id);
      setCurrentPage('userProfile');
    } catch (error) {
      setSearchError('Usuario no encontrado');
      setSearchedUserId(null);
      setTimeout(() => setSearchError(''), 3000);
    }
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
      
      {searchError && (
        <div className="search-error-banner">
          {searchError}
        </div>
      )}

      {currentPage === 'home' && (
        <HomePage 
          publicaciones={publicaciones} 
          token={token}
          currentUser={user}
          onPublicacionUpdated={loadPublicaciones}
        />
      )}

      {currentPage === 'createPublication' && (
        <CreatePublicationPage 
          user={user}
          token={token}
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
        <UserProfilePage
          userId={searchedUserId}
          token={token}
          currentUser={user}
          onBack={() => setCurrentPage('home')}
          onPublicacionUpdated={loadPublicaciones}
        />
      )}
    </div>
  );
}

export default App;