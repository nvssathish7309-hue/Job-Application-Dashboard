const express = require('express');
const router = express.Router();
const { getDashboardMetrics, exportReportsCSV } = require('../controllers/reportController');
const { requireAuth } = require('../middleware/auth');

router.use(requireAuth);

router.get('/metrics', getDashboardMetrics);
router.get('/csv', exportReportsCSV);

module.exports = router;
