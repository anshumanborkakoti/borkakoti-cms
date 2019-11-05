const express = require('express');
const issueRouter = express.Router();
const issueController = require('../controllers/issue');

issueRouter.get('', issueController.getAllIssues);
issueRouter.post('', issueController.saveIssue);
issueRouter.put('', issueController.updateIssue);
issueRouter.delete('/:ids', issueController.deleteIssues);

module.exports = issueRouter;
