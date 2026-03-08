const Post = require('../models/Post');
const asyncHandler = require('../utils/asyncHandler');
const { clearCacheByPrefix } = require('../services/cacheService');
const { sendSuccess, sendError } = require('../utils/response');

exports.getPosts = asyncHandler(async (req, res) => {
  const page = Math.max(Number.parseInt(req.query.page || '1', 10), 1);
  const limit = Math.min(Math.max(Number.parseInt(req.query.limit || '10', 10), 1), 50);
  const skip = (page - 1) * limit;
  const search = (req.query.search || '').trim();

  const filter = search
    ? {
      $or: [
        { title: { $regex: search, $options: 'i' } },
        { match: { $regex: search, $options: 'i' } },
        { teams: { $elemMatch: { $regex: search, $options: 'i' } } }
      ]
    }
    : {};

  const [posts, totalItems] = await Promise.all([
    Post.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Post.countDocuments(filter)
  ]);

  const totalPages = Math.ceil(totalItems / limit) || 1;

  return sendSuccess(res, posts, 'Posts fetched', 200, {
    pagination: {
      totalPages,
      currentPage: page,
      totalItems,
      page,
      limit,
      total: totalItems
    }
  });
});

exports.searchPosts = asyncHandler(async (req, res) => {
  const q = (req.query.q || '').trim();
  if (!q) {
    return sendSuccess(res, [], 'No query provided', 200, { query: q });
  }

  const results = await Post.find(
    { $text: { $search: q } },
    { score: { $meta: 'textScore' } }
  )
    .sort({ score: { $meta: 'textScore' }, createdAt: -1 })
    .limit(25);

  return sendSuccess(res, results, 'Search results', 200, { query: q });
});

exports.getPostById = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return sendError(res, 'Post not found', 404);
  return sendSuccess(res, post, 'Post fetched');
});

exports.createPost = asyncHandler(async (req, res) => {
  const payload = { ...req.body };
  if (req.file) {
    payload.imageUrl = `/uploads/${req.uploadFolder}/${req.file.filename}`;
  }

  const post = await Post.create(payload);
  await clearCacheByPrefix('posts');

  return sendSuccess(res, post, 'Post created successfully', 201);
});

exports.updatePost = asyncHandler(async (req, res) => {
  const payload = { ...req.body };
  if (req.file) {
    payload.imageUrl = `/uploads/${req.uploadFolder}/${req.file.filename}`;
  }

  const post = await Post.findByIdAndUpdate(req.params.id, payload, { new: true });
  if (!post) return sendError(res, 'Post not found', 404);

  await clearCacheByPrefix('posts');
  return sendSuccess(res, post, 'Post updated successfully');
});

exports.deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findByIdAndDelete(req.params.id);
  if (!post) return sendError(res, 'Post not found', 404);

  await clearCacheByPrefix('posts');
  return sendSuccess(res, { id: req.params.id }, 'Post deleted successfully');
});
