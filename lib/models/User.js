const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const schema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  passwordHash:{ 
    type: String,
    required: true
  },
}, {
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      delete ret.passwordHash;
      delete ret.id;
    }
  }
});

schema.virtual('mixtapes', {
  ref: 'Mixtape',
  localField: '_id',
  foreignField: 'userId'
});

schema.virtual('password').set(function(password) {
  this.passwordHash = bcrypt.hashSync(password, 14);
});

schema.statics.findByToken = function(token) {
  try {
    const tokenPayload = jwt.verify(token, process.env.APP_SECRET);
    return Promise.resolve(this.hydrate({
      _id: tokenPayload._id,
      username: tokenPayload.username,
      __v : tokenPayload.__v
    }));
  } catch(err) {
    return Promise.reject(err);
  }
};


schema.statics.authorize = async function({ username, password }) {
  const user = await this.findOne({ username });
  if(!user) {
    const err = new Error('Invalid Username/Password');
    err.status = 401;
    throw err;
  }

  const validPassword = await bcrypt.compare(password, user.passwordHash);
  if(!validPassword) {
    const err = new Error('Invalid Username/Password');
    err.status = 401;
    throw err;
  }
  return user;
};

schema.methods.authToken = function() {
    
  return jwt.sign(this.toJSON(), process.env.APP_SECRET, {
    expiresIn: '24h'
  });
};

module.exports = mongoose.model('User', schema);
