const express = require('express');
const router = express.Router();
const profesorController = require('../controllers/profesor.controller');

router.get('/', profesorController.listProfesores);

module.exports = router;