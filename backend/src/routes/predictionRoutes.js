const express = require('express');
const upload = require('../config/upload');
const { protect } = require('../middleware/auth');
const requireAdmin = require('../middleware/requireAdmin');
const requirePremium = require('../middleware/requirePremium');
const {
  getPredictions,
  getPredictionById,
  createPrediction,
  updatePrediction,
  deletePrediction
} = require('../controllers/predictionController');
const { withCache } = require('../services/cacheService');

const router = express.Router();

router.get('/', withCache('predictions', 60 * 1000), getPredictions);
router.get('/advanced/premium-feed', protect, requirePremium, (_req, res) => {
  res.json({
    success: true,
    message: 'Premium insights unlocked',
    data: {
      feature: 'advanced-predictions',
      indicators: ['form-adjusted xG', 'fatigue model', 'schedule pressure index']
    }
  });
});
router.get('/:id', getPredictionById);
router.post('/', protect, requireAdmin, upload.single('image'), createPrediction);
router.put('/:id', protect, requireAdmin, upload.single('image'), updatePrediction);
router.delete('/:id', protect, requireAdmin, deletePrediction);

module.exports = router;
