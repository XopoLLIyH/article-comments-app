const express = require('express');
const articleController = require('../controllers/article-controller');
const commentController = require('../controllers/comment-controller');
const asyncHandler = require('../utils/async-handler');

const router = express.Router();

router.get('/articles/', asyncHandler(articleController.list));
router.post('/article/', asyncHandler(articleController.create));
router.get('/article/:id/', asyncHandler(articleController.get));
router.patch('/article/:id/', asyncHandler(articleController.update));
router.delete('/article/:id/', asyncHandler(articleController.remove));

router.post('/article/:id/comment/', asyncHandler(commentController.create));
router.get('/article/:id/comments/', asyncHandler(commentController.list));
router.get('/article/:id/comment/:commentId/', asyncHandler(commentController.get));
router.patch('/article/:id/comment/:commentId/', asyncHandler(commentController.update));
router.delete('/article/:id/comment/:commentId/', asyncHandler(commentController.remove));

module.exports = router;

