const { Router } = require('express');
const ensureAuth = require('../middleware/ensure-auth');
const Mixtape = require('../models/Mixtape');



module.exports = Router()
  .post('/', ensureAuth, (req, res, next) => {
    Mixtape
      .create(req.body)
      .then(mixtape => {
        return Mixtape
          .findByIdAndUpdate(mixtape._id, { userId: req.user._id }, { new: true });
      })
      .then(mixtape => res.send(mixtape))
      .catch(next);
  })
  // .get('/byuser/:id', (req, res, next) => {
  //   Mixtape
  //     .find({ userId: req.params.id })
  //     .populate('userId')
  //     .then((mixtapes) => res.send(mixtapes))
  //     .catch(next);
  // })
  .get('/:id', (req, res, next) => {
    Mixtape
      .findById(req.params.id)
      .then(mixtape => res.send(mixtape))
      .catch(next);
  })
  .patch('/:id', ensureAuth, (req, res, next) => {
    Mixtape
      .findByIdAndUpdate(req.params.id, req.body, { new: true })
      .then(mixtape => res.send(mixtape))
      .catch(next);
  })
  .delete('/:id', ensureAuth, (req, res, next) => {
    Mixtape
      .findOneAndDelete(req.params._id)
      .then(mixtape => res.send(mixtape))
      .catch(next);
  });
