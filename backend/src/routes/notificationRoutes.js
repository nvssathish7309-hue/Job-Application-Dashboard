const express = require('express');
const router = express.Router();
const { getNotifications, markAsRead, markAllAsRead } = require('../controllers/notificationController');
const { requireAuth } = require('../middleware/auth');

router.use(requireAuth);

router.get('/', getNotifications);
router.patch('/:id/read', markAsRead);
router.patch('/read-all', markAllAsRead);

module.exports = router;
