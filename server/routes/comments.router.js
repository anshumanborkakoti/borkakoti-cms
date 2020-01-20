const express = require('express');
const commentsRouter = express.Router();
const commentsController = require('../controllers/comments.controller');
const util = require('../utils');

commentsRouter.get('/approved/:postId', commentsController.getApprovedCommentsByPost);
commentsRouter.post('', commentsController.saveComment);
if (!util.isProd()) {
  commentsRouter.get('/unapproved/:postId', commentsController.getUnapprovedCommentsByPost);
  commentsRouter.get('/unapproved', commentsController.getAllUnapprovedComments);
  commentsRouter.get('/:postId', commentsController.getAllCommentsByPost);
  commentsRouter.get('', commentsController.getAllComments);

  commentsRouter.delete('/:commentIds', commentsController.deleteComments);
  commentsRouter.put('/approve/:commentIds', commentsController.approveComments);
}

module.exports = commentsRouter;
