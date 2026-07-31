require('dotenv').config();

const shared = {
  dialect: 'postgres',
  migrationStorageTableName: 'sequelize_meta',
  seederStorage: 'sequelize',
  seederStorageTableName: 'sequelize_data',
};

module.exports = {
  development: {
    ...shared,
    use_env_variable: 'DATABASE_URL',
    url: process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/articles',
  },
  test: {
    ...shared,
    use_env_variable: 'TEST_DATABASE_URL',
    url: process.env.TEST_DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/articles_test',
    logging: false,
  },
  production: {
    ...shared,
    use_env_variable: 'DATABASE_URL',
    dialectOptions: process.env.DB_SSL === 'false' ? {} : {
      ssl: { require: true, rejectUnauthorized: false },
    },
    logging: false,
  },
};

