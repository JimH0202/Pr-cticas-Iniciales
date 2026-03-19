const { findAll, findById, create } = require('../repositories/curso.repository');

const listCursos = async (filters) => {
  return findAll(filters);
};

const getCursoById = async (id) => {
  const curso = await findById(id);
  if (!curso) {
    const error = new Error('Curso no encontrado');
    error.status = 404;
    throw error;
  }
  return curso;
};

const createCurso = async (payload) => {
  return create(payload);
};

module.exports = {
  listCursos,
  getCursoById,
  createCurso,
};
