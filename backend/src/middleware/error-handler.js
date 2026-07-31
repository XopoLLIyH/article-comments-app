function notFoundHandler(req, _res, next) {
  const error = new Error(`Route ${req.method} ${req.originalUrl} not found`);
  error.status = 404;
  next(error);
}

function errorHandler(error, _req, res, _next) {
  const sequelizeClientError = ['SequelizeValidationError', 'SequelizeUniqueConstraintError'].includes(error.name);
  const status = error.status || (sequelizeClientError ? 400 : 500);
  const payload = {
    error: error.name || 'Error',
    message: status === 500 ? 'Internal server error' : error.message,
  };

  if (error.errors) {
    payload.details = error.errors.map((item) => item.message);
  }

  if (status === 500) console.error(error);
  res.status(status).json(payload);
}

module.exports = { notFoundHandler, errorHandler };
