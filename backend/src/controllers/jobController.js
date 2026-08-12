const Job = require('../models/Job');
const { generateCustomId } = require('../utils/idGenerator');
const { createAuditLog } = require('../services/auditService');

const getJobs = async (req, res, next) => {
  try {
    const { status, department, search } = req.query;
    const query = {};

    if (status && status !== 'All') query.status = status;
    if (department && department !== 'All') query.department = department;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { department: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }

    const jobs = await Job.find(query)
      .populate('createdBy', 'firstName lastName email')
      .populate('assignedRecruiter', 'firstName lastName email')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: jobs });
  } catch (error) {
    next(error);
  }
};

const getJobById = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('createdBy', 'firstName lastName email')
      .populate('assignedRecruiter', 'firstName lastName email');

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found.' });
    }
    res.status(200).json({ success: true, data: job });
  } catch (error) {
    next(error);
  }
};

const createJob = async (req, res, next) => {
  try {
    const { title, department, description, requirements, skills, experience, employmentType, location, workMode, openings, assignedRecruiter, status } = req.body;

    if (!title || !description || !experience) {
      return res.status(400).json({ success: false, message: 'Title, description, and experience are required.' });
    }

    const jobId = await generateCustomId(Job, 'JOB');

    const parsedSkills = Array.isArray(skills) 
      ? skills 
      : typeof skills === 'string' ? skills.split(',').map(s => s.trim()).filter(Boolean) : [];

    const job = await Job.create({
      jobId,
      title,
      department: department || 'Engineering',
      description,
      requirements: requirements || '',
      skills: parsedSkills,
      experience,
      employmentType: employmentType || 'Full-time',
      location: location || 'Bangalore, India',
      workMode: workMode || 'Hybrid',
      openings: parseInt(openings) || 1,
      status: status || 'Open',
      createdBy: req.user ? req.user._id : null,
      assignedRecruiter: assignedRecruiter || (req.user ? req.user._id : null)
    });

    await createAuditLog({
      req,
      action: 'CREATE_JOB',
      entity: 'Job',
      entityId: job.jobId,
      newValue: job.title,
      description: `Created job posting ${job.jobId} (${job.title})`
    });

    res.status(201).json({ success: true, message: 'Job created successfully', data: job });
  } catch (error) {
    next(error);
  }
};

const updateJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found.' });
    }

    Object.assign(job, req.body);
    await job.save();

    await createAuditLog({
      req,
      action: 'UPDATE_JOB',
      entity: 'Job',
      entityId: job.jobId,
      description: `Updated job ${job.jobId}`
    });

    res.status(200).json({ success: true, message: 'Job updated successfully', data: job });
  } catch (error) {
    next(error);
  }
};

const updateJobStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found.' });
    }

    const oldStatus = job.status;
    job.status = status;
    await job.save();

    await createAuditLog({
      req,
      action: 'UPDATE_JOB_STATUS',
      entity: 'Job',
      entityId: job.jobId,
      oldValue: oldStatus,
      newValue: status,
      description: `Updated job ${job.jobId} status to ${status}`
    });

    res.status(200).json({ success: true, message: `Job status updated to ${status}`, data: job });
  } catch (error) {
    next(error);
  }
};

const deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found.' });
    }

    await createAuditLog({
      req,
      action: 'DELETE_JOB',
      entity: 'Job',
      entityId: job.jobId,
      description: `Deleted job ${job.jobId} (${job.title})`
    });

    res.status(200).json({ success: true, message: 'Job deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  updateJobStatus,
  deleteJob
};
