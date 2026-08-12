const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: [
        'New Application',
        'Interview Scheduled',
        'Interview Reminder',
        'Candidate Shortlisted',
        'Candidate Rejected',
        'Interview Feedback Pending'
      ],
      default: 'New Application'
    },
    isRead: { type: Boolean, default: false },
    link: { type: String, default: '' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notification', notificationSchema);
