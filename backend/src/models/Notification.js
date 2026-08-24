const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false, default: null },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      default: 'New Application'
    },
    isRead: { type: Boolean, default: false },
    link: { type: String, default: '' },
    relatedId: { type: mongoose.Schema.Types.ObjectId, default: null }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notification', notificationSchema);

