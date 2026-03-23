const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const { v2: cloudinary } = require('cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);
const ALLOWED_EXT = new Set(['jpg', 'jpeg', 'png', 'webp', 'gif']);

const getTargetFolder = (req) => {
  const monthKey = new Date().toISOString().slice(0, 7);
  if (req.baseUrl.includes('/posts')) return `mda/posts/${monthKey}`;
  if (req.baseUrl.includes('/predictions')) return `mda/predictions/${monthKey}`;
  return `mda/misc/${monthKey}`;
};

const storage = new CloudinaryStorage({
  cloudinary,
  params: (req) => ({
    folder: getTargetFolder(req),
    allowed_formats: [...ALLOWED_EXT],
    resource_type: 'image'
  })
});

const fileFilter = (req, file, cb) => {
  const ext = file.originalname.split('.').pop().toLowerCase();
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
