const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const ValidError = require('../errors/validError400');
const AuthError = require('../errors/authError401');
const NotFoundError = require('../errors/notFoundError404');
const ConflictError = require('../errors/conflictError409');

// GET /users
module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

// GET /users/:userId
module.exports.getUser = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        return next(new NotFoundError('Пользователь по указанному Id не найден'));
      }
      return res.send({ data: user });
    })
    .catch(next);
};

// POST /users
module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  // User.create({ name, about, avatar })
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => res.status(201).send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
      _id: user._id,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidError('Неверные данные'));
      } else if (err.code === 11000) {
        next(new ConflictError('Такой пользователь уже есть'));
      } else {
        next(err);
      }
    });
};

// PATCH /users/me
module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь с таким id не найден');
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new ValidError('Некорректные данные при обновлении профиля'));
      }
      return next(err);
    });
};

// PATCH /users/me/avatar
module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь с таким id не найден');
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new ValidError('Некорректные данные при обновлении аватара'));
      }
      return next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new AuthError('Неверная почта или пароль'));
      }
      return Promise.all([bcrypt.compare(password, user.password), user]);
    })
    .then(([isPasswordCorrect, user]) => {
      if (!isPasswordCorrect) {
        return Promise.reject(new AuthError('Неверная почта или пароль'));
      }
      const token = jwt.sign(
        { _id: user._id },
        'some-secret-key',
        { expiresIn: '7d' },
      );
      return res.send({ token });
    })
    .catch(next);
};

// GET/users/me - возвращение инфо о пользователе
module.exports.getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }
      return res.status(200).send({ data: user });
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        return next(new ValidError('Неверный id'));
      }
      return next(error);
    });
};
