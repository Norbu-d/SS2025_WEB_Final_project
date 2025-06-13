const prisma = require('../prismaClient');
const path = require('path');
const fs = require('fs');

// Transform post data with proper URLs
const getFullImageUrl = (req, imagePath) => {
  if (!imagePath) return null;
  
  const normalizedPath = imagePath.replace(/\\/g, '/'); // Replace backslashes with forward slashes
  if (normalizedPath.startsWith('http')) return normalizedPath; // Already full URL
  
  // Ensure path starts with /uploads
  const cleanPath = normalizedPath.startsWith('/uploads') 
    ? normalizedPath 
    : `/uploads/${normalizedPath.replace(/^uploads\//, '')}`;
    
  return `${req.protocol}://${req.get('host')}${cleanPath}`;
};

const transformPostData = (req) => (post) => ({
  id: post.id,
  image_url: post.image_url ? getFullImageUrl(req, post.image_url) : null,
  caption: post.caption,
  created_at: post.created_at,
  user: post.user,
  like_count: post.likes?.length || post._count?.likes || 0,
  comment_count: post.comments?.length || post._count?.comments || 0,
  likes: post.likes || [],
  comments: post.comments || []
});

const postInclude = {
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
};

// Create a new post
exports.createPost = async (req, res) => {
  try {
    const { caption } = req.body;

    // Validate required content
    if (!req.file && !caption) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'MISSING_CONTENT',
          message: 'Either image or caption is required'
        }
      });
    }

    // Authentication check
    if (!req.user?.userId) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required'
        }
      });
    }

    // Verify user exists
    const userExists = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { id: true }
    });

    if (!userExists) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User account not found'
        }
      });
    }

    // Handle image URL - use relative path for database storage
    let imageUrl = null;
    if (req.file) {
      // Store relative path in database (without domain)
      const relativePath = req.file.path.replace(/\\/g, '/');
      // Remove the absolute path prefix and keep only uploads/... part
      imageUrl = relativePath.includes('/uploads/') 
        ? relativePath.substring(relativePath.indexOf('/uploads/'))
        : `/uploads/${relativePath.replace(/^.*uploads\//, '')}`;
    }

    // Create post in database
    const post = await prisma.post.create({
      data: {
        image_url: imageUrl,
        caption: caption || null,
        user: { connect: { id: req.user.userId } }
      },
      include: postInclude
    });

    // Return transformed response
    res.status(201).json({
      success: true,
      data: transformPostData(req)(post)
    });
  } catch (error) {
    console.error('Error creating post:', error);
    
    // Cleanup uploaded file if error occurred
    if (req.file?.path) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('File cleanup failed:', err);
      });
    }

    // Handle specific Prisma errors
    let errorCode = 'POST_CREATION_FAILED';
    let httpStatus = 500;
    let errorMessage = 'Failed to create post';

    if (error.code === 'P2002') { // Unique constraint violation
      errorCode = 'CONFLICT';
      httpStatus = 409;
      errorMessage = 'Post with similar data already exists';
    }

    // Return error response
    res.status(httpStatus).json({
      success: false,
      error: {
        code: errorCode,
        message: errorMessage,
        details: process.env.NODE_ENV === 'development' ? {
          message: error.message,
          stack: error.stack
        } : undefined
      }
    });
  }
};

