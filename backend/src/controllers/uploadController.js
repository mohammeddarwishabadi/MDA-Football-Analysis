const asyncHandler = require('../utils/asyncHandler');

exports.uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const folder = req.uploadFolder ? `${req.uploadFolder}/` : '';
  const url = `/uploads/${folder}${req.file.filename}`;
  res.status(201).json({ url, filename: req.file.filename });
});
