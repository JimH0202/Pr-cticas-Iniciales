import React, { useState, useEffect } from 'react';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import HomePage from './pages/HomePage';
import UserProfilePage from './pages/UserProfilePage';
import Navbar from './components/Navbar';
import CreatePublicationPage from './pages/CreatePublicationPage';
import { fetchPublicaciones } from './services/apiClient';

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('jwtToken') || null);
  const [page, setPage] = useState('login');
  const [currentPage, setCurrentPage] = useState('home');
  const [searchedUserId, setSearchedUserId] = useState(null);
  const [publicaciones, setPublicaciones] = useState([]);

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
  useEffect(() => {
    if (user && token) {
      console.log('Loading publications for user:', user);
      const loadPublicaciones = async () => {
        try {
          const data = await fetchPublicaciones(token);
          console.log('Publications loaded:', data);
          setPublicaciones(data.publicaciones || []);
        } catch (error) {
          console.error('Error cargando publicaciones:', error);
        }
      };
      loadPublicaciones();
    }
  }, [user, token]);

  // Una función para crear publicaciones
  const handleCreatePost = (newPost) => {
    setPublicaciones(prev => [newPost, ...prev]);
    setCurrentPage('home');
  };

  const handleLoginSuccess = (loggedUser, userToken) => {
    console.log('Login success:', loggedUser, userToken);
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
      console.log('Navigating to myProfile, user:', user, 'user.id:', user.id);
      setSearchedUserId(user.id);
      setCurrentPage('userProfile');
    } else {
      setCurrentPage(destination);
      setSearchedUserId(null);
    }
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
  console.log('Rendering app - user:', user, 'currentPage:', currentPage, 'publicaciones:', publicaciones.length);
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
        <UserProfilePage
          userId={searchedUserId}
          token={token}
          currentUser={user}
          onBack={() => setCurrentPage('home')}
        />
      )}
    </div>
  );
}

export default App;