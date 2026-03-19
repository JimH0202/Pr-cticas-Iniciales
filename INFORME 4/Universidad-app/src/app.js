const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const authRoutes = require('./routes/auth.routes');
const usuarioRoutes = require('./routes/usuario.routes');
const cursoRoutes = require('./routes/curso.routes');
const publicacionRoutes = require('./routes/publicacion.routes');
const profesorRoutes = require('./routes/profesor.routes');

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const corsOrigin = process.env.CORS_ORIGIN || '*';
app.use(cors({ origin: corsOrigin }));

app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/cursos', cursoRoutes);
app.use('/api/publicaciones', publicacionRoutes);
app.use('/api/profesores', profesorRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Universidad App API', uptime: process.uptime() });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Error interno del servidor' });
});

module.exports = app;
