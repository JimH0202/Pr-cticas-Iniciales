const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuario.controller');
const { authenticate } = require('../middlewares/auth.middleware');

router.get('/registro/:registro', authenticate, usuarioController.getProfile);
router.get('/:id', authenticate, usuarioController.getProfileById);
router.put('/', authenticate, usuarioController.updateProfile);

// Cursos aprobados
router.get('/:userId/cursos-aprobados', authenticate, usuarioController.getApprovedCourses);
router.post('/:userId/cursos-aprobados', authenticate, usuarioController.addApprovedCourse);

module.exports = router;
