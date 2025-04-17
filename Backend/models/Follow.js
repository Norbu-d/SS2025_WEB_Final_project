const { DataTypes } = require('sequelize');
const db = require('../config/db');

const Follow = db.define('Follow', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  follower_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  following_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  tableName: 'followers',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
  indexes: [
    {
      unique: true,
      fields: ['follower_id', 'following_id']
    }
  ]
});

// Associations
Follow.associate = (models) => {
  Follow.belongsTo(models.User, {
    as: 'follower',
    foreignKey: 'follower_id'
  });
  
  Follow.belongsTo(models.User, {
    as: 'following',
    foreignKey: 'following_id'
  });
};

module.exports = Follow;