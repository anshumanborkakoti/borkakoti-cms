const commentsSchema = require('./comments.schema');
const connection = require('../transactional.connection');
const utils = require('../utils');

const commentsModel = async () => {
  let model = null;
  try {
    let conn = await connection;
    model = conn.model('Comments', commentsSchema);
  } catch (e) {
    utils.logError('Error instantiating comments model', e);
  }
  return model;
};

module.exports.CommentsModel = commentsModel();
