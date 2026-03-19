# Universidad App (Backend)

API REST desarrollada en Node.js para una plataforma de registro y calificación de catedráticos, cursos y publicaciones.

---

## 📦 Requisitos

- Node.js 18+ (recomendado)
- MySQL (servidor local o remoto)
- (Opcional) Postman / Insomnia para consumir la API

---

## 🛠️ Instalación y configuración

### 1) Clonar el repositorio

```bash
git clone https://github.com/JimH0202/Pr-cticas-Iniciales.git
cd "INFORME 4/Universidad-app"
```

### 2) Instalar dependencias

```bash
npm install
```

### 3) Crear y configurar la base de datos

#### 3.1) Instalar MySQL (si no lo tienes)

- **Windows:** descarga e instala MySQL Community Server desde https://dev.mysql.com/downloads/mysql/
- **Linux (Debian/Ubuntu):**

```bash
sudo apt update
sudo apt install mysql-server
```

#### 3.2) Crear la base de datos y tablas (script incluido)

Ejecuta el script SQL que crea la base de datos y las tablas necesarias:

```bash
mysql -u <usuario> -p < sql/esquema.sql
```

> El archivo `sql/esquema.sql` crea la base de datos `universidad_app` y todos los objetos (tablas, llaves, datos de ejemplo).

#### 3.3) (Opcional) Consultas y vistas ya definidas

También puedes ejecutar los scripts de ejemplo:

```bash
mysql -u <usuario> -p < sql/procedimientos.sql
mysql -u <usuario> -p < sql/vistas.sql
```

### 4) Configurar variables de entorno

Copia el archivo de ejemplo `.env.example` a `.env` y edítalo con tus credenciales MySQL.

```bash
cp .env.example .env
```

Editar `.env` con tus datos:

```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_contraseña
DB_NAME=universidad_app
JWT_SECRET=un_secreto_seguro
JWT_EXPIRES_IN=1d
CORS_ORIGIN=http://localhost:4200
```

---

## 🗄️ Base de datos

### Estructura de tablas (resumen)

**usuarios**
- `id` (PK)
- `registro` (UNIQUE)
- `nombres`, `apellidos`, `email`, `password_hash`

**profesores**
- `id` (PK)
- `nombres`, `apellidos`, `departamento`

**cursos**
- `id` (PK)
- `nombre`, `codigo` (UNIQUE), `creditos`
- `profesor_id` (FK a `profesores`)

**publicaciones**
- `id` (PK)
- `usuario_id` (FK a `usuarios`)
- `curso_id` (FK a `cursos`, opcional)
- `profesor_id` (FK a `profesores`, opcional)
- `mensaje`, `created_at`

**comentarios**
- `id` (PK)
- `publicacion_id` (FK a `publicaciones`)
- `usuario_id` (FK a `usuarios`)
- `mensaje`, `created_at`

**cursos_aprobados**
- `id` (PK)
- `usuario_id` (FK a `usuarios`)
- `curso_id` (FK a `cursos`)
- `created_at`
- `UNIQUE(usuario_id, curso_id)`

---

## 🔍 Consultas (mínimo)

### 1) Listar usuarios

```sql
SELECT id, registro, nombres, apellidos, email, created_at
FROM usuarios
ORDER BY created_at DESC
LIMIT 20;
```

### 2) Listar publicaciones con datos relacionados (usuario/curso/catedrático)

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

### 3) Total de créditos aprobados por usuario

```sql
SELECT u.registro,
       u.nombres,
       u.apellidos,
       SUM(c.creditos) AS creditos_aprobados
FROM cursos_aprobados a
JOIN usuarios u ON a.usuario_id = u.id
JOIN cursos c ON a.curso_id = c.id
WHERE u.registro = '20220001'
GROUP BY u.id;
```

### 4) Insertar un nuevo curso (ejemplo)

```sql
INSERT INTO cursos (nombre, codigo, creditos, profesor_id)
VALUES ('Inteligencia Artificial', 'IC-303', 4, 1);
```

