USE universidad_app;

CREATE OR REPLACE VIEW v_publicaciones_completas AS
SELECT
  p.id AS publicacion_id,
  p.mensaje,
  p.created_at,
  u.id AS usuario_id,
  u.registro AS usuario_registro,
  u.nombres AS usuario_nombres,
  u.apellidos AS usuario_apellidos,
  c.id AS curso_id,
  c.nombre AS curso_nombre,
  c.codigo AS curso_codigo,
  prof.id AS profesor_id,
  prof.nombres AS profesor_nombres,
  prof.apellidos AS profesor_apellidos
FROM publicaciones p
JOIN usuarios u ON p.usuario_id = u.id
LEFT JOIN cursos c ON p.curso_id = c.id
LEFT JOIN profesores prof ON p.profesor_id = prof.id;
