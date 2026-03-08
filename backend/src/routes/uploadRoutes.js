const express = require('express');
const upload = require('../config/upload');
const { protect } = require('../middleware/auth');
const requireAdmin = require('../middleware/requireAdmin');
const { uploadImage } = require('../controllers/uploadController');

const router = express.Router();

router.post('/', protect, requireAdmin, upload.single('image'), uploadImage);

module.exports = router;
