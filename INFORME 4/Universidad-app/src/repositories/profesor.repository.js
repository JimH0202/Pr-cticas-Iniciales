const pool = require('../config/db');

const findAll = async ({ nombre } = {}) => {
  const where = [];
  const values = [];
  if (nombre) {
    where.push('(nombres LIKE ? OR apellidos LIKE ?)');
    values.push(`%${nombre}%`, `%${nombre}%`);
  }

  const query = `
    SELECT *
    FROM profesores
    ${where.length ? 'WHERE ' + where.join(' AND ') : ''}
    ORDER BY apellidos, nombres
  `;

  const [rows] = await pool.query(query, values);
  return rows;
};

const findById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM profesores WHERE id = ?', [id]);
  return rows[0];
};

const findByName = async (nombre) => {
  const [rows] = await pool.query(
    'SELECT * FROM profesores WHERE LOWER(nombres) LIKE LOWER(?) OR LOWER(apellidos) LIKE LOWER(?) ORDER BY apellidos, nombres LIMIT 1',
    [`%${nombre}%`, `%${nombre}%`]
  );
  return rows[0];
};

const create = async ({ nombres, apellidos, departamento }) => {
  const [result] = await pool.query(
    'INSERT INTO profesores (nombres, apellidos, departamento) VALUES (?, ?, ?)',
    [nombres, apellidos, departamento]
  );
  return findById(result.insertId);
};

module.exports = {
  findAll,
  findById,
  findByName,
  create,
};
