

USE universidad_app;

-- 1. SELECT - LEER DATOS


-- Listar todos los usuarios con sus cursos aprobados
SELECT 
  u.id,
  u.nombres,
  u.apellidos,
  u.email,
  c.nombre AS curso,
  c.codigo,
  c.creditos
FROM usuarios u
LEFT JOIN cursos_aprobados ca ON u.id = ca.usuario_id
LEFT JOIN cursos c ON ca.curso_id = c.id
ORDER BY u.nombres;

-- Publicaciones con comentarios (incluir autor y profesor)
SELECT 
  p.id,
  u.nombres AS autor,
  u.apellidos,
  p.mensaje,
  c.nombre AS curso,
  prof.nombres AS profesor,
  COUNT(com.id) AS total_comentarios,
  p.created_at
FROM publicaciones p
LEFT JOIN usuarios u ON p.usuario_id = u.id
LEFT JOIN cursos c ON p.curso_id = c.id
LEFT JOIN profesores prof ON p.profesor_id = prof.id
LEFT JOIN comentarios com ON p.id = com.publicacion_id
GROUP BY p.id
ORDER BY p.created_at DESC;

-- Cursos con profesor y cantidad de estudiantes
SELECT 
  c.id,
  c.nombre,
  c.codigo,
  c.creditos,
  CONCAT(prof.nombres, ' ', prof.apellidos) AS profesor,
  prof.departamento,
  COUNT(ca.usuario_id) AS estudiantes_aprobados
FROM cursos c
LEFT JOIN profesores prof ON c.profesor_id = prof.id
LEFT JOIN cursos_aprobados ca ON c.id = ca.curso_id
GROUP BY c.id
ORDER BY c.nombre;

-- 2. INSERT - INSERTAR DATOS


-- Insertar un nuevo usuario
INSERT INTO usuarios (registro, nombres, apellidos, email, password_hash)
VALUES ('20230050', 'Juan', 'Rodríguez', 'juan.rodriguez@ejemplo.com', '$2a$10$wJxYPQiFS3mQdWEM1gAVseeKkI80q9SxxsZ2tFj5Y71a37E7XmKc2');

-- Insertar un nuevo profesor
INSERT INTO profesores (nombres, apellidos, departamento)
VALUES ('Pedro', 'López', 'Matemáticas');

-- Insertar un nuevo curso
INSERT INTO cursos (nombre, codigo, creditos, profesor_id)
VALUES ('Cálculo I', 'MTX-101', 4, 3);

-- Insertar una publicación (comentario sobre un curso)
INSERT INTO publicaciones (usuario_id, curso_id, mensaje)
VALUES (1, 1, 'Este curso de Programación I es excelente para principiantes');

-- Insertar un comentario en una publicación
INSERT INTO comentarios (publicacion_id, usuario_id, mensaje)
VALUES (1, 2, 'Totalmente de acuerdo, muy buen docente');

-- Registrar un curso aprobado por un usuario
INSERT INTO cursos_aprobados (usuario_id, curso_id)
VALUES (1, 1);

-- 3. DELETE - ELIMINAR DATOS (CON PRECAUCIÓN)

-- Eliminar un comentario específico
DELETE FROM comentarios 
WHERE id = 1 AND usuario_id = 2;

-- Eliminar todas las publicaciones de un usuario
DELETE FROM publicaciones 
WHERE usuario_id = 5;

-- Eliminar los cursos aprobados de un usuario
DELETE FROM cursos_aprobados 
WHERE usuario_id = 5 AND curso_id = 2;

-- Eliminar un profesor (cascada elimina sus cursos)
DELETE FROM profesores 
WHERE id = 1;

-- UPDATE - ACTUALIZAR DATOS


-- Actualizar datos de un usuario
UPDATE usuarios 
SET nombres = 'Carlos', apellidos = 'Méndez', email = 'carlos.mendez@nuevo.com'
WHERE id = 1;

-- Actualizar el profesor de un curso
UPDATE cursos 
SET profesor_id = 2, creditos = 3
WHERE id = 1;


-- BÚSQUEDAS CON FILTROS

-- Buscar usuario por email
SELECT * FROM usuarios WHERE email = 'usuario@ejemplo.com';

-- Buscar cursos de un departamento específico
SELECT c.* FROM cursos c
JOIN profesores p ON c.profesor_id = p.id
WHERE p.departamento LIKE '%Ingeniería%';

-- Buscar publicaciones recientes (últimos 7 días)
SELECT * FROM publicaciones 
WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
ORDER BY created_at DESC;

-- Usuarios sin cursos aprobados
SELECT u.* FROM usuarios u
LEFT JOIN cursos_aprobados ca ON u.id = ca.usuario_id
WHERE ca.id IS NULL;
