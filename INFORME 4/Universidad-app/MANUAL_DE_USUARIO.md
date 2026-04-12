# 📚 MANUAL DE USUARIO - UNIVERSIDAD APP

## Tabla de Contenidos
1. [Introducción](#introducción)
2. [Requisitos del Sistema](#requisitos-del-sistema)
3. [Instalación y Configuración](#instalación-y-configuración)
4. [Guía de Inicio](#guía-de-inicio)
5. [Funcionalidades Principales](#funcionalidades-principales)
6. [Gestión de Cuenta](#gestión-de-cuenta)
7. [Publicaciones y Comentarios](#publicaciones-y-comentarios)
8. [Perfil de Usuario](#perfil-de-usuario)
9. [Solución de Problemas](#solución-de-problemas)
10. [Preguntas Frecuentes](#preguntas-frecuentes)

---

## Introducción

**Universidad App** es una plataforma digital diseñada para facilitar la comunicación y colaboración entre estudiantes y profesores. La aplicación permite:

- 🔐 Autenticación segura mediante cuenta de usuario
- 📝 Crear, leer y comentar publicaciones
- 👤 Gestionar tu perfil personal
- 📊 Visualizar información de cursos y profesores
- 💬 Interactuar con otros usuarios de la plataforma

**Versión:** 1.0.0  
**Última actualización:** Marzo 2026  
**Desarrollado con:** React 18.3 (Frontend) + Express.js + MySQL (Backend)

---

## Requisitos del Sistema

### Requisitos Mínimos

| Requisito | Versión Mínima |
|-----------|-----------------|
| **Navegador Web** | Chrome 90+, Firefox 88+, Safari 14+, Edge 90+ |
| **Conexión a Internet** | Banda ancha (mínimo 2 Mbps) |
| **RAM** | 4 GB |
| **Almacenamiento** | 100 MB disponibles |
| **Sistema Operativo** | Windows 7+, macOS 10.12+, Linux (cualquier distribución modernamoderna) |

### Navegadores Soportados

✅ Google Chrome (recomendado)  
✅ Mozilla Firefox  
✅ Microsoft Edge  
✅ Safari  
⚠️ Internet Explorer: No soportado

---

## Instalación y Configuración

### Opción 1: Acceso en Línea

Si la aplicación está alojada en un servidor en la nube:

1. Abre tu navegador web favorito
2. Ingresa la URL proporcionada por tu administrador
3. La aplicación se cargará automáticamente

### Opción 2: Instalación Local (Para Desarrolladores)

#### Paso 1: Clonar el Repositorio

```bash
git clone [URL-del-repositorio]
cd Universidad-app
```

#### Paso 2: Instalar Dependencias del Backend

```bash
npm install
```

#### Paso 3: Instalar Dependencias del Frontend

```bash
cd frontend
npm install
cd ..
```

#### Paso 4: Configurar la Base de Datos

1. Asegúrate de tener **MySQL 5.7+** instalado
2. Crea una base de datos:
   ```sql
   mysql -u root -p < setup.sql
   ```
3. Configura el archivo `.env` en la raíz del proyecto:
   ```
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=tu_contraseña
   DB_NAME=universidad_app
   PORT=3001
   JWT_SECRET=tu_clave_secreta_muy_segura
   ```

#### Paso 5: Iniciar la Aplicación

**Backend:**
```bash
npm run dev
```
El servidor estará disponible en: `http://localhost:3001`

**Frontend (en otra terminal):**
```bash
cd frontend
npm run dev
```
La aplicación estará disponible en: `http://localhost:5173`

---

## Guía de Inicio

### Tu Primer Acceso

#### 1. Acceder a la Página de Login

Cuando abres la aplicación por primera vez, verás la pantalla de **Iniciar Sesión**.

```
┌─────────────────────────────┐
│    INICIAR SESIÓN          │
├─────────────────────────────┤
│ Registro / Email:  [______] │
│ Contraseña:        [______] │
│ [Iniciar sesión]            │
│ ¿No tienes cuenta? Crear    │
│ ¿Olvidaste tu contraseña?   │
└─────────────────────────────┘
```

#### 2. Crear una Nueva Cuenta (Si no tienes)

Si es tu primer acceso:

1. Haz clic en **"Crear una cuenta"**
2. Completa el formulario de registro:
   - **Registro académico:** Tu código de estudiante (ej: 20201234)
   - **Email:** Tu correo institucional o personal
   - **Nombre:** Tu primer nombre
   - **Apellido:** Tu apellido
   - **Contraseña:** Mínimo 6 caracteres, recomendamos usar mayúsculas, números y caracteres especiales

3. Haz clic en **"Registrarse"**
4. Recibirás un mensaje de confirmación
5. Ya podrás iniciar sesión con tus credenciales

#### 3. Iniciar Sesión

1. Ingresa tu **Registro académico** o **Email**
2. Escribe tu **Contraseña**
3. Haz clic en **"Iniciar sesión"**
4. Serás redirigido a la **Página Principal**

---

## Funcionalidades Principales

### 🏠 Página Principal (Home)

Después de iniciar sesión, verás la página principal con:

#### Barra de Navegación Superior

```
┌────────────────────────────────────────────────┐
│ UNIVERSIDAD APP    [🔍 Buscar]  [👤] [🚪 Salir]│
└────────────────────────────────────────────────┘
```

**Opciones disponibles:**
- **Logo:** Regresa a la página principal
- **Burbuja de búsqueda:** Busca usuarios por registro
- **Icono de perfil:** Accede a tu perfil personal
- **Salir:** Cierra sesión

#### Sección de Publicaciones

La página principal muestra todas las publicaciones de la comunidad universitaria:

**Componentes de una publicación:**
```
┌─────────────────────────────────────────┐
│ Autor: Juan Pérez (20201234)            │
│ Fecha: 25 de marzo de 2026, 10:30 AM   │
├─────────────────────────────────────────┤
│                                         │
│ "El contenido de mi publicación aquí"  │
│                                         │
├─────────────────────────────────────────┤
│ [💬 Comentarios] [❤️ Me gusta]          │
└─────────────────────────────────────────┘
```

**Acciones en publicaciones:**
- **Ver comentarios:** Haz clic en el icono de comentarios
- **Dejar un comentario:** Escribe en el campo de texto
- **Dar like:** Haz clic en el corazón (opcional)

### ➕ Crear una Publicación

Para compartir contenido con la comunidad:

1. Busca el botón **"+ Nueva publicación"** en la página principal
2. Se abrirá un formulario con campos:
   - **Título:** Asunto principal (máximo 100 caracteres)
   - **Contenido:** Descripción detallada (máximo 5000 caracteres)
   - **Categoría:** Selecciona el tema (opcional)

3. Haz clic en **"Publicar"**
4. Tu publicación aparecerá en la parte superior del feed

**Consejos para buenas publicaciones:**
- ✅ Sé claro y conciso
- ✅ Usa títulos descriptivos
- ✅ Revisa la ortografía antes de publicar
- ❌ No publiques contenido ofensivo o inapropiado
- ❌ No compartas información personal de terceros

### 💬 Comentarios y Interacciones

#### Comentar en una Publicación

1. Desplázate hasta la publicación que deseas comentar
2. Haz clic en **"Comentarios"** (parte inferior)
3. Se expandirá una sección con los comentarios existentes
4. En el campo de texto, escribe tu comentario
5. Presiona **"Enviar"** o **Enter**

```
Comentarios (3)
├─ Usuario1: "Excelente aporte"
├─ Usuario2: "Gracias por compartir"
└─ [Tu comentario:] [Enviar]
```

#### Responder a Comentarios

Próximamente se agregará la funcionalidad de responder directamente a comentarios específicos.

#### Editar o Eliminar Publicaciones/Comentarios

Si eres el autor:
1. Haz clic en el menú **"⋯"** (tres puntos) en tu publicación/comentario
2. Selecciona **"Editar"** o **"Eliminar"**
3. Confirma la acción

---

## Gestión de Cuenta

### Cambiar Contraseña

#### Si recuerdas tu contraseña actual:

1. Ve a **Perfil** (icono 👤)
2. Selecciona **"Seguridad"** o **"Cambiar contraseña"**
3. Ingresa:
   - **Contraseña actual:** Tu contraseña actual
   - **Nueva contraseña:** La nueva contraseña deseada
   - **Confirmar contraseña:** Repite la nueva contraseña
4. Haz clic en **"Actualizar contraseña"**

#### Si olvidaste tu contraseña:

1. En la página de login, haz clic en **"¿Olvidaste tu contraseña?"**
2. Ingresa tu **Email** registrado
3. Recibirás un correo con instrucciones para restaurar tu contraseña
4. Sigue el enlace en el correo (válido por 24 horas)
5. Crea una nueva contraseña
6. Ya puedes iniciar sesión con tu nueva contraseña

### Editar Información de Perfil

1. Haz clic en el icono de **perfil** (👤)
2. Selecciona **"Mi perfil"** o **"Editar perfil"**
3. Modifica los campos deseados:
   - Nombre
   - Apellido
   - Email
   - Foto de perfil (opcional)
   - Biografía personal (opcional)
4. Haz clic en **"Guardar cambios"**

**Nota:** Algunos campos como el Registro académico no pueden ser modificados por razones de seguridad.

### Actualizar Foto de Perfil

1. Ve a tu **Perfil**
2. Haz clic en tu foto actual o en **"Cambiar foto"**
3. Selecciona una imagen de tu computadora:
   - Formatos soportados: JPG, PNG, GIF
   - Tamaño máximo: 5 MB
   - Tamaño recomendado: 400x400 píxeles
4. Confirma la carga

### Cerrar Sesión

Para salir de tu cuenta:

1. Haz clic en el icono de **perfil** (👤)
2. Selecciona **"Cerrar sesión"** o **"Salir"**
3. Confirma la acción
4. Serás redirigido a la página de login

**Importante:** Al cerrar sesión en una computadora compartida, tu sesión se cerrará completamente. Ninguna otra persona podrá acceder a tu cuenta.

---

## Publicaciones y Comentarios

### Tipos de Publicaciones

#### 📌 Publicación Estándar
Contenido general compartido por cualquier usuario de la plataforma.

#### 🎓 Anuncio Académico
Publicaciones de profesores con información sobre cursos o tareas.

#### 📢 Anuncio del Sistema
Notificaciones importantes de la administración de Universidad App.

#### 📸 Compartir Recursos
Enlaces a archivos, documentos o recursos educativos.

### Buscar Publicaciones

#### Por contenido:

1. Usa el campo de búsqueda en la barra superior
2. Ingresa palabras clave (título, autor, contenido)
3. Presiona **Enter** o haz clic en **"Buscar"**
4. Los resultados se filtrarán automáticamente

#### Por usuario:

1. Haz clic en el icono de búsqueda (🔍)
2. Ingresa el **Registro académico** del usuario
3. Se mostrará el perfil del usuario
4. Puedes ver todas sus publicaciones

#### Por categoria (próximamente):

Filtrar publicaciones por tema/categoría académica.

### Notificaciones

#### Tipos de notificaciones:

- 💬 Alguien comentó en tu publicación
- ❤️ Alguien le dio like a tu publicación
- 👤 Alguien comenzó a seguirte
- 📬 Nuevo mensaje privado

#### Ver notificaciones:

1. Busca el icono de **campana** (🔔) en la barra superior
2. Se abrirá un panel mostrando tus notificaciones recientes
3. Haz clic en una notificación para ir a esa publicación/usuario

---

## Perfil de Usuario

### Acceder a tu Perfil

1. **Opción 1:** Haz clic en tu **foto de perfil** en la barra superior
2. **Opción 2:** Escribe tu **Registro académico** en la búsqueda
3. **Opción 3:** Ve a **Perfil** desde el menú de navegación

### Elementos de un Perfil

```
┌───────────────────────────────────────┐
│         [Foto de Perfil]              │
│                                       │
│  Juan Pérez García                    │
│  Registro: 20201234                   │
│  Email: juan.perez@universidad.edu    │
│                                       │
│  Biografía: "Estudiante de Ingeniería" │
│                                       │
│  📊 Estadísticas:                     │
│  • Publicaciones: 12                  │
│  • Seguidores: 45                     │
│  • Siguiendo: 32                      │
│                                       │
│  [Editar Perfil] [Seguir/Siguiendo]   │
└───────────────────────────────────────┘
```

### Ver Publicaciones de un Usuario

1. Accede al perfil del usuario deseado
2. Desplázate hacia abajo
3. Verás todas sus publicaciones en orden cronológico
4. Puedes filtrar por fecha o relevancia

### Seguir Usuarios

1. Accede al perfil del usuario
2. Haz clic en el botón **"Seguir"**
3. El botón cambiará a **"Siguiendo"**
4. Verás los posts de usuarios que sigues en tu feed personalizado

---

## Gestión de Cursos y Profesores

### Ver Mis Cursos

1. Ve a la sección **"Mis Cursos"** desde el menú principal
2. Visualizarás una lista con:
   - Nombre del curso
   - Profesor a cargo
   - Horario de clases
   - Número de estudiantes inscritos

### Información del Profesor

Para ver el perfil de un profesor:

1. Haz clic en el nombre del profesor en un anuncio o publicación
2. Se abrirá su perfil con:
   - Información personal
   - Cursos que imparte
   - Horario de atención
   - Publicaciones recientes

### Inscribirse en Cursos

1. Ve a **"Catálogo de Cursos"**
2. Busca el curso deseado
3. Haz clic en **"Inscribirse"**
4. Confirma tu inscripción
5. El curso aparecerá en **"Mis Cursos"**

---

## Solución de Problemas

### No puedo iniciar sesión

**Problema:** Aparece el mensaje "Registro/Email o contraseña incorrectos"

**Soluciones:**
1. Verifica que escribiste correctamente tu Registro académico o Email
2. Asegúrate de que MAYÚSCULAS/minúsculas sean correctas en la contraseña
3. Si olvidaste la contraseña, usa la opción **"¿Olvidaste tu contraseña?"**
4. Limpia el caché del navegador: `Ctrl+Shift+Delete` (Windows) o `Cmd+Shift+Delete` (Mac)
5. Intenta con otro navegador

---

### No recibo el correo de recuperación

**Problema:** No llega el email para cambiar contraseña

**Soluciones:**
1. Espera 5 minutos, puede haber retraso en el envío
2. Revisa la carpeta de **Correo No Deseado/Spam**
3. Asegúrate de haber ingresado el email correctamente
4. Si usas un email corporativo, verifica que no exista filtro de spam
5. Contacta al administrador del sistema

**Prevención:** Actualiza tu email en tu perfil si ha cambiado

---

### La aplicación carga lentamente

**Problema:** Las páginas tardan mucho en cargar o se congela la interfaz

**Soluciones:**
1. Verifica tu conexión a Internet (prueba con `speedtest.net`)
2. Cierra otras pestañas del navegador que usen mucho ancho de banda
3. Limpia el caché del navegador
4. Disminuye la resolución de las imágenes en tu perfil
5. Actualiza tu navegador a la última versión
6. Si uses una conexión VPN, intenta desconectarla temporalmente

---

### No puedo subir mi foto de perfil

**Problema:** La carga de foto falla o no se guarda

**Soluciones:**
1. Verifica el formato: JPG, PNG o GIF
2. Reduce el tamaño: máximo 5 MB
3. Redimensiona la imagen a 400x400 píxeles
4. Asegúrate de tener suficiente espacio en almacenamiento
5. Intenta con otro navegador
6. Si persiste, contacta al soporte técnico

---

### Olvidé mi Registro académico

**Problema:** No recuerdo cuál es mi número de Registro

**Soluciones:**
1. Revisa tu email de bienvenida de la universidad
2. Pregunta en la División de Registro y Control
3. Verifica en el carné o documento de identificación universitaria
4. Contacta a tu director académico o secretaría
5. Usa tu Email si lo tienes registrado en lugar del Registro

---

### Error 500 - Error del servidor

**Problema:** Aparece un mensaje de error en la aplicación

**Soluciones:**
1. Recarga la página: `F5` o `Cmd+R`
2. Cierra completamente el navegador y reabre
3. Intenta acceder más tarde (puede haber mantenimiento)
4. Borra el caché: `Ctrl+Shift+Delete`
5. Contacta al equipo de soporte técnico

---

### Mis publicaciones no aparecen

**Problema:** Publiqué algo pero no la veo en el feed

**Soluciones:**
1. Recarga la página (`F5`)
2. Verifica que la publicación se haya enviado correctamente
3. Si la publicación fue moderada, espera aprobación
4. Busca en tu perfil para confirmar que existe
5. Si desapareció, posiblemente fue eliminada por incumplimiento de normas

---

## Preguntas Frecuentes (FAQ)

### ❓ ¿Dónde puedo reportar contenido inapropiado?

Respuesta: En cada publicación/comentario hay un menú (⋯) con la opción "Reportar". Selecciona el motivo y describe el problema. Nuestro equipo de moderación revisará el reporte.

---

### ❓ ¿Puedo descargar mis datos personales?

Respuesta: Sí, en **Privacidad y Seguridad** → **Descargar mis datos** obtendrás un archivo con toda tu información.

---

### ❓ ¿Cómo elimino permanentemente mi cuenta?

Respuesta: 
1. Ve a **Configuración** → **Privacidad**
2. Haz clic en **"Eliminar cuenta de forma permanente"**
3. Confirma tu contraseña
4. Tu cuenta será eliminada en 30 días (período de gracia)

**Advertencia:** Esta acción no se puede deshacer. Se eliminarán todas tus publicaciones y comentarios.

---

### ❓ ¿Cuántas publicaciones puedo hacer al día?

Respuesta: No hay límite, pero si excedes 50 publicaciones en 24 horas, se activará un sistema anti-spam automático.

---

### ❓ ¿Qué sucede si veo contenido ofensivo?

Respuesta: 
1. **Reporta:** Usa la opción reportar
2. **Bloquea al usuario:** En su perfil, selecciona "Bloquear usuario"
3. **Contacta soporte:** Si es grave, contacta al equipo administrativo

---

### ❓ ¿Cuánto tiempo tardan en aprobar mi cuenta?

Respuesta: La mayoría de cuentas se aprueban automáticamente en segundos. Si hay problemas, recibirás un email en máximo 24 horas.

---

### ❓ ¿Puedo cambiar mi correo electrónico?

Respuesta: Sí, en tu perfil → **Información personal** → **Cambiar email**. Deberás confirmar el nuevo email antes de que sea efectivo.

---

### ❓ ¿Hay una aplicación móvil?

Respuesta: Por ahora, Universidad App es una aplicación web responsive que funciona perfectamente en dispositivos móviles. Una aplicación nativa estará disponible próximamente.

---

### ❓ ¿Qué privacidad tengo en mis publicaciones?

Respuesta: Por defecto, todas tus publicaciones son **públicas** y visibles para todos los usuarios registrados. Próximamente implementaremos niveles de privacidad.

---

### ❓ ¿Puedo ver quién vio mis publicaciones?

Respuesta: Actualmente no, pero puedes ver el número de comentarios y likes que recibiste.

---

### ❓ ¿Cómo recupero una publicación eliminada?

Respuesta: Una vez eliminada, no se puede recuperar. Te recomendamos guardar copia de contenido importante.

---

### ❓ ¿Hay sindicatos o representación de estudiantes aquí?

Respuesta: Puedes buscar a los representantes estudiantiles usando la función de búsqueda. Verifica sus publicaciones "fijadas" para más información.

---

### ❓ ¿Cómo me pongo en contacto con el soporte técnico?

Respuesta: 
- **Email:** soporte@universidad-app.edu
- **WhatsApp:** +34 XXX XXX XXX
- **Teléfono:** +34 XXX XXX XXX
- **Horario:** Lunes a Viernes, 8:00 AM - 5:00 PM

---

### ❓ ¿Existe alguna documentación para desarrolladores?

Respuesta: Sí, la documentación técnica está disponible en:
- [API Documentation](./API_DOCUMENTATION.md)
- [Deployment Guide](./DEPLOYMENT.md)
- [Developer Guide](./DEVELOPMENT.md)

---

## Politica de Privacidad y Conducta

### Términos de Servicio

Al utilizar Universidad App te comprometes a:

✅ **Hacer:**
- Ser respetuoso con otros usuarios
- Usar un lenguaje apropiado
- Reportar contenido inapropiado
- Proteger tus credenciales de acceso
- Actualizar tu información periódicamente

❌ **No Hacer:**
- Compartir contraseñas con terceros
- Publicar contenido ofensivo, sexista o discriminatorio
- Spamear o hacer acoso cibernético
- Publicar información personal ajena sin consentimiento
- Intentar hackear o comprometer la seguridad del sistema
- Usar datos falsos en tu registro
- Hacer múltiples cuentas para evadir restricciones

---

## Consejos de Seguridad

### 🔒 Protege tu Cuenta

1. **Contraseña fuerte:**
   - Mínimo 12 caracteres
   - Mezcla mayúsculas, minúsculas, números y símbolos
   - Cambia cada 3 meses

2. **Autenticación de dos factores:**
   - Habilítalo en Seguridad → 2FA
   - Usa una aplicación como Google Authenticator

3. **No compartas tu sesión:**
   - Nunca uses la aplicación en dispositivos públicos
   - Cierra sesión siempre al terminar

4. **Verifica el correo:**
   - Solo proporciona tu email real
   - Revisa emails de confirmación de seguridad

---

## Actualizaciones y Mejoras

### Versión 1.0.0 (Marzo 2026)

**Características:**
- ✅ Autenticación por email/Registro
- ✅ Publicaciones y comentarios
- ✅ Perfiles de usuario
- ✅ Búsqueda de usuarios
- ✅ Sistema de notificaciones

**Próximas mejoras:**
- 🔄 Mensajes privados
- 🔄 Grupos y comunidades
- 🔄 Eventos académicos
- 🔄 Aplicación móvil nativa
- 🔄 Conferencias en vivo
- 🔄 Recursos compartidos (dropbox integrado)

---

## Contacto y Soporte

### Canales de Soporte

| Medio | Contacto | Horario |
|-------|----------|---------|
| **Email** | soporte@universidad-app.edu | Lunes-Viernes 8AM-5PM |
| **Chat** | En la aplicación | 24/7 (respuesta en 24h) |
| **WhatsApp** | +34 XXX XXX XXX | Lunes-Viernes 9AM-6PM |
| **Oficina Física** | Edificio A, Piso 2, Sala 210 | Lunes-Viernes 10AM-4PM |

### Reportar un Bug

Si encuentras un error:

1. Anota los pasos exactos para reproducirlo
2. Toma una captura de pantalla
3. Envía un email a soporte@universidad-app.edu con:
   - Título descriptivo
   - Descripción del problema
   - Pasos para reproducirlo
   - Tu navegador y sistema operativo
   - Captura de pantalla

### Feedback y Sugerencias

¡Nos encanta recibir tus ideas para mejorar!

1. Ve a **Configuración** → **Enviar feedback**
2. Describe tu sugerencia
3. Haz clic en **"Enviar"**
4. Nuestro equipo de producto lo revisará

---

## Glosario de Términos

| Término | Definición |
|---------|-----------|
| **JWT** | JSON Web Token - Token de autenticación segura |
| **API** | Interface de Programación de Aplicaciones |
| **Backend** | Servidor que procesa la información |
| **Frontend** | Interfaz visual que ve el usuario |
| **Registro académico** | Código único de estudiante asignado por la universidad |
| **Feed** | Flujo de publicaciones que ves en la página principal |
| **Thread** | Hilo de comentarios en una publicación |
| **Moderación** | Revisión de contenido por el equipo administrativo |
| **Spam** | Contenido repetitivo, molesto o no solicitado |
| **Phishing** | Intento de robar información mediante engaño |

---

## Accesibilidad

Universidad App se diseñó pensando en la accesibilidad:

### Características de Accesibilidad

✅ Compatible con lectores de pantalla (NVDA, JAWS)  
✅ Navegación por teclado completa (`Tab`, `Enter`, `Esc`)  
✅ Contraste de colores optimizado  
✅ Fuentes escalables  
✅ Descripciones de imágenes (alt text)  
✅ Captions opcionales en videos  

### Solicitar Acomodaciones

Si necesitas acomodaciones especiales:

1. Contacta a: accesibilidad@universidad-app.edu
2. Describe tus necesidades de accesibilidad
3. Te proporcionaremos las acomodaciones necesarias

---

## Cambios Importantes en Versiones Futuras

### Próximamente en v1.1.0

- 🆕 Mensajería privada entre usuarios
- 🆕 Reacciones emoji en publicaciones
- 🆕 Publicaciones con imágenes mejoradas
- 🔄 Mejor rendimiento en móviles
- 🔧 Corrección de bugs reportados

### Próximamente en v1.2.0

- 🆕 Grupos temáticos
- 🆕 Calendario de eventos académicos
- 🆕 Sistema de puntos y logros
- 🆕 Integración con Google Calendar
- 🆕 Descarga de certificados

---

## Descubrimiento de Funciones Ocultas

¿Sabías que...?

- Presiona `?` en cualquier página para ver atajos de teclado
- Puedes marcar publicaciones con `D` para leerlas después
- Haz clic en tu nombre de usuario para ver estadísticas
- Escribe `/help` en una publicación para ver comandos

---

## Documento de Referencia Rápida

### Atajos de Teclado

| Atajo | Acción |
|-------|--------|
| `Ctrl+K` / `Cmd+K` | Abre la búsqueda rápida |
| `Ctrl+Enter` | Envía un formulario |
| `Esc` | Cierra diálogos |
| `G` `H` | Ir a Home |
| `G` `P` | Ir a Perfil |
| `/` | Abre búsqueda |
| `?` | Muestra ayuda |

---

## Finales Words

¡Gracias por ser parte de **Universidad App**! Esperamos que disfrutes usando nuestra plataforma. Si tienes preguntas, sugerencias o necesitas ayuda, no dudes en contactar a nuestro equipo de soporte.

**¡Que tengas una excelente experiencia universitaria!** 🎓

---

**Manual de Usuario - Universidad App v1.0.0**  
**Última actualización:** Marzo 2026  
**Próxima revisión:** Junio 2026  
**Responsable:** Equipo de Soporte Técnico  
**Licencia:** CC BY-NC-SA 4.0
