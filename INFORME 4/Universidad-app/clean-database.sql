-- Script para limpiar la base de datos manteniendo la estructura
-- Conserva: profesores, cursos, usuario de ejemplo
-- Elimina: publicaciones, comentarios, cursos aprobados de otro usuarios

USE universidad_app;

-- Limpiar publicaciones (los comentarios se eliminan por CASCADE)
DELETE FROM publicaciones;

-- Limpiar comentarios (por si acaso)
DELETE FROM comentarios;

-- Limpiar cursos aprobados
DELETE FROM cursos_aprobados;

-- Asegurar que solo existe el usuario de ejemplo
DELETE FROM usuarios WHERE registro != '20220001';

-- Confirmar limpieza
SELECT 'Base de datos limpia' AS estado;
SELECT COUNT(*) as publicaciones_totales FROM publicaciones;
SELECT COUNT(*) as comentarios_totales FROM comentarios;
SELECT COUNT(*) as cursos_aprobados_totales FROM cursos_aprobados;
SELECT COUNT(*) as usuarios_totales FROM usuarios;
SELECT COUNT(*) as profesores_totales FROM profesores;
SELECT COUNT(*) as cursos_totales FROM cursos;
