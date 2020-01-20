const Schema = require('mongoose/lib/schema');
const uniqueValidator = require('mongoose-unique-validator');
const commentsSchema = new Schema({
  postId: {
    type: Schema.Types.ObjectId,
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

commentsSchema.plugin(uniqueValidator);

module.exports = commentsSchema;
