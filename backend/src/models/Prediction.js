const mongoose = require('mongoose');

const predictionSchema = new mongoose.Schema(
  {
    match: { type: String, required: true },
    teams: [String],
    win_probability: [Number],
    expected_goals: [Number],
    confidence: Number,
    charts: [String],
    imageUrl: String
  },
  { timestamps: true }
);

module.exports = mongoose.model('Prediction', predictionSchema);
