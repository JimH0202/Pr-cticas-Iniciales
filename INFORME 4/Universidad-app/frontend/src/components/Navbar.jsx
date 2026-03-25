import React, { useState } from 'react';
import '../styles.css';

function Navbar({ user, onLogout, onNavigate, onSearchUser }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchMenu, setShowSearchMenu] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearchUser(searchQuery);
      setSearchQuery('');
      setShowSearchMenu(false);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo/Título */}
        <div className="navbar-brand">
          <h1 className="app-title">Universidad App</h1>
        </div>

        {/* Menú de navegación */}
        <ul className="navbar-menu">
          <li>
            <button
              className="nav-link"
              onClick={() => onNavigate('home')}
            >
              Inicio
            </button>
          </li>
          <li>
            <button
              className="nav-link"
              onClick={() => onNavigate('createPublication')}
            >
              Crear Publicación
            </button>
          </li>
          <li>
            <button
              className="nav-link"
              onClick={() => onNavigate('myProfile')}
            >
              Mi Perfil
            </button>
          </li>
        </ul>

        {/* Buscador de usuarios */}
        <div className="navbar-search">
          <button
            className="search-toggle"
            onClick={() => setShowSearchMenu(!showSearchMenu)}
            title="Buscar usuario"
          >
            Buscar
          </button>
          {showSearchMenu && (
            <form onSubmit={handleSearchSubmit} className="search-form">
              <input
                type="text"
                placeholder="Buscar usuario (Registro Personal)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              <button type="submit" className="search-btn">
                Buscar
              </button>
            </form>
          )}
        </div>

        {/* Información del usuario y logout */}
        <div className="navbar-user-info">
          <span className="user-name">
            {user?.nombre && `Hola, ${user.nombre.split(' ')[0]}`}
          </span>
          <button
            className="logout-btn"
            onClick={onLogout}
            title="Cerrar sesión"
          >
            Salir
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
