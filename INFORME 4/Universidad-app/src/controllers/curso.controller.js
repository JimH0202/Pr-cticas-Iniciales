const cursoService = require('../services/curso.service');

const listCursos = async (req, res, next) => {
  try {
    const { nombre, profesorId } = req.query;
    const cursos = await cursoService.listCursos({ nombre, profesorId });
    res.json({ cursos });
  } catch (err) {
    next(err);
  }
};

const getCurso = async (req, res, next) => {
  try {
    const curso = await cursoService.getCursoById(req.params.id);
    res.json({ curso });
  } catch (err) {
    next(err);
  }
};

const createCurso = async (req, res, next) => {
  try {
    const curso = await cursoService.createCurso(req.body);
    res.status(201).json({ curso });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  listCursos,
  getCurso,
  createCurso,
};
