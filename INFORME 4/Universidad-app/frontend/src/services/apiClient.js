import { mockUsers, mockCursos, mockPublicaciones, mockComentarios, getStoredUsers, saveStoredUsers } from './mockData';

const USE_MOCK = true; // Cambiar a false cuando conecte con el backend real

export async function login({ registro, password }) {
  if (USE_MOCK) {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 500));

    // Cargar usuarios desde localStorage
    const storedUsers = getStoredUsers();
    const user = storedUsers.find(u => u.registro === registro && u.password === password);
    if (!user) {
      throw { response: { data: { message: 'Usuario o contraseña incorrectos' } } };
    }
    return { token: 'mock-jwt-token-' + Date.now(), user: { ...user, id: user.id } };
  }

  // Código real con axios (cuando USE_MOCK = false)
  // const response = await axios.post(`${API_BASE_URL}/auth/login`, { registro, password });
  // return response.data;
}

export async function fetchCursos(token) {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockCursos;
  }

  // Código real
  // const response = await axios.get(`${API_BASE_URL}/cursos`, { headers: { Authorization: `Bearer ${token}` } });
  // return response.data;
}

export async function register({ registro, nombres, apellidos, password, email }) {
  if (USE_MOCK) {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 500));

    // Cargar usuarios desde localStorage
    const storedUsers = getStoredUsers();

    // Verificar si el registro ya existe
    const existingUser = storedUsers.find(u => u.registro === registro || u.email === email);
    if (existingUser) {
      throw { response: { data: { message: 'Registro académico o email ya existe' } } };
    }

    // Generar ID automático para el nuevo usuario
    const newId = Math.max(...storedUsers.map(u => u.id || 0), 0) + 1;

    // Agregar nuevo usuario con ID
    const newUser = { 
      id: newId, 
      registro, 
      nombres, 
      apellidos, 
      password, 
      email,
      created_at: new Date().toISOString()
    };
    storedUsers.push(newUser);

    // Guardar en localStorage
    saveStoredUsers(storedUsers);

    // Actualizar el array en memoria
    mockUsers.length = 0;
    mockUsers.push(...storedUsers);

    return { message: 'Usuario registrado exitosamente', user: newUser };
  }

  // Código real con axios (cuando USE_MOCK = false)
  // const response = await axios.post(`${API_BASE_URL}/auth/register`, { registro, nombres, apellidos, password, email });
  // return response.data;
}

export async function fetchPublicaciones(token, filters = {}) {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return { publicaciones: mockPublicaciones };
  }

  // Código real
  // const response = await axios.get(`${API_BASE_URL}/publicaciones`, { headers: { Authorization: `Bearer ${token}` }, params: filters });
  // return response.data;
}

export async function fetchPublicacionesByUser(token, userId) {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return { publicaciones: mockPublicaciones.filter(pub => pub.usuario?.id === Number(userId)) };
  }

  // Código real
  // const response = await axios.get(`${API_BASE_URL}/publicaciones`, { headers: { Authorization: `Bearer ${token}` }, params: { usuarioId: userId } });
  // return response.data;
}

export async function createComentario(token, publicacionId, mensaje) {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const newComentario = {
      id: Date.now(),
      mensaje,
      usuario: { nombres: 'Usuario', apellidos: 'Mock' },
      fechaCreacion: new Date().toISOString()
    };
    if (!mockComentarios[publicacionId]) {
      mockComentarios[publicacionId] = [];
    }
    mockComentarios[publicacionId].push(newComentario);
    return { comentario: newComentario };
  }

  // Código real
  // const response = await axios.post(`${API_BASE_URL}/comentarios/${publicacionId}`, { mensaje }, { headers: { Authorization: `Bearer ${token}` } });
  // return response.data;
}

export async function fetchComentarios(token, publicacionId) {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 200));
    return { comentarios: mockComentarios[publicacionId] || [] };
  }

  // Código real
  // const response = await axios.get(`${API_BASE_URL}/comentarios/${publicacionId}`, { headers: { Authorization: `Bearer ${token}` } });
  // return response.data;
}

export async function searchUserByRegistro(token, registro) {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const storedUsers = getStoredUsers();
    const user = storedUsers.find(u => u.registro === registro);
    if (!user) {
      throw { response: { data: { message: 'Usuario no encontrado' } } };
    }
    return { user };
  }

  // Código real
  // const response = await axios.get(`${API_BASE_URL}/usuarios/registro/${registro}`, { headers: { Authorization: `Bearer ${token}` } });
  // return response.data;
}

export async function getUserProfile(token, userId) {
  console.log('getUserProfile called with userId:', userId);
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const storedUsers = getStoredUsers();
    const user = storedUsers.find(u => u.id === userId);
    console.log('Found user in mock:', user);
    if (!user) {
      throw { response: { data: { message: 'Usuario no encontrado' } } };
    }
    return { user };
  }

  // Código real
  // const response = await axios.get(`${API_BASE_URL}/usuarios/${userId}`, { headers: { Authorization: `Bearer ${token}` } });
  // return response.data;
}

