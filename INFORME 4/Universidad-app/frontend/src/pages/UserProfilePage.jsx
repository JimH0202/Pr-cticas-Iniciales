import React, { useState, useEffect } from 'react';
import { getUserProfile, updateUserProfile, fetchPublicacionesByUser, fetchCursos, addCursoAprobado, removeCursoAprobado } from '../services/apiClient';
import PublicationCard from '../components/PublicationCard';
import '../styles.css';

function UserProfilePage({ userId, token, currentUser, onBack, onPublicacionUpdated }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [showCursosModal, setShowCursosModal] = useState(false);
  const [activeTab, setActiveTab] = useState('publicaciones'); // 'publicaciones' o 'cursos'
  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    email: ''
  });
  const [modalFormData, setModalFormData] = useState({
    cursoId: '',
    profesor: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [userPublicaciones, setUserPublicaciones] = useState([]);
  const [allCursos, setAllCursos] = useState([]);
  const [selectedCurso, setSelectedCurso] = useState(null);

  const isOwnProfile = currentUser && currentUser.id === userId;

  useEffect(() => {
    loadUserProfile();
    loadUserPublicaciones();
    loadCursos();
  }, [userId, token]);

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      const result = await getUserProfile(token, Number(userId));
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

  const loadUserPublicaciones = async () => {
    try {
      const publicacionesResult = await fetchPublicacionesByUser(token, Number(userId));
      setUserPublicaciones(publicacionesResult.publicaciones || []);
    } catch (error) {
      console.error('Error al cargar publicaciones del usuario:', error);
    }
  };

  const loadCursos = async () => {
    try {
      const cursosResult = await fetchCursos(token);
      const cursos = cursosResult.cursos || cursosResult || [];
      setAllCursos(Array.isArray(cursos) ? cursos : []);
    } catch (error) {
      console.error('Error al cargar cursos:', error);
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
      loadUserPublicaciones();
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

  const handleAddCursoAprobado = async () => {
    if (!selectedCurso || !modalFormData.profesor.trim()) {
      setError('Selecciona un curso y especifica el profesor');
      return;
    }

    try {
      setError('');
      setSuccess('');
      const result = await addCursoAprobado(token, userId, {
        cursoId: selectedCurso.id,
        profesor: modalFormData.profesor
      });
      setUser(result.user);
      setSelectedCurso(null);
      setModalFormData({ cursoId: '', profesor: '' });
      setShowCursosModal(false);
      setSuccess('Curso agregado a tus aprobados');
    } catch (error) {
      setError(error.response?.data?.message || 'Error al agregar curso');
    }
  };

  const handleRemoveCursoAprobado = async (cursoId) => {
    try {
      setError('');
      const result = await removeCursoAprobado(token, userId, cursoId);
      setUser(result.user);
      setSuccess('Curso removido de tus aprobados');
    } catch (error) {
      setError(error.response?.data?.message || 'Error al remover curso');
    }
  };

  const calcularCreditosAprobados = () => {
    if (!user || !user.cursosAprobados) return 0;
    return user.cursosAprobados.reduce((total, curso) => total + (curso.creditos || 0), 0);
  };

  const getCursosNoAprobados = () => {
    if (!allCursos || !Array.isArray(allCursos)) return [];
    if (!user || !user.cursosAprobados) return allCursos;
    return allCursos.filter(curso => !user.cursosAprobados.find(c => c.id === curso.id));
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
        <h1>{isOwnProfile ? 'Mi Perfil' : `Perfil de ${user.nombres}`}</h1>
      </div>

      <div className="profile-content">
        <aside className="profile-sidebar">
          <div className="profile-card">
            <div className="avatar-circle-large">
              {user.nombres.charAt(0).toUpperCase()}
            </div>
            <h2>{user.nombres} {user.apellidos}</h2>
            <p className="profile-subtitle">Registro: <strong>{user.registro}</strong></p>

            <div className="info-box">
              <div className="info-line"><span>Email</span><strong>{user.email}</strong></div>
              <div className="info-line"><span>Fecha de Registro</span><strong>{new Date(user.created_at).toLocaleDateString('es-ES')}</strong></div>
              <div className="info-line"><span>Créditos Aprobados</span><strong>{calcularCreditosAprobados()}</strong></div>
            </div>

            <div className="profile-buttons">
              {isOwnProfile && (
                <button className="btn-edit" onClick={() => setEditing(true)}>Editar Perfil</button>
              )}
            </div>

            {showCursosModal && isOwnProfile && (
              <div className="modal-overlay" onClick={() => setShowCursosModal(false)}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                  <h2>Agregar Curso Aprobado</h2>
                  <div className="form-group">
                    <label>Selecciona un Curso:</label>
                    <select 
                      value={modalFormData.cursoId} 
                      onChange={(e) => {
                        const curso = getCursosNoAprobados().find(c => c.id === Number(e.target.value));
                        setSelectedCurso(curso || null);
                        setModalFormData({ ...modalFormData, cursoId: e.target.value });
                      }}
                      className="curso-select"
                    >
                      <option value="">-- Selecciona un curso --</option>
                      {getCursosNoAprobados().map(curso => (
                        <option key={curso.id} value={curso.id}>
                          {curso.nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label>Profesor del Curso:</label>
                    <input 
                      type="text"
                      value={modalFormData.profesor}
                      onChange={(e) => setModalFormData({ ...modalFormData, profesor: e.target.value })}
                      placeholder="Ej: Dr. García, Ing. López"
                      className="profesor-input"
                    />
                  </div>

                  {selectedCurso && (
                    <div className="curso-preview">
                      <div className="preview-row">
                        <span>Curso:</span>
                        <strong>{selectedCurso.nombre}</strong>
                      </div>
                      <div className="preview-row">
                        <span>Créditos:</span>
                        <strong>{selectedCurso.creditos}</strong>
                      </div>
                      <div className="preview-row">
                        <span>Profesor:</span>
                        <strong>{modalFormData.profesor || '(a especificar)'}</strong>
                      </div>
                    </div>
                  )}
                  
                  {error && <p className="error-message">{error}</p>}
                  {success && <p className="success-message">{success}</p>}
                  
                  <div className="modal-buttons">
                    <button 
                      onClick={handleAddCursoAprobado} 
                      className="btn-confirm"
                      disabled={!selectedCurso || !modalFormData.profesor.trim()}
                    >
                      Agregar Curso
                    </button>
                    <button 
                      onClick={() => {
                        setShowCursosModal(false);
                        setSelectedCurso(null);
                        setModalFormData({ cursoId: '', profesor: '' });
                        setError('');
                        setSuccess('');
                      }} 
                      className="btn-cancel"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </aside>

        <main className="profile-main">
          {isOwnProfile && editing ? (
            <div className="profile-edit">
              <div className="form-group">
                <label>Número de Registro:</label>
                <input type="text" value={user.registro} disabled className="disabled-input" />
              </div>
              <div className="form-group">
                <label>Nombres:</label>
                <input type="text" name="nombres" value={formData.nombres} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label>Apellidos:</label>
                <input type="text" name="apellidos" value={formData.apellidos} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label>Email:</label>
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} />
              </div>
              {error && <p className="error-message">{error}</p>}
              {success && <p className="success-message">{success}</p>}
              <div className="edit-buttons-centered">
                <button onClick={handleSave} className="btn-save">Guardar</button>
                <button onClick={handleCancel} className="btn-cancel">Cancelar</button>
              </div>
            </div>
          ) : null}

          {/* TABS */}
          <div className="profile-tabs">
            <button 
              className={`tab-button ${activeTab === 'publicaciones' ? 'active' : ''}`}
              onClick={() => setActiveTab('publicaciones')}
            >
              {isOwnProfile ? 'Mis Publicaciones' : `Publicaciones de ${user.nombres}`}
            </button>
            <button 
              className={`tab-button ${activeTab === 'cursos' ? 'active' : ''}`}
              onClick={() => setActiveTab('cursos')}
            >
              Cursos Aprobados ({user.cursosAprobados?.length || 0})
            </button>
          </div>

          {/* PESTAÑA: PUBLICACIONES */}
          {activeTab === 'publicaciones' && (
            <div className="profile-publicaciones">
              {userPublicaciones.length > 0 ? (
                <div className="publicaciones-grid">
                  {userPublicaciones.map(pub => (
                    <PublicationCard 
                      key={pub.id} 
                      publicacion={pub} 
                      token={token}
                      currentUserId={currentUser?.id}
                      onPublicacionUpdated={() => {
                        loadUserPublicaciones();
                        if (onPublicacionUpdated) {
                          onPublicacionUpdated();
                        }
                      }}
                      enableEditing={isOwnProfile}
                    />
                  ))}
                </div>
              ) : (
                <p className="empty-state">📭 No hay publicaciones.</p>
              )}
            </div>
          )}

          {/* PESTAÑA: CURSOS APROBADOS */}
          {activeTab === 'cursos' && (
            <div className="cursos-aprobados-tab">
              {user.cursosAprobados && user.cursosAprobados.length > 0 ? (
                <div className="cursos-cards-container">
                  {user.cursosAprobados.map(curso => (
                    <div key={curso.id} className="curso-card">
                      <div className="curso-card-header">
                        <h3 className="curso-card-nombre">{curso.nombre}</h3>
                        {isOwnProfile && (
                          <button 
                            className="btn-remove-curso-card"
                            onClick={() => handleRemoveCursoAprobado(curso.id)}
                            title="Remover curso"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                      <div className="curso-card-body">
                        <div className="curso-card-row">
                          <span className="label">Créditos:</span>
                          <strong>{curso.creditos}</strong>
                        </div>
                        <div className="curso-card-row">
                          <span className="label">Profesor:</span>
                          <strong>{curso.profesor}</strong>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-cursos-tab">
                  <p>Aún no has aprobado cursos</p>
                </div>
              )}
              
              {isOwnProfile && (
                <button 
                  className="btn-add-curso-tab"
                  onClick={() => setShowCursosModal(true)}
                >
                  + Agregar Curso Aprobado
                </button>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default UserProfilePage;