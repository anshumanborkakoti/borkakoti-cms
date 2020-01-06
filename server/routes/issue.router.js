const express = require('express');
const issueRouter = express.Router();
const issueController = require('../controllers/issue');
const util = require('../utils');

issueRouter.get('', issueController.getAllIssues);
if (!util.isProd()) {
  issueRouter.post('', issueController.saveIssue);
  issueRouter.put('', issueController.updateIssue);
  issueRouter.delete('/:ids', issueController.deleteIssues);
}

module.exports = issueRouter;
