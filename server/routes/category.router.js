const express = require('express');
const categoryRouter = express.Router();
const categoryController = require('../controllers/category.controller');
const util = require('../utils');
const auth = require('../controllers/auth.controller');

categoryRouter.get('', categoryController.getAllCategories);
if (!util.isProd()) {
  categoryRouter.post('', auth, categoryController.saveCategory);
  categoryRouter.put('', auth, categoryController.updateCategory);
  categoryRouter.delete('/:ids', auth, categoryController.deleteCategories);
}

module.exports = categoryRouter;
