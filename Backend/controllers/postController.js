const prisma = require('../prismaClient');
const path = require('path');
const fs = require('fs');

// Helper function to transform post data
const transformPostData = (post) => ({
  id: post.id,
  image_url: post.image_url,
  caption: post.caption,
  created_at: post.created_at,
  user: post.user,
  like_count: post.likes?.length || post._count?.likes || 0,
  comment_count: post.comments?.length || post._count?.comments || 0,
  likes: post.likes || [],
  comments: post.comments || []
});

// Create a new post
exports.createPost = async (req, res) => {
  try {
    const { caption } = req.body;

    // Validate image exists
    if (!req.file) {
      return res.status(400).json({ 
        success: false,
        message: 'Image file is required' 
      });
    }

    // Create image URL
    const imageUrl = `/uploads/${req.file.filename}`;

    // Create post in database
    const post = await prisma.post.create({
      data: {
        image_url: imageUrl,
        caption,
        user: {
          connect: { id: req.user.id }
        }
      },
      include: {
        user: {
          select: {
            username: true,
            profile_picture: true
          }
        },
        _count: {
          select: {
            likes: true,
            comments: true
          }
        }
      }
    });

    res.status(201).json({
      success: true,
      data: transformPostData(post)
    });

  } catch (error) {
    console.error('Error creating post:', error);
    
    // Clean up uploaded file if error occurred
    if (req.file) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error deleting uploaded file:', err);
      });
    }
    
    res.status(500).json({ 
      success: false,
      message: 'Failed to create post',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get all posts (for feed)
exports.getPosts = async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      include: {
        user: {
          select: {
            username: true,
            profile_picture: true
          }
        },
        likes: {
          include: {
            user: {
              select: {
                username: true,
                profile_picture: true
              }
            }
          }
        },
        comments: {
          take: 2,
          orderBy: {
            created_at: 'desc'
          },
          include: {
            user: {
              select: {
                username: true,
                profile_picture: true
              }
            }
          }
        }
      },
      orderBy: {
        created_at: 'desc'
      }
    });

    res.json({
      success: true,
      count: posts.length,
      data: posts.map(transformPostData)
    });

  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch posts',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Middleware to validate post ID
exports.validatePostId = async (req, res, next) => {
  try {
    const postId = parseInt(req.params.postId);
    if (isNaN(postId)) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid post ID format'
      });
    }

    const post = await prisma.post.findUnique({
      where: { id: postId }
    });
    
    if (!post) {
      return res.status(404).json({ 
        success: false,
        message: 'Post not found'
      });
    }
    
    req.post = post;
    next();
  } catch (error) {
    next(error);
  }
};

// Middleware to check post ownership
exports.checkPostOwnership = (req, res, next) => {
  if (req.post.user_id !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to modify this post'
    });
  }
  next();
};

// Middleware to validate user ID
exports.validateUserId = async (req, res, next) => {
  try {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID format'
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true }
    });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    next();
  } catch (error) {
    next(error);
  }
};

// Get single post by ID
exports.getPost = async (req, res) => {
  try {
    const post = await prisma.post.findUnique({
      where: { id: parseInt(req.params.postId) },
      include: {
        user: {
          select: {
            username: true,
            profile_picture: true
          }
        },
        likes: {
          include: {
            user: {
              select: {
                username: true,
                profile_picture: true
              }
            }
          }
        },
        comments: {
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
        }
      }
    });

    if (!post) {
      return res.status(404).json({ 
        success: false,
        message: 'Post not found' 
      });
    }

    res.json({
      success: true,
      data: transformPostData(post)
    });

  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch post',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Delete a post
exports.deletePost = async (req, res) => {
  try {
    // Get image path safely
    const imagePath = path.join(
      __dirname, 
      '..', 
      'uploads', 
      path.basename(req.post.image_url)
    );

    // Delete post from database
    await prisma.post.delete({
      where: { id: req.post.id }
    });

    // Delete image file with error handling
    if (fs.existsSync(imagePath)) {
      try {
        fs.unlinkSync(imagePath);
      } catch (err) {
        console.error('Error deleting image file:', err);
      }
    }

    res.json({
      success: true,
      message: 'Post deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to delete post',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get all posts by a specific user
exports.getUserPosts = async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      where: { user_id: parseInt(req.params.userId) },
      include: {
        user: {
          select: {
            username: true,
            profile_picture: true
          }
        },
        _count: {
          select: {
            likes: true,
            comments: true
          }
        }
      },
      orderBy: {
        created_at: 'desc'
      }
    });

    res.json({
      success: true,
      count: posts.length,
      data: posts.map(transformPostData)
    });

  } catch (error) {
    console.error('Error fetching user posts:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch user posts',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};