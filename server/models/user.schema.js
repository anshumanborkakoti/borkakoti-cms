const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
  email: {
    required: true,
    unique: true,
    type: String
  },
  password: {
    required: true,
    type: String
  },
  name: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: false
  },
  roles: {
    type: [String],
    required: false
  }
});
mongoose.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
