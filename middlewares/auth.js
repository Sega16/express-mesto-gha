const jwt = require('jsonwebtoken');
const AuthError = require('../errors/authError401');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startWith('Bearer')) {
    return next(new AuthError('Необходимо авторизироваться'));
  }

  const token = authorization.replace('Bearer', '');
  let payload;
  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (error) {
    throw new AuthError('Необходимо авторизироваться');
  }
  req.user = payload;
  return next();
};