exports.getPosts = async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      include: {
        ...postInclude,
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
          orderBy: { created_at: 'desc' },
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
      orderBy: { created_at: 'desc' }
    });

    res.json({
      success: true,
      count: posts.length,
      data: posts.map(transformPostData(req))
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

exports.getExplorePosts = async (req, res) => {
  try {
    // Parse pagination parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const skip = (page - 1) * limit;

    // Get total count for pagination info
    const totalPosts = await prisma.post.count();
    
    // Fetch posts with full data including likes and comments
    const posts = await prisma.post.findMany({
      include: {
        ...postInclude,
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
          take: 2, // Show only 2 most recent comments in explore
          orderBy: { created_at: 'desc' },
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
      orderBy: { created_at: 'desc' },
      take: limit,
      skip: skip
    });

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalPosts / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    // If we've reached the end, start repeating from the beginning
    let finalPosts = posts;
    if (posts.length < limit && totalPosts > 0) {
      // We need to fill remaining slots by repeating from the beginning
      const remainingSlots = limit - posts.length;
      const repeatPosts = await prisma.post.findMany({
        include: {
          ...postInclude,
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
            orderBy: { created_at: 'desc' },
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
        orderBy: { created_at: 'desc' },
        take: remainingSlots
      });
      
      finalPosts = [...posts, ...repeatPosts];
    }

    // Transform posts with full image URLs and proper data structure
    const transformedPosts = finalPosts.map(transformPostData(req));

    res.json({
      success: true,
      data: transformedPosts,
      pagination: {
        currentPage: page,
        totalPages: totalPages,
        totalPosts: totalPosts,
        postsPerPage: limit,
        hasNextPage: hasNextPage,
        hasPreviousPage: hasPreviousPage,
        isRepeating: posts.length < limit && totalPosts > 0
      },
      count: transformedPosts.length
    });
  } catch (error) {
    console.error('EXPLORE POSTS ERROR:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch explore posts',
      error: process.env.NODE_ENV === 'development' ? {
        message: error.message,
        stack: error.stack
      } : undefined
    });
  }
};

exports.getPublicPosts = async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      include: postInclude,
      orderBy: { created_at: 'desc' }
    });

    res.json({
      success: true,
      count: posts.length,
      data: posts.map(transformPostData(req))
    });
  } catch (error) {
    console.error('Error fetching public posts:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch posts' });
  }
};

exports.getPost = async (req, res) => {
  try {
    const post = await prisma.post.findUnique({
      where: { id: parseInt(req.params.postId) },
      include: {
        ...postInclude,
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
          orderBy: { created_at: 'desc' },
          include: {
            user: {
              select: {
                username: true,
                profile_picture: true
              }
            }
          }
        }
      }
    });

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    res.json({ success: true, data: transformPostData(req)(post) });
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch post' });
  }
};

exports.deletePost = async (req, res) => {
  try {
    // Get the post with image URL
    const post = await prisma.post.findUnique({
      where: { id: req.post.id },
      select: { image_url: true }
    });

    // Delete post from database
    await prisma.post.delete({ where: { id: req.post.id } });

    // Delete associated image file if exists
    if (post?.image_url) {
      // Convert relative URL to absolute file path
      const fileName = path.basename(post.image_url);
      const imagePath = path.join(__dirname, '..', 'uploads', 'posts', fileName);
      
      if (fs.existsSync(imagePath)) {
        try {
          fs.unlinkSync(imagePath);
        } catch (err) {
          console.error('Error deleting image file:', err);
        }
      }
    }

    res.json({ success: true, message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ success: false, message: 'Failed to delete post' });
  }
};

exports.getUserPosts = async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      where: { user_id: parseInt(req.params.userId) },
      include: postInclude,
      orderBy: { created_at: 'desc' }
    });

    res.json({
      success: true,
      count: posts.length,
      data: posts.map(transformPostData(req))
    });
  } catch (error) {
    console.error('Error fetching user posts:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch user posts' });
  }
};

exports.validatePostId = async (req, res, next) => {
  try {
    const postId = parseInt(req.params.postId);
    if (isNaN(postId)) {
      return res.status(400).json({ success: false, message: 'Invalid post ID format' });
    }

    const post = await prisma.post.findUnique({ where: { id: postId } });

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    req.post = post;
    next();
  } catch (error) {
    next(error);
  }
};

exports.checkPostOwnership = (req, res, next) => {
  if (req.post.user_id !== req.user.userId) {
    return res.status(403).json({ success: false, message: 'Not authorized to modify this post' });
  }
  next();
};

exports.validateUserId = async (req, res, next) => {
  try {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ success: false, message: 'Invalid user ID format' });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true }
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    next();
  } catch (error) {
    next(error);
  }
};