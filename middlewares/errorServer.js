const { DEFAUTL_CODE } = require('../utils/constants');

module.exports = (err, req, res, next) => {
  const { statusCode = DEFAUTL_CODE, message } = err;

  res.status(statusCode).send(statusCode === DEFAUTL_CODE
    ? { message: 'На сервере произошла ошибка' }
    : { message });
  next();
};
