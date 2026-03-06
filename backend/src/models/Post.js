const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    match: String,
    teams: [String],
    stats: { type: Object, default: {} },
    xg: String,
    shots: String,
    possession: String,
    analysis_text: String,
    charts: [String],
    imageUrl: String
  },
  { timestamps: true }
);

module.exports = mongoose.model('Post', postSchema);
