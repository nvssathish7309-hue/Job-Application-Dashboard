const express = require('express');
const router = express.Router();
const { getAuditLogs } = require('../controllers/auditController');
const { requireAuth } = require('../middleware/auth');
const { requireRole } = require('../middleware/rbac');

router.use(requireAuth);

router.get('/', requireRole(['SUPER_ADMIN', 'HR_MANAGER']), getAuditLogs);

module.exports = router;
