const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const authorsSchema = mongoose.Schema({
  email: {
    required: true,
    unique: true,
    type: String
  },
  password: {
    required: false,
    type: String
  },
  name: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: false
  },
  address: {
    type: String,
    required: false
  },
  roles: {
    type: [String],
    required: false
  },
  details: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Thumbnail'
  }
});
mongoose.plugin(uniqueValidator);

module.exports = mongoose.model('Author', authorsSchema);
