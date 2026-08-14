const express = require('express');
const router = express.Router();
const { getUsers, createUser, updateUser, updateUserRole, toggleUserStatus, updateUserPassword } = require('../controllers/userController');
const { requireAuth } = require('../middleware/auth');
const { requireRole } = require('../middleware/rbac');

router.use(requireAuth);

router.get('/', requireRole(['ADMIN', 'SUPER_ADMIN', 'HR_MANAGER', 'RECRUITER']), getUsers);
router.post('/', requireRole(['ADMIN', 'SUPER_ADMIN', 'HR_MANAGER', 'RECRUITER']), createUser);
router.put('/:id', requireRole(['ADMIN', 'SUPER_ADMIN', 'HR_MANAGER', 'RECRUITER']), updateUser);
router.put('/:id/role', requireRole(['ADMIN', 'SUPER_ADMIN', 'HR_MANAGER', 'RECRUITER']), updateUserRole);
router.put('/:id/password', requireRole(['ADMIN', 'SUPER_ADMIN', 'HR_MANAGER', 'RECRUITER']), updateUserPassword);
router.patch('/:id/toggle-status', requireRole(['ADMIN', 'SUPER_ADMIN', 'HR_MANAGER', 'RECRUITER']), toggleUserStatus);

module.exports = router;
