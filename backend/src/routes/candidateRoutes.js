const express = require('express');
const router = express.Router();
const { 
  getCandidates, 
  getCandidateById, 
  createCandidate, 
  updateCandidate, 
  deleteCandidate,
  shortlistCandidate,
  rejectCandidate 
} = require('../controllers/candidateController');
const { requireAuth, optionalAuth } = require('../middleware/auth');
const { requireRole } = require('../middleware/rbac');
const { uploadResume } = require('../middleware/upload');


// Public & Optional Auth endpoints
router.get('/', optionalAuth, getCandidates);
router.get('/:id', optionalAuth, getCandidateById);
router.post('/', optionalAuth, uploadResume.single('resume'), createCandidate);

// Authenticated Privileged Action routes
router.put('/:id', requireAuth, uploadResume.single('resume'), updateCandidate);
router.delete('/:id', requireAuth, requireRole(['SUPER_ADMIN', 'HR_MANAGER']), deleteCandidate);

router.patch('/:id/shortlist', requireAuth, requireRole(['SUPER_ADMIN', 'HR_MANAGER', 'RECRUITER']), shortlistCandidate);
router.patch('/:id/reject', requireAuth, requireRole(['SUPER_ADMIN', 'HR_MANAGER', 'RECRUITER']), rejectCandidate);

module.exports = router;

