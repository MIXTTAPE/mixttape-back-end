const { Router } = require('express');
const User = require('../models/User');

module.exports = Router()
  .get('/:id', (req, res, next) => {
    User
      .findById(req.params.id)
      .populate('mixtapes')
      .send(userTapes => res.send(userTapes))
      .catch(next);
  });
