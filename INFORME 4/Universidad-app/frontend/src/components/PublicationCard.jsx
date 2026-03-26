import React, { useState } from 'react';
import { createComentario, fetchComentarios } from '../services/apiClient';
import '../styles.css';

function PublicationCard({ publicacion, token }) {
  const [showComments, setShowComments] = useState(false);
  const [comentarios, setComentarios] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCommentClick = async () => {
    if (!showComments) {
      // Cargar comentarios
      if (token) {
        try {
          const result = await fetchComentarios(token, publicacion.id);
          setComentarios(result.comentarios);
        } catch (error) {
          console.error('Error fetching comments:', error);
        }
      }
    }
    setShowComments(!showComments);
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !token) return;
    setLoading(true);
    try {
      const result = await createComentario(token, publicacion.id, newComment);
      setComentarios([...comentarios, result.comentario]);
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setLoading(false);
    }
  };
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
        <button 
          className={`action-btn comment-btn ${showComments ? 'active' : ''}`} 
          onClick={handleCommentClick} 
          title="Ver comentarios"
        >
          Comentarios ({comentarios.length})
        </button>
      </div>

      {/* Sección de comentarios */}
      {showComments && (
        <div className="comments-section">
          <div className="add-comment">
            <input
              type="text"
              placeholder="Escribe un comentario..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !loading && handleAddComment()}
              disabled={loading}
            />
            <button onClick={handleAddComment} disabled={!newComment.trim() || loading}>
              {loading ? '...' : 'Comentar'}
            </button>
          </div>
          <div className="comments-list">
            {comentarios.map((comentario) => (
              <div key={comentario.id} className="comment">
                <strong>{comentario.usuario.nombres} {comentario.usuario.apellidos}:</strong> {comentario.mensaje}
                <small> - {formatDate(comentario.fechaCreacion)}</small>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default PublicationCard;
