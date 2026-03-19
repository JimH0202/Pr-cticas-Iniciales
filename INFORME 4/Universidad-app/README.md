# Universidad App (Backend)

Esta es la API REST desarrollada en Node.js para la aplicación de registro y calificación de catedráticos y cursos.

## Requisitos

- Node.js 18+ (recomendado)
- MySQL

## Instalación

1. Clonar o copiar el proyecto en tu máquina.
2. Instalar dependencias:

```bash
npm install
```

3. Crear la base de datos y las tablas ejecutando el script ubicado en `sql/esquema.sql`.

4. Copiar el archivo de ejemplo de variables de entorno:

```bash
cp .env.example .env
```

5. Editar `.env` con los datos de tu servidor MySQL.

## Ejecutar

```bash
npm run dev
```

La API quedará disponible en http://localhost:3000

## Endpoints principales

### Autenticación

- `POST /api/auth/register` - Registro de usuario.
- `POST /api/auth/login` - Inicio de sesión.
- `POST /api/auth/forgot-password` - Reiniciar contraseña.

### Usuarios

- `GET /api/usuarios/:registro` - Ver perfil de un usuario (requiere token).
- `PUT /api/usuarios` - Actualizar perfil propio (requiere token).
- `GET /api/usuarios/:userId/cursos-aprobados` - Ver cursos aprobados (requiere token).
- `POST /api/usuarios/:userId/cursos-aprobados` - Agregar curso aprobado (requiere token y ser el mismo usuario).

### Publicaciones

- `GET /api/publicaciones` - Listar publicaciones (filtrables por curso y catedrático).
- `GET /api/publicaciones/:id` - Obtener publicación con comentarios.
- `POST /api/publicaciones` - Crear publicación (requiere token).

### Comentarios

- `GET /api/comentarios/:publicacionId` - Listar comentarios de una publicación.
- `POST /api/comentarios/:publicacionId` - Agregar comentario a una publicación (requiere token).

### Cursos

- `GET /api/cursos` - Listar cursos.
- `GET /api/cursos/:id` - Obtener detalles de un curso.
- `POST /api/cursos` - Crear curso (requiere token).

## Nota

Esta API está diseñada para ser consumida desde un frontend (React o Angular) y cumple con los requisitos de usuario, publicaciones, comentarios y filtro por curso/catedrático.
