const Application = require('../models/Application');
const Candidate = require('../models/Candidate');
const mongoose = require('mongoose');
const { generateCustomId } = require('../utils/idGenerator');
const { createAuditLog } = require('../services/auditService');

const findApplicationByIdOrCustomId = async (idParam) => {
  if (!idParam) return null;
  const isMongoId = mongoose.isValidObjectId(idParam);
  let app = null;
  if (isMongoId) {
    app = await Application.findById(idParam);
  }
  if (!app) {
    app = await Application.findOne({
      $or: [
        { id: idParam },
        { applicationId: idParam }
      ]
    });
  }
  return app;
};

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
    const application = await findApplicationByIdOrCustomId(req.params.id);

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found.' });
    }

    await application.populate('candidateId');
    await application.populate('jobId');
    await application.populate('recruiterId', 'firstName lastName email');
    await application.populate('stageHistory.changedBy', 'firstName lastName email');

    res.status(200).json({ success: true, data: application });
  } catch (error) {
    next(error);
  }
};

const updateStage = async (req, res, next) => {
  try {
    const { stage, remarks } = req.body;
    let application = await findApplicationByIdOrCustomId(req.params.id);

    if (!application) {
      // Fallback: search if ID belongs to Candidate or custom candidateId
      const isMongoId = mongoose.isValidObjectId(req.params.id);
      const candidate = isMongoId 
        ? await Candidate.findById(req.params.id) 
        : await Candidate.findOne({ $or: [{ id: req.params.id }, { candidateId: req.params.id }] });

      if (candidate) {
        candidate.status = stage;
        await candidate.save();

        application = await Application.findOne({ candidateId: candidate._id });
        if (!application) {
          const applicationId = await generateCustomId(Application, 'APP');
          application = await Application.create({
            applicationId,
            candidateId: candidate._id,
            status: stage,
            stage: stage,
            stageHistory: [{ stage, changedBy: req.user ? req.user._id : null, remarks: remarks || `Moved to ${stage}` }]
          });
        }
      }
    }

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

    if (application.candidateId) {
      await Candidate.findByIdAndUpdate(application.candidateId, { status: stage });
    }

    await createAuditLog({
      req,
      action: 'UPDATE_APPLICATION_STAGE',
      entity: 'Application',
      entityId: application.applicationId || application._id,
      oldValue: oldStage,
      newValue: stage,
      description: `Moved application ${application.applicationId || application._id} from ${oldStage} to ${stage}`
    });

    res.status(200).json({ success: true, message: `Application moved to ${stage}`, data: application });
  } catch (error) {
    next(error);
  }
};

const deleteApplication = async (req, res, next) => {
  try {
    const application = await findApplicationByIdOrCustomId(req.params.id);
    if (application) {
      await Application.findByIdAndDelete(application._id);
      if (application.candidateId) {
        await Candidate.findByIdAndDelete(application.candidateId);
      }
    } else {
      const isMongoId = mongoose.isValidObjectId(req.params.id);
      const candidate = isMongoId 
        ? await Candidate.findById(req.params.id) 
        : await Candidate.findOne({ $or: [{ id: req.params.id }, { candidateId: req.params.id }] });
      if (candidate) {
        await Candidate.findByIdAndDelete(candidate._id);
      }
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
