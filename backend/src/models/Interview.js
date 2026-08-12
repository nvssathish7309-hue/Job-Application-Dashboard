const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema(
  {
    interviewId: { type: String, unique: true, required: true },
    candidateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Candidate', required: true },
    applicationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Application' },
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
    interviewerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    round: { type: String, default: 'Technical Round 1' },
    date: { type: String, required: true }, // YYYY-MM-DD
    startTime: { type: String, required: true }, // HH:mm
    endTime: { type: String, required: true },   // HH:mm
    mode: {
      type: String,
      enum: ['Online', 'Phone', 'In Person'],
      default: 'Online'
    },
    meetingLink: { type: String, default: '' },
    location: { type: String, default: '' },
    status: {
      type: String,
      enum: ['Scheduled', 'Confirmed', 'Completed', 'Cancelled', 'Rescheduled', 'No Show'],
      default: 'Scheduled'
    },
    notes: { type: String, default: '' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Interview', interviewSchema);
