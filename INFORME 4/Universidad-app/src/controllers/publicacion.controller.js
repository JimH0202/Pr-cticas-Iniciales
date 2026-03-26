const publicacionService = require('../services/publicacion.service');
const comentarioService = require('../services/comentario.service');

const listPublicaciones = async (req, res, next) => {
  try {
    const { cursoId, profesorId, cursoNombre, profesorNombre } = req.query;
    const publicaciones = await publicacionService.listPublicaciones({ cursoId, profesorId, cursoNombre, profesorNombre });
    res.json({ publicaciones });
  } catch (err) {
    next(err);
  }
};

const getPublicacion = async (req, res, next) => {
  try {
    const publicacion = await publicacionService.getPublicacion(req.params.id);
    const comentarios = await comentarioService.listComentarios(req.params.id);
    res.json({ publicacion, comentarios });
  } catch (err) {
    next(err);
  }
};

const createPublicacion = async (req, res, next) => {
  try {
    const usuarioId = req.user.id;
    const { cursoId, profesorId, mensaje } = req.body;
    const publicacion = await publicacionService.createPublicacion({ usuarioId, cursoId, profesorId, mensaje });
    res.status(201).json({ publicacion });
  } catch (err) {
    next(err);
  }
};

const updatePublicacion = async (req, res, next) => {
  try {
    const publicacionId = req.params.id;
    const usuarioId = req.user.id;
    const { mensaje } = req.body;
    const publicacion = await publicacionService.updatePublicacion(publicacionId, usuarioId, mensaje);
    res.json({ publicacion });
  } catch (err) {
    next(err);
  }
};

const deletePublicacion = async (req, res, next) => {
  try {
    const publicacionId = req.params.id;
    const usuarioId = req.user.id;
    await publicacionService.deletePublicacion(publicacionId, usuarioId);
    res.json({ message: 'Publicación eliminada exitosamente' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  listPublicaciones,
  getPublicacion,
  createPublicacion,
  updatePublicacion,
  deletePublicacion,
};
