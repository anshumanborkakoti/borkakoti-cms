const express = require('express');
const commentsRouter = express.Router();
const commentsController = require('../controllers/comments.controller');
const util = require('../utils');

commentsRouter.get('/approved/:postId', commentsController.getApprovedCommentsByPost);
commentsRouter.post('', commentsController.saveComment);
if (!util.isProd()) {
  commentsRouter.get('', commentsController.getAllComments);
  commentsRouter.get('/:postId', commentsController.getAllCommentsByPost);
  commentsRouter.delete('/:commentIds', commentsController.deleteComments);
  commentsRouter.put('/approve', commentsController.approveComments);
  commentsRouter.get('/unapproved', commentsController.getAllUnapprovedComments);
}

module.exports = commentsRouter;
