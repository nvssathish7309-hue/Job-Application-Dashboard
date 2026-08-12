const express = require('express');
const router = express.Router();
const { 
  getInterviews, 
  getInterviewById, 
  scheduleInterview, 
  submitFeedback 
} = require('../controllers/interviewController');
const { requireAuth } = require('../middleware/auth');
const { requireRole } = require('../middleware/rbac');

router.use(requireAuth);

router.get('/', getInterviews);
router.get('/:id', getInterviewById);
router.post('/', requireRole(['SUPER_ADMIN', 'HR_MANAGER', 'RECRUITER']), scheduleInterview);
router.post('/:id/feedback', requireRole(['SUPER_ADMIN', 'HR_MANAGER', 'RECRUITER', 'INTERVIEWER']), submitFeedback);

module.exports = router;
