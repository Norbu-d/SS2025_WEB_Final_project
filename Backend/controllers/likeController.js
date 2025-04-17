const Like = require('../models/Like');
const Post = require('../models/Post');
const { createNotification } = require('./notificationController');

exports.likePost = async (req, res) => {
  try {
    const postId = req.params.postId;
    
    // Check if like already exists
    const existingLike = await Like.findOne({
      where: {
        user_id: req.user.id,
        post_id: postId
      }
    });

    if (existingLike) {
      return res.status(400).json({ message: 'Post already liked' });
    }

    const like = await Like.create({
      user_id: req.user.id,
      post_id: postId
    });

    // Add notification
    const post = await Post.findById(postId);
    if (post.user_id !== req.user.id) {
      await createNotification({
        userId: post.user_id,
        senderId: req.user.id,
        postId,
        type: 'like'
      });
    }

    res.status(201).json(like);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.unlikePost = async (req, res) => {
  try {
    const like = await Like.findOne({
      where: {
        user_id: req.user.id,
        post_id: req.params.postId
      }
    });

    if (!like) {
      return res.status(404).json({ message: 'Like not found' });
    }

    await like.destroy();
    res.json({ message: 'Post unliked' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.getLikes = async (req, res) => {
  try {
    const likes = await Like.findAll({
      where: { post_id: req.params.postId },
      include: ['user'],
      order: [['created_at', 'DESC']]
    });
    res.json(likes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};