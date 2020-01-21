const express = require('express');
const postRouter = express.Router();
const postController = require('../controllers/post.controller');
const util = require('../utils');
const auth = require('../controllers/auth.controller');

postRouter.get('', postController.getPosts);
if (!util.isProd()) {
  postRouter.post('', auth, postController.savePost);
  postRouter.put('', auth, postController.updatePost);
  postRouter.delete('/:ids', auth, postController.deletePosts);
}

module.exports = postRouter;
