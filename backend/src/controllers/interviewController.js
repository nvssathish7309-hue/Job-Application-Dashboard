const Interview = require('../models/Interview');
const InterviewFeedback = require('../models/InterviewFeedback');
const Candidate = require('../models/Candidate');
const Application = require('../models/Application');
const Notification = require('../models/Notification');
const { generateCustomId } = require('../utils/idGenerator');
const { createAuditLog } = require('../services/auditService');
const { sendNotificationEmail } = require('../utils/emailService');


const getInterviews = async (req, res, next) => {
  try {
    const query = {};

    // Interviewers only see interviews assigned to them
    if (req.user && req.user.role === 'INTERVIEWER') {
      query.interviewerId = req.user._id;
    }

    const interviews = await Interview.find(query)
      .populate('candidateId')
      .populate('jobId')
      .populate('interviewerId', 'firstName lastName email avatar')
      .sort({ date: 1, startTime: 1 });

    res.status(200).json({ success: true, data: interviews });
  } catch (error) {
    next(error);
  }
};

const getInterviewById = async (req, res, next) => {
  try {
    const interview = await Interview.findById(req.params.id)
      .populate('candidateId')
      .populate('jobId')
      .populate('interviewerId', 'firstName lastName email avatar');

    if (!interview) {
      return res.status(404).json({ success: false, message: 'Interview not found.' });
    }

    const feedback = await InterviewFeedback.findOne({ interviewId: interview._id });

    res.status(200).json({ success: true, data: { interview, feedback } });
  } catch (error) {
    next(error);
  }
};

const scheduleInterview = async (req, res, next) => {
  try {
    const { candidateId, jobId, interviewerId, round, date, startTime, endTime, mode, meetingLink, notes } = req.body;

    if (!candidateId || !interviewerId || !date || !startTime || !endTime) {
      return res.status(400).json({ success: false, message: 'Candidate, interviewer, date, start time, and end time are required.' });
    }

    // Validation: End time cannot be before start time
    if (endTime <= startTime) {
      return res.status(400).json({ success: false, message: 'End time must be after start time.' });
    }

    const interviewId = await generateCustomId(Interview, 'INT');

    const interview = await Interview.create({
      interviewId,
      candidateId,
      jobId: jobId || null,
      interviewerId,
      round: round || 'Technical Round 1',
      date,
      startTime,
      endTime,
      mode: mode || 'Online',
      meetingLink: meetingLink || '',
      notes: notes || '',
      status: 'Scheduled',
      createdBy: req.user ? req.user._id : null
    });

    // Update candidate and application status to 'Interview'
    await Candidate.findByIdAndUpdate(candidateId, { status: 'Interview' });
    await Application.updateMany(
      { candidateId },
      { 
        $set: { status: 'Interview', stage: 'Interview' },
        $push: { stageHistory: { stage: 'Interview', changedBy: req.user ? req.user._id : null, remarks: `Interview scheduled on ${date}` } }
      }
    );

    // Create notification for Interviewer
    await Notification.create({
      userId: interviewerId,
      title: 'Interview Scheduled',
      message: `You have been assigned to conduct an interview on ${date} at ${startTime}.`,
      type: 'Interview Scheduled',
      link: '/interviews'
    });

    // Send email notification to Candidate
    try {
      const targetCand = await Candidate.findById(candidateId);
      if (targetCand && targetCand.email) {
        await sendNotificationEmail({
          toEmail: targetCand.email,
          candidateName: targetCand.fullName || targetCand.name || 'Candidate',
          title: '🎉 Interview Scheduled — Technical Round',
          message: `Congratulations ${targetCand.fullName || 'Candidate'}! An interview round has been scheduled for you on ${date} at ${startTime}.${meetingLink ? ` Joining link: ${meetingLink}` : ''}`,
          stage: 'Interview Scheduled',
          link: meetingLink || `${process.env.CLIENT_URL || 'http://localhost:5173'}/candidate-portal`
        });
      }
    } catch (e) {
      console.warn('Failed to send interview scheduled candidate email:', e.message);
    }


    await createAuditLog({
      req,
      action: 'SCHEDULE_INTERVIEW',
      entity: 'Interview',
      entityId: interview.interviewId,
      description: `Scheduled interview ${interview.interviewId} on ${date}`
    });

    res.status(201).json({ success: true, message: 'Interview scheduled successfully', data: interview });
  } catch (error) {
    next(error);
  }
};

const submitFeedback = async (req, res, next) => {
  try {
    const { technicalSkills, communication, problemSolving, domainKnowledge, overallRating, recommendation, feedback } = req.body;
    const interview = await Interview.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({ success: false, message: 'Interview not found.' });
    }

    if (!feedback) {
      return res.status(400).json({ success: false, message: 'Feedback text is required.' });
    }

    const feedbackDoc = await InterviewFeedback.create({
      interviewId: interview._id,
      candidateId: interview.candidateId,
      interviewerId: req.user ? req.user._id : interview.interviewerId,
      technicalSkills: parseInt(technicalSkills) || 3,
      communication: parseInt(communication) || 3,
      problemSolving: parseInt(problemSolving) || 3,
      domainKnowledge: parseInt(domainKnowledge) || 3,
      overallRating: parseInt(overallRating) || 3,
      recommendation: recommendation || 'Hire',
      feedback
    });

    interview.status = 'Completed';
    await interview.save();

    await createAuditLog({
      req,
      action: 'SUBMIT_INTERVIEW_FEEDBACK',
      entity: 'Interview',
      entityId: interview.interviewId,
      description: `Submitted feedback for interview ${interview.interviewId} (${recommendation})`
    });

    res.status(201).json({ success: true, message: 'Interview feedback submitted successfully', data: feedbackDoc });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getInterviews,
  getInterviewById,
  scheduleInterview,
  submitFeedback
};
