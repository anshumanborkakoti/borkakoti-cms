const express = require('express');
const commentsRouter = express.Router();
const commentsController = require('../controllers/comments.controller');
const util = require('../utils');
const auth = require('../controllers/auth.controller');

commentsRouter.get('/approved/:postId', commentsController.getApprovedCommentsByPost);
commentsRouter.post('', commentsController.saveComment);
if (!util.isProd()) {
  commentsRouter.get('/unapproved/:postId', auth, commentsController.getUnapprovedCommentsByPost);
  commentsRouter.get('/unapproved', auth, commentsController.getAllUnapprovedComments);
  commentsRouter.get('/:postId', auth, commentsController.getAllCommentsByPost);
  commentsRouter.get('', auth, commentsController.getAllComments);

  commentsRouter.delete('/:commentIds', auth, commentsController.deleteComments);
  commentsRouter.put('/approve/:commentIds', auth, commentsController.approveComments);
}

module.exports = commentsRouter;
