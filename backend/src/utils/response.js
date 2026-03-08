exports.sendSuccess = (res, data, message = 'OK', statusCode = 200, meta) => {
  const payload = { success: true, message, data };
  if (meta) payload.meta = meta;
  return res.status(statusCode).json(payload);
};

exports.sendError = (res, message = 'Request failed', statusCode = 400, details) => {
  const payload = { success: false, message };
  if (details) payload.details = details;
  return res.status(statusCode).json(payload);
};
