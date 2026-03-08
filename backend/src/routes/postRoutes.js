const express = require('express');
const upload = require('../config/upload');
const { protect } = require('../middleware/auth');
const requireAdmin = require('../middleware/requireAdmin');
const {
  getPosts,
  searchPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost
} = require('../controllers/postController');
const { getCommentsByPost, createComment } = require('../controllers/commentController');
const { withCache } = require('../services/cacheService');

const router = express.Router();

router.get('/', withCache('posts', 60 * 1000), getPosts);
router.get('/search', withCache('posts', 60 * 1000), searchPosts);
router.get('/:id', withCache('posts', 60 * 1000), getPostById);
router.get('/:id/comments', getCommentsByPost);
router.post('/:id/comments', protect, createComment);
router.post('/', protect, requireAdmin, upload.single('image'), createPost);
router.put('/:id', protect, requireAdmin, upload.single('image'), updatePost);
router.delete('/:id', protect, requireAdmin, deletePost);

module.exports = router;
