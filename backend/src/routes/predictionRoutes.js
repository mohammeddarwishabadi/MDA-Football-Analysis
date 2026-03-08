const express = require('express');
const upload = require('../config/upload');
const { protect, adminOnly, requirePremium } = require('../middleware/auth');
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
router.get('/:id', getPredictionById);
// SaaS premium-gated example endpoint for advanced predictions payload.
router.get('/advanced/premium-feed', protect, requirePremium, (_req, res) => {
  res.json({
    feature: 'advanced-predictions',
    message: 'Premium insights unlocked',
    indicators: ['form-adjusted xG', 'fatigue model', 'schedule pressure index']
  });
});
router.post('/', protect, adminOnly, upload.single('image'), createPrediction);
router.put('/:id', protect, adminOnly, upload.single('image'), updatePrediction);
router.delete('/:id', protect, adminOnly, deletePrediction);

module.exports = router;
