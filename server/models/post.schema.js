const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const PostSchema = mongoose.Schema({

});

mongoose.plugin(uniqueValidator);
module.exports = mongoose.model('Post', PostSchema);
