const { Model, DataTypes } = require('sequelize');

class Comment extends Model {
  static initModel(sequelize) {
    Comment.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        text: {
          type: DataTypes.TEXT,
          allowNull: false,
          validate: { notEmpty: true },
        },
        articleId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          field: 'article_id',
          references: { model: 'articles', key: 'id' },
        },
      },
      {
        sequelize,
        modelName: 'Comment',
        tableName: 'comments',
        underscored: true,
        timestamps: true,
      },
    );

    return Comment;
  }

  static associate(models) {
    Comment.belongsTo(models.Article, {
      as: 'article',
      foreignKey: 'articleId',
    });
  }
}

module.exports = Comment;

