require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '.env.test' });

const pool = require('../src/config/db');

let canConnect = true;

beforeAll(async () => {
  try {
    await pool.query('SELECT 1');
  } catch (err) {
    canConnect = false;
    console.warn('⚠️ No se pudo conectar a la base de datos. Asegúrate de tener `.env` con credenciales válidas.');
  }
});

afterAll(async () => {
  if (canConnect) {
    await pool.end();
  }
});

describe('Base de datos - consultas básicas', () => {
  it('Debe existir la tabla usuarios y tener al menos un registro', async () => {
    if (!canConnect) return;
    const [rows] = await pool.query('SELECT COUNT(*) AS count FROM usuarios');
    expect(rows[0].count).toBeGreaterThan(0);
  });

  it('Debe devolver al menos un curso en la tabla cursos', async () => {
    if (!canConnect) return;
    const [rows] = await pool.query('SELECT COUNT(*) AS count FROM cursos');
    expect(rows[0].count).toBeGreaterThan(0);
  });
});
