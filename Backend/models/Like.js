module.exports = (sequelize, DataTypes) => {
  const Like = sequelize.define('Like', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    post_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Posts',
        key: 'id'
      }
    }
  }, {
    timestamps: true,
    underscored: true,
    tableName: 'likes'
  });

  Like.associate = (models) => {
    Like.belongsTo(models.User, { foreignKey: 'user_id' });
    Like.belongsTo(models.Post, { foreignKey: 'post_id' });
  };

  return Like;
};