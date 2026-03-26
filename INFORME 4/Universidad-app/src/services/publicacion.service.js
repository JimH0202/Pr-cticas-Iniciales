const publicacionRepository = require('../repositories/publicacion.repository');
const cursoRepository = require('../repositories/curso.repository');
const profesorRepository = require('../repositories/profesor.repository');

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

const createPublicacion = async ({ usuarioId, cursoId, profesorId, cursoNombre, profesorNombre, mensaje }) => {
  if (!mensaje || (!cursoId && !profesorId && !cursoNombre && !profesorNombre)) {
    const error = new Error('Debe especificar un mensaje y seleccionar un curso o un catedrático');
    error.status = 400;
    throw error;
  }

  let obtainedCursoId = cursoId;
  let obtainedProfesorId = profesorId;

  // Si viene nombre de curso, buscar por nombre
  if (cursoNombre && !cursoId) {
    const curso = await cursoRepository.findByName(cursoNombre);
    obtainedCursoId = curso ? curso.id : null;
  }

  // Si viene nombre de profesor, buscar por nombre
  if (profesorNombre && !profesorId) {
    const profesor = await profesorRepository.findByName(profesorNombre);
    obtainedProfesorId = profesor ? profesor.id : null;
  }

  return publicacionRepository.create({ 
    usuarioId, 
    cursoId: obtainedCursoId, 
    profesorId: obtainedProfesorId, 
    cursoNombre,
    profesorNombre,
    mensaje 
  });
};

const updatePublicacion = async (id, usuarioId, mensaje) => {
  const publicacion = await publicacionRepository.findById(id);
  if (!publicacion) {
    const error = new Error('Publicación no encontrada');
    error.status = 404;
    throw error;
  }
  if (publicacion.usuario_id !== usuarioId) {
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
  if (publicacion.usuario_id !== usuarioId) {
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
