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
router.patch('/:id/stage', requireRole(['SUPER_ADMIN', 'HR_MANAGER', 'RECRUITER']), updateStage);
router.delete('/:id', requireRole(['SUPER_ADMIN', 'HR_MANAGER', 'RECRUITER']), deleteApplication);

module.exports = router;
