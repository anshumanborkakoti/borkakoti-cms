const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const commentsSchema = mongoose.Schema({
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Post'
  },
  author: {
    type: String,
    required: true
  },
  comment: {
    type: String,
    required: true
  },
  approved: {
    type: Boolean,
    required: true
  },
  timestamp: {
    type: Date,
    required: true
  }
});
mongoose.plugin(uniqueValidator);
module.exports = mongoose.model('Comments', commentsSchema);
