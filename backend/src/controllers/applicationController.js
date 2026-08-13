const Application = require('../models/Application');
const Candidate = require('../models/Candidate');
const { generateCustomId } = require('../utils/idGenerator');
const { createAuditLog } = require('../services/auditService');

const getApplications = async (req, res, next) => {
  try {
    const { stage, status, jobId } = req.query;
    const query = {};

    if (stage && stage !== 'All') query.stage = stage;
    if (status && status !== 'All') query.status = status;
    if (jobId) query.jobId = jobId;

    const applications = await Application.find(query)
      .populate('candidateId')
      .populate('jobId')
      .populate('recruiterId', 'firstName lastName email')
      .sort({ updatedAt: -1 });

    res.status(200).json({ success: true, data: applications });
  } catch (error) {
    next(error);
  }
};

const getApplicationById = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('candidateId')
      .populate('jobId')
      .populate('recruiterId', 'firstName lastName email')
      .populate('stageHistory.changedBy', 'firstName lastName email');

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found.' });
    }

    res.status(200).json({ success: true, data: application });
  } catch (error) {
    next(error);
  }
};

const updateStage = async (req, res, next) => {
  try {
    const { stage, remarks } = req.body;
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found.' });
    }

    const oldStage = application.stage;
    application.stage = stage;
    application.status = stage;
    application.stageHistory.push({
      stage,
      changedBy: req.user ? req.user._id : null,
      changedAt: new Date(),
      remarks: remarks || `Stage updated to ${stage}`
    });

    await application.save();

    // Also update Candidate status
    if (application.candidateId) {
      await Candidate.findByIdAndUpdate(application.candidateId, { status: stage });
    }

    await createAuditLog({
      req,
      action: 'UPDATE_APPLICATION_STAGE',
      entity: 'Application',
      entityId: application.applicationId,
      oldValue: oldStage,
      newValue: stage,
      description: `Moved application ${application.applicationId} from ${oldStage} to ${stage}`
    });

    res.status(200).json({ success: true, message: `Application moved to ${stage}`, data: application });
  } catch (error) {
    next(error);
  }
};

const deleteApplication = async (req, res, next) => {
  try {
    const application = await Application.findByIdAndDelete(req.params.id);
    if (application && application.candidateId) {
      await Candidate.findByIdAndDelete(application.candidateId);
    }
    await createAuditLog({
      req,
      action: 'DELETE_APPLICATION',
      entity: 'Application',
      entityId: req.params.id,
      description: `Deleted application ${req.params.id}`
    });
    res.status(200).json({ success: true, message: 'Application deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getApplications,
  getApplicationById,
  updateStage,
  deleteApplication
};
