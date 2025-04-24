const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.createComment = async (req, res) => {
  try {
    const { content } = req.body;
    const postId = parseInt(req.params.postId);
    const userId = req.user.id;

    // Validate input
    if (!content || content.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Comment content is required'
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

    // Create comment
    const comment = await prisma.comment.create({
      data: {
        content,
        user_id: userId,
        post_id: postId
      },
      include: {
        user: {
          select: {
            username: true,
            profile_picture: true
          }
        }
      }
    });

    res.status(201).json({
      success: true,
      data: comment
    });

  } catch (error) {
    console.error('Create comment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create comment',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

exports.getComments = async (req, res) => {
  try {
    const postId = parseInt(req.params.postId);

    // Check if post exists
    const postExists = await prisma.post.findUnique({
      where: { id: postId }
    });

    if (!postExists) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    const comments = await prisma.comment.findMany({
      where: { post_id: postId },
      include: {
        user: {
          select: {
            username: true,
            profile_picture: true
          }
        }
      },
      orderBy: {
        created_at: 'desc'
      }
    });

    res.json({
      success: true,
      count: comments.length,
      data: comments
    });

  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get comments',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const commentId = parseInt(req.params.commentId);
    const userId = req.user.id;

    // Find comment
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      include: {
        post: true
      }
    });

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    // Check if user is comment owner or post owner
    if (comment.user_id !== userId && comment.post.user_id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this comment'
      });
    }

    await prisma.comment.delete({
      where: { id: commentId }
    });

    res.json({
      success: true,
      message: 'Comment deleted successfully'
    });

  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete comment',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};