const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const thumbnail = mongoose.Schema({
  image: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Image'
  },
  caption: {
    type: String
  },
  content: {
    type: String
  },
  footer: {
    type: String
  },
  header: {
    required: true,
    type: String
  }
});

mongoose.plugin(uniqueValidator);
module.exports = mongoose.model('Thumbnail', thumbnail);
