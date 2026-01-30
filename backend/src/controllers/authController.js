const { User } = require('../models');
const { generateToken } = require('../utils/jwt');
const { sendSuccess, sendError } = require('../utils/response');

/**
 * @route   POST /api/auth/login
 * @desc    Login admin user
 * @access  Public
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return sendError(res, 400, 'Please provide email and password');
    }

    // Find user and include password for comparison
    const user = await User.findOne({
      where: { email: email.toLowerCase() },
      attributes: ['id', 'email', 'password', 'role', 'is_active']
    });

    // Check if user exists and is active
    if (!user || !user.is_active) {
      return sendError(res, 401, 'Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    
    if (!isPasswordValid) {
      return sendError(res, 401, 'Invalid credentials');
    }

    // Generate token
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role
    });

    // Return user data without password
    const userData = {
      id: user.id,
      email: user.email,
      role: user.role
    };

    return sendSuccess(res, 200, 'Login successful', {
      token,
      user: userData
    });

  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/auth/verify
 * @desc    Verify JWT token and return user
 * @access  Protected
 */
const verifyTokenAndGetUser = async (req, res, next) => {
  try {
    return sendSuccess(res, 200, 'Token is valid', {
      user: req.user
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user (client-side token removal)
 * @access  Protected
 */
const logout = async (req, res, next) => {
  try {
    // In JWT, logout is handled client-side by removing the token
    return sendSuccess(res, 200, 'Logout successful');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  login,
  verifyTokenAndGetUser,
  logout
};
