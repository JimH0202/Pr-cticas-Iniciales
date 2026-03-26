const comentarioService = require('../services/comentario.service');

const sanitizeComentario = (comentario) => {
  if (!comentario) return null;
  return {
    id: comentario.id,
    mensaje: comentario.mensaje,
    publicacion_id: comentario.publicacion_id,
    usuario_id: comentario.usuario_id,
    created_at: comentario.created_at,
    usuario: {
      id: comentario.usuario_id,
      registro: comentario.usuario_registro || '',
      nombres: comentario.usuario_nombres || '',
      apellidos: comentario.usuario_apellidos || ''
    },
    fechaCreacion: comentario.created_at
  };
};

const listComentarios = async (req, res, next) => {
  try {
    const publicacionId = req.params.publicacionId;
    const comentarios = await comentarioService.listComentarios(publicacionId);
    res.json({ comentarios: comentarios.map(sanitizeComentario) });
  } catch (err) {
    next(err);
  }
};

const createComentario = async (req, res, next) => {
  try {
    const usuarioId = req.user.id;
    const publicacionId = req.params.publicacionId;
    const { mensaje } = req.body;
    const comentario = await comentarioService.createComentario({ publicacionId, usuarioId, mensaje });
    res.status(201).json({ comentario: sanitizeComentario(comentario) });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  listComentarios,
  createComentario,
};
