const express = require('express');
const categoryRouter = express.Router();
const categoryController = require('../controllers/category.controller');

categoryRouter.get('', categoryController.getAllCategories);
categoryRouter.post('', categoryController.saveCategory);
categoryRouter.put('', categoryController.updateCategory);
categoryRouter.delete('/:ids', categoryController.deleteCategories);

module.exports = categoryRouter;
