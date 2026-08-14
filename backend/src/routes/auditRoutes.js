const express = require('express');
const router = express.Router();
const { getAuditLogs, deleteAuditLog, clearAllAuditLogs } = require('../controllers/auditController');
const { requireAuth } = require('../middleware/auth');
const { requireRole } = require('../middleware/rbac');

router.use(requireAuth);

router.get('/', requireRole(['ADMIN', 'SUPER_ADMIN', 'HR_MANAGER', 'RECRUITER']), getAuditLogs);
router.delete('/:id', requireRole(['ADMIN', 'SUPER_ADMIN', 'HR_MANAGER', 'RECRUITER']), deleteAuditLog);
router.delete('/', requireRole(['ADMIN', 'SUPER_ADMIN', 'HR_MANAGER', 'RECRUITER']), clearAllAuditLogs);

module.exports = router;
