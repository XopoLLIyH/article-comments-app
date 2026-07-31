const express = require('express');
const analyticsController = require('../controllers/analytics-controller');
const asyncHandler = require('../utils/async-handler');

const router = express.Router();

router.get('/analytic/comments/', asyncHandler(analyticsController.commentsByPeriod));

module.exports = router;

