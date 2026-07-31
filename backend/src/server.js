const createApp = require('./app');
const sequelize = require('./config/database');
const config = require('./config/env');

async function start() {
  try {
    await sequelize.authenticate();
    const app = createApp();
    app.listen(config.port, () => {
      console.log(`Backend listening on http://localhost:${config.port}`);
    });
  } catch (error) {
    console.error('Unable to start backend:', error);
    process.exit(1);
  }
}

start();
