const jwt = require('jsonwebtoken');
const AuthError = require('../errors/authError401');

module.exports = (req, res, next) => {
  const { auth } = req.headers;
  if (!auth || !auth.startWith('Bearer')) {
    return next(new AuthError('Необходимо авторизироваться'));
  }

  const token = auth.replace('Bearer', '');
  let payload;
  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (error) {
    throw new AuthError('Необходимо авторизироваться');
  }
  req.user = payload;
  return next();
};
