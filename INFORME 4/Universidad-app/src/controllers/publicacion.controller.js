const publicacionService = require('../services/publicacion.service');
const comentarioService = require('../services/comentario.service');

const sanitizePublicacion = (publicacion) => {
  if (!publicacion) return null;
  return {
    id: publicacion.id,
    mensaje: publicacion.mensaje,
    curso_id: publicacion.curso_id,
    profesor_id: publicacion.profesor_id,
    usuario_id: publicacion.usuario_id,
    created_at: publicacion.created_at,
    usuario: {
      id: publicacion.usuario_id,
      registro: publicacion.usuario_registro || '',
      nombres: publicacion.usuario_nombres || '',
      apellidos: publicacion.usuario_apellidos || ''
    },
    curso: publicacion.curso_id || publicacion.curso_nombre_text ? {
      id: publicacion.curso_id || null,
      nombre: publicacion.curso_nombre_text || publicacion.curso_nombre || '',
      codigo: publicacion.curso_codigo || ''
    } : null,
    profesor: publicacion.profesor_id || publicacion.profesor_nombre_text ? {
      id: publicacion.profesor_id || null,
      nombres: publicacion.profesor_nombre_text?.split(' ')[0] || publicacion.profesor_nombres || '',
      apellidos: publicacion.profesor_nombre_text?.split(' ').slice(1).join(' ') || publicacion.profesor_apellidos || ''
    } : null,
    fechaCreacion: publicacion.created_at
  };
};

const listPublicaciones = async (req, res, next) => {
  try {
    const { cursoId, profesorId, cursoNombre, profesorNombre } = req.query;
    const publicaciones = await publicacionService.listPublicaciones({ cursoId, profesorId, cursoNombre, profesorNombre });
    res.json({ publicaciones: publicaciones.map(sanitizePublicacion) });
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
    const { cursoId, profesorId, cursoNombre, profesorNombre, mensaje } = req.body;
    const publicacion = await publicacionService.createPublicacion({ 
      usuarioId, 
      cursoId, 
      profesorId, 
      cursoNombre,
      profesorNombre,
      mensaje 
    });
    res.status(201).json({ publicacion: sanitizePublicacion(publicacion) });
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
    res.json({ publicacion: sanitizePublicacion(publicacion) });
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
