const User = require('../models/User');
const { createAuditLog } = require('../services/auditService');

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
};

const createUser = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, role, department, phone } = req.body;

    if (!firstName || !lastName || !email || !password || !role) {
      return res.status(400).json({ success: false, message: 'First name, last name, email, password, and role are required.' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'User with this email already exists.' });
    }

    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      role,
      department: department || 'Human Resources',
      phone: phone || ''
    });

    await createAuditLog({
      req,
      action: 'CREATE_USER',
      entity: 'User',
      entityId: user._id,
      newValue: user.email,
      description: `Super Admin created user ${user.email} with role ${user.role}`
    });

    res.status(201).json({ success: true, message: 'User created successfully', data: user.toJSON() });
  } catch (error) {
    next(error);
  }
};

const toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    user.isActive = !user.isActive;
    await user.save();

    await createAuditLog({
      req,
      action: 'TOGGLE_USER_STATUS',
      entity: 'User',
      entityId: user._id,
      newValue: user.isActive ? 'Active' : 'Deactivated',
      description: `Toggled user ${user.email} status to ${user.isActive ? 'Active' : 'Deactivated'}`
    });

    res.status(200).json({ success: true, message: `User status updated to ${user.isActive ? 'Active' : 'Deactivated'}`, data: user.toJSON() });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  createUser,
  toggleUserStatus
};
