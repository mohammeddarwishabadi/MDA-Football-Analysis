module.exports = (err, _req, res, _next) => {
  console.error(err);

  if (err.name === 'MulterError') {
    return res.status(400).json({ message: err.message || 'Upload failed' });
  }

  if (err.name === 'SyntaxError' && err.status === 400 && 'body' in err) {
    return res.status(400).json({ message: 'Invalid JSON payload' });
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  return res.status(statusCode).json({
    message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
};
