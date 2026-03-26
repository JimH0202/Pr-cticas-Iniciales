const pool = require('../config/db');

const findAll = async ({ nombre, profesorId } = {}) => {
  const where = [];
  const values = [];

  if (nombre) {
    where.push('c.nombre LIKE ?');
    values.push(`%${nombre}%`);
  }
  if (profesorId) {
    where.push('c.profesor_id = ?');
    values.push(profesorId);
  }

  const query = `
    SELECT c.*, p.nombres AS profesor_nombres, p.apellidos AS profesor_apellidos
    FROM cursos c
    LEFT JOIN profesores p ON c.profesor_id = p.id
    ${where.length ? 'WHERE ' + where.join(' AND ') : ''}
    ORDER BY c.nombre ASC
  `;

  const [rows] = await pool.query(query, values);
  return rows;
};

const findById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM cursos WHERE id = ?', [id]);
  return rows[0];
};

const findByName = async (nombre) => {
  const [rows] = await pool.query(
    'SELECT * FROM cursos WHERE LOWER(nombre) LIKE LOWER(?)',
    [`%${nombre}%`]
  );
  return rows[0];
};

const create = async ({ nombre, codigo, creditos, profesorId }) => {
  const [result] = await pool.query(
    'INSERT INTO cursos (nombre, codigo, creditos, profesor_id) VALUES (?, ?, ?, ?)',
    [nombre, codigo, creditos, profesorId]
  );
  return findById(result.insertId);
};

module.exports = {
  findAll,
  findById,
  findByName,
  create,
};
