const Post = require('../models/Post');
const Prediction = require('../models/Prediction');
const User = require('../models/User');
const Comment = require('../models/Comment');
const asyncHandler = require('../utils/asyncHandler');

exports.getAdminStats = asyncHandler(async (_req, res) => {
  const [totalPosts, totalPredictions, totalUsers, latestPosts, latestPredictions, latestComments] = await Promise.all([
    Post.countDocuments(),
    Prediction.countDocuments(),
    User.countDocuments(),
    Post.find().sort({ createdAt: -1 }).limit(3).select('title createdAt'),
    Prediction.find().sort({ createdAt: -1 }).limit(3).select('match createdAt'),
    Comment.find().sort({ createdAt: -1 }).limit(3).populate('user', 'email').select('content createdAt user')
  ]);

  const recentActivity = [
    ...latestPosts.map((p) => ({ type: 'post', label: p.title, createdAt: p.createdAt })),
    ...latestPredictions.map((p) => ({ type: 'prediction', label: p.match, createdAt: p.createdAt })),
    ...latestComments.map((c) => ({
      type: 'comment',
      label: `${c.user?.email || 'user'}: ${c.content.slice(0, 60)}`,
      createdAt: c.createdAt
    }))
  ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 8);

  res.json({
    totalPosts,
    totalPredictions,
    totalUsers,
    latestPost: latestPosts[0]?.title || null,
    latestPrediction: latestPredictions[0]?.match || null,
    recentActivity
  });
});
