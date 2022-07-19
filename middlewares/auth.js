const jwt = require('jsonwebtoken');
const AuthError = require('../errors/authError401');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    throw new AuthError('Нужна авторизация');
  }
  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV ? JWT_SECRET : 'secret');
  } catch (error) {
    throw new AuthError('Ошибка авторизации');
  }
  req.user = payload;
  next();
};
