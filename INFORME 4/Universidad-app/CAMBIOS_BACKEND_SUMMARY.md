# Resumen de Cambios: Conexión Backend

## 📝 Archivos Modificados

### 1. **frontend/src/services/apiClient.js** ⚠️ CAMBIO MAYOR
**Antes:** 100% mock data, todas las funciones simulaban respuestas
**Después:** 100% axios real, llamadas verdaderas al backend

#### Cambios específicos:
- ❌ Eliminado: `import { mockUsers, mockCursos, mockPublicaciones, mockComentarios, getStoredUsers, saveStoredUsers }`
- ❌ Eliminado: `const USE_MOCK = config.api.useMock;`
- ✅ Agregado: `import axios from 'axios';`
- ✅ Agregado: `const axiosInstance = axios.create({ baseURL: API_BASE_URL, timeout: 10000 })`

#### Interceptores agregados:
```javascript
// Interceptor 1: Agrega token JWT automáticamente
axiosInstance.interceptors.request.use(
  (configAxios) => {
    const token = localStorage.getItem(config.storage.token);
    if (token) {
      configAxios.headers.Authorization = `Bearer ${token}`;
    }
    return configAxios;
  }
);

// Interceptor 2: Maneja errores 401
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(config.storage.token);
      localStorage.removeItem(config.storage.user);
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);
```

#### Funciones actualizadas:
- `login()` - Ahora hace POST real a `/auth/login`
- `register()` - Ahora hace POST real a `/auth/register`
- `forgotPassword()` - Nueva función para recuperar contraseña
- `getUserProfile()` - Ahora hace GET real a `/usuarios/:userId`
- `searchUserByRegistro()` - Ahora hace GET real a `/usuarios/registro/:registro`
- `updateUserProfile()` - Ahora hace PUT real a `/usuarios`
- `getApprovedCourses()` - Nueva función para obtener cursos aprobados
- `addCursoAprobado()` - Ahora hace POST real a `/usuarios/:userId/cursos-aprobados`
- `removeCursoAprobado()` - Ahora hace DELETE real
- `fetchPublicaciones()` - Ahora hace GET real a `/publicaciones`
- `fetchPublicacionesByUser()` - Ahora filtra en backend
- `createPublicacion()` - Ahora hace POST real
- `updatePublicacion()` - Ahora hace PUT real
- `deletePublicacion()` - Ahora hace DELETE real
- `fetchComentarios()` - Ahora hace GET real a `/comentarios/:publicacionId`
- `createComentario()` - Ahora hace POST real
- `fetchCursos()` - Ahora hace GET real a `/cursos`
- `getCurso()` - Nueva función para obtener un curso específico
- `fetchProfesores()` - Ahora hace GET real a `/profesores`

### 2. **frontend/.env** ✏️ CAMBIO CRÍTICO
```diff
- VITE_USE_MOCK=true
+ VITE_USE_MOCK=false
```
**Impacto:** Activa uso de backend real en lugar de mock

### 3. **frontend/src/config/config.js** ✏️ CAMBIO MENOR
**Endpoints actualizados para coincidir con rutas backend:**
```javascript
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
}
```

### 4. **src/app.js** ✏️ CAMBIO IMPORTANTE
**Antes:**
```javascript
const authRoutes = require('./routes/auth.routes');
const usuarioRoutes = require('./routes/usuario.routes');
const cursoRoutes = require('./routes/curso.routes');
const publicacionRoutes = require('./routes/publicacion.routes');
const profesorRoutes = require('./routes/profesor.routes');
// ... comentarioRoutes FALTABA

app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/cursos', cursoRoutes);
app.use('/api/publicaciones', publicacionRoutes);
app.use('/api/profesores', profesorRoutes);
// ... comentarios NO MONTADO
```

