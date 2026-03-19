const express = require('express');
const router = express.Router();
const cursoController = require('../controllers/curso.controller');
const { authenticate } = require('../middlewares/auth.middleware');

router.get('/', authenticate, cursoController.listCursos);
router.get('/:id', authenticate, cursoController.getCurso);
router.post('/', authenticate, cursoController.createCurso);

module.exports = router;
