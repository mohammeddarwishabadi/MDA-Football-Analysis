const express = require('express');
const upload = require('../config/upload');
const { protect, authorize } = require('../middleware/auth');
const { uploadImage } = require('../controllers/uploadController');

const router = express.Router();

router.post('/', protect, authorize('admin', 'editor'), upload.single('image'), uploadImage);

module.exports = router;
