/**
 * Ejemplos de uso de la configuración centralizada
 */

import config from '../config/config';

// ============================================
// 1. ACCEDER A CONFIGURACIÓN DE API
// ============================================

console.log('API Base URL:', config.api.baseURL);
// Output: http://localhost:3000/api

console.log('Usar Mock:', config.api.useMock);
// Output: true

console.log('Timeout:', config.api.timeout);
// Output: 30000


// ============================================
// 2. ACCEDER A ENDPOINTS
// ============================================

// Auth endpoints
const loginUrl = `${config.api.baseURL}${config.endpoints.auth.login}`;
// Result: http://localhost:3000/api/auth/login

const registerUrl = `${config.api.baseURL}${config.endpoints.auth.register}`;
// Result: http://localhost:3000/api/auth/register

// Usuarios endpoints
const profileUrl = `${config.api.baseURL}${config.endpoints.usuarios.profile}`;
// Result: http://localhost:3000/api/usuarios/:id

// Publicaciones endpoints
const listPublicacionesUrl = `${config.api.baseURL}${config.endpoints.publicaciones.list}`;
// Result: http://localhost:3000/api/publicaciones


// ============================================
// 3. USAR EN COMPONENTES REACT
// ============================================

import { useEffect, useState } from 'react';
import axios from 'axios';

function MyComponent() {
  const [publicaciones, setPublicaciones] = useState([]);

  useEffect(() => {
    const fetchPublicaciones = async () => {
      try {
        // Opción 1: Usar configuración centralizada
        const url = `${config.api.baseURL}${config.endpoints.publicaciones.list}`;
        const response = await axios.get(url, {
          timeout: config.api.timeout,
        });
        setPublicaciones(response.data);

        // Opción 2: Si config.api.useMock es true, usar mock
        if (config.api.useMock) {
          console.log('Using mock data');
          // Usar mockData en lugar de axios
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchPublicaciones();
  }, []);

  return (
    <div>
      {publicaciones.map(pub => (
        <div key={pub.id}>{pub.mensaje}</div>
      ))}
    </div>
  );
}


// ============================================
// 4. USAR EN SERVICIOS/API CLIENT
// ============================================

import { getStoredUsers } from './mockData';

export async function getPublicaciones(token) {
  if (config.api.useMock) {
    // Simular delay de red
    await new Promise(resolve => 
      setTimeout(resolve, config.mockDelays.api)
    );
    
    // Retornar datos mock
    return { publicaciones: mockPublicaciones };
  }

  // Usar API real
  const response = await axios.get(
    `${config.api.baseURL}${config.endpoints.publicaciones.list}`,
    {
      headers: { Authorization: `Bearer ${token}` },
      timeout: config.api.timeout,
    }
  );
  return response.data;
}


// ============================================
// 5. ACCEDER A CLAVES DE STORAGE
// ============================================

// En lugar de hardcodear strings
// ❌ localStorage.getItem('jwtToken')
// ✅ localStorage.getItem(config.storage.token)

function saveToken(token) {
  localStorage.setItem(config.storage.token, token);
}

function getToken() {
  return localStorage.getItem(config.storage.token);
}


// ============================================
// 6. USAR FEATURES CONDICIONALES
// ============================================

function trackEvent(eventName, data) {
  if (config.features.analytics) {
    // Enviar evento a servicio de analytics
    console.log('Analytics:', eventName, data);
  }
}

function debugLog(message, data) {
  if (config.features.debug) {
    console.debug('[DEBUG]', message, data);
  }
}


// ============================================
// 7. CONFIGURAR AXIOS GLOBALMENTE
// ============================================

import axiosInstance from 'axios';

const api = axiosInstance.create({
  baseURL: config.api.baseURL,
  timeout: config.api.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token
api.interceptors.request.use((axiosConfig) => {
  const token = localStorage.getItem(config.storage.token);
  if (token) {
    axiosConfig.headers.Authorization = `Bearer ${token}`;
  }
  return axiosConfig;
});

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado
      localStorage.removeItem(config.storage.token);
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;


// ============================================
// 8. CAMBIAR CONFIGURACIÓN SEGÚN ENTORNO
// ============================================

// En .env (desarrollo)
// VITE_API_BASE_URL=http://localhost:3000/api
// VITE_USE_MOCK=true

// En .env.production (producción)
// VITE_API_BASE_URL=https://api.myapp.com
// VITE_USE_MOCK=false

// El código usa automáticamente la configuración correcta
// Sin necesidad de cambios en el código fuente


// ============================================
// 9. TYPESCRIPT (Opcional)
// ============================================

// Para mejor type safety, crear config.ts en lugar de .js
// y exportar interfaces:

/*
interface ApiConfig {
  baseURL: string;
  useMock: boolean;
  timeout: number;
}

interface Config {
  api: ApiConfig;
  endpoints: {
    auth: { login: string; register: string };
    // ...
  };
  app: { name: string; version: string };
  features: { analytics: boolean; debug: boolean };
  storage: { token: string; user: string };
}

const config: Config = {
  // ...
};

export default config;
*/
