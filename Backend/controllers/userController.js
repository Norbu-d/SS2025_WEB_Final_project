const User = require('../models/User');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

exports.getUserById = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    if (isNaN(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID format'
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access'
      });
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        full_name: user.full_name,
        profile_picture: user.profile_picture,
        bio: user.bio,
        website: user.website
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    let { full_name, bio, website } = req.body;

    // Validate full_name
    if (!full_name || full_name.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Full name is required'
      });
    }

    // Trim inputs for safety
    full_name = full_name.trim();
    bio = bio ? bio.trim() : null;
    website = website ? website.trim() : null;

    const updatedUser = await User.updateProfile(req.user.id, { 
      full_name, 
      bio, 
      website 
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

    const user = await User.findById(req.user.id);
    const oldPicturePath = path.join(__dirname, '..', user.profile_picture);

    if (fs.existsSync(oldPicturePath) && !oldPicturePath.includes('default.jpg')) {
      fs.unlinkSync(oldPicturePath);
    }

    const profile_picture = `/uploads/${req.file.filename}`;
    const updatedUser = await User.updateProfilePicture(req.user.id, profile_picture);
    
    res.json({ 
      success: true, 
      user: updatedUser 
    });
  } catch (error) {
    console.error('Update profile picture error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update profile picture'
    });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        errors: [{ 
          param: 'newPassword', 
          message: 'Password must be at least 6 characters' 
        }]
      });
    }

    const isMatch = await User.verifyPassword(req.user.id, currentPassword);
    if (!isMatch) {
      return res.status(400).json({ 
        success: false,
        errors: [{ 
          param: 'currentPassword', 
          message: 'Current password is incorrect' 
        }]
      });
    }

    await User.updatePassword(req.user.id, newPassword);
    res.json({ 
      success: true, 
      message: 'Password updated successfully' 
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to change password'
    });
  }
};
