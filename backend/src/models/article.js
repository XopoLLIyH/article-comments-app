const { Model, DataTypes } = require('sequelize');

class Article extends Model {
  static initModel(sequelize) {
    Article.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        title: {
          type: DataTypes.STRING(255),
          allowNull: false,
          validate: { notEmpty: true },
        },
        text: {
          type: DataTypes.TEXT,
          allowNull: false,
          validate: { notEmpty: true },
        },
      },
      {
        sequelize,
        modelName: 'Article',
        tableName: 'articles',
        underscored: true,
        timestamps: true,
      },
    );

    return Article;
  }

  static associate(models) {
    Article.hasMany(models.Comment, {
      as: 'comments',
      foreignKey: 'articleId',
      onDelete: 'CASCADE',
    });
  }
}

module.exports = Article;

