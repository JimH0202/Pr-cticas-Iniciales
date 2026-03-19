const { findAll } = require('../repositories/profesor.repository');

const listProfesores = async (filters) => {
  return findAll(filters);
};

module.exports = {
  listProfesores,
};