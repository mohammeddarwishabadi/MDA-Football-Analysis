const Post = require('../models/Post');
const Prediction = require('../models/Prediction');
const User = require('../models/User');
const Comment = require('../models/Comment');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/response');

exports.getAdminStats = asyncHandler(async (_req, res) => {
  const [totalPosts, totalPredictions, totalUsers, premiumUsers, recentPosts, recentPredictions, latestComments] = await Promise.all([
    Post.countDocuments(),
    Prediction.countDocuments(),
    User.countDocuments(),
    User.countDocuments({ subscription: 'premium' }),
    Post.find().sort({ createdAt: -1 }).limit(5).select('title match createdAt'),
    Prediction.find().sort({ createdAt: -1 }).limit(5).select('match createdAt'),
    Comment.find().sort({ createdAt: -1 }).limit(5).populate('user', 'email').select('content createdAt user')
  ]);

  const recentActivity = [
    ...recentPosts.map((p) => ({ type: 'post', label: p.title, createdAt: p.createdAt })),
    ...recentPredictions.map((p) => ({ type: 'prediction', label: p.match, createdAt: p.createdAt })),
    ...latestComments.map((c) => ({
      type: 'comment',
      label: `${c.user?.email || 'user'}: ${c.content.slice(0, 60)}`,
      createdAt: c.createdAt
    }))
  ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 8);

  return sendSuccess(res, {
    totalPosts,
    totalPredictions,
    totalUsers,
    premiumUsers,
    latestPost: recentPosts[0]?.title || null,
    latestPrediction: recentPredictions[0]?.match || null,
    recentPosts,
    recentPredictions,
    recentActivity
  }, 'Admin stats fetched');
});
