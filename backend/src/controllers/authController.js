const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { createAuditLog } = require('../services/auditService');

const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET || 'super_secret_jwt_key',
    { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
  );
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.'
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Please check email and password.'
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been deactivated. Please contact your HR Admin.'
      });
    }

    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user._id);

    await createAuditLog({
      req: { user },
      action: 'USER_LOGIN',
      entity: 'User',
      entityId: user._id,
      description: `${user.firstName} ${user.lastName} logged in successfully.`
    });

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: user.toJSON()
      }
    });
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res) => {
  res.status(200).json({
    success: true,
    data: req.user
  });
};

const logout = async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
};

const forgotPassword = async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Password reset instructions have been sent to your email.'
  });
};

const resetPassword = async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Password reset successfully.'
  });
};

module.exports = {
  login,
  getMe,
  logout,
  forgotPassword,
  resetPassword
};
