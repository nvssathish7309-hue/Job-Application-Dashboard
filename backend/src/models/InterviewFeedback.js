const mongoose = require('mongoose');

const interviewFeedbackSchema = new mongoose.Schema(
  {
    interviewId: { type: mongoose.Schema.Types.ObjectId, ref: 'Interview', required: true },
    candidateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Candidate', required: true },
    interviewerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    technicalSkills: { type: Number, min: 1, max: 5, default: 3 },
    communication: { type: Number, min: 1, max: 5, default: 3 },
    problemSolving: { type: Number, min: 1, max: 5, default: 3 },
    domainKnowledge: { type: Number, min: 1, max: 5, default: 3 },
    overallRating: { type: Number, min: 1, max: 5, default: 3 },
    recommendation: {
      type: String,
      enum: ['Strong Hire', 'Hire', 'Hold', 'Reject'],
      default: 'Hire'
    },
    feedback: { type: String, required: true },
    submittedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

module.exports = mongoose.model('InterviewFeedback', interviewFeedbackSchema);
