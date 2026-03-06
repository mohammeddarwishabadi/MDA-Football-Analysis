const asyncHandler = require('../utils/asyncHandler');

exports.uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  // Public URL for uploaded asset.
  const url = `/uploads/${req.file.filename}`;
  res.status(201).json({ url, filename: req.file.filename });
});
