# Manual Técnico — Backend (Node.js)

---

## 1. Instalación y configuración

### 1.1 Requisitos previos
- Node.js (>= 18 recomendado)
- npm (incluido con Node.js)
- MySQL (o MariaDB) funcionando localmente

### 1.2 Instalación de dependencias
Desde la carpeta `Universidad-app` ejecutar:

```bash
npm install
```

### 1.3 Configuración de variables de entorno
Copiar el archivo de ejemplo `.env.example` a `.env` y ajustar según tu entorno:

```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=universidad_app

JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=1d

# Opcional: habilitar CORS para frontend local
CORS_ORIGIN=http://localhost:4200
```

> 🔧 **Importante:** Si tu base de datos requiere contraseña, completa `DB_PASSWORD`. Si usas un usuario distinto a `root`, actualiza `DB_USER`.

### 1.4 Creación de la base de datos y tablas (esquema)
El esquema SQL está en `sql/esquema.sql`. Para crear la base de datos y las tablas, ejecuta:

```bash
mysql -u <usuario> -p < sql/esquema.sql
```

Esto crea las tablas principales y una fila de ejemplo que permite iniciar sesión.

---

## 2. Estructura de la base de datos

### 2.1 Tablas principales

| Tabla | Descripción |
|------|-------------|
| `usuarios` | Usuarios registrados con contraseña hasheada.
| `profesores` | Profesores/Catedráticos.
| `cursos` | Cursos ofertados, con vinculación opcional al profesor.
| `publicaciones` | Publicaciones de usuarios sobre cursos o profesores.
| `comentarios` | Comentarios en publicaciones.
| `cursos_aprobados` | Relación usuarios ↔ cursos aprobados.

### 2.2 Estructura (columnas relevantes)

- **usuarios**: `id`, `registro`, `nombres`, `apellidos`, `email`, `password_hash`, `created_at`
- **cursos**: `id`, `nombre`, `codigo`, `creditos`, `profesor_id`
- **profesores**: `id`, `nombres`, `apellidos`, `departamento`
- **publicaciones**: `id`, `usuario_id`, `curso_id`, `profesor_id`, `mensaje`, `created_at`
- **comentarios**: `id`, `publicacion_id`, `usuario_id`, `mensaje`, `created_at`
- **cursos_aprobados**: `id`, `usuario_id`, `curso_id`, `created_at`

---

## 3. Consultas SQL (mínimo 3)

Las siguientes consultas están en `sql/procedimientos.sql`.

### 3.1 Publicaciones recientes con datos completos

```sql
SELECT
  p.id,
  p.mensaje,
  p.created_at,
  u.registro AS usuario_registro,
  u.nombres AS usuario_nombres,
  u.apellidos AS usuario_apellidos,
  c.nombre AS curso_nombre,
  prof.nombres AS profesor_nombres,
  prof.apellidos AS profesor_apellidos
FROM publicaciones p
JOIN usuarios u ON p.usuario_id = u.id
LEFT JOIN cursos c ON p.curso_id = c.id
LEFT JOIN profesores prof ON p.profesor_id = prof.id
ORDER BY p.created_at DESC
LIMIT 20;
```

### 3.2 Buscar publicaciones por curso o profesor

```sql
SELECT p.*
FROM publicaciones p
LEFT JOIN cursos c ON p.curso_id = c.id
LEFT JOIN profesores prof ON p.profesor_id = prof.id
WHERE c.nombre LIKE '%Bases%'
   OR prof.apellidos LIKE '%Pérez%';
```

### 3.3 Total de créditos aprobados por usuario

```sql
SELECT u.registro, u.nombres, u.apellidos, SUM(c.creditos) AS creditos_aprobados
FROM cursos_aprobados a
JOIN usuarios u ON a.usuario_id = u.id
JOIN cursos c ON a.curso_id = c.id
WHERE u.registro = '20220001'
GROUP BY u.id, u.registro, u.nombres, u.apellidos;
```

---

## 4. Conexión con el servidor (backend)

### 4.1 Configuración de la conexión
La conexión a MySQL se realiza con `mysql2/promise` en:
- `src/config/db.js`

Ejemplo de configuración:

```js
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'universidad_app',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  timezone: 'Z',
});
```

### 4.2 Probar la conexión
Inicia el servidor y realiza una petición a cualquier endpoint protegido (por ejemplo `/api/usuarios/20220001`). Si la base de datos no está accesible, el servidor devolverá un error de conexión.

---

## 5. Creación del servidor en Node.js

### 5.1 Archivo principal: `server.js`

- Carga variables de entorno con `dotenv`.
- Importa la aplicación Express desde `src/app.js`.
- Inicia el servidor en `process.env.PORT || 3000`.

### 5.2 Configuración de Express (`src/app.js`)

- Se usa `express.json()` para parsear JSON.
- Se habilita CORS con origen configurable via `CORS_ORIGIN`.
- Se registran rutas bajo `/api/*`.
- Existe un middleware global de manejo de errores.

---

## 6. Servicios REST API

