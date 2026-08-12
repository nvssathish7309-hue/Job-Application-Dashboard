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
const { requireAuth } = require('../middleware/auth');
const { requireRole } = require('../middleware/rbac');
const { uploadResume } = require('../middleware/upload');

router.use(requireAuth);

router.get('/', getCandidates);
router.get('/:id', getCandidateById);

router.post('/', uploadResume.single('resume'), createCandidate);
router.put('/:id', uploadResume.single('resume'), updateCandidate);
router.delete('/:id', requireRole(['SUPER_ADMIN', 'HR_MANAGER']), deleteCandidate);

router.patch('/:id/shortlist', requireRole(['SUPER_ADMIN', 'HR_MANAGER', 'RECRUITER']), shortlistCandidate);
router.patch('/:id/reject', requireRole(['SUPER_ADMIN', 'HR_MANAGER', 'RECRUITER']), rejectCandidate);

module.exports = router;
