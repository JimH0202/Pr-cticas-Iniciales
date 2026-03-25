import React, { useState, useEffect } from 'react';
import PublicationCard from '../components/PublicationCard';
import '../styles.css';

function HomePage({ publicacionesExternas = [] }) {

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

  // 🔹 Carga inicial
  useEffect(() => {
    cargarDatos();
  }, []);

  // 🔹 Cuando llegan nuevas publicaciones (desde Create)
  useEffect(() => {
    if (publicacionesExternas.length > 0) {
      setPublicaciones(prev => [
        ...publicacionesExternas,
        ...prev
      ]);
    }
  }, [publicacionesExternas]);

  // 🔹 Aplicar filtros
  useEffect(() => {
    aplicarFiltros();
  }, [publicaciones, filtros]);

  const cargarDatos = async () => {
    try {
      setCargando(true);

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
          mensaje: 'Recomiendo el libro de Bases de Datos de C.J. Date.',
          fechaCreacion: new Date('2026-03-23')
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

      // 🔥 mezcla inicial
      setPublicaciones([
        ...publicacionesExternas,
        ...mockPublicaciones
      ]);

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

    if (filtros.cursoId) {
      resultado = resultado.filter(pub => pub.curso?.id === parseInt(filtros.cursoId));
    }

    if (filtros.profesorId) {
      resultado = resultado.filter(pub => pub.profesor?.id === parseInt(filtros.profesorId));
    }

    if (filtros.nombreCurso.trim()) {
      resultado = resultado.filter(pub =>
        pub.curso?.nombre?.toLowerCase().includes(filtros.nombreCurso.toLowerCase())
      );
    }

    if (filtros.nombreProfesor.trim()) {
      resultado = resultado.filter(pub =>
        `${pub.profesor?.nombres || ''} ${pub.profesor?.apellidos || ''}`
          .toLowerCase()
          .includes(filtros.nombreProfesor.toLowerCase())
      );
    }

    //ORDENAR POR FECHA (más recientes primero)
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
    return (
      <div className="home-page">
        <p className="loading">Cargando publicaciones...</p>
      </div>
    );
  }

  return (
    <div className="home-page">

      <div className="home-header">
        <h1>Publicaciones</h1>
        <p>Explora lo que está pasando en la comunidad.</p>
      </div>

      {/* FILTROS */}
      <div className="filtros-section">
        <div className="filtros-container">
          <h3>Filtros de Búsqueda</h3>

          <div className="filtros-grid">

            <div className="filtro-group">
              <label>Curso:</label>
              <select name="cursoId" value={filtros.cursoId} onChange={handleFiltroChange}>
                <option value="">Todos</option>
                {cursos.map(curso => (
                  <option key={curso.id} value={curso.id}>
                    {curso.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="filtro-group">
              <label>Catedrático:</label>
              <select name="profesorId" value={filtros.profesorId} onChange={handleFiltroChange}>
                <option value="">Todos</option>
                {profesores.map(prof => (
                  <option key={prof.id} value={prof.id}>
                    {prof.nombres} {prof.apellidos}
                  </option>
                ))}
              </select>
            </div>

            <div className="filtro-group">
              <label>Buscar Curso:</label>
              <input
                name="nombreCurso"
                value={filtros.nombreCurso}
                onChange={handleFiltroChange}
                placeholder="Ej: Programación"
              />
            </div>

            <div className="filtro-group">
              <label>Buscar Catedrático:</label>
              <input
                name="nombreProfesor"
                value={filtros.nombreProfesor}
                onChange={handleFiltroChange}
                placeholder="Ej: García"
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
        <div className="publicaciones-info">
          <p className="result-count">
            {publicacionesFiltradas.length === 0
              ? 'No hay publicaciones'
              : `${publicacionesFiltradas.length} publicación(es)`}
          </p>
        </div>

        <div className="publicaciones-list">
          {publicacionesFiltradas.map(pub => (
            <PublicationCard key={pub.id} publicacion={pub} />
          ))}
        </div>
      </div>

    </div>
  );
}

export default HomePage;