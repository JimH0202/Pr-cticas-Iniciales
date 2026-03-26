const usuarioService = require('../services/usuario.service');

const sanitizeUser = (user) => {
  if (!user) return null;
  const { id, registro, nombres, apellidos, email, created_at } = user;
  return { id, registro, nombres, apellidos, email, created_at };
};

const getProfileById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const usuario = await usuarioService.getProfileById(id);
    res.json({ usuario: sanitizeUser(usuario) });
  } catch (err) {
    next(err);
  }
};

const getProfile = async (req, res, next) => {
  try {
    const { registro } = req.params;
    const usuario = await usuarioService.getProfileByRegistro(registro);
    res.json({ usuario: sanitizeUser(usuario) });
  } catch (err) {
    next(err);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const userId = parseInt(req.user.id, 10);
    const payload = req.body;
    const updated = await usuarioService.updateProfile(userId, payload);
    res.json({ usuario: sanitizeUser(updated) });
  } catch (err) {
    next(err);
  }
};

const getApprovedCourses = async (req, res, next) => {
  try {
    const userId = parseInt(req.params.userId, 10);
    const cursos = await usuarioService.getCursosAprobados(userId);
    res.json({ cursos });
  } catch (err) {
    next(err);
  }
};

const addApprovedCourse = async (req, res, next) => {
  try {
    const userId = parseInt(req.params.userId, 10);
    const authenticatedUserId = parseInt(req.user.id, 10);

    if (userId !== authenticatedUserId) {
      return res.status(403).json({ error: 'No autorizado para modificar cursos aprobados de otro usuario' });
    }

    const { cursoId } = req.body;
    const cursos = await usuarioService.addCursoAprobado(userId, cursoId);
    res.status(201).json({ cursos });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getProfile,
  getProfileById,
  updateProfile,
  getApprovedCourses,
  addApprovedCourse,
};
