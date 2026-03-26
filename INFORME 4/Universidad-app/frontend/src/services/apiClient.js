import axios from 'axios';
import config from '../config/config';

const API_BASE_URL = config.api.baseURL;

// Crear instancia de axios
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: config.api.timeout || 10000,
});

// Interceptor para agregar el token JWT a todas las solicitudes
axiosInstance.interceptors.request.use(
  (configAxios) => {
    const token = localStorage.getItem(config.storage.token);
    if (token) {
      configAxios.headers.Authorization = `Bearer ${token}`;
    }
    return configAxios;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejar errores de autenticación
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido - limpiar localStorage y redirigir a login
      localStorage.removeItem(config.storage.token);
      localStorage.removeItem(config.storage.user);
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// ======================== AUTENTICACIÓN ========================

export async function login({ registro, password }) {
  try {
    const response = await axiosInstance.post('/auth/login', { registro, password });
    
    // Guardar token y usuario en localStorage
    localStorage.setItem(config.storage.token, response.data.token);
    localStorage.setItem(config.storage.user, JSON.stringify(response.data.user));
    
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Error en login';
    throw { 
      response: { 
        data: { message } 
      } 
    };
  }
}

export async function register({ registro, nombres, apellidos, password, email }) {
  try {
    const response = await axiosInstance.post('/auth/register', {
      registro,
      nombres,
      apellidos,
      password,
      email
    });
    
    // Opcionalmente guardar token si el backend lo devuelve
    if (response.data.token) {
      localStorage.setItem(config.storage.token, response.data.token);
      localStorage.setItem(config.storage.user, JSON.stringify(response.data.user));
    }
    
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Error en registro';
    throw { 
      response: { 
        data: { message } 
      } 
    };
  }
}

export async function forgotPassword(email) {
  try {
    const response = await axiosInstance.post('/auth/forgot-password', { email });
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Error al recuperar contraseña';
    throw { 
      response: { 
        data: { message } 
      } 
    };
  }
}

// ======================== USUARIOS ========================

export async function getUserProfile(token, userId) {
  try {
    const response = await axiosInstance.get(`/usuarios/${userId}`);
    return { user: response.data.usuario };
  } catch (error) {
    const message = error.response?.data?.message || 'Usuario no encontrado';
    throw { 
      response: { 
        data: { message } 
      } 
    };
  }
}

export async function searchUserByRegistro(token, registro) {
  try {
    const response = await axiosInstance.get(`/usuarios/registro/${registro}`);
    return { user: response.data.usuario };
  } catch (error) {
    const message = error.response?.data?.message || 'Usuario no encontrado';
    throw { 
      response: { 
        data: { message } 
      } 
    };
  }
}

export async function updateUserProfile(token, userId, userData) {
  try {
    const response = await axiosInstance.put('/usuarios', userData);
    
    // Actualizar usuario en localStorage
    localStorage.setItem(config.storage.user, JSON.stringify(response.data.usuario));
    
    return { user: response.data.usuario };
  } catch (error) {
    const message = error.response?.data?.message || 'Error al actualizar perfil';
    throw { 
      response: { 
        data: { message } 
      } 
    };
  }
}

export async function getApprovedCourses(token, userId) {
  try {
    const response = await axiosInstance.get(`/usuarios/${userId}/cursos-aprobados`);
    return { cursosAprobados: response.data.cursos };
  } catch (error) {
    const message = error.response?.data?.message || 'Error al obtener cursos aprobados';
    throw { 
      response: { 
        data: { message } 
      } 
    };
  }
}

export async function addCursoAprobado(token, userId, cursoAprobado) {
  try {
    const response = await axiosInstance.post(
      `/usuarios/${userId}/cursos-aprobados`,
      cursoAprobado
    );
    
    // Actualizar usuario en localStorage
    if (response.data.user) {
      localStorage.setItem(config.storage.user, JSON.stringify(response.data.user));
    }
    
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Error al agregar curso aprobado';
    throw { 
      response: { 
        data: { message } 
      } 
    };
  }
}

export async function removeCursoAprobado(token, userId, cursoId) {
  try {
    const response = await axiosInstance.delete(
      `/usuarios/${userId}/cursos-aprobados/${cursoId}`
    );
    
    // Actualizar usuario en localStorage
    if (response.data.user) {
      localStorage.setItem(config.storage.user, JSON.stringify(response.data.user));
    }
    
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Error al eliminar curso aprobado';
    throw { 
      response: { 
        data: { message } 
      } 
    };
  }
}

// ======================== PUBLICACIONES ========================

export async function fetchPublicaciones(token, filters = {}) {
  try {
    const response = await axiosInstance.get('/publicaciones', { params: filters });
    return { publicaciones: response.data.publicaciones };
  } catch (error) {
    const message = error.response?.data?.message || 'Error al obtener publicaciones';
    throw { 
      response: { 
        data: { message } 
      } 
    };
  }
}

export async function fetchPublicacionesByUser(token, userId) {
  try {
    const response = await axiosInstance.get('/publicaciones', {
      params: { usuarioId: userId }
    });
    return { publicaciones: response.data.publicaciones };
  } catch (error) {
    const message = error.response?.data?.message || 'Error al obtener publicaciones del usuario';
    throw { 
      response: { 
        data: { message } 
      } 
    };
  }
}

export async function createPublicacion(token, usuarioId, { cursoNombre, profesorNombre, mensaje }, currentUser) {
  try {
    const response = await axiosInstance.post('/publicaciones', {
      cursoNombre,
      profesorNombre,
      mensaje
    });
    
    return { publicacion: response.data.publicacion };
  } catch (error) {
    const message = error.response?.data?.message || 'Error al crear publicación';
    throw { 
      response: { 
        data: { message } 
      } 
    };
  }
}

export async function updatePublicacion(token, publicacionId, mensaje) {
  try {
    const response = await axiosInstance.put(`/publicaciones/${publicacionId}`, {
      mensaje
    });
    
    return { publicacion: response.data.publicacion };
  } catch (error) {
    const message = error.response?.data?.message || 'Error al actualizar publicación';
    throw { 
      response: { 
        data: { message } 
      } 
    };
  }
}

export async function deletePublicacion(token, publicacionId) {
  try {
    const response = await axiosInstance.delete(`/publicaciones/${publicacionId}`);
    return { message: 'Publicación eliminada exitosamente' };
  } catch (error) {
    const message = error.response?.data?.message || 'Error al eliminar publicación';
    throw { 
      response: { 
        data: { message } 
      } 
    };
  }
}

// ======================== COMENTARIOS ========================

export async function fetchComentarios(token, publicacionId) {
  try {
    const response = await axiosInstance.get(`/comentarios/${publicacionId}`);
    return { comentarios: response.data.comentarios };
  } catch (error) {
    const message = error.response?.data?.message || 'Error al obtener comentarios';
    throw { 
      response: { 
        data: { message } 
      } 
    };
  }
}

export async function createComentario(token, publicacionId, mensaje) {
  try {
    const response = await axiosInstance.post(`/comentarios/${publicacionId}`, {
      mensaje
    });
    
    return { comentario: response.data.comentario };
  } catch (error) {
    const message = error.response?.data?.message || 'Error al crear comentario';
    throw { 
      response: { 
        data: { message } 
      } 
    };
  }
}

// ======================== CURSOS ========================

export async function fetchCursos(token) {
  try {
    const response = await axiosInstance.get('/cursos');
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Error al obtener cursos';
    throw { 
      response: { 
        data: { message } 
      } 
    };
  }
}

export async function getCurso(token, cursoId) {
  try {
    const response = await axiosInstance.get(`/cursos/${cursoId}`);
    return { curso: response.data };
  } catch (error) {
    const message = error.response?.data?.message || 'Curso no encontrado';
    throw { 
      response: { 
        data: { message } 
      } 
    };
  }
}

// ======================== PROFESORES ========================

export async function fetchProfesores(token) {
  try {
    const response = await axiosInstance.get('/profesores');
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Error al obtener profesores';
    throw { 
      response: { 
        data: { message } 
      } 
    };
  }
}
