const { Article } = require('../models');
const HttpError = require('../utils/http-error');
const { parseId, requireText } = require('../utils/request');

async function create(req, res) {
  const article = await Article.create({
    title: requireText(req.body.title, 'title'),
    text: requireText(req.body.text, 'text'),
  });
  res.status(201).json(article);
}

async function list(_req, res) {
  const articles = await Article.findAll({ order: [['createdAt', 'DESC']] });
  res.json(articles);
}

async function get(req, res) {
  const article = await Article.findByPk(parseId(req.params.id, 'Article ID'));
  if (!article) throw new HttpError(404, 'Article not found');
  res.json(article);
}

async function update(req, res) {
  const article = await Article.findByPk(parseId(req.params.id, 'Article ID'));
  if (!article) throw new HttpError(404, 'Article not found');

  const changes = {};
  if (req.body.title !== undefined) changes.title = requireText(req.body.title, 'title');
  if (req.body.text !== undefined) changes.text = requireText(req.body.text, 'text');
  if (!Object.keys(changes).length) throw new HttpError(400, 'Provide title or text to update');

  await article.update(changes);
  res.json(article);
}

async function remove(req, res) {
  const article = await Article.findByPk(parseId(req.params.id, 'Article ID'));
  if (!article) throw new HttpError(404, 'Article not found');
  await article.destroy();
  res.status(204).send();
}

module.exports = { create, list, get, update, remove };

