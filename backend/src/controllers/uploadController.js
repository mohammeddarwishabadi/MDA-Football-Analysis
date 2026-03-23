const asyncHandler = require('../utils/asyncHandler');
const { sendError, sendSuccess } = require('../utils/response');

exports.uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    return sendError(res, 'No file uploaded', 400);
  }

  const url = req.file.path;
  const filename = req.file.filename;

  return sendSuccess(res, { url, filename }, 'File uploaded', 201);
});
