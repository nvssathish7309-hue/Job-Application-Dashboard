const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    jobId: { type: String, unique: true, required: true },
    title: { type: String, required: true, trim: true },
    department: { type: String, required: true, default: 'Engineering' },
    description: { type: String, required: true },
    requirements: { type: String, default: '' },
    skills: [{ type: String }],
    experience: { type: String, required: true },
    employmentType: { 
      type: String, 
      enum: ['Full-time', 'Part-time', 'Contract', 'Internship'], 
      default: 'Full-time' 
    },
    location: { type: String, default: 'Bangalore, India' },
    workMode: { 
      type: String, 
      enum: ['On-site', 'Remote', 'Hybrid'], 
      default: 'Hybrid' 
    },
    openings: { type: Number, default: 1 },
    status: {
      type: String,
      enum: ['Draft', 'Open', 'Paused', 'Closed'],
      default: 'Open'
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    assignedRecruiter: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Job', jobSchema);
