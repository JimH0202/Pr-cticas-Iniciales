const {
  findById,
  findByRegistro,
  updateUser,
  getApprovedCourses,
  addApprovedCourse,
  removeApprovedCourse,
} = require('../repositories/usuario.repository');

const { hashPassword } = require('../utils/hash');

const getProfileById = async (id) => {
  const usuario = await findById(id);
  if (!usuario) {
    const error = new Error('Usuario no encontrado');
    error.status = 404;
    throw error;
  }
  return usuario;
};

const getProfileByRegistro = async (registro) => {
  const usuario = await findByRegistro(registro);
  if (!usuario) {
    const error = new Error('Usuario no encontrado');
    error.status = 404;
    throw error;
  }
  return usuario;
};

const updateProfile = async (userId, { nombres, apellidos, email, password }) => {
  const updatePayload = { nombres, apellidos, email };
  if (password) {
    updatePayload.passwordHash = await hashPassword(password);
  }
  const updated = await updateUser(userId, updatePayload);
  return updated;
};

const getCursosAprobados = async (userId) => {
  return getApprovedCourses(userId);
};

const addCursoAprobado = async (userId, cursoId, profesorNombre) => {
  return addApprovedCourse(userId, cursoId, profesorNombre);
};

const removeCursoAprobado = async (userId, cursoId) => {
  return removeApprovedCourse(userId, cursoId);
};

module.exports = {
  getProfileByRegistro,
  getProfileById,
  updateProfile,
  getCursosAprobados,
  addCursoAprobado,
  removeCursoAprobado,
};
