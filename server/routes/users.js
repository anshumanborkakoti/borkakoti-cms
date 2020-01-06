const express = require('express');
const userRouter = express.Router();
const userController = require('../controllers/user');
const util = require('../utils');

userRouter.get('', userController.getUsers);
if (!util.isProd()) {
  userRouter.post('', userController.saveUser);
  userRouter.put('/:id', userController.updateUser);
  userRouter.delete('/:id', userController.deleteUser);
}

module.exports = userRouter;
