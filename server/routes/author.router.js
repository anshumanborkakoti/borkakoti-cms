const express = require('express');
const authorRouter = express.Router();
const authorController = require('../controllers/author.controller');
const util = require('../utils');

authorRouter.get('', authorController.getAuthors);
if (!util.isProd()) {
  authorRouter.post('', authorController.saveAuthor);
  authorRouter.put('/:id', authorController.updateAuthor);
  authorRouter.delete('/:ids', authorController.deleteAuthors);
}

module.exports = authorRouter;
