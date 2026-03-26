import { mockUsers, mockCursos, mockPublicaciones } from './mockData';

const USE_MOCK = true; // Cambiar a false cuando conecte con el backend real

export async function login({ registro, password }) {
  if (USE_MOCK) {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 500));

    const user = mockUsers.find(u => u.registro === registro && u.password === password);
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

    // Verificar si el registro ya existe
    const existingUser = mockUsers.find(u => u.registro === registro || u.email === email);
    if (existingUser) {
      throw { response: { data: { message: 'Registro académico o email ya existe' } } };
    }

    // Agregar nuevo usuario (en mock, no persiste)
    const newUser = { registro, nombres, apellidos, password, email };
    mockUsers.push(newUser);

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

export async function createComentario(token, publicacionId, mensaje) {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return { comentario: { id: Date.now(), mensaje, usuario: { nombres: 'Usuario', apellidos: 'Mock' }, fechaCreacion: new Date() } };
  }

  // Código real
  // const response = await axios.post(`${API_BASE_URL}/comentarios/${publicacionId}`, { mensaje }, { headers: { Authorization: `Bearer ${token}` } });
  // return response.data;
}

export async function fetchComentarios(token, publicacionId) {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 200));
    return { comentarios: [] }; // Mock vacío por simplicidad
  }

  // Código real
  // const response = await axios.get(`${API_BASE_URL}/comentarios/${publicacionId}`, { headers: { Authorization: `Bearer ${token}` } });
  // return response.data;
}

export async function searchUserByRegistro(token, registro) {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const user = mockUsers.find(u => u.registro === registro);
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
    const user = mockUsers.find(u => u.id === userId);
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

export async function updateUserProfile(token, userId, userData) {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const userIndex = mockUsers.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      throw { response: { data: { message: 'Usuario no encontrado' } } };
    }
    // Simular actualización (no persiste)
    mockUsers[userIndex] = { ...mockUsers[userIndex], ...userData };
    return { user: mockUsers[userIndex] };
  }

  // Código real
  // const response = await axios.put(`${API_BASE_URL}/usuarios/${userId}`, userData, { headers: { Authorization: `Bearer ${token}` } });
  // return response.data;
}