---

## 🔌 Conexión con el servidor (Backend)

El backend se conecta a MySQL mediante un pool de conexiones en `src/config/db.js`.

```js
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: 10,
  timezone: 'Z',
});
```

> La configuración se carga desde `.env` usando `dotenv`.

---

## 🚀 Servidor – Backend (Node.js)

### Estructura principal

- `server.js` - punto de entrada del servidor.
- `src/app.js` - configuración de Express, middlewares y rutas.
- `src/routes/` - definiciones de rutas por módulo.
- `src/controllers/` - lógica que responde a cada endpoint.
- `src/services/` + `src/repositories/` - lógica de negocio y acceso a datos.

### Ejecutar el servidor

```bash
npm run dev
```

La API quedará disponible en: **http://localhost:3000**

---

## 🧩 Servicios REST API (endpoints)

### Autenticación

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/auth/register` | Registrar un nuevo usuario |
| POST | `/api/auth/login` | Iniciar sesión y obtener token JWT |
| POST | `/api/auth/forgot-password` | Reiniciar contraseña |

### Usuarios

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/usuarios/:registro` | Ver perfil del usuario (token requerido) |
| PUT | `/api/usuarios` | Actualizar perfil propio (token requerido) |
| GET | `/api/usuarios/:userId/cursos-aprobados` | Ver cursos aprobados (token requerido) |
| POST | `/api/usuarios/:userId/cursos-aprobados` | Agregar curso aprobado (token + mismo usuario) |

### Publicaciones

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/publicaciones` | Listar publicaciones (filtrable por curso/catedrático) |
| GET | `/api/publicaciones/:id` | Obtener publicación con comentarios |
| POST | `/api/publicaciones` | Crear publicación (token requerido) |

### Comentarios

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/comentarios/:publicacionId` | Listar comentarios de una publicación |
| POST | `/api/comentarios/:publicacionId` | Agregar comentario (token requerido) |

### Cursos

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/cursos` | Listar cursos |
| GET | `/api/cursos/:id` | Obtener detalles de un curso |
| POST | `/api/cursos` | Crear curso (token requerido) |

---

## 🧪 Evidencia de respuesta / consumo de servicio

### 1) Probar que el servidor responde

```bash
curl http://localhost:3000/
```

Respuesta esperada (JSON):

```json
{
  "message": "Universidad App API",
  "uptime": 12.345
}
```

### 2) Registro / Login (auth)

#### Registro

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "registro": "20220002",
    "nombres": "Test",
    "apellidos": "Usuario",
    "email": "test@ejemplo.com",
    "password": "123456"
  }'
```

#### Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@ejemplo.com",
    "password": "123456"
  }'
```

Respuesta esperada (JSON):

```json
{
  "token": "<JWT_TOKEN>",
  "user": {
    "id": 2,
    "registro": "20220002",
    "nombres": "Test",
    "apellidos": "Usuario",
    "email": "test@ejemplo.com"
  }
}
```

> Guardar `token` para consultar endpoints protegidos.

### 3) Consumir endpoint protegido (ej. listar cursos)

```bash
curl http://localhost:3000/api/cursos \
  -H "Authorization: Bearer <JWT_TOKEN>"
```

Ejemplo de respuesta:

```json
[
  {
    "id": 1,
    "nombre": "Programación I",
    "codigo": "IC-101",
    "creditos": 4,
    "profesor_id": 1
  },
  {
    "id": 2,
    "nombre": "Bases de Datos",
    "codigo": "IC-202",
    "creditos": 4,
    "profesor_id": 2
  }
]
```

---

## 📌 Notas finales

- Si cambias de entorno (por ejemplo `DB_HOST` o `DB_NAME`), asegúrate de volver a ejecutar `sql/esquema.sql` para crear las tablas.
- El backend usa JWT para autenticación; el token expira según `JWT_EXPIRES_IN` en `.env`.
- Si necesitas otro frontend, puedes consumir esta API desde cualquier cliente HTTP (Angular, React, Postman, etc.).
