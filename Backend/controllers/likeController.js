const prisma = require('../prismaClient');

// Like a post
exports.likePost = async (req, res) => {
  try {
    const postId = parseInt(req.params.postId);
    const userId = req.user.id;

    if (isNaN(postId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid post ID'
      });
    }

    // Check if post exists
    const post = await prisma.post.findUnique({
      where: { id: postId }
    });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Check if like already exists
    const existingLike = await prisma.like.findFirst({
      where: {
        user_id: userId,
        post_id: postId
      }
    });

    if (existingLike) {
      return res.status(400).json({
        success: false,
        message: 'Post already liked'
      });
    }

    // Create like and update post in transaction
    const [like, updatedPost] = await prisma.$transaction([
      prisma.like.create({
        data: {
          user_id: userId,
          post_id: postId
        },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              profile_picture: true
            }
          }
        }
      }),
      // Since your schema doesn't have like_count, we'll count likes instead
      prisma.post.update({
        where: { id: postId },
        data: {}, // No direct like_count update needed
        include: {
          _count: {
            select: { likes: true }
          }
        }
      })
    ]);

    res.status(201).json({
      success: true,
      data: {
        like,
        likeCount: updatedPost._count.likes
      }
    });

  } catch (error) {
    console.error('Like error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to like post',
      error: error.message
    });
  }
};

exports.unlikePost = async (req, res) => {
  try {
    const postId = parseInt(req.params.postId);
    const userId = req.user.id;

    const like = await prisma.like.findFirst({
      where: {
        user_id: userId,
        post_id: postId
      }
    });

    if (!like) {
      return res.status(404).json({
        success: false,
        message: 'Like not found'
      });
    }

    await prisma.like.delete({
      where: { id: like.id }
    });

    // Get updated like count
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        _count: {
          select: { likes: true }
        }
      }
    });

    res.json({
      success: true,
      message: 'Post unliked successfully',
      data: {
        postId,
        likeCount: post._count.likes
      }
    });
  } catch (error) {
    console.error('Unlike error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to unlike post',
      error: error.message
    });
  }
};

// Get all likes for a post
exports.getLikes = async (req, res) => {
  try {
    const postId = parseInt(req.params.postId);
    
    // Verify post exists
    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    const likes = await prisma.like.findMany({
      where: { post_id: postId },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            profile_picture: true
          }
        }
      },
      orderBy: {
        id: 'desc' // Sort by ID instead of created_at
      }
    });

    res.json({
      success: true,
      count: likes.length,
      data: likes
    });
  } catch (error) {
    console.error('Get likes error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to get likes',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};