const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
  nativeId: {
    type: String,
    required: true
  },
  nativeSource: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  thumbnailUrl: {
    type: String
  },
  buyLink: {
    type: String
  },
  isMemo: {
    type: Boolean,
    required: true
  },
  tags: [String]
});

const schema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  mixtapeName: {
    type: String,
    required: true
  },
  createdBy: {
    type: String,
    required: true
  },
  songs: {
    type: [songSchema],
    required: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  }
});

module.exports = mongoose.model('Mixtape', schema);
