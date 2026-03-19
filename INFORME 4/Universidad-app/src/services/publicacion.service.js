const publicacionRepository = require('../repositories/publicacion.repository');

const listPublicaciones = async (filters) => {
  return publicacionRepository.findAll(filters);
};

const getPublicacion = async (id) => {
  const publicacion = await publicacionRepository.findById(id);
  if (!publicacion) {
    const error = new Error('Publicación no encontrada');
    error.status = 404;
    throw error;
  }
  return publicacion;
};

const createPublicacion = async ({ usuarioId, cursoId, profesorId, mensaje }) => {
  if (!mensaje || (!cursoId && !profesorId)) {
    const error = new Error('Debe especificar un mensaje y seleccionar un curso o un catedrático');
    error.status = 400;
    throw error;
  }
  return publicacionRepository.create({ usuarioId, cursoId, profesorId, mensaje });
};

module.exports = {
  listPublicaciones,
  getPublicacion,
  createPublicacion,
};
