const express = require('express');
const upload = require('../config/upload');
const { protect, authorize } = require('../middleware/auth');
const {
  getPredictions,
  getPredictionById,
  createPrediction,
  updatePrediction,
  deletePrediction
} = require('../controllers/predictionController');

const router = express.Router();

router.get('/', getPredictions);
router.get('/:id', getPredictionById);
router.post('/', protect, authorize('admin', 'editor'), upload.single('image'), createPrediction);
router.put('/:id', protect, authorize('admin', 'editor'), upload.single('image'), updatePrediction);
router.delete('/:id', protect, authorize('admin'), deletePrediction);

module.exports = router;
