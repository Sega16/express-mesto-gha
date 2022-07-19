const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { linkValidator } = require('../utils/linkValidator');

const {
  getUsers, getUser, updateUser, updateAvatar, getUserInfo,
} = require('../controllers/users');

router.get('/users', getUsers); // Возвращает пользователя по id
router.get('/users/me', getUserInfo); // Возвращает инфо о пользователе

router.get('/users/:userId', celebrate({ // возврат юзера по id
  params: Joi.object().keys({
    userId: Joi.string().required().length(24).hex(),
  }),
}), getUser);

router.patch('/users/me', celebrate({ // обновление данных юзера
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateUser);

router.patch('/users/me/avatar', celebrate({ // обновление аватара юзера
  body: Joi.object().keys({
    avatar: Joi.string().required().custom(linkValidator),
  }),
}), updateAvatar);

module.exports = router;
