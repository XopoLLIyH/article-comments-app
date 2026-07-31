const { Sequelize } = require('sequelize');
const config = require('./env');

const sequelize = new Sequelize(config.databaseUrl, {
  dialect: 'postgres',
  logging: config.env === 'development' ? console.log : false,
});

module.exports = sequelize;

