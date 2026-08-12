const Notification = require('../models/Notification');

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

module.exports = {
  getNotifications,
  markAsRead,
  markAllAsRead
};
