const express = require('express');
const router = express.Router();
const { getDashboardMetrics, exportReportsCSV } = require('../controllers/reportController');
const { requireAuth, optionalAuth } = require('../middleware/auth');

router.get('/metrics', optionalAuth, getDashboardMetrics);
router.get('/csv', requireAuth, exportReportsCSV);

module.exports = router;

