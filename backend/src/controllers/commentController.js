const Comment = require('../models/Comment');
const Post = require('../models/Post');
const asyncHandler = require('../utils/asyncHandler');
const { clearCacheByPrefix } = require('../services/cacheService');
const { sendSuccess, sendError } = require('../utils/response');

exports.getCommentsByPost = asyncHandler(async (req, res) => {
  const comments = await Comment.find({ post: req.params.id })
    .populate('user', 'email role subscription')
    .sort({ createdAt: -1 });

  return sendSuccess(res, comments, 'Comments fetched');
});

exports.createComment = asyncHandler(async (req, res) => {
  const { content } = req.body;

  if (!content || !content.trim()) {
    return sendError(res, 'Comment content is required', 400);
  }

  const post = await Post.findById(req.params.id).select('_id');
  if (!post) {
    return sendError(res, 'Post not found', 404);
  }

  const comment = await Comment.create({
    user: req.user._id,
    post: req.params.id,
    content: content.trim()
  });

  await clearCacheByPrefix('posts');

  return sendSuccess(res, comment, 'Comment added', 201);
});
