const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const PostSchema = mongoose.Schema({
  authors: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Author'
  }],
  editHistory: [{
    editor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    comment: String,
    date: Date
  }],
  archived: Boolean,
  thumbnail: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Thumbnail'
  },
  detail: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Thumbnail'
  }],
  approved: Boolean,
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  },
  issues: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Issue'
  }],
  label: {
    type: String,
    required: true
  },
  content: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Thumbnail'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

mongoose.plugin(uniqueValidator);
module.exports = mongoose.model('Post', PostSchema);
