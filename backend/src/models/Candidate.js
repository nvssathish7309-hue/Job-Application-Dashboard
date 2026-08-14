const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema(
  {
    candidateId: { type: String, unique: true, required: true },
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    skills: [{ type: String }],
    education: { type: String, default: '' },
    experience: { type: String, required: true },
    projects: [{ type: String }],
    resume: {
      filename: { type: String, default: '' },
      originalName: { type: String, default: '' },
      path: { type: String, default: '' },
      mimeType: { type: String, default: '' },
      size: { type: Number, default: 0 },
      uploadedAt: { type: Date, default: Date.now }
    },
    status: {
      type: String,
      enum: ['Applied', 'New', 'Screening', 'Shortlisted', 'Interview', 'Selected', 'Rejected', 'On Hold'],
      default: 'Applied'
    },
    notes: [{ type: String }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Candidate', candidateSchema);
