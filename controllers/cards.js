
const Card = require('../models/card');

// GET /cards
module.exports.getCards = (_req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(500).send({ message: 'Ошибка' }));
};

// POST /cards
module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(200).send(card))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(400).send({ message: 'Некорректные данные при создании карточки' });
        return;
      }
      res.status(500).send({ message: 'Произошла ошибка' });
    });
};

// DELETE /cards/:cardId
module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.csrdId)
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: 'Карточка не найдена' });
        return;
      }
      res.status(200).send(card);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        res.status(400).send({ message: 'Некорректные данные' });
        return;
      }
      res.status(500).send({ message: 'Ошибка' });
    });
};

// PUT /cards/:cardId/likes
module.exports.likeCard = (req, res) =>
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card === null) {
        return res.status(404).send({ message: 'Несуществующий id карточки' });
      }
      return res.send({ data: card });
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        return res.status(400).send({ message: 'Некорректные данные для лайка' });
      }
      if (error.name === 'CastError') {
        return res.status(400).send({ message: 'Несуществующий id карточки' });
      }
      return res.status(500).send({ message: 'Ошибка' });
    });

// DELETE /cards/:cardId/likes
module.exports.dislikeCard = (req, res) =>
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card === null) {
        return res.status(404).send({ message: 'Несуществующий id карточки' });
      }
      return res.send({ data: card });
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        return res.status(400).send({ message: 'Некорректные данные для лайка' });
      }
      if (error.name === 'CastError') {
        return res.status(400).send({ message: 'Несуществующий _id карточки' });
      }
      return res.status(500).send({ message: 'Ошибка' });
    });
