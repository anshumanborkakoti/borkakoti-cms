const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const imageSchema = mongoose.Schema({
  publicId: {
    required: true,
    unique: true,
    type: String
  },
  format: {
    type: String
  },
  tags: [{
    type: String
  }],
  secureUrl: {
    type: String
  },
  url: {
    type: String
  }
});
mongoose.plugin(uniqueValidator);
module.exports = mongoose.model('Image', imageSchema);
