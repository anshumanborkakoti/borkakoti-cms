const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const categorySchema = mongoose.Schema({
  name: {
    required: true,
    type: String
  },
  label: {
    required: true,
    type: String
  },
  thumbnail: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Thumbnail'
  },
  minPostDetail: {
    type: Number
  },
  maxPostDetail: {
    type: Number
  }
});
mongoose.plugin(uniqueValidator);
module.exports = mongoose.model('Category', categorySchema);
