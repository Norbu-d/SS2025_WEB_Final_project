const prisma = require('../prismaClient');

// Like a post
exports.likePost = async (req, res) => {
  try {
    const postId = parseInt(req.params.postId);
    
    // Verify post exists
    const post = await prisma.post.findUnique({
      where: { id: postId }
    });
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Check for existing like
    const existingLike = await prisma.like.findFirst({
      where: {
        user_id: req.user.id,
        post_id: postId
      }
    });

    if (existingLike) {
      return res.status(400).json({ 
        success: false,
        message: 'Post already liked' 
      });
    }

    const like = await prisma.like.create({
      data: {
        user_id: req.user.id,
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
    });

    res.status(201).json({
      success: true,
      data: like
    });
  } catch (error) {
    console.error('Like error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to like post',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Unlike a post
exports.unlikePost = async (req, res) => {
  try {
    const postId = parseInt(req.params.postId);
    
    // Verify post exists
    const post = await prisma.post.findUnique({
      where: { id: postId }
    });
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    const like = await prisma.like.findFirst({
      where: {
        user_id: req.user.id,
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

    res.json({ 
      success: true,
      message: 'Post unliked successfully',
      data: { postId }
    });
  } catch (error) {
    console.error('Unlike error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to unlike post',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
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