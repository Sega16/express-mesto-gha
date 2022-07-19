const { LINK_REGEXP } = require('./constants');

module.exports.linkValidator = (url, helpers) => {
  if (LINK_REGEXP.test(url)) {
    return url;
  }
  return helpers.error('Ошибка адреса url');
};
