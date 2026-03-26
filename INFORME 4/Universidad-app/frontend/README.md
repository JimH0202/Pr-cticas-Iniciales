# Frontend - Universidad App

## Setup

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar variables de entorno
Copiar `.env.example` a `.env`:
```bash
cp .env.example .env
```

Editar `.env` según tu entorno:
```env
# Para desarrollo con mock data
VITE_API_BASE_URL=http://localhost:3000/api
VITE_USE_MOCK=true
VITE_ENABLE_DEBUG=true

# Para producción con API real
# VITE_API_BASE_URL=https://api.tudominio.com
# VITE_USE_MOCK=false
# VITE_ENABLE_DEBUG=false
```

### 3. Ejecutar en desarrollo
```bash
npm run dev
```
La aplicación estará disponible en `http://localhost:5173`

### 4. Compilar para producción
```bash
npm run build
```
Genera la carpeta `dist/` lista para deployment.

### 5. Preview de la build de producción
```bash
npm run serve
```

---

## Estructura de Configuración

### Variables de Entorno (`.env`)
Todas las variables se cargan desde `import.meta.env`:

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | URL base de la API | `http://localhost:3000/api` |
| `VITE_USE_MOCK` | Usar datos mock | `true` o `false` |
| `VITE_APP_NAME` | Nombre de la app | `Universidad App` |
| `VITE_ENABLE_DEBUG` | Modo debug | `true` o `false` |
| `VITE_ENABLE_ANALYTICS` | Analytics enablement | `true` o `false` |

### Archivo de Configuración (`/src/config/config.js`)
Centraliza toda la configuración de la aplicación:

```javascript
import config from '../config/config';

// Usar configuración
console.log(config.api.baseURL);
console.log(config.endpoints.auth.login);
console.log(config.storage.token);
```

---

## Características

### ✅ Autenticación
- Registro de usuarios
- Login con persistencia en localStorage
- Logout
- Protección de rutas (requiere token)

### ✅ Perfiles de Usuario
- Ver perfil propio y de otros usuarios
- Editar datos personales (solo perfil propio)
- Ver cursos aprobados
- Gestionar cursos aprobados (solo perfil propio)

### ✅ Publicaciones
- Crear publicaciones (con curso/profesor)
- Ver feed con filtros
- Editar publicaciones (solo propias)
- Eliminar publicaciones (solo propias)
- Sistema de comentarios

### ✅ Cursos Aprobados
- Ver créditos totales aprobados
- Agregar cursos (seleccionar curso + profesor personalizado)
- Remover cursos
- Vista en pestañas (publicaciones vs cursos)

### ✅ Filtros Funcionales
- Filtrar publicaciones por curso
- Filtrar publicaciones por profesor
- Buscar usuarios por número de registro
- Dropdown con auto-relleno de datos

---

## Deploy

### Vercel / Netlify
1. Conectar el repositorio
2. Establecer variables de entorno en el panel
3. Comando build: `npm run build`
4. Output directory: `dist`

### Docker
```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=0 /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

## Troubleshooting

### Variables de entorno no se cargan
- Reinicia el servidor de desarrollo (`npm run dev`)
- Verifica que las variables comienzan con `VITE_`

### Error: "Cannot find module"
```bash
rm -rf node_modules
npm install
```

### Build fails
```bash
npm run build -- --debug
```

---

## Stack Tecnológico

- **React**: 18.3.1 - UI Framework
- **Vite**: 5.4.0 - Build tool (más rápido que CRA)
- **Axios**: 1.6.0 - HTTP client (comentados, listos para API real)
- **CSS Vanilla**: Estilos sin dependencias externas
- **localStorage**: Persistencia de datos en cliente

---

## Próximas Mejoras

- [ ] Integración con API real (desactivar mock)
- [ ] Autenticación con JWT real
- [ ] Tests unitarios e integración
- [ ] TypeScript para type safety
- [ ] Component library (Ant Design, Material UI, etc.)
- [ ] State management (Redux, Zustand, Context API avanzado)
- [ ] PWA features (offline support, install app)
