const express = require('express');
const router = express.Router();
const { getUsers, createUser, toggleUserStatus } = require('../controllers/userController');
const { requireAuth } = require('../middleware/auth');
const { requireRole } = require('../middleware/rbac');

router.use(requireAuth);

router.get('/', requireRole(['SUPER_ADMIN', 'HR_MANAGER']), getUsers);
router.post('/', requireRole(['SUPER_ADMIN']), createUser);
router.patch('/:id/toggle-status', requireRole(['SUPER_ADMIN']), toggleUserStatus);

module.exports = router;
