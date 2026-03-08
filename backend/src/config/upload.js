const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const multer = require('multer');

const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);
const ALLOWED_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif']);

const getTargetFolder = (req) => {
  const monthKey = new Date().toISOString().slice(0, 7);
  if (req.baseUrl.includes('/posts')) return path.join('posts', monthKey);
  if (req.baseUrl.includes('/predictions')) return path.join('predictions', monthKey);
  if (req.baseUrl.includes('/upload')) return path.join('misc', monthKey);
  return path.join('misc', monthKey);
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const relativeFolder = getTargetFolder(req);
    const absoluteFolder = path.join(__dirname, '..', 'uploads', relativeFolder);
    fs.mkdirSync(absoluteFolder, { recursive: true });
    req.uploadFolder = relativeFolder;
    cb(null, absoluteFolder);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const unique = `${Date.now()}-${crypto.randomUUID()}`;
    cb(null, `${unique}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();

  if (!ALLOWED_MIME.has(file.mimetype) || !ALLOWED_EXT.has(ext)) {
    return cb(new Error('Invalid file type. Upload images only (jpg, png, webp, gif).'));
  }

  return cb(null, true);
};

module.exports = multer({
  storage,
  limits: { fileSize: 3 * 1024 * 1024 },
  fileFilter
});
