# Guía: Conexión Frontend-Backend

## 🚀 Cambios Realizados

### 1. **Frontend - apiClient.js (COMPLETAMENTE REESCRITO)**
- ✅ Reemplazado todo código mock con llamadas reales a axios
- ✅ Agregados interceptores de axios para:
  - Incluir automáticamente el token JWT en todas las solicitudes
  - Manejar errores 401 (token expirado)
  - Redirigir a login si el token no es válido
- ✅ Todas las funciones ahora usan `axiosInstance` en lugar de mock data

### 2. **Frontend - .env**
- ✅ Actualizado `VITE_USE_MOCK=false` (usa backend real)
- ✅ Configurado `VITE_API_BASE_URL=http://localhost:3000/api`

### 3. **Backend - app.js**
- ✅ Agregada importación de `comentarioRoutes`
- ✅ Montada ruta `/api/comentarios` que faltaba

## 📋 Checklist - Antes de Iniciar

### Backend (Node.js)

1. **Navega a la carpeta raíz del proyecto:**
   ```bash
   cd c:\Users\jimhu\Desktop\Pr-cticas-Iniciales\INFORME\ 4\Universidad-app\
   ```

2. **Instala dependencias (si no lo has hecho):**
   ```bash
   npm install
   ```

3. **Verifica el archivo `.env` del backend:**
   - Debe existir `.env` en la raíz del proyecto
   - Contiene variables como:
     ```
     PORT=3000
     DB_HOST=localhost
     DB_USER=root
     DB_PASSWORD=...
     DB_NAME=universidad_app
     JWT_SECRET=tu_secreto_jwt
     CORS_ORIGIN=http://localhost:5173
     ```

4. **Inicia el servidor backend:**
   ```bash
   npm start
   ```
   O si tienes nodemon instalado:
   ```bash
   npm run dev
   ```

5. **Verifica que el servidor está corriendo:**
   - Debe mostrar: `Server running on port 3000`
   - Abre en navegador: http://localhost:3000
   - Debe mostrar un JSON con el estado del servidor

### Frontend (Vite)

1. **En otra terminal, navega a la carpeta frontend:**
   ```bash
   cd frontend/
   ```

2. **Instala dependencias:**
   ```bash
   npm install
   ```

3. **Inicia el servidor Vite:**
   ```bash
   npm run dev
   ```

4. **Abre en navegador:**
   ```
   http://localhost:5173
   ```

## 🧪 Flujo de Prueba Recomendado

### 1. **Registro de nuevo usuario**
```
1. Haz clic en "Registrarse"
2. Completa el formulario:
   - Registro: 12345678
   - Nombres: Juan
   - Apellidos: Pérez
   - Email: juan@example.com
   - Contraseña: 123456
3. Presiona "Registrarse"
```

**Verifica en la consola del navegador:**
- La solicitud debe llegar a: `POST http://localhost:3000/api/auth/register`
- El token debe guardarse en localStorage

### 2. **Login**
```
1. Usa las credenciales que acabas de crear
2. Presiona "Ingresar"
```

**Verifica:**
- El token JWT está en localStorage (ver DevTools → Application → Local Storage)
- Se muestra la página de inicio con el usuario autenticado

### 3. **Crear una publicación**
```
1. Escribe un mensaje en el área de texto
2. Presiona "Publicar"
```

**Verifica:**
- La solicitud: `POST http://localhost:3000/api/publicaciones`
- Incluye el header: `Authorization: Bearer <token>`
- La publicación aparece en el feed

### 4. **Agregar un curso aprobado**
```
1. Ve a tu perfil
2. Haz clic en "Agregar Curso Aprobado"
3. Selecciona un curso y profesor
4. Presiona "Agregar"
```

**Verifica:**
- La solicitud: `POST http://localhost:3000/api/usuarios/:userId/cursos-aprobados`
- Los créditos aprobados se actualizan en tiempo real

### 5. **Comentar en una publicación**
```
1. Escribe un comentario
2. Presiona "Comentar"
```

**Verifica:**
- La solicitud: `POST http://localhost:3000/api/comentarios/:publicacionId`
- El comentario aparece en la publicación

