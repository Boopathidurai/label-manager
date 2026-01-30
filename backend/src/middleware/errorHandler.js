const { sendError } = require('../utils/response');

/**
 * Error handling middleware
 */
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Sequelize validation error
  if (err.name === 'SequelizeValidationError') {
    const errors = err.errors.map(e => ({
      field: e.path,
      message: e.message
    }));
    return sendError(res, 400, 'Validation Error', errors);
  }

  // Sequelize unique constraint error
  if (err.name === 'SequelizeUniqueConstraintError') {
    return sendError(res, 400, 'Duplicate entry. Record already exists.');
  }

  // Sequelize database error
  if (err.name === 'SequelizeDatabaseError') {
    return sendError(res, 500, 'Database error occurred');
  }

  // JWT error
  if (err.name === 'JsonWebTokenError') {
    return sendError(res, 401, 'Invalid token');
  }

  if (err.name === 'TokenExpiredError') {
    return sendError(res, 401, 'Token expired');
  }

  // Default error
  return sendError(
    res,
    err.statusCode || 500,
    err.message || 'Internal Server Error'
  );
};

/**
 * 404 Not Found handler
 */
const notFound = (req, res, next) => {
  return sendError(res, 404, `Route ${req.originalUrl} not found`);
};

module.exports = {
  errorHandler,
  notFound
};
