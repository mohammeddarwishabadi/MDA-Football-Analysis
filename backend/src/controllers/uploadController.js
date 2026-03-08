const asyncHandler = require('../utils/asyncHandler');
const { sendError, sendSuccess } = require('../utils/response');

exports.uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    return sendError(res, 'No file uploaded', 400);
  }

  const folder = req.uploadFolder ? `${req.uploadFolder}/` : '';
  const url = `/uploads/${folder}${req.file.filename}`;
  return sendSuccess(res, { url, filename: req.file.filename }, 'File uploaded', 201);
});
