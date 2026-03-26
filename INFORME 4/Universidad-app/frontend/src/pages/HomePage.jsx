import React, { useState, useEffect } from 'react';
import PublicationCard from '../components/PublicationCard';
import '../styles.css';

function HomePage({ publicaciones, token }) {

  const [filtros, setFiltros] = useState({
    cursoId: '',
    profesorId: '',
    nombreCurso: '',
    nombreProfesor: ''
  });

  const [cursos, setCursos] = useState([]);
  const [profesores, setProfesores] = useState([]);
  const [publicacionesFiltradas, setPublicacionesFiltradas] = useState([]);

  //EXTRAER CURSOS Y PROFESORES ÚNICOS
  useEffect(() => {
    const cursosUnicos = [];
    const profesoresUnicos = [];

    publicaciones.forEach(pub => {
      if (pub.curso && pub.curso.nombre) {
        if (!cursosUnicos.some(c => c.nombre === pub.curso.nombre)) {
          cursosUnicos.push({
            id: pub.curso.id || pub.curso.nombre,
            nombre: pub.curso.nombre
          });
        }
      }

      if (pub.profesor && pub.profesor.nombres) {
        const nombreCompleto = `${pub.profesor.nombres} ${pub.profesor.apellidos || ''}`;

        if (!profesoresUnicos.some(p => p.nombre === nombreCompleto)) {
          profesoresUnicos.push({
            id: pub.profesor.id || nombreCompleto,
            nombre: nombreCompleto
          });
        }
      }
    });

    setCursos(cursosUnicos);
    setProfesores(profesoresUnicos);
  }, [publicaciones]);

  // FILTROS
  useEffect(() => {
    aplicarFiltros();
  }, [publicaciones, filtros]);

  const aplicarFiltros = () => {
    let resultado = [...publicaciones];

    if (filtros.cursoId) {
      resultado = resultado.filter(
        pub =>
          (pub.curso?.id || pub.curso?.nombre) === filtros.cursoId
      );
    }

    if (filtros.profesorId) {
      resultado = resultado.filter(pub => {
        const nombreCompleto = `${pub.profesor?.nombres || ''} ${pub.profesor?.apellidos || ''}`;
        return (pub.profesor?.id || nombreCompleto) === filtros.profesorId;
      });
    }

    if (filtros.nombreCurso.trim()) {
      resultado = resultado.filter(pub =>
        pub.curso?.nombre
          ?.toLowerCase()
          .includes(filtros.nombreCurso.toLowerCase())
      );
    }

    if (filtros.nombreProfesor.trim()) {
      resultado = resultado.filter(pub =>
        `${pub.profesor?.nombres || ''} ${pub.profesor?.apellidos || ''}`
          .toLowerCase()
          .includes(filtros.nombreProfesor.toLowerCase())
      );
    }

    resultado.sort(
      (a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion)
    );

    setPublicacionesFiltradas(resultado);
  };

  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltros(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const limpiarFiltros = () => {
    setFiltros({
      cursoId: '',
      profesorId: '',
      nombreCurso: '',
      nombreProfesor: ''
    });
  };

  return (
    <div className="home-page">

      {/* HEADER */}
      <div className="home-header">
        <h1>Publicaciones</h1>
        <p>Aquí puedes ver todas las publicaciones de la comunidad. Usa los filtros para buscar lo que te interesa.</p>
      </div>

      {/* FILTROS */}
      <div className="filtros-section">
        <div className="filtros-container">
          <h3>Filtros de Búsqueda</h3>

          <div className="filtros-grid">

            {/*CURSOS */}
            <div className="filtro-group">
              <label>Filtrar por Curso:</label>
              <select
                name="cursoId"
                value={filtros.cursoId}
                onChange={handleFiltroChange}
              >
                <option value="">Todos</option>
                {cursos.map(curso => (
                  <option key={curso.id} value={curso.id}>
                    {curso.nombre}
                  </option>
                ))}
              </select>
            </div>

            {/* PROFESORES */}
            <div className="filtro-group">
              <label>Filtrar por Catedrático:</label>
              <select
                name="profesorId"
                value={filtros.profesorId}
                onChange={handleFiltroChange}
              >
                <option value="">Todos</option>
                {profesores.map(prof => (
                  <option key={prof.id} value={prof.id}>
                    {prof.nombre}
                  </option>
                ))}
              </select>
            </div>

            {/* NOMBRE CURSO */}
            <div className="filtro-group">
              <label>Nombre de Curso:</label>
              <input
                type="text"
                name="nombreCurso"
                placeholder="Ej: Programación"
                value={filtros.nombreCurso}
                onChange={handleFiltroChange}
              />
            </div>

            {/* NOMBRE PROFESOR */}
            <div className="filtro-group">
              <label>Nombre de Catedrático:</label>
              <input
                type="text"
                name="nombreProfesor"
                placeholder="Ej: García"
                value={filtros.nombreProfesor}
                onChange={handleFiltroChange}
              />
            </div>

          </div>

          <button className="btn-limpiar" onClick={limpiarFiltros}>
            Limpiar Filtros
          </button>
        </div>
      </div>

      {/* PUBLICACIONES */}
      <div className="publicaciones-section">
        <div className="publicaciones-list">
          {publicacionesFiltradas.length > 0 ? (
            publicacionesFiltradas.map((publicacion) => (
              <PublicationCard
                key={publicacion.id}
                publicacion={publicacion}
                token={token}
              />
            ))
          ) : (
            <div className="empty-state">
              <p>📭</p> //colocado a proposito por el momento en lo que investigo como agregar imagnes e iconos
              <p>Sé el primero en crear una publicación</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}

export default HomePage;