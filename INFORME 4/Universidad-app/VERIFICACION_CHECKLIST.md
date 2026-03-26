# Checklist de Verificación: Backend Connection

## ✅ Verificaciones Antes de Iniciar

### Backend - Configuración

- [ ] Archivo `/src/app.js` importa `comentarioRoutes`
  ```bash
  grep -n "comentarioRoutes" src/app.js
  # Debe mostrar línea con: const comentarioRoutes = require...
  ```

- [ ] Archivo `/src/app.js` monta ruta de comentarios
  ```bash
  grep -n "app.use('/api/comentarios'" src/app.js
  # Debe mostrar línea con: app.use('/api/comentarios', comentarioRoutes);
  ```

- [ ] Backend tiene archivo `.env` en raíz
  ```bash
  ls -la .env
  # Debe existir el archivo .env
  ```

- [ ] Variables de entorno en `.env` incluyen:
  ```env
  PORT=3000                         ✓
  DB_HOST=localhost                 ✓
  DB_USER=root                      ✓
  DB_PASSWORD=...                   ✓
  DB_NAME=universidad_app           ✓
  JWT_SECRET=...                    ✓
  CORS_ORIGIN=http://localhost:5173 ✓
  ```

- [ ] backend/package.json tiene scripts:
  ```bash
  grep -A 5 '"scripts"' package.json
  # Debe incluir: "start", "dev" o similar
  ```

### Frontend - Configuración

- [ ] Frontend tiene archivo `.env` en `frontend/` carpeta
  ```bash
  ls -la frontend/.env
  ```

- [ ] Frontend `.env` tiene las variables correctas:
  ```env
  VITE_API_BASE_URL=http://localhost:3000/api  ✓ (cambió de localhost)
  VITE_USE_MOCK=false                          ✓ (CAMBIO CRÍTICO)
  VITE_APP_NAME=Universidad App                ✓
  VITE_ENABLE_DEBUG=true                       ✓
  ```

- [ ] Frontend tiene archivo `src/services/apiClient.js`
  ```bash
  ls -la frontend/src/services/apiClient.js
  ```

- [ ] apiClient.js CONTIENE (no debe tener estas palabras):
  ```bash
  grep -v "//\|Código real" frontend/src/services/apiClient.js | \
  grep -c "mockUsers\|USE_MOCK\|if (USE_MOCK)"
  # Resultado debe ser 0 (cero)
  ```

- [ ] apiClient.js TIENE (debe tener estas palabras):
  ```bash
  grep "import axios\|axiosInstance\|interceptors" frontend/src/services/apiClient.js
  # Debe mostrar líneas con axios e interceptors
  ```

- [ ] Frontend package.json tiene axios instalado:
  ```bash
  grep "axios" frontend/package.json
  # Debe mostrar: "axios": "^1.x.x"
  ```

## 🔧 Pasos de Configuración

### 1. Base de Datos MySQL

```sql
-- Verifica si la BD existe
SHOW DATABASES;

-- Si no existe, crear:
CREATE DATABASE universidad_app CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Importar esquema
SOURCE sql/esquema.sql;

-- Verificar tabla usuarios
USE universidad_app;
DESCRIBE usuarios;

-- Insertar datos iniciales (si existen)
SOURCE sql/procedimientos.sql;
```

### 2. Backend - Instalación y Inicio

```bash
# Navegar a raíz del proyecto
cd c:\Users\jimhu\Desktop\Pr-cticas-Iniciales\INFORME\ 4\Universidad-app\

# Instalar dependencias
npm install

# Verificar que axios, express, cors, dotenv están instalados
npm list axios express cors dotenv

# Iniciar backend
npm start
# O con nodemon:
npm run dev

# Resultado esperado:
# Server running on port 3000
# Database connected
# CORS configured for http://localhost:5173
```

### 3. Frontend - Instalación e Inicio

```bash
# En otra terminal, navegar a frontend
cd frontend/

# Instalar dependencias
npm install

# Verificar axios está disponible
npm list axios

# Iniciar dev server
npm run dev

# Resultado esperado:
# VITE v5.4.0 ready in XX ms
# ➜  Local: http://localhost:5173/
```

