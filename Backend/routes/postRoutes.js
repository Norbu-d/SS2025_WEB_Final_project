const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const authMiddleware = require('../middleware/auth');
const upload = require('../utils/upload'); // Using utils/upload.js
const rateLimit = require('express-rate-limit');

// Rate limiting for post creation
const createPostLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each user to 5 post creations per window
  message: { 
    success: false, 
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many post creations. Please try again later.'
    }
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: req => !req.user // Skip rate limiting for non-authenticated requests
});

// @route   POST /api/posts
// @desc    Create a post with image upload
// @access  Private
router.post(
  '/',
  authMiddleware,
  createPostLimiter,
  upload, // Using our improved upload middleware from utils/upload.js
  postController.createPost
);

// @route   GET /api/posts/explore
// @desc    Get explore posts (must come before /:postId route)
// @access  Public
router.get('/explore', postController.getExplorePosts);

// @route   GET /api/posts
// @desc    Get all posts (feed)
// @access  Public
router.get('/', postController.getPosts);

// @route   GET /api/posts/:postId
// @desc    Get single post
// @access  Public
router.get(
  '/:postId',
  postController.validatePostId,
  postController.getPost
);

// @route   DELETE /api/posts/:postId
// @desc    Delete a post
// @access  Private (Post owner only)
router.delete(
  '/:postId',
  authMiddleware,
  postController.validatePostId,
  postController.checkPostOwnership,
  postController.deletePost
);

// @route   GET /api/posts/users/:userId/posts
// @desc    Get all posts by a specific user
// @access  Public
router.get(
  '/users/:userId/posts',
  postController.validateUserId,
  postController.getUserPosts
);

module.exports = router;