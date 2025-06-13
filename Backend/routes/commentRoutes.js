const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const authMiddleware = require('../middleware/auth');

// @route   POST /api/posts/:postId/comments
// @desc    Add comment to a post
// @access  Private
router.post('/posts/:postId/comments', authMiddleware, commentController.createComment);

// @route   GET /api/posts/:postId/comments
// @desc    Get all comments for a post
// @access  Public
router.get('/posts/:postId/comments', commentController.getComments);

// @route   DELETE /api/comments/:commentId
// @desc    Delete a comment
// @access  Private (only comment owner or post owner)
router.delete('/comments/:commentId', authMiddleware, commentController.deleteComment);

module.exports = router;
