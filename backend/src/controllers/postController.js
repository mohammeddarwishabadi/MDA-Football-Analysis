const Post = require('../models/Post');
const asyncHandler = require('../utils/asyncHandler');
const { clearCacheByPrefix } = require('../services/cacheService');

exports.getPosts = asyncHandler(async (req, res) => {
  const page = Math.max(Number.parseInt(req.query.page || '1', 10), 1);
  const limit = Math.min(Math.max(Number.parseInt(req.query.limit || '10', 10), 1), 50);
  const skip = (page - 1) * limit;

  const [posts, totalItems] = await Promise.all([
    Post.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
    Post.countDocuments()
  ]);

  const totalPages = Math.ceil(totalItems / limit) || 1;

  res.json({
    data: posts,
    pagination: {
      totalPages,
      currentPage: page,
      totalItems,
      // backward-compatible keys
      page,
      limit,
      total: totalItems
    }
  });
});

exports.searchPosts = asyncHandler(async (req, res) => {
  const q = (req.query.q || '').trim();
  if (!q) {
    return res.json({ data: [], query: q });
  }

  const results = await Post.find(
    { $text: { $search: q } },
    { score: { $meta: 'textScore' } }
  )
    .sort({ score: { $meta: 'textScore' }, createdAt: -1 })
    .limit(25);

  res.json({ data: results, query: q });
});

exports.getPostById = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: 'Post not found' });
  res.json(post);
});

exports.createPost = asyncHandler(async (req, res) => {
  const payload = { ...req.body };
  if (req.file) {
    payload.imageUrl = `/uploads/${req.uploadFolder}/${req.file.filename}`;
  }

  const post = await Post.create(payload);
  await clearCacheByPrefix('posts');

  res.status(201).json(post);
});

exports.updatePost = asyncHandler(async (req, res) => {
  const payload = { ...req.body };
  if (req.file) {
    payload.imageUrl = `/uploads/${req.uploadFolder}/${req.file.filename}`;
  }

  const post = await Post.findByIdAndUpdate(req.params.id, payload, { new: true });
  if (!post) return res.status(404).json({ message: 'Post not found' });

  await clearCacheByPrefix('posts');
  res.json(post);
});

exports.deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findByIdAndDelete(req.params.id);
  if (!post) return res.status(404).json({ message: 'Post not found' });

  await clearCacheByPrefix('posts');
  res.json({ message: 'Post deleted' });
});
