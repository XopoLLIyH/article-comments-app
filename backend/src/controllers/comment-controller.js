const { Article, Comment } = require('../models');
const HttpError = require('../utils/http-error');
const { parseId, requireText } = require('../utils/request');

async function requireArticle(articleId) {
  const article = await Article.findByPk(articleId);
  if (!article) throw new HttpError(404, 'Article not found');
  return article;
}

async function requireComment(articleId, commentId) {
  const comment = await Comment.findOne({ where: { id: commentId, articleId } });
  if (!comment) throw new HttpError(404, 'Comment not found');
  return comment;
}

async function create(req, res) {
  const articleId = parseId(req.params.id, 'Article ID');
  await requireArticle(articleId);
  const comment = await Comment.create({
    articleId,
    text: requireText(req.body.text, 'text'),
  });
  res.status(201).json(comment);
}

async function list(req, res) {
  const articleId = parseId(req.params.id, 'Article ID');
  await requireArticle(articleId);
  const comments = await Comment.findAll({
    where: { articleId },
    order: [['createdAt', 'ASC']],
  });
  res.json(comments);
}

async function get(req, res) {
  const articleId = parseId(req.params.id, 'Article ID');
  const commentId = parseId(req.params.commentId, 'Comment ID');
  await requireArticle(articleId);
  res.json(await requireComment(articleId, commentId));
}

async function update(req, res) {
  const articleId = parseId(req.params.id, 'Article ID');
  const commentId = parseId(req.params.commentId, 'Comment ID');
  await requireArticle(articleId);
  const comment = await requireComment(articleId, commentId);
  await comment.update({ text: requireText(req.body.text, 'text') });
  res.json(comment);
}

async function remove(req, res) {
  const articleId = parseId(req.params.id, 'Article ID');
  const commentId = parseId(req.params.commentId, 'Comment ID');
  await requireArticle(articleId);
  const comment = await requireComment(articleId, commentId);
  await comment.destroy();
  res.status(204).send();
}

module.exports = { create, list, get, update, remove };

