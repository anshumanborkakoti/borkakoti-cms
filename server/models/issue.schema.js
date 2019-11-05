const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const issueSchema = mongoose.Schema({
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
  published: {
    type: Boolean
  },
  archived: {
    type: Boolean
  },
  pdfUrl: {
    type: String
  },
  latest: {
    type: Boolean
  },
  posts: {
    type: String //TODO correct
  },

});
mongoose.plugin(uniqueValidator);
module.exports = mongoose.model('Issue', issueSchema);
