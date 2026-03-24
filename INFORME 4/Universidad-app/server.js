const dotenv = require('dotenv');
const app = require('./src/app');
const pool = require('./src/config/db');
const listEndpoints = require('express-list-endpoints');

dotenv.config();

const PORT = process.env.PORT || 3001;

app.listen(PORT, async () => {
  console.log('\nINFORMACIÓN DE CONEXIÓN - BACKEND\n');

  // Información de conexión
  console.log('Estado: ACTIVO');
  console.log(`URL: http://localhost:${PORT}`);
  console.log(`Puerto: ${PORT}`);
  console.log(`Base de Datos: ${process.env.DB_NAME || 'universidad_app'}`);
  console.log(`Host BD: ${process.env.DB_HOST || 'localhost'}`);
  console.log('Motor: Express.js + MySQL2');

  // Obtener endpoints automáticamente
  console.log('\n📡 ENDPOINTS DISPONIBLES:');
  const endpoints = listEndpoints(app);
  endpoints.forEach((endpoint, index) => {
    console.log(`${index + 1}. ${endpoint.path} [${endpoint.methods.join(', ')}]`);
  });

  // Verificar conexión a la base de datos
  try {
    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();
    console.log('\nConexión a la Base de Datos: EXITOSA');
  } catch (err) {
    console.error('\nError al conectar con la Base de Datos:', err.message);
  }

  console.log('\nSERVIDOR LISTO PARA RECIBIR PETICIONES\n');
});
