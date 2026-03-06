const Prediction = require('../models/Prediction');
const asyncHandler = require('../utils/asyncHandler');

exports.getPredictions = asyncHandler(async (req, res) => {
  const page = Math.max(Number.parseInt(req.query.page || '1', 10), 1);
  const limit = Math.min(Math.max(Number.parseInt(req.query.limit || '10', 10), 1), 50);
  const skip = (page - 1) * limit;

  const [predictions, total] = await Promise.all([
    Prediction.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
    Prediction.countDocuments()
  ]);

  res.json({
    data: predictions,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  });
});

exports.getPredictionById = asyncHandler(async (req, res) => {
  const prediction = await Prediction.findById(req.params.id);
  if (!prediction) return res.status(404).json({ message: 'Prediction not found' });
  res.json(prediction);
});

exports.createPrediction = asyncHandler(async (req, res) => {
  const payload = { ...req.body };
  if (req.file) {
    payload.imageUrl = `/uploads/${req.file.filename}`;
  }
  const prediction = await Prediction.create(payload);
  res.status(201).json(prediction);
});

exports.updatePrediction = asyncHandler(async (req, res) => {
  const payload = { ...req.body };
  if (req.file) {
    payload.imageUrl = `/uploads/${req.file.filename}`;
  }

  const prediction = await Prediction.findByIdAndUpdate(req.params.id, payload, { new: true });
  if (!prediction) return res.status(404).json({ message: 'Prediction not found' });
  res.json(prediction);
});

exports.deletePrediction = asyncHandler(async (req, res) => {
  const prediction = await Prediction.findByIdAndDelete(req.params.id);
  if (!prediction) return res.status(404).json({ message: 'Prediction not found' });
  res.json({ message: 'Prediction deleted' });
});
