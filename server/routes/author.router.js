const express = require('express');
const authorRouter = express.Router();
const authorController = require('../controllers/author.controller');
const auth = require('../controllers/auth.controller');
const util = require('../utils');

authorRouter.get('', authorController.getAuthors);
if (!util.isProd()) {
  authorRouter.post('', auth, authorController.saveAuthor);
  authorRouter.put('/:id', auth, authorController.updateAuthor);
  authorRouter.delete('/:ids', auth, authorController.deleteAuthors);
}

module.exports = authorRouter;
