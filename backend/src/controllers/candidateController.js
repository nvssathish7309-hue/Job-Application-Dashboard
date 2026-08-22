const Candidate = require('../models/Candidate');
const Application = require('../models/Application');
const Notification = require('../models/Notification');
const { generateCustomId } = require('../utils/idGenerator');
const { createAuditLog } = require('../services/auditService');

const mongoose = require('mongoose');

const escapeRegex = (text) => text ? String(text).replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&') : '';

const findCandidateByIdOrCustomId = async (idParam) => {
  if (!idParam) return null;
  const isMongoId = mongoose.isValidObjectId(idParam);
  let candidate = null;
  if (isMongoId) {
    candidate = await Candidate.findById(idParam);
  }
  if (!candidate) {
    candidate = await Candidate.findOne({
      $or: [
        { id: idParam },
        { candidateId: idParam }
      ]
    });
  }
  return candidate;
};

const getCandidates = async (req, res, next) => {
  try {
    const { search, role, status, experience, sortBy = 'createdAt', order = 'desc', page = 1, limit = 50 } = req.query;

    const query = {};

    if (search) {
      const safeSearch = escapeRegex(search);
      query.$or = [
        { fullName: { $regex: safeSearch, $options: 'i' } },
        { email: { $regex: safeSearch, $options: 'i' } },
        { role: { $regex: safeSearch, $options: 'i' } },
        { skills: { $in: [new RegExp(safeSearch, 'i')] } }
      ];
    }

    if (role && role !== 'All') {
      const safeRole = escapeRegex(role);
      query.role = { $regex: new RegExp(`^${safeRole}$`, 'i') };
    }

    if (status && status !== 'All') {
      const safeStatus = escapeRegex(status);
      query.status = { $regex: new RegExp(`^${safeStatus}$`, 'i') };
    }

    if (experience && experience !== 'All') {
      if (experience === '0-2') query.experience = { $regex: /0|1|2|Fresher/i };
      else if (experience === '3-5') query.experience = { $regex: /3|4|5/i };
      else if (experience === '5+') query.experience = { $regex: /6|7|8|9|10|\+/i };
    }

    const sortOrder = order === 'asc' ? 1 : -1;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const candidates = await Candidate.find(query)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(parseInt(limit));

    const candidateIds = candidates.map(c => c._id);
    const applications = await Application.find({ candidateId: { $in: candidateIds } }).populate('jobId');

    const candidatesWithApps = candidates.map(cand => {
      const candApps = applications.filter(app => String(app.candidateId) === String(cand._id));
      return {
        ...cand.toJSON(),
        applications: candApps,
        applicationsCount: candApps.length
      };
    });

    const uniqueCandidates = [];
    const seenCandEmails = new Set();
    const seenCandNames = new Set();
    const duplicateCandIdsToDelete = [];

    candidatesWithApps.forEach(cand => {
      const emailKey = (cand.email || '').toLowerCase().trim();
      const nameKey = (cand.fullName || cand.name || '').toLowerCase().replace(/\s+/g, ' ').trim();

      if ((emailKey && seenCandEmails.has(emailKey)) || (nameKey && seenCandNames.has(nameKey))) {
        duplicateCandIdsToDelete.push(cand._id);
      } else {
        if (emailKey) seenCandEmails.add(emailKey);
        if (nameKey) seenCandNames.add(nameKey);
        uniqueCandidates.push(cand);
      }
    });

    if (duplicateCandIdsToDelete.length > 0) {
      Candidate.deleteMany({ _id: { $in: duplicateCandIdsToDelete } }).catch(() => {});
    }

    const total = uniqueCandidates.length;

    res.status(200).json({
      success: true,
      data: uniqueCandidates,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    next(error);
  }
};

const getCandidateById = async (req, res, next) => {
  try {
    const candidate = await findCandidateByIdOrCustomId(req.params.id);
    if (!candidate) {
      return res.status(404).json({ success: false, message: 'Candidate not found.' });
    }
    const applications = await Application.find({ candidateId: candidate._id }).populate('jobId');
    res.status(200).json({
      success: true,
      data: {
        ...candidate.toJSON(),
        applications,
        applicationsCount: applications.length
      }
    });
  } catch (error) {
    next(error);
  }
};

const createCandidate = async (req, res, next) => {
  try {
    const { fullName, email, phone, role, skills, education, experience, projects, jobId, source } = req.body;

    if (!fullName || !email || !phone || !role) {
      return res.status(400).json({ success: false, message: 'Full name, email, phone, and role are required.' });
    }

    const cleanEmail = email.toLowerCase().trim();

    const parsedSkills = Array.isArray(skills) 
      ? skills 
      : typeof skills === 'string' ? skills.split(',').map(s => s.trim()).filter(Boolean) : [];

    const parsedProjects = Array.isArray(projects) 
      ? projects 
      : typeof projects === 'string' ? projects.split(',').map(p => p.trim()).filter(Boolean) : [];

    let resumeData = {};
    if (req.file) {
      resumeData = {
        filename: req.file.filename,
        originalName: req.file.originalname,
        path: `/uploads/${req.file.filename}`,
        mimeType: req.file.mimetype,
        size: req.file.size,
        uploadedAt: new Date()
      };
    }

    // Check if candidate with this email already exists
    let candidate = await Candidate.findOne({ email: cleanEmail });

    if (!candidate) {
      const candidateId = await generateCustomId(Candidate, 'CAN');
      candidate = await Candidate.create({
        candidateId,
        fullName,
        email: cleanEmail,
        phone,
        role,
        skills: parsedSkills,
        education: education || 'Bachelor Degree',
        experience: experience || 'Fresher',
        projects: parsedProjects,
        resume: resumeData,
        status: 'New',
        createdBy: req.user ? req.user._id : null
      });
    } else {
      // Update existing candidate info with latest application data
      candidate.fullName = fullName || candidate.fullName;
      candidate.phone = phone || candidate.phone;
      candidate.role = role || candidate.role;
      if (parsedSkills.length > 0) candidate.skills = parsedSkills;
      if (experience) candidate.experience = experience;
      if (education) candidate.education = education;
      if (req.file) candidate.resume = resumeData;
      candidate.status = 'New';
      await candidate.save();
    }

    // Always create an Application entry stored in the Applications & Candidates list
    const applicationId = await generateCustomId(Application, 'APP');
    const newApplication = await Application.create({
      applicationId,
      candidateId: candidate._id,
      jobId: jobId || null,
      status: 'New',
      stage: 'New',
      source: source || (req.user ? 'Candidate Portal' : 'Careers Website'),
      appliedAt: new Date(),
      stageHistory: [{
        stage: 'New',
        changedBy: req.user ? req.user._id : null,
        remarks: `Applied for ${role}`
      }]
    });

    // Notify HR / Admins
    try {
      await Notification.create({
        title: 'New Job Application Submitted',
        message: `${fullName} applied for ${role} (${applicationId})`,
        type: 'APPLICATION',
        relatedId: newApplication._id
      });
    } catch (e) {
      console.warn('Failed to create application notification:', e.message);
    }

    await createAuditLog({
      req,
      action: 'CREATE_CANDIDATE',
      entity: 'Candidate',
      entityId: candidate.candidateId,
      newValue: candidate.fullName,
      description: `Created candidate application ${applicationId} for ${candidate.fullName} (${role})`
    });

    res.status(201).json({
      success: true,
      message: 'Candidate application submitted and stored in candidates list successfully',
      data: candidate
    });
  } catch (error) {
    next(error);
  }
};

const updateCandidate = async (req, res, next) => {
  try {
    const candidate = await findCandidateByIdOrCustomId(req.params.id);
    if (!candidate) {
      return res.status(404).json({ success: false, message: 'Candidate not found.' });
    }

    const oldStatus = candidate.status;
    Object.assign(candidate, req.body);
    if (req.user) candidate.updatedBy = req.user._id;

    if (req.file) {
      candidate.resume = {
        filename: req.file.filename,
        originalName: req.file.originalname,
        path: `/uploads/${req.file.filename}`,
        mimeType: req.file.mimetype,
        size: req.file.size,
        uploadedAt: new Date()
      };
    }

    await candidate.save();

    await createAuditLog({
      req,
      action: 'UPDATE_CANDIDATE',
      entity: 'Candidate',
      entityId: candidate.candidateId,
      oldValue: oldStatus,
      newValue: candidate.status,
      description: `Updated candidate ${candidate.candidateId}`
    });

    res.status(200).json({ success: true, message: 'Candidate updated successfully', data: candidate });
  } catch (error) {
    next(error);
  }
};

const deleteCandidate = async (req, res, next) => {
  try {
    const candidate = await findCandidateByIdOrCustomId(req.params.id);
    if (!candidate) {
      return res.status(404).json({ success: false, message: 'Candidate not found.' });
    }

    await Candidate.findByIdAndDelete(candidate._id);

    await createAuditLog({
      req,
      action: 'DELETE_CANDIDATE',
      entity: 'Candidate',
      entityId: candidate.candidateId,
      description: `Deleted candidate ${candidate.candidateId} (${candidate.fullName})`
    });

    res.status(200).json({ success: true, message: 'Candidate deleted successfully' });
  } catch (error) {
    next(error);
  }
};

const shortlistCandidate = async (req, res, next) => {
  try {
    const candidate = await findCandidateByIdOrCustomId(req.params.id);
    if (!candidate) {
      return res.status(404).json({ success: false, message: 'Candidate not found.' });
    }

    const oldStatus = candidate.status;
    candidate.status = 'Shortlisted';
    await candidate.save();

    await Application.updateMany(
      { candidateId: candidate._id },
      { 
        $set: { status: 'Shortlisted', stage: 'Shortlisted' },
        $push: { 
          stageHistory: { 
            stage: 'Shortlisted', 
            changedBy: req.user ? req.user._id : null,
            remarks: req.body.remarks || 'Shortlisted by HR'
          } 
        }
      }
    );

    await createAuditLog({
      req,
      action: 'SHORTLIST_CANDIDATE',
      entity: 'Candidate',
      entityId: candidate.candidateId,
      oldValue: oldStatus,
      newValue: 'Shortlisted',
      description: `Shortlisted candidate ${candidate.candidateId} (${candidate.fullName})`
    });

    res.status(200).json({ success: true, message: 'Candidate shortlisted successfully', data: candidate });
  } catch (error) {
    next(error);
  }
};

const rejectCandidate = async (req, res, next) => {
  try {
    const candidate = await findCandidateByIdOrCustomId(req.params.id);
    if (!candidate) {
      return res.status(404).json({ success: false, message: 'Candidate not found.' });
    }

    const oldStatus = candidate.status;
    candidate.status = 'Rejected';
    if (req.body.reason) {
      candidate.notes.push(`Rejection reason: ${req.body.reason}`);
    }
    await candidate.save();

    await Application.updateMany(
      { candidateId: candidate._id },
      { 
        $set: { status: 'Rejected', stage: 'Rejected' },
        $push: { 
          stageHistory: { 
            stage: 'Rejected', 
            changedBy: req.user ? req.user._id : null,
            remarks: req.body.reason || 'Rejected during review'
          } 
        }
      }
    );

    await createAuditLog({
      req,
      action: 'REJECT_CANDIDATE',
      entity: 'Candidate',
      entityId: candidate.candidateId,
      oldValue: oldStatus,
      newValue: 'Rejected',
      description: `Rejected candidate ${candidate.candidateId} (${candidate.fullName})`
    });

    res.status(200).json({ success: true, message: 'Candidate rejected', data: candidate });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCandidates,
  getCandidateById,
  createCandidate,
  updateCandidate,
  deleteCandidate,
  shortlistCandidate,
  rejectCandidate
};
