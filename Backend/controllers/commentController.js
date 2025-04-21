// const Comment = require('../models/Comment');
// const Post = require('../models/Post');
// const User = require('../models/User');
// const { createNotification } = require('./notificationController');

// exports.createComment = async (req, res) => {
//   try {
//     const { content } = req.body;
//     const postId = req.params.postId;
    
//     const comment = await Comment.create({
//       user_id: req.user.id,
//       post_id: postId,
//       content
//     });

//     // Add notification
//     const post = await Post.findById(postId);
//     if (post.user_id !== req.user.id) {
//       await createNotification({
//         userId: post.user_id,
//         senderId: req.user.id,
//         postId,
//         type: 'comment'
//       });
//     }

//     const user = await User.findById(req.user.id);
//     comment.dataValues.user = {
//       username: user.username,
//       profile_picture: user.profile_picture
//     };

//     res.status(201).json(comment);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server Error' });
//   }
// };

// exports.getComments = async (req, res) => {
//   try {
//     const comments = await Comment.findAll({
//       where: { post_id: req.params.postId },
//       include: [{
//         model: User,
//         attributes: ['username', 'profile_picture']
//       }],
//       order: [['created_at', 'DESC']]
//     });
//     res.json(comments);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server Error' });
//   }
// };

// exports.deleteComment = async (req, res) => {
//   try {
//     const comment = await Comment.findOne({
//       where: {
//         id: req.params.commentId,
//         user_id: req.user.id
//       }
//     });

//     if (!comment) {
//       return res.status(404).json({ message: 'Comment not found' });
//     }

//     await comment.destroy();
//     res.json({ message: 'Comment deleted' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server Error' });
//   }
// };