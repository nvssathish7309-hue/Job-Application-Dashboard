const AuditLog = require('../models/AuditLog');

const getAuditLogs = async (req, res, next) => {
  try {
    const logs = await AuditLog.find()
      .populate('userId', 'firstName lastName email role')
      .sort({ createdAt: -1 })
      .limit(100);

    res.status(200).json({ success: true, data: logs });
  } catch (error) {
    next(error);
  }
};

const deleteAuditLog = async (req, res, next) => {
  try {
    const log = await AuditLog.findByIdAndDelete(req.params.id);
    if (!log) {
      return res.status(404).json({ success: false, message: 'Audit log entry not found.' });
    }
    res.status(200).json({ success: true, message: 'Audit log deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

const clearAllAuditLogs = async (req, res, next) => {
  try {
    await AuditLog.deleteMany({});
    res.status(200).json({ success: true, message: 'All audit logs cleared successfully.' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAuditLogs, deleteAuditLog, clearAllAuditLogs };
