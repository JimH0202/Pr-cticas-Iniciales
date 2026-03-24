require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '.env.test' });

const request = require('supertest');
const app = require('../src/app');

const TEST_USER = {
  email: 'usuario@ejemplo.com',
  password: 'admin123',
};

let canConnect = true;

beforeAll(async () => {
  // Verificar que la base de datos está disponible (evitar fallos de credenciales)
  try {
    const pool = require('../src/config/db');
    await pool.query('SELECT 1');
  } catch (err) {
    canConnect = false;
    console.warn('No se pudo conectar a la base de datos. Las pruebas de API serán omitidas.');
  }
});

describe('API REST - Universidad App', () => {
  it('GET / should respond with basic info', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message', 'Universidad App API');
    expect(typeof res.body.uptime).toBe('number');
  });

  it('POST /api/auth/login should return a JWT token', async () => {
    if (!canConnect) return;

    const res = await request(app)
      .post('/api/auth/login')
      .send(TEST_USER)
      .set('Accept', 'application/json');

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(typeof res.body.token).toBe('string');
    expect(res.body).toHaveProperty('user');
    expect(res.body.user).toMatchObject({
      email: TEST_USER.email,
    });
  });

  it('GET /api/cursos should return a list of courses when authorized', async () => {
    if (!canConnect) return;

    const loginRes = await request(app)
      .post('/api/auth/login')
      .send(TEST_USER)
      .set('Accept', 'application/json');

    const token = loginRes.body.token;

    const res = await request(app)
      .get('/api/cursos')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    if (res.body.length > 0) {
      expect(res.body[0]).toHaveProperty('id');
      expect(res.body[0]).toHaveProperty('nombre');
    }
  });
});
