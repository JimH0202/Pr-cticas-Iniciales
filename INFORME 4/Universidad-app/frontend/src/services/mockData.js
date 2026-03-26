export const mockUsers = [
  { id: 1, registro: 'est_2024001', password: 'admin123', nombres: 'Jimmy', apellidos: 'García', email: 'jimmy@universidad.edu', created_at: '2024-01-15T10:00:00Z' },
  { id: 2, registro: 'prof_001', password: 'prof123', nombres: 'Brian', apellidos: 'Rodríguez', email: 'brian@universidad.edu', created_at: '2023-08-01T09:00:00Z' },
];

export const mockCursos = [
  { id: 1, nombre: 'Matemáticas Avanzadas', creditos: 4, profesor: 'Dr. García' },
  { id: 2, nombre: 'Programación Web', creditos: 3, profesor: 'Ing. López' },
  { id: 3, nombre: 'Bases de Datos', creditos: 3, profesor: 'Dr. Martínez' },
];

export const mockPublicaciones = [
  {
    id: 1,
    usuario: { id: 1, registro: 'est_2024001', nombres: 'Jimmy', apellidos: 'García' },
    mensaje: '¿Alguien tiene apuntes de Matemáticas?',
    fechaCreacion: '2026-03-20T14:30:00Z',
    likesCount: 3,
    isLiked: false
  },
  {
    id: 2,
    usuario: { id: 2, registro: 'prof_001', nombres: 'Brian', apellidos: 'Rodríguez' },
    mensaje: 'Clase de Programación Web suspendida mañana',
    fechaCreacion: '2026-03-19T16:45:00Z',
    likesCount: 1,
    isLiked: true
  },
  {
    id: 3,
    usuario: { id: 1, registro: 'est_2024001', nombres: 'Jimmy', apellidos: 'García' },
    mensaje: 'Recomiendo el libro de Bases de Datos',
    fechaCreacion: '2026-03-18T11:20:00Z',
    likesCount: 5,
    isLiked: false
  },
];
