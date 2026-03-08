const Comment = require('../models/Comment');
const Post = require('../models/Post');
const asyncHandler = require('../utils/asyncHandler');
const { clearCacheByPrefix } = require('../services/cacheService');

exports.getCommentsByPost = asyncHandler(async (req, res) => {
  const comments = await Comment.find({ post: req.params.id })
    .populate('user', 'email role')
    .sort({ createdAt: -1 });

  res.json({ data: comments });
});

exports.createComment = asyncHandler(async (req, res) => {
  const { content } = req.body;

  if (!content || !content.trim()) {
    return res.status(400).json({ message: 'Comment content is required' });
  }

  const post = await Post.findById(req.params.id).select('_id');
  if (!post) {
    return res.status(404).json({ message: 'Post not found' });
  }

  const comment = await Comment.create({
    user: req.user._id,
    post: req.params.id,
    content: content.trim()
  });

  await clearCacheByPrefix('posts');

  res.status(201).json(comment);
});
