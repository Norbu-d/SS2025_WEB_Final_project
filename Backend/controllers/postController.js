const express = require('express');
const router = express.Router();
const { validate, validationResult } = require('../utils/validation');
const postController = require('../controllers/postController');
const authMiddleware = require('../middleware/auth');
const upload = require('../utils/upload');

router.post(
    '/',
    authMiddleware,
    upload.single('image'),
    validate('createPost'),
    validationResult,
    postController.createPost
);

exports.createPost = async (req, res) => {
  try {
    const { caption } = req.body;
    const imageUrl = `/uploads/${req.file.filename}`;

    const post = await Post.create({
      user_id: req.user.id,
      image_url: imageUrl,
      caption
    });

    const user = await User.findById(req.user.id);
    post.dataValues.user = {
      username: user.username,
      profile_picture: user.profile_picture
    };

    res.status(201).json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.findAll({
      include: [
        {
          model: User,
          attributes: ['username', 'profile_picture']
        },
        {
          model: Like,
          attributes: ['user_id']
        },
        {
          model: Comment,
          attributes: ['id'],
          limit: 2,
          include: [{
            model: User,
            attributes: ['username', 'profile_picture']
          }]
        }
      ],
      order: [['created_at', 'DESC']]
    });

    // Transform data for easier frontend consumption
    const transformedPosts = posts.map(post => ({
      ...post.dataValues,
      like_count: post.likes.length,
      comment_count: post.comments.length,
      comments: post.comments.slice(0, 2) // Only show 2 recent comments
    }));

    res.json(transformedPosts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.getPost = async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.postId, {
      include: [
        {
          model: User,
          attributes: ['username', 'profile_picture']
        },
        {
          model: Like,
          include: [{
            model: User,
            attributes: ['username', 'profile_picture']
          }]
        },
        {
          model: Comment,
          include: [{
            model: User,
            attributes: ['username', 'profile_picture']
          }],
          order: [['created_at', 'DESC']]
        }
      ]
    });

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findOne({
      where: {
        id: req.params.postId,
        user_id: req.user.id
      }
    });

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // In production, you'd also delete the image file here
    await post.destroy();
    res.json({ message: 'Post deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.getUserPosts = async (req, res) => {
  try {
    const posts = await Post.findAll({
      where: { user_id: req.params.userId },
      include: [{
        model: User,
        attributes: ['username', 'profile_picture']
      }],
      order: [['created_at', 'DESC']]
    });
    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};