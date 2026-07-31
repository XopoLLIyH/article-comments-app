const sequelize = require('../config/database');
const Article = require('./article');
const Comment = require('./comment');

const models = {
  Article: Article.initModel(sequelize),
  Comment: Comment.initModel(sequelize),
};

Object.values(models).forEach((model) => {
  if (model.associate) model.associate(models);
});

module.exports = { sequelize, ...models };

