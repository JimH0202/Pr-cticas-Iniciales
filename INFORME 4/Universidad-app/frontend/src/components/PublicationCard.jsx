import React, { useState } from 'react';
import { createComentario, fetchComentarios, updatePublicacion, deletePublicacion } from '../services/apiClient';
import '../styles.css';

function PublicationCard({ publicacion, token, currentUserId, onPublicacionUpdated, enableEditing = false }) {
  const [showComments, setShowComments] = useState(false);
  const [comentarios, setComentarios] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editMessage, setEditMessage] = useState(publicacion.mensaje);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleCommentClick = async () => {
    if (!showComments) {
      // Cargar comentarios cuando se abre la sección de comentarios
      if (token) {
        try {
          const result = await fetchComentarios(token, publicacion.id);
          setComentarios(result.comentarios || []);
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

  const handleEditClick = () => {
    setEditMessage(publicacion.mensaje);
    setEditing(true);
  };

  const handleSaveEdit = async () => {
    if (!editMessage.trim() || !token) return;
    setLoading(true);
    try {
      await updatePublicacion(token, publicacion.id, editMessage);
      publicacion.mensaje = editMessage;
      setEditing(false);
      if (onPublicacionUpdated) {
        onPublicacionUpdated();
      }
    } catch (error) {
      console.error('Error updating publication:', error);
      alert('Error al actualizar la publicación');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditing(false);
    setEditMessage(publicacion.mensaje);
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    setLoading(true);
    try {
      await deletePublicacion(token, publicacion.id);
      setShowDeleteModal(false);
      if (onPublicacionUpdated) {
        onPublicacionUpdated();
      }
    } catch (error) {
      console.error('Error deleting publication:', error);
      alert('Error al eliminar la publicación');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
  };

  const isOwnPublication = currentUserId && publicacion.usuario?.id === currentUserId;

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
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
          {isOwnPublication && enableEditing && (
            <div className="publication-actions-header">
              <button 
                className="action-btn edit-btn"
                onClick={handleEditClick}
                title="Editar publicación"
                disabled={loading}
              >
                ✎
              </button>
              <button 
                className="action-btn delete-btn"
                onClick={handleDeleteClick}
                title="Eliminar publicación"
                disabled={loading}
              >
                ✕
              </button>
            </div>
          )}
          <div className="publication-date">
            {formatDate(publicacion.fechaCreacion)}
          </div>
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
      {editing ? (
        <div className="publication-edit">
          <textarea 
            value={editMessage}
            onChange={(e) => setEditMessage(e.target.value)}
            className="edit-textarea"
            placeholder="Edita tu publicación..."
            disabled={loading}
          />
          <div className="edit-buttons">
            <button 
              onClick={handleSaveEdit}
              className="btn-save"
              disabled={loading || !editMessage.trim()}
            >
              {loading ? '...' : 'Guardar'}
            </button>
            <button 
              onClick={handleCancelEdit}
              className="btn-cancel"
              disabled={loading}
            >
              Cancelar
            </button>
          </div>
        </div>
      ) : (
        <div className="publication-content">
          <p>{publicacion.mensaje}</p>
        </div>
      )}

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

      {/* Modal de confirmación de eliminación */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Eliminar Publicación</h3>
            <p>¿Estás seguro de que deseas eliminar esta publicación? Esta acción no se puede deshacer.</p>
            <div className="modal-buttons">
              <button 
                className="modal-btn-cancel"
                onClick={handleCancelDelete}
                disabled={loading}
              >
                Cancelar
              </button>
              <button 
                className="modal-btn-delete"
                onClick={handleConfirmDelete}
                disabled={loading}
              >
                {loading ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PublicationCard;
