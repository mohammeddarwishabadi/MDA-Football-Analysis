const express = require('express');
const upload = require('../config/upload');
const { protect, authorize } = require('../middleware/auth');
const { getPosts, getPostById, createPost, updatePost, deletePost } = require('../controllers/postController');

const router = express.Router();

router.get('/', getPosts);
router.get('/:id', getPostById);
router.post('/', protect, authorize('admin', 'editor'), upload.single('image'), createPost);
router.put('/:id', protect, authorize('admin', 'editor'), upload.single('image'), updatePost);
router.delete('/:id', protect, authorize('admin'), deletePost);

module.exports = router;
