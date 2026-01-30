const { verifyToken } = require('../utils/jwt');
const { sendError } = require('../utils/response');
const { User } = require('../models');

/**
 * Middleware to protect routes requiring authentication
 */
const protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Check if token exists
    if (!token) {
      return sendError(res, 401, 'Not authorized, no token provided');
    }

    // Verify token
    const decoded = verifyToken(token);

    // Get user from database
    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ['password'] }
    });

    if (!user || !user.is_active) {
      return sendError(res, 401, 'Not authorized, user not found or inactive');
    }

    // Attach user to request
    req.user = user;
    next();

  } catch (error) {
    console.error('Auth middleware error:', error.message);
    return sendError(res, 401, 'Not authorized, token failed');
  }
};

/**
 * Middleware to check if user has admin role
 */
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return sendError(res, 403, 'Access denied. Admin privileges required.');
  }
};

module.exports = {
  protect,
  adminOnly
};
