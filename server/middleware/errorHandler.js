/**
 * Error Handling Middleware
 * Centralized error handling and logging
 */

export function errorHandler(err, req, res, next) {
  // Enhanced error logging
  const errorId = `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  console.error(`[${errorId}] Error occurred:`, {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : err.message,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString(),
    userId: req.user?.id || 'anonymous',
    errorId
  });

  // Default error response
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let code = 'INTERNAL_ERROR';

  // Handle specific error types with user-friendly messages
  if (err.name === 'ValidationError') {
    statusCode = 400;
    code = 'VALIDATION_ERROR';
    message = 'The information provided is not valid. Please check your input and try again.';
  } else if (err.name === 'CastError') {
    statusCode = 400;
    code = 'INVALID_ID';
    message = 'The requested resource could not be found.';
  } else if (err.code === 11000) {
    statusCode = 409;
    code = 'DUPLICATE_RESOURCE';
    message = 'This resource already exists. Please try a different approach.';
  } else if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    code = 'INVALID_TOKEN';
    message = 'Your session has expired. Please sign in again.';
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    code = 'TOKEN_EXPIRED';
    message = 'Your session has expired. Please sign in again.';
  } else if (err.name === 'MongoServerError' || err.name === 'MongoError') {
    statusCode = 503;
    code = 'DATABASE_ERROR';
    message = 'The divine database is temporarily unavailable. Please try again in a moment.';
  } else if (err.code === 'ENOTFOUND' || err.code === 'ECONNREFUSED') {
    statusCode = 503;
    code = 'SERVICE_UNAVAILABLE';
    message = 'External service is temporarily unavailable. Divine forces are working to restore connection.';
  } else if (err.statusCode === 429) {
    code = 'RATE_LIMIT_EXCEEDED';
    message = 'Too many requests. Please pause and try again in a moment.';
  }

  // Don't expose internal errors in production
  if (process.env.NODE_ENV === 'production' && statusCode === 500) {
    message = 'The cosmic energies are experiencing turbulence. Our mystical technicians are working to restore harmony. Please try again shortly.';
    code = 'MYSTICAL_DISRUPTION';
  }

  // Create comprehensive error response
  const errorResponse = {
    error: message,
    code,
    timestamp: new Date().toISOString(),
    errorId,
    ...(process.env.NODE_ENV === 'development' && { 
      stack: err.stack,
      originalError: err.message 
    })
  };

  // Add suggestions for common errors
  if (statusCode === 401) {
    errorResponse.suggestion = 'Please refresh the page and sign in again.';
  } else if (statusCode === 403) {
    errorResponse.suggestion = 'Consider upgrading your membership for access to this feature.';
  } else if (statusCode === 429) {
    errorResponse.suggestion = 'Take a moment to reflect, then try your request again.';
  }

  res.status(statusCode).json(errorResponse);
}

// Async error wrapper
export function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}