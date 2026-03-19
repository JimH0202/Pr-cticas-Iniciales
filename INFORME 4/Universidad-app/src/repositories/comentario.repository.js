const pool = require('../config/db');

const findByPublicacionId = async (publicacionId) => {
  const [rows] = await pool.query(
    `SELECT c.*, u.registro as usuario_registro, u.nombres as usuario_nombres, u.apellidos as usuario_apellidos
     FROM comentarios c
     JOIN usuarios u ON c.usuario_id = u.id
     WHERE c.publicacion_id = ?
     ORDER BY c.created_at ASC`,
    [publicacionId]
  );
  return rows;
};

const create = async ({ publicacionId, usuarioId, mensaje }) => {
  const [result] = await pool.query(
    'INSERT INTO comentarios (publicacion_id, usuario_id, mensaje, created_at) VALUES (?, ?, ?, NOW())',
    [publicacionId, usuarioId, mensaje]
  );
  const [rows] = await pool.query(
    `SELECT c.*, u.registro AS usuario_registro, u.nombres AS usuario_nombres, u.apellidos AS usuario_apellidos
     FROM comentarios c
     JOIN usuarios u ON c.usuario_id = u.id
     WHERE c.id = ?`,
    [result.insertId]
  );
  return rows[0];
};

module.exports = {
  findByPublicacionId,
  create,
};
