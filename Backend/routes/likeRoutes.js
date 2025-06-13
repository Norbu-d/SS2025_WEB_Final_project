// routes/likeRoutes.js
const express = require('express');
const router = express.Router();
const likeController = require('../controllers/likeController');
const authMiddleware = require('../middleware/auth');

// Like a post
router.post('/:postId', authMiddleware, likeController.likePost);

// Unlike a post
router.delete('/:postId', authMiddleware, likeController.unlikePost);

// Get likes for a post
router.get('/:postId', likeController.getLikes);

module.exports = router;