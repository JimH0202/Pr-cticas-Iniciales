const comentarioService = require('../services/comentario.service');

const listComentarios = async (req, res, next) => {
  try {
    const publicacionId = req.params.publicacionId;
    const comentarios = await comentarioService.listComentarios(publicacionId);
    res.json({ comentarios });
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
    res.status(201).json({ comentario });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  listComentarios,
  createComentario,
};
