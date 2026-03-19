const express = require('express');
const router = express.Router();
const publicacionController = require('../controllers/publicacion.controller');
const { authenticate } = require('../middlewares/auth.middleware');

router.get('/', authenticate, publicacionController.listPublicaciones);
router.get('/:id', authenticate, publicacionController.getPublicacion);
router.post('/', authenticate, publicacionController.createPublicacion);

module.exports = router;