### 6.1 Autenticación
#### POST `/api/auth/register`
- **Descripción**: crea un nuevo usuario.
- **Request body**:
  ```json
  {
    "registro": "20220001",
    "nombres": "Usuario",
    "apellidos": "Ejemplo",
    "email": "usuario@ejemplo.com",
    "password": "admin123"
  }
  ```
- **Respuesta**: 201
  ```json
  {
    "user": { "id": 1, "registro": "20220001", "nombres": "Usuario", "apellidos": "Ejemplo", "email": "usuario@ejemplo.com", "created_at": "..." }
  }
  ```

#### POST `/api/auth/login`
- **Descripción**: autentica y devuelve token JWT.
- **Request body**:
  ```json
  { "registro": "20220001", "password": "admin123" }
  ```
- **Respuesta**: 200
  ```json
  {
    "token": "<jwt_token>",
    "user": { "id": 1, "registro": "20220001", "nombres": "Usuario", "apellidos": "Ejemplo", "email": "usuario@ejemplo.com" }
  }
  ```

#### POST `/api/auth/forgot-password`
- **Descripción**: actualiza contraseña si coincide `registro` + `email`.
- **Request body**:
  ```json
  { "registro": "20220001", "email": "usuario@ejemplo.com", "newPassword": "nueva123" }
  ```
- **Respuesta**:
  ```json
  { "message": "Contraseña actualizada correctamente" }
  ```

### 6.2 Usuarios (requiere token Bearer)
Todos los endpoints de `/api/usuarios` requieren el header:

```
Authorization: Bearer <token>
```

#### GET `/api/usuarios/:registro`
- Obtiene perfil de usuario por registro.
- Respuesta:
  ```json
  { "usuario": { "id": 1, "registro": "20220001", "nombres": "Usuario", "apellidos": "Ejemplo", "email": "usuario@ejemplo.com", "created_at": "..." } }
  ```

#### PUT `/api/usuarios`
- Actualiza los datos del usuario autenticado.
- Body opcional: `nombres`, `apellidos`, `email`, `password`.

#### GET `/api/usuarios/:userId/cursos-aprobados`
- Lista los cursos aprobados del usuario.

#### POST `/api/usuarios/:userId/cursos-aprobados`
- Agrega un curso aprobado (solo el usuario autenticado puede hacerlo).
- Body: `{ "cursoId": 1 }`

### 6.3 Cursos (requiere token Bearer)
#### GET `/api/cursos`
- Lista cursos, puede filtrarse por `nombre` y `profesorId`.
- Ejemplo:
  - `/api/cursos?nombre=Programaci%C3%B3n`

#### GET `/api/cursos/:id`
- Obtiene un curso por su ID.

#### POST `/api/cursos`
- Crea un curso:
  ```json
  { "nombre":"Nueva Materia", "codigo":"IC-999", "creditos":4, "profesorId": 1 }
  ```

### 6.4 Profesores
#### GET `/api/profesores`
- Lista profesores (opcional `nombre` para filtrar).

### 6.5 Publicaciones (requiere token Bearer)
#### GET `/api/publicaciones`
- Lista publicaciones. Filtros disponibles:
  - `cursoId`, `profesorId`, `cursoNombre`, `profesorNombre`

#### GET `/api/publicaciones/:id`
- Obtiene una publicación y sus comentarios.

#### POST `/api/publicaciones`
- Crea una nueva publicación.
- Body:
  ```json
  { "mensaje": "Mi opinión...", "cursoId": 1 }
  ```
  o
  ```json
  { "mensaje": "Mi opinión...", "profesorId": 1 }
  ```

---

## 7. Evidencia de respuesta / consumo de servicio

A continuación se muestran ejemplos de consumo usando `curl` (o Postman) y los resultados esperados.

### 7.1 Ejemplo: Login (obtener token)

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"registro":"20220001","password":"admin123"}'
```

**Respuesta esperada** (ejemplo):

```json
{
  "token": "eyJhbGciOiJI...",
  "user": {
    "id": 1,
    "registro": "20220001",
    "nombres": "Usuario",
    "apellidos": "Ejemplo",
    "email": "usuario@ejemplo.com"
  }
}
```

### 7.2 Ejemplo: Obtener perfil con token

```bash
curl -H "Authorization: Bearer <token>" http://localhost:3000/api/usuarios/20220001
```

### 7.3 Ejemplo: Crear publicación

```bash
curl -X POST http://localhost:3000/api/publicaciones \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"mensaje":"Mi publicación","cursoId":1}'
```

---

## 8. Evidencia de creación y arranque del servidor Node.js

- El servidor se inicia con:
  ```bash
  npm start
  ```
- El archivo principal es `server.js` y ejecuta:
  - `dotenv.config()`
  - `app.listen(PORT, ...)`

- La API básica de prueba existe en `/` que devuelve:
  ```json
  { "message": "Universidad App API", "uptime": 123.45 }
  ```

---

## 9. Notas adicionales

- Si al ejecutar la app obtienes el error `Access denied for user 'root'@'localhost'`, debes ajustar los valores `DB_USER` y `DB_PASSWORD` en `.env` con un usuario válido de MySQL.
- Para resetear la base de datos puedes volver a ejecutar `sql/esquema.sql`.

---
