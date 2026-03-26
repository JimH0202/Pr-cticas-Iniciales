import React, { useState, useEffect } from 'react';
import { getUserProfile, updateUserProfile } from '../services/apiClient';
import '../styles.css';

function UserProfilePage({ userId, token, currentUser, onBack }) {
  console.log('UserProfilePage - userId:', userId, 'currentUser:', currentUser);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    email: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const isOwnProfile = currentUser && currentUser.id === userId;

  useEffect(() => {
    loadUserProfile();
  }, [userId, token]);

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      const result = await getUserProfile(token, userId);
      setUser(result.user);
      setFormData({
        nombres: result.user.nombres,
        apellidos: result.user.apellidos,
        email: result.user.email
      });
    } catch (error) {
      setError('Error al cargar el perfil del usuario');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      setError('');
      setSuccess('');
      const result = await updateUserProfile(token, userId, formData);
      setUser(result.user);
      setEditing(false);
      setSuccess('Perfil actualizado exitosamente');
    } catch (error) {
      setError('Error al actualizar el perfil');
    }
  };

  const handleCancel = () => {
    setFormData({
      nombres: user.nombres,
      apellidos: user.apellidos,
      email: user.email
    });
    setEditing(false);
    setError('');
    setSuccess('');
  };

  if (loading) {
    return (
      <div className="profile-page">
        <div className="loading">Cargando perfil...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="profile-page">
        <div className="error">Usuario no encontrado</div>
        <button onClick={onBack} className="btn-back">Volver</button>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <button onClick={onBack} className="btn-back">← Volver</button>
        <h1>Perfil de Usuario</h1>
      </div>

      <div className="profile-content">
        <div className="profile-avatar">
          <div className="avatar-circle">
            {user.nombres.charAt(0)}
          </div>
        </div>

        <div className="profile-info">
          {editing ? (
            <div className="profile-edit">
              <div className="form-group">
                <label>Número de Registro:</label>
                <input
                  type="text"
                  value={user.registro}
                  disabled
                  className="disabled-input"
                />
              </div>

              <div className="form-group">
                <label>Nombres:</label>
                <input
                  type="text"
                  name="nombres"
                  value={formData.nombres}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>Apellidos:</label>
                <input
                  type="text"
                  name="apellidos"
                  value={formData.apellidos}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>

              {error && <p className="error-message">{error}</p>}
              {success && <p className="success-message">{success}</p>}

              <div className="edit-buttons">
                <button onClick={handleSave} className="btn-save">Guardar</button>
                <button onClick={handleCancel} className="btn-cancel">Cancelar</button>
              </div>
            </div>
          ) : (
            <div className="profile-view">
              <div className="info-item">
                <label>Número de Registro:</label>
                <span>{user.registro}</span>
              </div>

              <div className="info-item">
                <label>Nombres:</label>
                <span>{user.nombres}</span>
              </div>

              <div className="info-item">
                <label>Apellidos:</label>
                <span>{user.apellidos}</span>
              </div>

              <div className="info-item">
                <label>Email:</label>
                <span>{user.email}</span>
              </div>

              <div className="info-item">
                <label>Fecha de Registro:</label>
                <span>{new Date(user.created_at).toLocaleDateString('es-ES')}</span>
              </div>

              {isOwnProfile && (
                <button onClick={() => setEditing(true)} className="btn-edit">
                  Editar Perfil
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserProfilePage;