const express = require('express');
const upload = require('../config/upload');
const { protect, adminOnly } = require('../middleware/auth');
const { uploadImage } = require('../controllers/uploadController');

const router = express.Router();

router.post('/', protect, adminOnly, upload.single('image'), uploadImage);

module.exports = router;
