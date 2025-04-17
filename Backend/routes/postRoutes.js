const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const authMiddleware = require('../middleware/auth');
const upload = require('../utils/upload');

// @route   POST /api/posts
// @desc    Create a post
// @access  Private
router.post('/', authMiddleware, upload.single('image'), postController.createPost);

// @route   GET /api/posts
// @desc    Get all posts
// @access  Public
router.get('/', postController.getPosts);

// @route   GET /api/posts/:postId
// @desc    Get single post
// @access  Public
router.get('/:postId', postController.getPost);

// @route   DELETE /api/posts/:postId
// @desc    Delete a post
// @access  Private (only post owner)
router.delete('/:postId', authMiddleware, postController.deletePost);

// @route   GET /api/users/:userId/posts
// @desc    Get all posts by a user
// @access  Public
router.get('/users/:userId/posts', postController.getUserPosts);

module.exports = router;