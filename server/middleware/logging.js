/**
 * Request Logging Middleware
 * Logs incoming requests for debugging and monitoring
 */

export function logRequest(req, res, next) {
  const startTime = Date.now();
  
  // Log request
  console.log(`${new Date().toISOString()} ${req.method} ${req.originalUrl} - ${req.ip}`);
  
  // Log response time when request completes
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    console.log(`${new Date().toISOString()} ${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms`);
  });
  
  next();
}