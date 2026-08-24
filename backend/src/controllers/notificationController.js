const Notification = require('../models/Notification');
const { sendNotificationEmail } = require('../utils/emailService');

const getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(30);

    const unreadCount = await Notification.countDocuments({ userId: req.user._id, isRead: false });

    res.status(200).json({
      success: true,
      data: notifications,
      unreadCount
    });
  } catch (error) {
    next(error);
  }
};

const markAsRead = async (req, res, next) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { isRead: true },
      { new: true }
    );
    res.status(200).json({ success: true, data: notification });
  } catch (error) {
    next(error);
  }
};

const markAllAsRead = async (req, res, next) => {
  try {
    await Notification.updateMany({ userId: req.user._id }, { isRead: true });
    res.status(200).json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    next(error);
  }
};

const sendEmailNotification = async (req, res, next) => {
  try {
    const { toEmail, candidateName, title, message, stage, link } = req.body;
    const targetEmail = toEmail || req.user?.email;

    if (!targetEmail || !title || !message) {
      return res.status(400).json({
        success: false,
        message: 'Recipient email (toEmail), title, and message are required.'
      });
    }

    const result = await sendNotificationEmail({
      toEmail: targetEmail,
      candidateName: candidateName || (req.user ? `${req.user.firstName || ''} ${req.user.lastName || ''}`.trim() : 'Candidate'),
      title,
      message,
      stage,
      link
    });

    res.status(200).json({
      success: true,
      message: 'Email notification processed successfully',
      result
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getNotifications,
  markAsRead,
  markAllAsRead,
  sendEmailNotification
};

