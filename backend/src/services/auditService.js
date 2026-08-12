const AuditLog = require('../models/AuditLog');

const createAuditLog = async ({ req, action, entity, entityId, oldValue, newValue, description }) => {
  try {
    const userId = req && req.user ? req.user._id : null;
    const userName = req && req.user ? `${req.user.firstName} ${req.user.lastName}` : 'System';

    await AuditLog.create({
      userId,
      userName,
      action,
      entity,
      entityId: String(entityId || ''),
      oldValue,
      newValue,
      description
    });
  } catch (error) {
    console.error('Failed to record audit log:', error.message);
  }
};

module.exports = { createAuditLog };