## 🧪 Pruebas de Funcionamiento

### Prueba 1: Backend Está Activo

```bash
curl http://localhost:3000

# Resultado esperado:
# {"message":"Universidad App API","uptime":XX.XX}
```

### Prueba 2: Login - Network Analysis

En el navegador:
1. Abre DevTools (F12)
2. Ve a pestaña "Network"
3. Limpia Network history (icono de papelera)
4. Haz click en "Ingresar"
5. Ingresa credenciales válidas
6. Presiona "Ingresar"

Verifica:
- [ ] Aparece solicitud POST a `http://localhost:3000/api/auth/login`
- [ ] Status: 200 OK (no 400, 401, 404, 500)
- [ ] Response headers incluyen: `content-type: application/json`
- [ ] Response body contiene: `token` y `user`
- [ ] Headers enviados incluyen `Content-Type: application/json`

### Prueba 3: Token en LocalStorage

1. Abre DevTools (F12)
2. Ve a Application → Local Storage
3. Selecciona `http://localhost:5173`
4. Busca clave: `universidad_app_token`

Verifica:
- [ ] La clave existe
- [ ] El valor comienza con: `eyJ` (es un JWT)
- [ ] Formato JWT: `xxx.yyy.zzz` (tres partes con puntos)

### Prueba 4: Solicitud Autenticada

1. En DevTools → Network
2. Ve a la pestaña "Console"
3. Ejecuta este comando:

```javascript
// Verify token is being sent
fetch('http://localhost:3000/api/usuarios/1', {
  headers: { 'Authorization': 'Bearer ' + localStorage.getItem('universidad_app_token') }
}).then(r => r.json()).then(console.log)
```

Verifica:
- [ ] La respuesta es un objeto usuario
- [ ] No es error 401 (Unauthorized)
- [ ] No es error 404 (Not Found)

### Prueba 5: Crear Publicación

1. Haz login si no lo has hecho
2. En "Crear Publicación", escribe un mensaje
3. Presiona "Publicar"

Verifica:
- [ ] En Network tab aparece: POST `/api/publicaciones`
- [ ] Status: 201 Created o 200 OK
- [ ] La publicación aparece en el feed inmediatamente
- [ ] Request headers incluye: `Authorization: Bearer ...`

### Prueba 6: Comentarios

1. Busca una publicación  
2. Escribe un comentario
3. Presiona "Comentar"

Verifica:
- [ ] En Network tab: POST `/api/comentarios/:publicacionId`
- [ ] Status: 201 Created
- [ ] El comentario aparece debajo de la publicación
- [ ] Incluye: autor, mensaje, fecha

### Prueba 7: Cursos Aprobados

1. Ve a tu perfil
2. Haz clic en "Agregar Curso Aprobado"
3. Selecciona un curso
4. Presiona "Agregar"

Verifica:
- [ ] En Network tab: POST `/api/usuarios/:userId/cursos-aprobados`
- [ ] Status: 200 OK
- [ ] Los créditos aprobados en el perfil se actualizan
- [ ] El curso aparece en la pestaña "Cursos"

## 🐛 Debugging de Errores

### Error: "ECONNREFUSED 127.0.0.1:3000"

```
frontend logs: 
Error: Network Error
Back-end server is not running on port 3000
```

**Causa:** Backend no está corriendo

**Solución:**
```bash
# Terminal 1 - Backend
cd c:\Users\jimhu\Desktop\Pr-cticas-Iniciales\INFORME\ 4\Universidad-app\
npm start

# Verifica que veas:
# Server running on port 3000
```

### Error: "401 Unauthorized"

```
POST http://localhost:3000/api/publicaciones 401
Error: Invalid or expired token
```

**Causa:** Token no está siendo enviado o es inválido

**Solución:**
1. Limpia localStorage:
   ```javascript
   localStorage.clear()
   ```
2. Recarga página (Ctrl+R)
3. Haz login nuevamente
4. Verifica token en Application → Local Storage

### Error: "404 Not Found"

```
POST http://localhost:3000/api/comentarios/123 404
Not Found
```

**Causa:** Ruta no está montada en backend

