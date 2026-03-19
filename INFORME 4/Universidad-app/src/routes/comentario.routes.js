const express = require('express');
const router = express.Router();
const comentarioController = require('../controllers/comentario.controller');
const { authenticate } = require('../middlewares/auth.middleware');

router.get('/:publicacionId', authenticate, comentarioController.listComentarios);
router.post('/:publicacionId', authenticate, comentarioController.createComentario);

module.exports = router;
