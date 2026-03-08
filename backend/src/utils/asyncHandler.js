// Utility wrapper that forwards async controller errors to centralized error middleware.
module.exports = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