**Solución:**
1. Verifica que app.js tiene:
   ```javascript
   const comentarioRoutes = require('./routes/comentario.routes');
   app.use('/api/comentarios', comentarioRoutes);
   ```
2. Reinicia backend: Ctrl+C y npm start
3. Espera mensaje: "Server running on port 3000"

### Error: "CORS Policy"

```
Access to XMLHttpRequest from origin 'http://localhost:5173' 
has been blocked by CORS policy
```

**Causa:** CORS no está bien configurado

**Solución:**
1. Backend `.env` debe tener:
   ```env
   CORS_ORIGIN=http://localhost:5173
   ```
2. Backend `app.js` debe tener:
   ```javascript
   app.use(cors({ origin: corsOrigin }));
   ```
3. Reinicia backend

### Error: "Cannot find module 'axios'"

```
Error: Cannot find module 'axios'
at Function.Module._load...
```

**Causa:** axios no está instalado

**Solución:**
```bash
# Frontend
cd frontend/
npm install axios

# Backend (if needed)
npm install axios
```

## 📊 Verificación de Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                    Client (http://localhost:5173)           │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         React App (Vite)                             │  │
│  │  ├── App.jsx                                        │  │
│  │  ├── pages/LoginPage.jsx                            │  │
│  │  └── services/apiClient.js (✅ axios real)          │  │
│  └──────────────────────────────────────────────────────┘  │
│            ↓ HTTP + JWT Token in Header                    │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│          Server (Express - http://localhost:3000)          │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │    app.js (CORS enabled)                             │  │
│  │  ├── /api/auth → authRoutes                         │  │
│  │  ├── /api/usuarios → usuarioRoutes                  │  │
│  │  ├── /api/publicaciones → publicacionRoutes         │  │
│  │  ├── /api/comentarios → comentarioRoutes (✅ ADDED)  │  │
│  │  ├── /api/cursos → cursoRoutes                      │  │
│  │  └── /api/profesores → profesorRoutes               │  │
│  │                                                      │  │
│  │    Middleware:                                        │  │
│  │  ├── authenticate (JWT validation)                    │  │
│  │  └── cors (for localhost:5173)                       │  │
│  └──────────────────────────────────────────────────────┘  │
│            ↓                                                 │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│          Database (MySQL - universidad_app)                │
│  ├── usuarios                                              │
│  ├── publicaciones                                         │
│  ├── comentarios                                           │
│  ├── cursos                                                │
│  ├── cursos_aprobados                                      │
│  └── profesores                                            │
└─────────────────────────────────────────────────────────────┘
```

## ✨ Estado Final Esperado

Cuando todo está correctamente configurado:

- ✅ Puedo hacer login con credenciales reales
- ✅ Token JWT se guarda en localStorage
- ✅ Puedo crear publicaciones que se guardan en BD
- ✅ Puedo comentar en publicaciones
- ✅ Puedo agregar cursos aprobados
- ✅ Los datos persisten después de recargar página
- ✅ Los datos son compartidos entre usuarios
- ✅ Si cierre sesión y abro sesión otra vez, veo mis datos
- ✅ DevTools → Network muestra solicitudes HTTP reales

## 📋 Resumen de Cambios

| Archivo | Cambio | Razón |
|---------|--------|-------|
| `frontend/src/services/apiClient.js` | Completamente reescrito | Usar axios real |
| `frontend/.env` | `VITE_USE_MOCK=false` | Activar backend |
| `frontend/src/config/config.js` | Actualizar endpoints | Coincida con backend |
| `src/app.js` | Agregar comentarioRoutes | Montar ruta que faltaba |

## 🚀 Comando Rápido

Para iniciar todo de una vez (en dos terminales separadas):

**Terminal 1 (Backend):**
```bash
cd c:\Users\jimhu\Desktop\Pr-cticas-Iniciales\INFORME\ 4\Universidad-app\
npm start
```

**Terminal 2 (Frontend):**
```bash
cd c:\Users\jimhu\Desktop\Pr-cticas-Iniciales\INFORME\ 4\Universidad-app\frontend\
npm run dev
```

Luego abre: http://localhost:5173
