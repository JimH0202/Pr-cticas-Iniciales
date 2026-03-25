import React, { useState } from 'react';
import '../styles.css';

function CreatePublicationPage({ user, onCreate }) {
  const [tipo, setTipo] = useState('curso'); // curso o profesor
  const [curso, setCurso] = useState('');
  const [profesor, setProfesor] = useState('');
  const [mensaje, setMensaje] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    const nuevaPublicacion = {
      id: Date.now(),
      usuario: user,
      curso: tipo === 'curso' ? { nombre: curso } : null,
      profesor: tipo === 'profesor' ? { nombres: profesor, apellidos: '' } : null,
      mensaje,
      fechaCreacion: new Date()
    };

    onCreate(nuevaPublicacion);

    // limpiar
    setCurso('');
    setProfesor('');
    setMensaje('');
  };

 return (
  <div className="home-page">

    {/* HEADER*/}
    <div className="home-header">
      <h1>Crear Publicación</h1>
      <p>Aquí puedes crear tus publicaciones para la comunidad.</p>
    </div>

    <div className="create-container">
      <form onSubmit={handleSubmit} className="create-form">

        {/* Tipo */}
        <div className="input-group">
          <label>Tipo de publicación</label>
           <div className="radio-group">
            <label className="radio-option">
              <input
                type="radio"
                value="curso"
                checked={tipo === 'curso'}
                onChange={(e) => setTipo(e.target.value)}
              />
              <span>Curso</span>
            </label>

            <label className="radio-option">
              <input
                type="radio"
                value="profesor"
                checked={tipo === 'profesor'}
                onChange={(e) => setTipo(e.target.value)}
              />
              <span>Catedrático</span>
            </label>
          </div>
        </div>

        {/* Curso */}
        {tipo === 'curso' && (
          <div className="input-group">
            <label>Nombre del curso</label>
            <input
              value={curso}
              onChange={(e) => setCurso(e.target.value)}
              placeholder="Ej: Matemáticas Avanzadas"
              required
            />
          </div>
        )}

        {/* Profesor */}
        {tipo === 'profesor' && (
          <div className="input-group">
            <label>Nombre del catedrático</label>
            <input
              value={profesor}
              onChange={(e) => setProfesor(e.target.value)}
              placeholder="Ej: Carlos López"
              required
            />
          </div>
        )}

        {/* Mensaje */}
        <div className="input-group">
          <label>Mensaje</label>
          <textarea
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            placeholder="Escribe tu publicación aquí..."
            required
          />
        </div>

        <button className="create-btn">Publicar</button>
      </form>

      
      <div className="preview-section">
        <h3>Vista previa</h3>

        <div className="publication-card">
          <div className="publication-header">
            <div className="publication-author">
              <div className="author-avatar">
                {user?.nombres?.charAt(0)}
              </div>
              <div>
                <h4>{user?.nombres} {user?.apellidos}</h4>
                <p>@{user?.registro}</p>
              </div>
            </div>
            <div className="publication-date">
              {new Date().toLocaleString()}
            </div>
          </div>

          <div className="publication-topic">
            {tipo === 'curso' && curso && (
              <span className="topic-badge topic-curso">{curso}</span>
            )}
            {tipo === 'profesor' && profesor && (
              <span className="topic-badge topic-profesor">{profesor}</span>
            )}
          </div>

          <div className="publication-content">
            <p>{mensaje || 'Aquí aparecerá tu mensaje...'}</p>
          </div>
        </div>
      </div>

    </div>
  </div>
);
}

export default CreatePublicationPage;