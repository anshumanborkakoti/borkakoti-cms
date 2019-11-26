const express = require('express');
const postRouter = express.Router();
const postController = require('../controllers/post.controller');

postRouter.get('', postController.getPosts);
postRouter.post('', postController.savePost);
postRouter.put('', postController.updatePost);
postRouter.delete('/:ids', postController.deletePosts);

module.exports = postRouter;
