/**
 * Configuración centralizada de la aplicación
 * Las variables se cargan desde los archivos .env
 */

const config = {
  // API Configuration
  api: {
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
    timeout: 30000,
  },

  // Endpoints
  endpoints: {
    auth: {
      login: '/auth/login',
      register: '/auth/register',
      forgotPassword: '/auth/forgot-password',
    },
    usuarios: {
      profileByRegistro: '/usuarios/registro/:registro',
      profileById: '/usuarios/:id',
      update: '/usuarios',
      cursosAprobados: '/usuarios/:userId/cursos-aprobados',
      addCursoAprobado: '/usuarios/:userId/cursos-aprobados',
    },
    publicaciones: {
      list: '/publicaciones',
      create: '/publicaciones',
      getById: '/publicaciones/:id',
      update: '/publicaciones/:id',
      delete: '/publicaciones/:id',
    },
    comentarios: {
      list: '/comentarios/:publicacionId',
      create: '/comentarios/:publicacionId',
    },
    cursos: {
      list: '/cursos',
      getById: '/cursos/:id',
      create: '/cursos',
    },
  },

  // App Configuration
  app: {
    name: import.meta.env.VITE_APP_NAME || 'Universidad App',
    version: import.meta.env.VITE_APP_VERSION || '1.0.0',
  },

  // Local Storage Keys
  storage: {
    token: 'jwtToken',
    user: 'user',
  },

  // Pagination
  pagination: {
    defaultPageSize: 10,
    maxPageSize: 100,
  },
};

// Freeze para evitar modificaciones accidentales
Object.freeze(config);

export default config;
