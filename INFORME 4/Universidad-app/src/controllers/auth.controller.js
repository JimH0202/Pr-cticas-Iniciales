const authService = require('../services/auth.service');

const sanitizeUser = (user) => {
  if (!user) return null;
  const { id, registro, nombres, apellidos, email, created_at } = user;
  return { id, registro, nombres, apellidos, email, created_at };
};

const register = async (req, res, next) => {
  try {
    const { registro, nombres, apellidos, email, password } = req.body;
    const user = await authService.register({ registro, nombres, apellidos, email, password });
    res.status(201).json({ user: sanitizeUser(user) });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { registro, password } = req.body;
    const result = await authService.login({ registro, password });
    res.json({ token: result.token, user: sanitizeUser(result.user) });
  } catch (err) {
    next(err);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const { registro, email, newPassword } = req.body;
    await authService.resetPassword({ registro, email, newPassword });
    res.json({ message: 'Contraseña actualizada correctamente' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  register,
  login,
  forgotPassword,
};
