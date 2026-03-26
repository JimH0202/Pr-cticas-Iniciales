const pool = require('../config/db');

const findByRegistro = async (registro) => {
  const [rows] = await pool.query('SELECT * FROM usuarios WHERE registro = ?', [registro]);
  return rows[0];
};

const findByEmail = async (email) => {
  const [rows] = await pool.query('SELECT * FROM usuarios WHERE email = ?', [email]);
  return rows[0];
};

const findById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM usuarios WHERE id = ?', [id]);
  return rows[0];
};

const createUser = async ({ registro, nombres, apellidos, email, passwordHash }) => {
  const [result] = await pool.query(
    'INSERT INTO usuarios (registro, nombres, apellidos, email, password_hash, created_at) VALUES (?, ?, ?, ?, ?, NOW())',
    [registro, nombres, apellidos, email, passwordHash]
  );
  return findById(result.insertId);
};

const updateUser = async (id, { nombres, apellidos, email, passwordHash }) => {
  const fields = [];
  const values = [];
  if (nombres) {
    fields.push('nombres = ?');
    values.push(nombres);
  }
  if (apellidos) {
    fields.push('apellidos = ?');
    values.push(apellidos);
  }
  if (email) {
    fields.push('email = ?');
    values.push(email);
  }
  if (passwordHash) {
    fields.push('password_hash = ?');
    values.push(passwordHash);
  }
  if (fields.length === 0) {
    return findById(id);
  }
  values.push(id);
  await pool.query(`UPDATE usuarios SET ${fields.join(', ')} WHERE id = ?`, values);
  return findById(id);
};

const getApprovedCourses = async (userId) => {
  const [rows] = await pool.query(
    `SELECT c.id, c.nombre, c.codigo, c.creditos, a.profesor_nombre as profesor
     FROM cursos_aprobados a
     JOIN cursos c ON a.curso_id = c.id
     WHERE a.usuario_id = ?`,
    [userId]
  );
  return rows;
};

const addApprovedCourse = async (userId, cursoId, profesorNombre) => {
  await pool.query(
    'INSERT IGNORE INTO cursos_aprobados (usuario_id, curso_id, profesor_nombre, created_at) VALUES (?, ?, ?, NOW())',
    [userId, cursoId, profesorNombre || null]
  );
  return getApprovedCourses(userId);
};

const removeApprovedCourse = async (userId, cursoId) => {
  await pool.query(
    'DELETE FROM cursos_aprobados WHERE usuario_id = ? AND curso_id = ?',
    [userId, cursoId]
  );
  return getApprovedCourses(userId);
};

module.exports = {
  findByRegistro,
  findByEmail,
  findById,
  createUser,
  updateUser,
  getApprovedCourses,
  addApprovedCourse,
  removeApprovedCourse,
};
