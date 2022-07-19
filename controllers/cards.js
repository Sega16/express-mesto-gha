const Card = require('../models/card');
const ValidError = require('../errors/validError400');
const ForbiddenError = require('../errors/forbiddenError403');
const NotFoundError = require('../errors/notFoundError404');

// GET /cards
module.exports.getCards = (_req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(next);
};

// POST /cards
module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidError('Некорректные данные при создании карточки'));
        return;
      }
      next(err);
    });
};

// DELETE /cards/:cardId
module.exports.deleteCard = (req, res, next) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка не найдена.');
      } else if (String(card.owner._id) !== req.user._id) {
        throw new ForbiddenError('Нельзя удалять чужие карточки.');
      } else {
        card.remove()
          .then(() => res.status(200).send({ message: 'Карточка удалена' }));
      }
    })
    .catch(next);
};

// PUT /cards/:cardId/likes
module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка не найдена.');
      }
      res.send(card);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new ValidError('Переданы неправильные данные'));
        return;
      }
      next(error);
    });
};

// DELETE /cards/:cardId/likes
module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка не найдена.');
      }
      res.send(card);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new ValidError('Переданы неправильные данные'));
        return;
      }
      next(error);
    });
};
