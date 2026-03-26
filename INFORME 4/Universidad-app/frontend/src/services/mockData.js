// Usuarios iniciales
const initialMockUsers = [
  { id: 1, registro: 'est_2024001', password: 'admin123', nombres: 'Jimmy', apellidos: 'García', email: 'jimmy@universidad.edu', created_at: '2024-01-15T10:00:00Z', cursosAprobados: [] },
  { id: 2, registro: 'prof_001', password: 'prof123', nombres: 'Brian', apellidos: 'Rodríguez', email: 'brian@universidad.edu', created_at: '2023-08-01T09:00:00Z', cursosAprobados: [] },
];

// Función helper para obtener usuarios desde localStorage o iniciales
export const getStoredUsers = () => {
  if (typeof window === 'undefined') {
    return initialMockUsers;
  }
  const stored = localStorage.getItem('mockUsers');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      return initialMockUsers;
    }
  }
  return initialMockUsers;
};

// Función para guardar usuarios en localStorage
export const saveStoredUsers = (users) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('mockUsers', JSON.stringify(users));
  }
};

// mockUsers es dinámico, se carga desde localStorage
export let mockUsers = getStoredUsers();

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

export const mockComentarios = {
  1: [
    { id: 1, mensaje: 'Yo tengo los apuntes de la clase pasada', usuario: { nombres: 'Brian', apellidos: 'Rodríguez' }, fechaCreacion: '2026-03-20T15:00:00Z' }
  ],
  2: [],
  3: [
    { id: 2, mensaje: 'Excelente recomendación, muy útil', usuario: { nombres: 'Carlos', apellidos: 'López' }, fechaCreacion: '2026-03-18T12:30:00Z' },
    { id: 3, mensaje: 'Ya lo tengo, es muy bueno', usuario: { nombres: 'María', apellidos: 'García' }, fechaCreacion: '2026-03-18T13:00:00Z' }
  ]
};
