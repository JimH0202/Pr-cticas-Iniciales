const profesorService = require('../services/profesor.service');

const listProfesores = async (req, res, next) => {
  try {
    const { nombre } = req.query;
    const profesores = await profesorService.listProfesores({ nombre });
    res.json({ profesores });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  listProfesores,
};