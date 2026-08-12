const express = require('express');
const router = express.Router();
const { login, getMe, logout, forgotPassword, resetPassword } = require('../controllers/authController');
const { requireAuth } = require('../middleware/auth');

router.post('/login', login);
router.post('/logout', logout);
router.get('/me', requireAuth, getMe);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

module.exports = router;
