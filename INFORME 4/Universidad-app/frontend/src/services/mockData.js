export const mockUsers = [
  { registro: 'est_2024001', password: 'admin123', nombres: 'Jimmy', apellidos: 'García', email: 'jimmy@universidad.edu' },
  { registro: 'prof_001', password: 'prof123', nombres: 'Brian', apellidos: 'Rodríguez', email: 'brian@universidad.edu' },
];

export const mockCursos = [
  { id: 1, nombre: 'Matemáticas Avanzadas', creditos: 4, profesor: 'Dr. García' },
  { id: 2, nombre: 'Programación Web', creditos: 3, profesor: 'Ing. López' },
  { id: 3, nombre: 'Bases de Datos', creditos: 3, profesor: 'Dr. Martínez' },
];

export const mockPublicaciones = [
  { id: 1, usuario: 'est_2024001', mensaje: '¿Alguien tiene apuntes de Matemáticas?', fecha: '2026-03-20' },
  { id: 2, usuario: 'prof_001', mensaje: 'Clase de Programación Web suspendida mañana', fecha: '2026-03-19' },
  { id: 3, usuario: 'est_2024002', mensaje: 'Recomiendo el libro de Bases de Datos', fecha: '2026-03-18' },
];