**Después:**
```javascript
const authRoutes = require('./routes/auth.routes');
const usuarioRoutes = require('./routes/usuario.routes');
const cursoRoutes = require('./routes/curso.routes');
const publicacionRoutes = require('./routes/publicacion.routes');
const comentarioRoutes = require('./routes/comentario.routes'); // ✅ AGREGADO
const profesorRoutes = require('./routes/profesor.routes');

app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/cursos', cursoRoutes);
app.use('/api/publicaciones', publicacionRoutes);
app.use('/api/comentarios', comentarioRoutes); // ✅ AGREGADO
app.use('/api/profesores', profesorRoutes);
```

## 🔄 Flujo Ahora

**ANTES (Mock):**
```
Frontend Input
    ↓
apiClient.js (funciones mock)
    ↓
localStorage
    ↓
Componentes actualizados
```

**AHORA (Real Backend):**
```
Frontend Input
    ↓
apiClient.js (axios)
    ↓
Interceptor agrega token JWT
    ↓
HTTP Request → Backend
    ↓
Backend valida token (middleware)
    ↓
Backend procesa y responde
    ↓
apiClient.js maneja respuesta
    ↓
localStorage actualizado
    ↓
Componentes actualizados
```

## 🔐 Seguridad Agregada

1. **JWT en Headers:**
   - Token automáticamente incluido en toda solicitud
   - No expuesto en URL
   - Validado por backend

2. **Manejo de Errores:**
   - 401 Unauthorized → logout automático
   - Limpia credenciales
   - Redirige a login

3. **Token Persistente:**
   - Se guarda en localStorage
   - Se carga automáticamente al recargar página
   - Se envía en cada solicitud

## ⚙️ Variables de Entorno

**Frontend (.env) - Cambios:**
```env
VITE_API_BASE_URL=http://localhost:3000/api  # ← Apunta al backend
VITE_USE_MOCK=false                           # ← CAMBIO CRÍTICO
```

## 📦 Dependencias

- ✅ axios (ya instalado en package.json)
- ✅ express (backend)
- ✅ dotenv (configuración)
- ✅ cors (permitir solicitudes del frontend)

## 🧪 Qué Cambió en Comportamiento

| Feature | Antes (Mock) | Ahora (Real) |
|---------|-------------|-------------|
| Login | Instantáneo | Tiempo real de red |
| Datos persistentes | localStorage solo | localStorage + BD |
| Multi-usuario | Simulado en localStorage | Real en BD |
| Comentarios | Almacenados en RAM | Almacenados en BD |
| Cursos aprobados | localStorage | Base de datos |
| Búsqueda de usuarios | En memoria | En base de datos |
| Validaciones | Frontend solo | Frontend + Backend |

## ✨ Nuevas Características

1. **Token JWT automático** - Incluido en todas las solicitudes
2. **Manejo de errores de red** - Try/catch en todas las funciones
3. **Logout automático** - Token expirado = logout
4. **Error messages reales** - Del backend
5. **Persistent data** - Almacenado en base de datos

## 🚀 Siguientes Pasos

1. Asegúrate que el backend está corriendo: `npm start`
2. Verifica que MySQL está activa
3. Inicia frontend: `npm run dev` (en carpeta frontend)
4. Abre http://localhost:5173
5. Prueba login/registro
6. Observa Network tab en DevTools

## ⚠️ Notas Importantes

- El backend debe estar corriendo en **puerto 3000**
- MySQL debe estar activo con la BD `universidad_app`
- CORS está habilitado para `http://localhost:5173`
- Si ves error 401, el token es inválido → vuelve a hacer login
- Si ves error 404, revisa que todas las rutas estén montadas en app.js

## 📞 Debugging

**Ver todas las solicitudes HTTP:**
1. Abre DevTools (F12)
2. Ve a pestaña "Network"
3. Realiza una acción (login, publicar, etc.)
4. Observa la solicitud HTTP, headers y respuesta

**Ver tokens guardados:**
1. DevTools → Application → Local Storage
2. Busca clave: `universidad_app_token`
3. Debe contener un JWT (string largo con puntos: `xxx.yyy.zzz`)
