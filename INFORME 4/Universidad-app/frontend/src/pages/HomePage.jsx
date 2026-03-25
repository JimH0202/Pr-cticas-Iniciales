import React, { useState, useEffect } from 'react';
import PublicationCard from '../components/PublicationCard';
import '../styles.css';

function HomePage() {
  // Estados para filtros
  const [publicaciones, setPublicaciones] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [profesores, setProfesores] = useState([]);
  const [filtros, setFiltros] = useState({
    cursoId: '',
    profesorId: '',
    nombreCurso: '',
    nombreProfesor: ''
  });
  const [publicacionesFiltradas, setPublicacionesFiltradas] = useState([]);
  const [cargando, setCargando] = useState(true);

  // Cargar publicaciones y datos de filtros
  useEffect(() => {
    cargarDatos();
  }, []);

  // Aplicar filtros cuando cambien
  useEffect(() => {
    aplicarFiltros();
  }, [publicaciones, filtros]);

  const cargarDatos = async () => {
    try {
      setCargando(true);
      // Aquí iría el fetch real al backend
      // Por ahora usamos datos mock
      const mockPublicaciones = [
        {
          id: 1,
          usuario: { nombres: 'Jimmy', apellidos: 'García', registro: 'est_2024001' },
          curso: { id: 1, nombre: 'Matemáticas Avanzadas' },
          profesor: null,
          mensaje: '¿Alguien tiene apuntes de Matemáticas? Me perdí la última clase.',
          fechaCreacion: new Date('2026-03-25')
        },
        {
          id: 2,
          usuario: { nombres: 'Brian', apellidos: 'Rodríguez', registro: 'prof_001' },
          curso: null,
          profesor: { id: 2, nombres: 'Carlos', apellidos: 'López' },
          mensaje: 'La clase de mañana será en el aula 5, no en el aula 3.',
          fechaCreacion: new Date('2026-03-24')
        },
        {
          id: 3,
          usuario: { nombres: 'Ana', apellidos: 'Martínez', registro: 'est_2024002' },
          curso: { id: 3, nombre: 'Bases de Datos' },
          profesor: null,
          mensaje: 'Recomiendo el libro de Bases de Datos de C.J. Date. Muy completo y didáctico.',
          fechaCreacion: new Date('2026-03-23')
        },
        {
          id: 4,
          usuario: { nombres: 'Juan', apellidos: 'Pérez', registro: 'est_2024003' },
          curso: { id: 2, nombre: 'Programación Web' },
          profesor: null,
          mensaje: 'Alguien sabe cómo hacer responsive design con CSS Grid?',
          fechaCreacion: new Date('2026-03-22')
        }
      ];

      const mockCursos = [
        { id: 1, nombre: 'Matemáticas Avanzadas' },
        { id: 2, nombre: 'Programación Web' },
        { id: 3, nombre: 'Bases de Datos' }
      ];

      const mockProfesores = [
        { id: 1, nombres: 'Dr.', apellidos: 'García' },
        { id: 2, nombres: 'Carlos', apellidos: 'López' },
        { id: 3, nombres: 'Dr.', apellidos: 'Martínez' }
      ];

      setPublicaciones(mockPublicaciones);
      setCursos(mockCursos);
      setProfesores(mockProfesores);
      setCargando(false);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      setCargando(false);
    }
  };

  const aplicarFiltros = () => {
    let resultado = [...publicaciones];

    // Filtrar por curso ID
    if (filtros.cursoId) {
      resultado = resultado.filter(pub => pub.curso?.id === parseInt(filtros.cursoId));
    }

    // Filtrar por profesor ID
    if (filtros.profesorId) {
      resultado = resultado.filter(pub => pub.profesor?.id === parseInt(filtros.profesorId));
    }

    // Filtrar por nombre de curso (búsqueda)
    if (filtros.nombreCurso.trim()) {
      resultado = resultado.filter(pub =>
        pub.curso?.nombre.toLowerCase().includes(filtros.nombreCurso.toLowerCase())
      );
    }

    // Filtrar por nombre de profesor (búsqueda)
    if (filtros.nombreProfesor.trim()) {
      resultado = resultado.filter(pub =>
        `${pub.profesor?.nombres} ${pub.profesor?.apellidos}`
          .toLowerCase()
          .includes(filtros.nombreProfesor.toLowerCase())
      );
    }

    // Ordenar por fecha (más recientes primero)
    resultado.sort((a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion));

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

  if (cargando) {
    return <div className="home-page"><p className="loading">Cargando publicaciones...</p></div>;
  }

  return (
    <div className="home-page">
      <div className="home-header">
        <h1>Publicaciones</h1>
        <p>Aquí puedes ver todas las publicaciones de la comunidad. Usa los filtros para buscar lo que te interesa.</p>
      </div>

      {/* Sección de filtros */}
      <div className="filtros-section">
        <div className="filtros-container">
          <h3>Filtros de Búsqueda</h3>

          <div className="filtros-grid">
            {/* Filtro por curso */}
            <div className="filtro-group">
              <label htmlFor="cursoId">Filtrar por Curso:</label>
              <select
                id="cursoId"
                name="cursoId"
                value={filtros.cursoId}
                onChange={handleFiltroChange}
              >
                <option value="">Todos los cursos</option>
                {cursos.map(curso => (
                  <option key={curso.id} value={curso.id}>
                    {curso.nombre}
                  </option>
                ))}
              </select>
            </div>

            {/* Filtro por profesor */}
            <div className="filtro-group">
              <label htmlFor="profesorId">Filtrar por Catedrático:</label>
              <select
                id="profesorId"
                name="profesorId"
                value={filtros.profesorId}
                onChange={handleFiltroChange}
              >
                <option value="">Todos los catedráticos</option>
                {profesores.map(profesor => (
                  <option key={profesor.id} value={profesor.id}>
                    {profesor.nombres} {profesor.apellidos}
                  </option>
                ))}
              </select>
            </div>

            {/* Búsqueda por nombre de curso */}
            <div className="filtro-group">
              <label htmlFor="nombreCurso">Buscar Curso por Nombre:</label>
              <input
                id="nombreCurso"
                type="text"
                name="nombreCurso"
                placeholder="Ej: Programación, Matemáticas..."
                value={filtros.nombreCurso}
                onChange={handleFiltroChange}
              />
            </div>

            {/* Búsqueda por nombre de profesor */}
            <div className="filtro-group">
              <label htmlFor="nombreProfesor">Buscar Catedrático por Nombre:</label>
              <input
                id="nombreProfesor"
                type="text"
                name="nombreProfesor"
                placeholder="Ej: García, López..."
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

      {/* Sección de publicaciones */}
      <div className="publicaciones-section">
        <div className="publicaciones-info">
          <p className="result-count">
            {publicacionesFiltradas.length === 0
              ? 'No se encontraron publicaciones con los filtros seleccionados'
              : `Se encontraron ${publicacionesFiltradas.length} publicación(es)`}
          </p>
        </div>

        <div className="publicaciones-list">
          {publicacionesFiltradas.length > 0 ? (
            publicacionesFiltradas.map(publicacion => (
              <PublicationCard key={publicacion.id} publicacion={publicacion} />
            ))
          ) : (
            <div className="empty-state">
              <p>No hay publicaciones que mostrar</p>
              <p className="empty-text">Intenta con otros filtros o sé el primero en publicar algo.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default HomePage;
