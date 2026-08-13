const express = require('express');
const router = express.Router();
const { getAuditLogs, deleteAuditLog, clearAllAuditLogs } = require('../controllers/auditController');
const { requireAuth } = require('../middleware/auth');
const { requireRole } = require('../middleware/rbac');

router.use(requireAuth);

router.get('/', requireRole(['SUPER_ADMIN', 'HR_MANAGER']), getAuditLogs);
router.delete('/:id', requireRole(['SUPER_ADMIN', 'HR_MANAGER']), deleteAuditLog);
router.delete('/', requireRole(['SUPER_ADMIN', 'HR_MANAGER']), clearAllAuditLogs);

module.exports = router;
