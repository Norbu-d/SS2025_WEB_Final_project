const { DataTypes } = require('sequelize');
const db = require('../config/db');

const Like = db.define('Like', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
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
  tableName: 'likes',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
  indexes: [
    {
      unique: true,
      fields: ['user_id', 'post_id']
    }
  ]
});

Like.associate = (models) => {
  Like.belongsTo(models.User, { foreignKey: 'user_id' });
  Like.belongsTo(models.Post, { foreignKey: 'post_id' });
};

module.exports = Like;