export async function createPublicacion(token, usuarioId, { cursoId, profesorId, mensaje, curso, profesor }, currentUser) {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const newPublicacion = {
      id: Date.now(),
      usuario: { id: currentUser.id, registro: currentUser.registro, nombres: currentUser.nombres, apellidos: currentUser.apellidos },
      curso: cursoId ? { id: cursoId, nombre: curso } : null,
      profesor: profesorId ? { id: profesorId, nombres: profesor, apellidos: '' } : null,
      mensaje,
      fechaCreacion: new Date().toISOString(),
      likesCount: 0,
      isLiked: false
    };
    mockPublicaciones.unshift(newPublicacion);
    return { publicacion: newPublicacion };
  }

  // Código real
  // const response = await axios.post(`${API_BASE_URL}/publicaciones`, { cursoId, profesorId, mensaje }, { headers: { Authorization: `Bearer ${token}` } });
  // return response.data;
}

export async function updateUserProfile(token, userId, userData) {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Cargar usuarios desde localStorage
    const storedUsers = getStoredUsers();
    const userIndex = storedUsers.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      throw { response: { data: { message: 'Usuario no encontrado' } } };
    }
    
    // Actualizar usuario
    storedUsers[userIndex] = { ...storedUsers[userIndex], ...userData };
    
    // Guardar en localStorage
    saveStoredUsers(storedUsers);
    
    // Actualizar el array en memoria
    mockUsers.length = 0;
    mockUsers.push(...storedUsers);
    
    // Actualizar también las publicaciones del usuario con los datos nuevos
    mockPublicaciones.forEach(pub => {
      if (pub.usuario.id === userId) {
        pub.usuario = { ...storedUsers[userIndex], id: userId };
      }
    });
    
    return { user: storedUsers[userIndex] };
  }

  // Código real
  // const response = await axios.put(`${API_BASE_URL}/usuarios/${userId}`, userData, { headers: { Authorization: `Bearer ${token}` } });
  // return response.data;
}

export async function updatePublicacion(token, publicacionId, mensaje) {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const publicacion = mockPublicaciones.find(p => p.id === publicacionId);
    if (!publicacion) {
      throw { response: { data: { message: 'Publicación no encontrada' } } };
    }
    publicacion.mensaje = mensaje;
    return { publicacion };
  }

  // Código real
  // const response = await axios.put(`${API_BASE_URL}/publicaciones/${publicacionId}`, { mensaje }, { headers: { Authorization: `Bearer ${token}` } });
  // return response.data;
}

export async function deletePublicacion(token, publicacionId) {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = mockPublicaciones.findIndex(p => p.id === publicacionId);
    if (index === -1) {
      throw { response: { data: { message: 'Publicación no encontrada' } } };
    }
    mockPublicaciones.splice(index, 1);
    return { message: 'Publicación eliminada exitosamente' };
  }

  // Código real
  // const response = await axios.delete(`${API_BASE_URL}/publicaciones/${publicacionId}`, { headers: { Authorization: `Bearer ${token}` } });
  // return response.data;
}

// Funciones para Cursos Aprobados
export async function addCursoAprobado(token, userId, cursoAprobado) {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const storedUsers = getStoredUsers();
    const userIndex = storedUsers.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      throw { response: { data: { message: 'Usuario no encontrado' } } };
    }
    
    // Verificar si el curso ya está aprobado
    if (!storedUsers[userIndex].cursosAprobados) {
      storedUsers[userIndex].cursosAprobados = [];
    }
    
    const cursoYaAprobado = storedUsers[userIndex].cursosAprobados.find(c => c.id === cursoAprobado.id);
    if (cursoYaAprobado) {
      throw { response: { data: { message: 'Este curso ya está en tu lista de aprobados' } } };
    }
    
    storedUsers[userIndex].cursosAprobados.push(cursoAprobado);
    saveStoredUsers(storedUsers);
    mockUsers.length = 0;
    mockUsers.push(...storedUsers);
    
    return { user: storedUsers[userIndex] };
  }

  // Código real
  // const response = await axios.post(`${API_BASE_URL}/usuarios/${userId}/cursos-aprobados`, cursoAprobado, { headers: { Authorization: `Bearer ${token}` } });
  // return response.data;
}

export async function removeCursoAprobado(token, userId, cursoId) {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const storedUsers = getStoredUsers();
    const userIndex = storedUsers.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      throw { response: { data: { message: 'Usuario no encontrado' } } };
    }
    
    if (!storedUsers[userIndex].cursosAprobados) {
      storedUsers[userIndex].cursosAprobados = [];
    }
    
    const cursoIndex = storedUsers[userIndex].cursosAprobados.findIndex(c => c.id === cursoId);
    if (cursoIndex === -1) {
      throw { response: { data: { message: 'Curso no encontrado en tu lista' } } };
    }
    
    storedUsers[userIndex].cursosAprobados.splice(cursoIndex, 1);
    saveStoredUsers(storedUsers);
    mockUsers.length = 0;
    mockUsers.push(...storedUsers);
    
    return { user: storedUsers[userIndex] };
  }

  // Código real
  // const response = await axios.delete(`${API_BASE_URL}/usuarios/${userId}/cursos-aprobados/${cursoId}`, { headers: { Authorization: `Bearer ${token}` } });
  // return response.data;
}
