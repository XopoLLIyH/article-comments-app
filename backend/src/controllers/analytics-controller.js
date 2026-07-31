const { Op } = require('sequelize');
const { Article, Comment } = require('../models');
const HttpError = require('../utils/http-error');
const { parseTimestamp } = require('../utils/request');

async function commentsByPeriod(req, res) {
  const dateFrom = parseTimestamp(req.query.dateFrom, 'dateFrom');
  const dateTo = parseTimestamp(req.query.dateTo, 'dateTo');
  if (dateFrom > dateTo) throw new HttpError(400, 'dateFrom must not be later than dateTo');

  const comments = await Comment.findAll({
    where: { createdAt: { [Op.between]: [dateFrom, dateTo] } },
    include: [{ model: Article, as: 'article', attributes: ['id', 'title'] }],
    order: [['createdAt', 'ASC']],
  });

  const grouped = new Map();
  comments.forEach((commentModel) => {
    const comment = commentModel.toJSON();
    const article = comment.article;
    if (!grouped.has(article.id)) {
      grouped.set(article.id, { article, comments: [] });
    }
    delete comment.article;
    grouped.get(article.id).comments.push(comment);
  });

  res.json({
    dateFrom: dateFrom.toISOString(),
    dateTo: dateTo.toISOString(),
    articles: Array.from(grouped.values()),
  });
}

module.exports = { commentsByPeriod };

