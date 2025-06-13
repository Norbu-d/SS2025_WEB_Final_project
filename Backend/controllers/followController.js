// controllers/followController.js
const prisma = require('../prismaClient');

exports.followUser = async (req, res) => {
  try {
    const { followingId } = req.body;
    const followerId = req.user.id;

    if (followerId === followingId) {
      return res.status(400).json({
        success: false,
        message: "You can't follow yourself"
      });
    }

    // Check if already following
    const existingFollow = await prisma.follow.findFirst({
      where: {
        follower_id: followerId,
        following_id: followingId
      }
    });

    if (existingFollow) {
      return res.status(400).json({
        success: false,
        message: "Already following this user"
      });
    }

    // Create follow relationship
    const follow = await prisma.follow.create({
      data: {
        follower_id: followerId,
        following_id: followingId
      }
    });

    res.json({
      success: true,
      message: "Followed successfully"
    });
  } catch (error) {
    console.error('Follow error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to follow user',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

exports.unfollowUser = async (req, res) => {
  try {
    const { followingId } = req.body;
    const followerId = req.user.id;

    // Delete follow relationship
    const deleteResult = await prisma.follow.deleteMany({
      where: {
        follower_id: followerId,
        following_id: followingId
      }
    });

    if (deleteResult.count === 0) {
      return res.status(400).json({
        success: false,
        message: "Not following this user"
      });
    }

    res.json({
      success: true,
      message: "Unfollowed successfully"
    });
  } catch (error) {
    console.error('Unfollow error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to unfollow user',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};