const usuarioService = require('../services/usuario.service');

const sanitizeUser = (user) => {
  if (!user) return null;
  const { id, registro, nombres, apellidos, email, created_at, cursosAprobados } = user;
  return { 
    id, 
    registro, 
    nombres, 
    apellidos, 
    email, 
    created_at,
    cursosAprobados: cursosAprobados || []
  };
};

const getProfileById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const usuario = await usuarioService.getProfileById(id);
    const cursosAprobados = await usuarioService.getCursosAprobados(id);
    const usuarioWithCourses = {
      ...usuario,
      cursosAprobados
    };
    res.json({ usuario: sanitizeUser(usuarioWithCourses) });
  } catch (err) {
    next(err);
  }
};

const getProfile = async (req, res, next) => {
  try {
    const { registro } = req.params;
    const usuario = await usuarioService.getProfileByRegistro(registro);
    const cursosAprobados = await usuarioService.getCursosAprobados(usuario.id);
    const usuarioWithCourses = {
      ...usuario,
      cursosAprobados
    };
    res.json({ usuario: sanitizeUser(usuarioWithCourses) });
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

    const { cursoId, profesor } = req.body;
    await usuarioService.addCursoAprobado(userId, cursoId, profesor);
    
    // Obtener y devolver el usuario actualizado con sus cursos
    const user = await usuarioService.getProfileById(userId);
    const cursosAprobados = await usuarioService.getCursosAprobados(userId);
    const userWithCourses = {
      ...user,
      cursosAprobados
    };
    res.status(201).json({ user: sanitizeUser(userWithCourses) });
  } catch (err) {
    next(err);
  }
};

const removeApprovedCourse = async (req, res, next) => {
  try {
    const userId = parseInt(req.params.userId, 10);
    const cursoId = parseInt(req.params.cursoId, 10);
    const authenticatedUserId = parseInt(req.user.id, 10);

    if (userId !== authenticatedUserId) {
      return res.status(403).json({ error: 'No autorizado para modificar cursos aprobados de otro usuario' });
    }

    await usuarioService.removeCursoAprobado(userId, cursoId);
    
    // Obtener y devolver el usuario actualizado con sus cursos
    const user = await usuarioService.getProfileById(userId);
    const cursosAprobados = await usuarioService.getCursosAprobados(userId);
    const userWithCourses = {
      ...user,
      cursosAprobados
    };
    res.json({ user: sanitizeUser(userWithCourses) });
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
  removeApprovedCourse,
};
