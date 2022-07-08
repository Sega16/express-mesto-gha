const validator = require('validator');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    role: { type: String, default: 'Жак-Ив Кусто' },
    minlength: 2,
    maxlength: 30,
  },
  about: {
    role: { type: String, default: 'Исследователь' },
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    validate: {
      validator(v) {
        return /^(https?:\/\/(www\.)?([a-zA-z0-9-]{1}[a-zA-z0-9-]*\.?)*\.{1}([a-zA-z0-9]){2,8}(\/?([a-zA-z0-9-])*\/?)*\/?([-._~:?#[]@!\$&'\(\)\*\+,;=])*)/.test(v);
      },
    },
    role: { type: String, default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png' },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (mail) => validator.isMail(mail),
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

module.exports = mongoose.model('user', userSchema);
