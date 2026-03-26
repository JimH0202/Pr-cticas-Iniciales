const pool = require('../config/db');

const findAll = async ({ cursoId, profesorId, cursoNombre, profesorNombre } = {}) => {
  const where = [];
  const values = [];

  if (cursoId) {
    where.push('p.curso_id = ?');
    values.push(cursoId);
  }
  if (profesorId) {
    where.push('p.profesor_id = ?');
    values.push(profesorId);
  }
  if (cursoNombre) {
    where.push('c.nombre LIKE ?');
    values.push(`%${cursoNombre}%`);
  }
  if (profesorNombre) {
    where.push('(prof.nombres LIKE ? OR prof.apellidos LIKE ?)');
    values.push(`%${profesorNombre}%`, `%${profesorNombre}%`);
  }

  const query = `
    SELECT p.*, u.registro AS usuario_registro, u.nombres AS usuario_nombres, u.apellidos AS usuario_apellidos,
           c.nombre AS curso_nombre, c.codigo AS curso_codigo,
           prof.nombres AS profesor_nombres, prof.apellidos AS profesor_apellidos
    FROM publicaciones p
    JOIN usuarios u ON p.usuario_id = u.id
    LEFT JOIN cursos c ON p.curso_id = c.id
    LEFT JOIN profesores prof ON p.profesor_id = prof.id
    ${where.length ? 'WHERE ' + where.join(' AND ') : ''}
    ORDER BY p.created_at DESC
  `;

  const [rows] = await pool.query(query, values);
  return rows;
};

const findById = async (id) => {
  const [rows] = await pool.query(
    `SELECT p.*, u.registro AS usuario_registro, u.nombres AS usuario_nombres, u.apellidos AS usuario_apellidos,
            c.nombre AS curso_nombre, c.codigo AS curso_codigo,
            prof.nombres AS profesor_nombres, prof.apellidos AS profesor_apellidos
     FROM publicaciones p
     JOIN usuarios u ON p.usuario_id = u.id
     LEFT JOIN cursos c ON p.curso_id = c.id
     LEFT JOIN profesores prof ON p.profesor_id = prof.id
     WHERE p.id = ?`,
    [id]
  );
  return rows[0];
};

const create = async ({ usuarioId, cursoId, profesorId, mensaje }) => {
  const [result] = await pool.query(
    'INSERT INTO publicaciones (usuario_id, curso_id, profesor_id, mensaje, created_at) VALUES (?, ?, ?, ?, NOW())',
    [usuarioId, cursoId || null, profesorId || null, mensaje]
  );
  return findById(result.insertId);
};

const update = async (id, { mensaje }) => {
  await pool.query(
    'UPDATE publicaciones SET mensaje = ?, created_at = created_at WHERE id = ?',
    [mensaje, id]
  );
  return findById(id);
};

const delete_publicacion = async (id) => {
  await pool.query('DELETE FROM publicaciones WHERE id = ?', [id]);
  return { success: true };
};

module.exports = {
  findAll,
  findById,
  create,
  update,
  delete: delete_publicacion,
};
