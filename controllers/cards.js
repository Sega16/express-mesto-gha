const Card = require('../models/card');
const ValidError = require('../errors/validError400');
const ForbiddenError = require('../errors/forbiddenError403');
const NotFoundError = require('../errors/notFoundError404');

// GET /cards
module.exports.getCards = (_req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((error) => {
      next(error);
    });
};

// POST /cards
module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send(card))
    .catch((error) => {
      if (error.name === 'ValidError') {
        return next(new ValidError('Некорректные данные при создании карточки'));
      }
      return next(error);
    });
};

// DELETE /cards/:cardId
module.exports.deleteCard = (req, res, next) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка отсутствует');
      }
      if (card.owner.toString() !== req.user._id) {
        throw new ForbiddenError('Нельзя удалять чужие карточки');
      } else {
        return card.remove()
          .then(() => res.send({
            message: 'Карточка удалена',
          }));
      }
    }).catch(next);
};

// PUT /cards/:cardId/likes
module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card === null) {
        throw new NotFoundError('Карточки с таким id нет');
      }
      return res.send({ data: card });
    })
    .catch(next);
};

// DELETE /cards/:cardId/likes
module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card === null) {
        throw new NotFoundError('Карточки с таким id нет');
      }
      return res.send({ data: card });
    })
    .catch(next);
};
