const express = require('express');
const router = express.Router();
const { 
  getJobs, 
  getJobById, 
  createJob, 
  updateJob, 
  updateJobStatus, 
  deleteJob 
} = require('../controllers/jobController');
const { requireAuth } = require('../middleware/auth');
const { requireRole } = require('../middleware/rbac');

// Public jobs access for careers portal
router.get('/public', getJobs);
router.get('/public/:id', getJobById);

router.use(requireAuth);

router.get('/', getJobs);
router.get('/:id', getJobById);
router.post('/', requireRole(['SUPER_ADMIN', 'HR_MANAGER']), createJob);
router.put('/:id', requireRole(['SUPER_ADMIN', 'HR_MANAGER']), updateJob);
router.patch('/:id/status', requireRole(['SUPER_ADMIN', 'HR_MANAGER']), updateJobStatus);
router.delete('/:id', requireRole(['SUPER_ADMIN', 'HR_MANAGER']), deleteJob);

module.exports = router;
