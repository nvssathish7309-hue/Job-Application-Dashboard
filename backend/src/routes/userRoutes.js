const express = require('express');
const router = express.Router();
const { getUsers, createUser, updateUser, updateUserRole, toggleUserStatus, updateUserPassword } = require('../controllers/userController');
const { requireAuth } = require('../middleware/auth');
const { requireRole } = require('../middleware/rbac');

router.use(requireAuth);

router.get('/', requireRole(['SUPER_ADMIN', 'HR_MANAGER']), getUsers);
router.post('/', requireRole(['SUPER_ADMIN', 'HR_MANAGER']), createUser);
router.put('/:id', requireRole(['SUPER_ADMIN', 'HR_MANAGER']), updateUser);
router.put('/:id/role', requireRole(['SUPER_ADMIN', 'HR_MANAGER']), updateUserRole);
router.put('/:id/password', requireRole(['SUPER_ADMIN', 'HR_MANAGER']), updateUserPassword);
router.patch('/:id/toggle-status', requireRole(['SUPER_ADMIN', 'HR_MANAGER']), toggleUserStatus);

module.exports = router;
