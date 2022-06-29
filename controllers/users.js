
const User = require('../models/user');

// GET /users
module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(500).send({ massege: 'Ошибка 500' }));
};

// GET /users/:userId
module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (user === null) {
        return res
          .status(404)
          .send({ message: 'Пользователь по указанному Id не найден.' });
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Передан некорректный Id' });
      }
      return res.status(500).send({ message: 'Ошибка' });
    });
};

// POST /users
module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        return res
          .status(400)
          .send({ message: 'Некорректные данные при создании пользователя' });
      }
      return res.status(500).send({ message: 'Ошибка' });
    });
};

// PATCH /users/me
module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, {
    new: true,
    runValidators: true,
  })
    .then((user) => res.status(200).send(user))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(400).send({ message: 'Некорректные данные при обновлении профиля' });
        return;
      }
      res.status(500).send({ message: 'Ошибка' });
    });
};

// PATCH /users/me/avatar
module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, {
    new: true,
    runValidators: true,
  })
    .then((user) => res.status(200).send(user))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(400).send({ message: 'Некорректные данные при обновлении аватара' });
        return;
      }
      res.status(500).send({ message: 'Ошибка' });
    });
};