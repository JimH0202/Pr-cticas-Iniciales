USE universidad_app;

-- 1) Listar publicaciones más recientes con datos del usuario, curso y catedrático.
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

-- 2) Buscar publicaciones por nombre de curso o catedrático (parámetro LIKE)
SELECT p.*
FROM publicaciones p
LEFT JOIN cursos c ON p.curso_id = c.id
LEFT JOIN profesores prof ON p.profesor_id = prof.id
WHERE c.nombre LIKE '%Bases%'
   OR prof.apellidos LIKE '%Pérez%';

-- 3) Obtener el total de créditos aprobados por un usuario
SELECT u.registro, u.nombres, u.apellidos, SUM(c.creditos) AS creditos_aprobados
FROM cursos_aprobados a
JOIN usuarios u ON a.usuario_id = u.id
JOIN cursos c ON a.curso_id = c.id
WHERE u.registro = '20220001'
GROUP BY u.id, u.registro, u.nombres, u.apellidos;
