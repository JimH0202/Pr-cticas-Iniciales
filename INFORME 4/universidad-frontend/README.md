# Universidad Frontend (Angular)

Este es el frontend desarrollado en Angular para consumir la API REST del backend.

## Requisitos

- Node.js 18+
- Angular CLI

## Instalación

1. Instalar dependencias:

```bash
npm install
```

2. Ejecutar el servidor de desarrollo:

```bash
ng serve
```

La aplicación quedará disponible en http://localhost:4200

## Funcionalidades implementadas

- Registro de usuarios
- Inicio de sesión con JWT
- Pantalla principal con publicaciones (filtrables)
- Crear publicaciones sobre cursos o catedráticos
- Ver perfil de usuarios (propio y de otros)
- Agregar cursos aprobados (solo en perfil propio)
- Navegación protegida con AuthGuard

## Notas

- Asegúrate de que el backend esté corriendo en http://localhost:3000
- Las credenciales se almacenan en localStorage
- Para profesores, se hardcodean algunos datos (agregar endpoint al backend si es necesario)