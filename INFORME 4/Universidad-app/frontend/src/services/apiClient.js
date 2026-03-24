import { mockUsers, mockCursos, mockPublicaciones } from './mockData';

const USE_MOCK = true; // Cambiar a false cuando conectes el backend real

export async function login({ registro, password }) {
  if (USE_MOCK) {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 500));

    const user = mockUsers.find(u => u.registro === registro && u.password === password);
    if (!user) {
      throw { response: { data: { message: 'Usuario o contraseña incorrectos' } } };
    }
    return { token: 'mock-jwt-token-' + Date.now(), user };
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

export async function fetchPublicaciones(token) {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockPublicaciones;
  }

  // Código real
  // const response = await axios.get(`${API_BASE_URL}/publicaciones`, { headers: { Authorization: `Bearer ${token}` } });
  // return response.data;
}
