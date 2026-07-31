const HttpError = require('./http-error');

function parseId(value, label = 'ID') {
  const id = Number(value);
  if (!Number.isSafeInteger(id) || id < 1) {
    throw new HttpError(400, `${label} must be a positive integer`);
  }
  return id;
}

function requireText(value, field) {
  if (typeof value !== 'string' || !value.trim()) {
    throw new HttpError(400, `${field} must be a non-empty string`);
  }
  return value.trim();
}

function parseTimestamp(value, field) {
  if (value === undefined || value === '') {
    throw new HttpError(400, `${field} is required`);
  }

  const numeric = typeof value === 'string' && /^\d+$/.test(value) ? Number(value) : null;
  const date = numeric === null
    ? new Date(value)
    : new Date(numeric < 1_000_000_000_000 ? numeric * 1000 : numeric);

  if (Number.isNaN(date.getTime())) {
    throw new HttpError(400, `${field} must be an ISO date or Unix timestamp`);
  }
  return date;
}

module.exports = { parseId, requireText, parseTimestamp };

