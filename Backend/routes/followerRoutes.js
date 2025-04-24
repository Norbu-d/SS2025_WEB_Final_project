const express = require('express');
const router = express.Router();
const followerController = require('../controllers/followerController');
const authMiddleware = require('../middleware/auth');

// Follow a user
router.post(
  '/user/:userId',
  authMiddleware,
  followerController.followUser
);

// Unfollow a user
router.delete(
  '/user/:userId',
  authMiddleware,
  followerController.unfollowUser
);

// Get user's followers
router.get(
  '/followers/:userId',
  followerController.getFollowers
);

// Get who a user is following
router.get(
  '/following/:userId',
  followerController.getFollowing
);

module.exports = router;