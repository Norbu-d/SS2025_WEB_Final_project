const express = require('express');
const router = express.Router();
const { validate, validationResult } = require('../utils/validation');
const commentController = require('../controllers/commentController');
const authMiddleware = require('../middleware/auth');


router.post(
  '/:postId/comments',
  authMiddleware,
  validate('createComment'),
  validationResult,
  commentController.createComment
);


const Comment = db.define('Comment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  post_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'comments',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

Comment.associate = (models) => {
  Comment.belongsTo(models.User, { foreignKey: 'user_id' });
  Comment.belongsTo(models.Post, { foreignKey: 'post_id' });
};

module.exports = Comment;