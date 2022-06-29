
const router = require('express').Router();
const { getUsers, getUser, createUser, updateUser, updateAvatar, }
  = require('../controllers/users');

router.get('/users', getUsers);
router.get('/users/:userId', getUser);
router.post('/users', createUser);
router.patch('user/me', updateUser);
router.patch('user/me/avatar', updateAvatar);

module.exports = router;