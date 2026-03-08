const express = require('express');
const { getAdminStats } = require('../controllers/adminController');
const { protect } = require('../middleware/auth');
const requireAdmin = require('../middleware/requireAdmin');

const router = express.Router();

router.get('/stats', protect, requireAdmin, getAdminStats);

module.exports = router;
