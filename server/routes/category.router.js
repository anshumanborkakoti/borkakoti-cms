const express = require('express');
const categoryRouter = express.Router();
const categoryController = require('../controllers/category.controller');
const util = require('../utils');

categoryRouter.get('', categoryController.getAllCategories);
if (!util.isProd()) {
  categoryRouter.post('', categoryController.saveCategory);
  categoryRouter.put('', categoryController.updateCategory);
  categoryRouter.delete('/:ids', categoryController.deleteCategories);
}

module.exports = categoryRouter;