## ⚠️ Errores Comunes y Soluciones

### Error: "ECONNREFUSED"
```
Error: connect ECONNREFUSED 127.0.0.1:3000
```
**Solución:** El backend no está corriendo
- Verifica que `npm start` esté ejecutándose en otra terminal

### Error: "401 Unauthorized"
```
POST http://localhost:3000/api/publicaciones 401
```
**Solución:** El token no está siendo enviado correctamente
- Verifica que `localStorage` contenga el token
- Revisa los interceptores en `apiClient.js`
- Limpia localStorage y vuelve a hacer login

### Error: "CORS"
```
Access to XMLHttpRequest has been blocked by CORS policy
```
**Solución:** CORS no está bien configurado
- Verifica que `CORS_ORIGIN=http://localhost:5173` en `.env` del backend
- El backend tiene CORS habilitado en `app.js`

### Error: "404 - Ruta no encontrada"
```
GET http://localhost:3000/api/comentarios/123 404
```
**Solución:** La ruta no está montada
- Se acaba de agregar en `app.js` (línea 24)
- Reinicia el servidor backend

## 📊 Estructura de Peticiones

### Request de Login
```javascript
// Frontend
const response = await axiosInstance.post('/auth/login', {
  registro: '12345678',
  password: 'password123'
});

// Backend endpoint
POST /api/auth/login
Response:
{
  "token": "eyJhbGc...",
  "user": {
    "id": 1,
    "registro": "12345678",
    "nombres": "Juan",
    "apellidos": "Pérez",
    "email": "juan@example.com"
  }
}
```

### Request Autenticada (con token)
```javascript
// Frontend - El interceptor agrega esto automáticamente
GET /api/publicaciones
Headers:
{
  "Authorization": "Bearer eyJhbGc..."
}

// Backend valida el token con middleware authenticate
```

## 🔄 Flujo de Autenticación

```
1. Usuario hace login
   ↓
2. Backend devuelve token JWT
   ↓
3. Frontend guarda token en localStorage
   ↓
4. Interceptor agrega token a TODAS las solicitudes
   ↓
5. Backend valida token en middleware `authenticate`
   ↓
6. Si token es inválido (401):
   - Limpiar localStorage
   - Redirigir a login
```

## 🛠️ Variables de Entorno Necesarias

**Backend (.env en raíz):**
```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_contraseña_mysql
DB_NAME=universidad_app
JWT_SECRET=tu_secreto_muy_seguro_aqui
CORS_ORIGIN=http://localhost:5173
```

**Frontend (.env en frontend/):**
```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_USE_MOCK=false
VITE_APP_NAME=Universidad App
VITE_ENABLE_DEBUG=true
```

## ✅ Verificación Final

- [ ] Backend corriendo en puerto 3000
- [ ] Frontend corriendo en puerto 5173
- [ ] Usuario registrado exitosamente
- [ ] Token guardado en localStorage
- [ ] Publicaciones creadas y visibles
- [ ] Comentarios funcionan
- [ ] Cursos aprobados se guardan
- [ ] Perfil se actualiza correctamente
- [ ] Logout y login funcionan

## 📝 Notas Importantes

1. **axios está instalado:** ✅ Verificado en package.json
2. **Tokens JWT:** Se guardan en localStorage con clave `universidad_app_token`
3. **Interceptor de errores:** Maneja automáticamente tokens expirados
4. **CORS:** Está habilitado en el backend para localhost:5173
5. **Base de datos:** Debe estar activa en MySQL

## 🚨 Si algo no funciona:

1. Abre DevTools (F12)
2. Ve a la pestaña "Network"
3. Realiza una acción (login, publicar, etc.)
4. Observa la solicitud HTTP:
   - Status: ¿200, 401, 404, 500?
   - Headers: ¿Incluye Authorization?
   - Response: ¿Cuál es el mensaje de error?

5. Copia los detalles y revisa aquí:
   - Backend logs en la terminal
   - Browser console para errores de JavaScript
   - Network tab para detalles HTTP
