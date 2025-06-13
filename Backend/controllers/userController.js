const prisma = require('../prismaClient');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

exports.searchUsernames = async (req, res) => {
  try {
    console.log("Search endpoint hit with query:", req.query.query);
    
    const { query } = req.query;

    if (!query || query.trim() === '') {
      return res.json({
        success: true,
        users: []  // Return empty array instead of error
      });
    }

    // Using raw SQL for guaranteed case-insensitive search
    const users = await prisma.$queryRaw`
      SELECT id, username 
      FROM User 
      WHERE username COLLATE utf8mb4_general_ci LIKE ${'%' + query + '%'}
      LIMIT 10
    `;

    console.log(`Found ${users.length} users for query: "${query}"`);
    
    res.json({
      success: true,
      users
    });
  } catch (error) {
    console.error('Search usernames error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search usernames',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    if (isNaN(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID format'
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        full_name: true,
        profile_picture: true,
        bio: true,
        created_at: true
      }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Add this to userController.js
exports.getUserProfile = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID format'
      });
    }

    // Get user profile
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        full_name: true,
        profile_picture: true,
        bio: true,
        created_at: true,
        _count: {
          select: {
            posts: true,
            followers: true,
            following: true
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get user's posts
    const posts = await prisma.post.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' },
      include: {
        likes: true,
        comments: true
      }
    });

    // Get follow status (if current user is following this user)
    let isFollowing = false;
    if (req.user) {
      const follow = await prisma.follow.findFirst({
        where: {
          follower_id: req.user.id,
          following_id: userId
        }
      });
      isFollowing = !!follow;
    }

    res.json({
      success: true,
      profile: {
        ...user,
        posts,
        isFollowing
      }
    });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

exports.listAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true
      }
    });

    res.json({
      success: true,
      users
    });
  } catch (error) {
    console.error('List users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to list users',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};


exports.updateProfile = async (req, res) => {
  try {
    let { full_name, bio } = req.body;

    if (!full_name || full_name.trim() === '') {
      return res.status(400).json({
        success: false,
        errors: [{
          param: 'full_name',
          message: 'Full name is required'
        }]
      });
    }

    full_name = full_name.trim();
    bio = bio ? bio.trim() : null;

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: { 
        full_name, 
        bio 
      },
      select: {
        id: true,
        username: true,
        email: true,
        full_name: true,
        profile_picture: true,
        bio: true,
        created_at: true
      }
    });

    res.json({ 
      success: true, 
      user: updatedUser 
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update profile',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

exports.updateProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    // Update user with new profile picture path
    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: { 
        profile_picture: req.file.path 
      },
      select: {
        id: true,
        username: true,
        profile_picture: true
      }
    });

    res.json({
      success: true,
      user: updatedUser
    });
  } catch (error) {
    console.error('Update profile picture error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile picture',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Both current and new password are required'
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { password: true }
    });

    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ 
        success: false,
        message: 'Current password is incorrect' 
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: req.user.id },
      data: { password: hashedPassword }
    });

    res.json({ 
      success: true, 
      message: 'Password updated successfully' 
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to change password',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};