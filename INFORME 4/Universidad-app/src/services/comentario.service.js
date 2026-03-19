const comentarioRepository = require('../repositories/comentario.repository');

const listComentarios = async (publicacionId) => {
  return comentarioRepository.findByPublicacionId(publicacionId);
};

const createComentario = async ({ publicacionId, usuarioId, mensaje }) => {
  if (!mensaje) {
    const error = new Error('El mensaje es obligatorio');
    error.status = 400;
    throw error;
  }
  return comentarioRepository.create({ publicacionId, usuarioId, mensaje });
};

module.exports = {
  listComentarios,
  createComentario,
};
