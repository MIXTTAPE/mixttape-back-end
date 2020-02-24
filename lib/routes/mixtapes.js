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
  });
