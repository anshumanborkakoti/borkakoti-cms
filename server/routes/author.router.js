const express = require('express');
const authorRouter = express.Router();
const authorController = require('../controllers/author.controller');

authorRouter.get('', authorController.getAuthors);
authorRouter.post('', authorController.saveAuthor);
authorRouter.put('/:id', authorController.updateAuthor);
authorRouter.delete('/:ids', authorController.deleteAuthors);

module.exports = authorRouter;
