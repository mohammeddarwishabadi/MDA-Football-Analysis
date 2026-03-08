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

// Enables fast keyword search for blog post discovery.
postSchema.index({ title: 'text', analysis_text: 'text' });

module.exports = mongoose.model('Post', postSchema);
