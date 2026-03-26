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

const updatePublicacion = async (id, usuarioId, mensaje) => {
  const publicacion = await publicacionRepository.findById(id);
  if (!publicacion) {
    const error = new Error('Publicación no encontrada');
    error.status = 404;
    throw error;
  }
  if (publicacion.usuarioId !== usuarioId) {
    const error = new Error('No tienes permiso para editar esta publicación');
    error.status = 403;
    throw error;
  }
  if (!mensaje || !mensaje.trim()) {
    const error = new Error('El mensaje no puede estar vacío');
    error.status = 400;
    throw error;
  }
  return publicacionRepository.update(id, { mensaje });
};

const deletePublicacion = async (id, usuarioId) => {
  const publicacion = await publicacionRepository.findById(id);
  if (!publicacion) {
    const error = new Error('Publicación no encontrada');
    error.status = 404;
    throw error;
  }
  if (publicacion.usuarioId !== usuarioId) {
    const error = new Error('No tienes permiso para eliminar esta publicación');
    error.status = 403;
    throw error;
  }
  return publicacionRepository.delete(id);
};

module.exports = {
  listPublicaciones,
  getPublicacion,
  createPublicacion,
  updatePublicacion,
  deletePublicacion,
};
