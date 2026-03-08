const Prediction = require('../models/Prediction');
const asyncHandler = require('../utils/asyncHandler');
const { clearCacheByPrefix } = require('../services/cacheService');
const { sendSuccess, sendError } = require('../utils/response');

exports.getPredictions = asyncHandler(async (req, res) => {
  const page = Math.max(Number.parseInt(req.query.page || '1', 10), 1);
  const limit = Math.min(Math.max(Number.parseInt(req.query.limit || '10', 10), 1), 50);
  const skip = (page - 1) * limit;

  const [predictions, totalItems] = await Promise.all([
    Prediction.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
    Prediction.countDocuments()
  ]);

  const totalPages = Math.ceil(totalItems / limit) || 1;

  return sendSuccess(res, predictions, 'Predictions fetched', 200, {
    pagination: { totalPages, currentPage: page, totalItems, page, limit, total: totalItems }
  });
});

exports.getPredictionById = asyncHandler(async (req, res) => {
  const prediction = await Prediction.findById(req.params.id);
  if (!prediction) return sendError(res, 'Prediction not found', 404);
  return sendSuccess(res, prediction, 'Prediction fetched');
});

exports.createPrediction = asyncHandler(async (req, res) => {
  const payload = { ...req.body };
  if (req.file) {
    payload.imageUrl = `/uploads/${req.uploadFolder}/${req.file.filename}`;
  }
  const prediction = await Prediction.create(payload);

  await clearCacheByPrefix('predictions');
  return sendSuccess(res, prediction, 'Prediction created successfully', 201);
});

exports.updatePrediction = asyncHandler(async (req, res) => {
  const payload = { ...req.body };
  if (req.file) {
    payload.imageUrl = `/uploads/${req.uploadFolder}/${req.file.filename}`;
  }

  const prediction = await Prediction.findByIdAndUpdate(req.params.id, payload, { new: true });
  if (!prediction) return sendError(res, 'Prediction not found', 404);

  await clearCacheByPrefix('predictions');
  return sendSuccess(res, prediction, 'Prediction updated successfully');
});

exports.deletePrediction = asyncHandler(async (req, res) => {
  const prediction = await Prediction.findByIdAndDelete(req.params.id);
  if (!prediction) return sendError(res, 'Prediction not found', 404);

  await clearCacheByPrefix('predictions');
  return sendSuccess(res, { id: req.params.id }, 'Prediction deleted successfully');
});
