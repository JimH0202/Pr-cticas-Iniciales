const jwt = require('jsonwebtoken');
const { findByRegistro, findByEmail, createUser, updateUser } = require('../repositories/usuario.repository');
const { hashPassword, comparePassword } = require('../utils/hash');

const register = async ({ registro, nombres, apellidos, email, password }) => {
  const existingUser = await findByRegistro(registro);
  if (existingUser) {
    const error = new Error('Registro académico ya existe');
    error.status = 400;
    throw error;
  }

  const existingEmail = await findByEmail(email);
  if (existingEmail) {
    const error = new Error('El correo electrónico ya está registrado');
    error.status = 400;
    throw error;
  }

  const passwordHash = await hashPassword(password);
  const user = await createUser({ registro, nombres, apellidos, email, passwordHash });
  return user;
};

const login = async ({ registro, password }) => {
  const user = await findByRegistro(registro);
  if (!user) {
    const error = new Error('Usuario o contraseña incorrectos');
    error.status = 401;
    throw error;
  }

  const valid = await comparePassword(password, user.password_hash);
  if (!valid) {
    const error = new Error('Usuario o contraseña incorrectos');
    error.status = 401;
    throw error;
  }

  const token = jwt.sign(
    { sub: user.id, registro: user.registro },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
  );

  return { user: { id: user.id, registro: user.registro, nombres: user.nombres, apellidos: user.apellidos, email: user.email }, token };
};

const resetPassword = async ({ registro, email, newPassword }) => {
  const user = await findByRegistro(registro);
  if (!user || user.email !== email) {
    const error = new Error('Registro académico o correo electrónico incorrectos');
    error.status = 400;
    throw error;
  }

  const passwordHash = await hashPassword(newPassword);
  return updateUser(user.id, { passwordHash });
};

module.exports = {
  register,
  login,
  resetPassword,
};
