const express = require('express');
const userRouter = express.Router();
const userController = require('../controllers/user');
const util = require('../utils');
const auth = require('../controllers/auth.controller');

userRouter.get('', userController.getUsers);
userRouter.post("/login", userController.login);

if (!util.isProd()) {
  userRouter.post('', auth, userController.saveUser);
  userRouter.put('/:id', auth, userController.updateUser);
  userRouter.delete('/:id', auth, userController.deleteUser);
}

module.exports = userRouter;
