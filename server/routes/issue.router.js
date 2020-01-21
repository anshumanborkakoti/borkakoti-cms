const express = require('express');
const issueRouter = express.Router();
const issueController = require('../controllers/issue');
const util = require('../utils');
const auth = require('../controllers/auth.controller');

issueRouter.get('', issueController.getAllIssues);
if (!util.isProd()) {
  issueRouter.post('', auth, issueController.saveIssue);
  issueRouter.put('', auth, issueController.updateIssue);
  issueRouter.delete('/:ids', auth, issueController.deleteIssues);
}

module.exports = issueRouter;
