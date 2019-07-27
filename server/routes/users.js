const express = require('express');
const userRouter = express.Router();
const userController = require('../controllers/user');

userRouter.get('', userController.getUsers);
userRouter.post('', userController.saveUser);
userRouter.put('/:id', userController.updateUser);
userRouter.delete('/:id', userController.deleteUser);

module.exports = userRouter;
