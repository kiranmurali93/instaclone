/* eslint-disable consistent-return */
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { JWT_SECRET } = require('../keys');

const User = mongoose.model('User');

module.exports = ((req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({ error: 'you are not signed in' });
  }
  const token = authorization.replace('Bearer ', '');
  jwt.verify(token, JWT_SECRET, (err, payload) => {
    if (err) {
      return res.status(401).json({ error: 'you are not signed in' });
    }
    const { id } = payload;
    User.findById(id).then((userdata) => {
      req.user = userdata;
      next();
    });
  });
});
