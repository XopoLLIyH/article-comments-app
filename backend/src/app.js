const express = require('express');
const cors = require('cors');
const config = require('./config/env');
const { notFoundHandler, errorHandler } = require('./middleware/error-handler');
const articleRoutes = require('./routes/article-routes');
const analyticsRoutes = require('./routes/analytics-routes');

function createApp() {
  const app = express();

  app.disable('x-powered-by');
  app.use(cors({ origin: config.frontendUrl }));
  app.use(express.json({ limit: '1mb' }));

  app.get('/health', (_req, res) => res.json({ status: 'ok' }));
  app.use(articleRoutes);
  app.use(analyticsRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

module.exports = createApp;
