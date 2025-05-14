const express = require('express');
const router = express.Router();
const { likePost, unlikePost, getLikes } = require('../controllers/likeController'); // Destructured import
const authMiddleware = require('../middleware/auth');

// Like a post
router.post('/posts/:postId/like', authMiddleware, likePost);

// Unlike a post
router.delete('/posts/:postId/like', authMiddleware, unlikePost);

// Get post likes
router.get('/posts/:postId/likes', getLikes);

module.exports = router;