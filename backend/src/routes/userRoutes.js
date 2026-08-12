const express = require('express');
const router = express.Router();
const { getUsers, createUser, updateUserRole, toggleUserStatus } = require('../controllers/userController');
const { requireAuth } = require('../middleware/auth');
const { requireRole } = require('../middleware/rbac');

router.use(requireAuth);

router.get('/', requireRole(['SUPER_ADMIN', 'HR_MANAGER']), getUsers);
router.post('/', requireRole(['SUPER_ADMIN']), createUser);
router.put('/:id/role', requireRole(['SUPER_ADMIN']), updateUserRole);
router.patch('/:id/toggle-status', requireRole(['SUPER_ADMIN']), toggleUserStatus);

module.exports = router;
