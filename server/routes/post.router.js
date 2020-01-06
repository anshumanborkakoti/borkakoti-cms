const express = require('express');
const postRouter = express.Router();
const postController = require('../controllers/post.controller');
const util = require('../utils');

postRouter.get('', postController.getPosts);
if (!util.isProd()) {
  postRouter.post('', postController.savePost);
  postRouter.put('', postController.updatePost);
  postRouter.delete('/:ids', postController.deletePosts);
}

module.exports = postRouter;
