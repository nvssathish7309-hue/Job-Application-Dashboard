const express = require('express');
const router = express.Router();
const { 
  getApplications, 
  getApplicationById, 
  updateStage,
  deleteApplication
} = require('../controllers/applicationController');
const { requireAuth } = require('../middleware/auth');
const { requireRole } = require('../middleware/rbac');

router.use(requireAuth);

router.get('/', getApplications);
router.get('/:id', getApplicationById);
router.route('/:id/stage')
  .patch(requireRole(['SUPER_ADMIN', 'HR_MANAGER', 'RECRUITER', 'INTERVIEWER', 'ADMIN']), updateStage)
  .put(requireRole(['SUPER_ADMIN', 'HR_MANAGER', 'RECRUITER', 'INTERVIEWER', 'ADMIN']), updateStage)
  .post(requireRole(['SUPER_ADMIN', 'HR_MANAGER', 'RECRUITER', 'INTERVIEWER', 'ADMIN']), updateStage);

router.delete('/:id', requireRole(['SUPER_ADMIN', 'HR_MANAGER', 'RECRUITER']), deleteApplication);

module.exports = router;
