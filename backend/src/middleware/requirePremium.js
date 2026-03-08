module.exports = (req, res, next) => {
  if (!req.user || req.user.subscription !== 'premium') {
    return res.status(403).json({ success: false, message: 'Premium subscription required' });
  }
  return next();
};
