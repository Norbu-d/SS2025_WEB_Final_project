const prisma = require('../prismaClient');
const path = require('path');
const fs = require('fs');

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
        user_id: req.user.id,
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
        }
      }
    });

    // Prepare response data
    const responseData = {
      ...post,
      like_count: 0,
      comment_count: 0,
      comments: []
    };

    res.status(201).json({
      success: true,
      data: responseData
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

    // Transform data for frontend
    const transformedPosts = posts.map(post => ({
      id: post.id,
      image_url: post.image_url,
      caption: post.caption,
      created_at: post.created_at,
      user: post.user,
      like_count: post.likes.length,
      comment_count: post.comments.length,
      likes: post.likes,
      comments: post.comments
    }));

    res.json({
      success: true,
      count: transformedPosts.length,
      data: transformedPosts
    });

  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch posts'
    });
  }
};
// In postController.js
exports.validatePostId = async (req, res, next) => {
  try {
    const post = await prisma.post.findUnique({
      where: { id: parseInt(req.params.postId) }
    });
    
    if (!post) {
      return res.status(404).json({ 
        success: false,
        message: 'Post not found'
      });
    }
    
    req.post = post; // Attach post to request
    next();
  } catch (error) {
    next(error);
  }
};

exports.checkPostOwnership = (req, res, next) => {
  if (req.post.user_id !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to modify this post'
    });
  }
  next();
};

exports.validateUserId = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(req.params.userId) }
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

    // Transform data
    const responseData = {
      ...post,
      like_count: post.likes.length,
      comment_count: post.comments.length
    };

    res.json({
      success: true,
      data: responseData
    });

  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch post'
    });
  }
};

// Delete a post
exports.deletePost = async (req, res) => {
  try {
    const post = await prisma.post.findFirst({
      where: {
        id: parseInt(req.params.postId),
        user_id: req.user.id
      }
    });

    if (!post) {
      return res.status(404).json({ 
        success: false,
        message: 'Post not found or unauthorized' 
      });
    }

    // Get image path
    const imagePath = path.join(__dirname, '..', 'uploads', path.basename(post.image_url));

    // Delete post from database
    await prisma.post.delete({
      where: { id: post.id }
    });

    // Delete image file
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    res.json({
      success: true,
      message: 'Post deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to delete post'
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
        likes: {
          select: {
            user_id: true
          }
        }
      },
      orderBy: {
        created_at: 'desc'
      }
    });

    // Transform data
    const transformedPosts = posts.map(post => ({
      ...post,
      like_count: post.likes.length
    }));

    res.json({
      success: true,
      count: transformedPosts.length,
      data: transformedPosts
    });

  } catch (error) {
    console.error('Error fetching user posts:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch user posts'
    });
  }
};