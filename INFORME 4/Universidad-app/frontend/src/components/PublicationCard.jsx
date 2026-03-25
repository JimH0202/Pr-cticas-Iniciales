import React from 'react';
import '../styles.css';

function PublicationCard({ publicacion }) {
  const formatDate = (date) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    };
    return new Date(date).toLocaleDateString('es-ES', options);
  };

  return (
    <div className="publication-card">
      {/* Encabezado de la publicación */}
      <div className="publication-header">
        <div className="publication-author">
          <div className="author-avatar">
            {publicacion.usuario.nombres.charAt(0)}
          </div>
          <div className="author-info">
            <h4 className="author-name">
              {publicacion.usuario.nombres} {publicacion.usuario.apellidos}
            </h4>
            <p className="author-registro">@{publicacion.usuario.registro}</p>
          </div>
        </div>
        <div className="publication-date">
          {formatDate(publicacion.fechaCreacion)}
        </div>
      </div>

      {/* Tema de la publicación (Curso o Profesor) */}
      <div className="publication-topic">
        {publicacion.curso && (
          <span className="topic-badge topic-curso">
            {publicacion.curso.nombre}
          </span>
        )}
        {publicacion.profesor && (
          <span className="topic-badge topic-profesor">
            {publicacion.profesor.nombres} {publicacion.profesor.apellidos}
          </span>
        )}
      </div>

      {/* Contenido de la publicación */}
      <div className="publication-content">
        <p>{publicacion.mensaje}</p>
      </div>

      {/* Acciones */}
      <div className="publication-actions">
        <button className="action-btn comment-btn" title="Ver comentarios">
          Comentarios
        </button>
        <button className="action-btn likes-btn" title="Me gusta">
          Me gusta
        </button>
        <button className="action-btn share-btn" title="Compartir">
          Compartir
        </button>
      </div>
    </div>
  );
}

export default PublicationCard;
