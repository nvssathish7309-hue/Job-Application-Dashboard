const mongoose = require('mongoose');

const stageHistorySchema = new mongoose.Schema({
  stage: { type: String, required: true },
  changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  changedAt: { type: Date, default: Date.now },
  remarks: { type: String, default: '' }
}, { _id: false });

const applicationSchema = new mongoose.Schema(
  {
    applicationId: { type: String, unique: true, required: true },
    candidateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Candidate', required: true },
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
    recruiterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: {
      type: String,
      enum: ['New', 'Screening', 'Shortlisted', 'Interview', 'Selected', 'Rejected', 'On Hold'],
      default: 'New'
    },
    stage: {
      type: String,
      enum: ['New', 'Screening', 'Shortlisted', 'Interview', 'Selected', 'Rejected'],
      default: 'New'
    },
    source: {
      type: String,
      enum: ['Website', 'LinkedIn', 'Referral', 'Indeed', 'Naukri', 'Direct', 'Other'],
      default: 'Website'
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium'
    },
    appliedAt: { type: Date, default: Date.now },
    notes: [{ type: String }],
    stageHistory: [stageHistorySchema]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Application', applicationSchema);
