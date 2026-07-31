const { describe, it, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const createApp = require('../src/app');
const { Article, Comment } = require('../src/models');

const app = createApp();
const originalMethods = {
  articleCreate: Article.create,
  articleFindAll: Article.findAll,
  articleFindByPk: Article.findByPk,
  commentCreate: Comment.create,
  commentFindAll: Comment.findAll,
  commentFindOne: Comment.findOne,
};

function restoreModelMethods() {
  Article.create = originalMethods.articleCreate;
  Article.findAll = originalMethods.articleFindAll;
  Article.findByPk = originalMethods.articleFindByPk;
  Comment.create = originalMethods.commentCreate;
  Comment.findAll = originalMethods.commentFindAll;
  Comment.findOne = originalMethods.commentFindOne;
}

describe('HTTP API', { concurrency: false }, () => {
  beforeEach(restoreModelMethods);

  it('reports service health', async () => {
    const response = await request(app).get('/health').expect(200);
    assert.deepEqual(response.body, { status: 'ok' });
  });

  it('creates an article from JSON', async () => {
    Article.create = async (payload) => ({ id: 7, ...payload });

    const response = await request(app)
      .post('/article/')
      .set('Content-Type', 'application/json')
      .send({ title: '  Test article  ', text: ' Body ' })
      .expect(201)
      .expect('Content-Type', /json/);

    assert.deepEqual(response.body, { id: 7, title: 'Test article', text: 'Body' });
  });

  it('rejects an empty article title', async () => {
    const response = await request(app)
      .post('/article/')
      .send({ title: ' ', text: 'Body' })
      .expect(400);

    assert.equal(response.body.message, 'title must be a non-empty string');
  });

  it('returns 404 for a missing article', async () => {
    Article.findByPk = async () => null;
    const response = await request(app).get('/article/42/').expect(404);
    assert.equal(response.body.message, 'Article not found');
  });

  it('updates only supplied article fields', async () => {
    const article = {
      id: 3,
      title: 'Old',
      text: 'Keep me',
      async update(changes) {
        Object.assign(this, changes);
      },
    };
    Article.findByPk = async () => article;

    const response = await request(app)
      .patch('/article/3/')
      .send({ title: 'New' })
      .expect(200);

    assert.equal(response.body.title, 'New');
    assert.equal(response.body.text, 'Keep me');
  });

  it('creates a comment under an existing article', async () => {
    Article.findByPk = async () => ({ id: 2 });
    Comment.create = async (payload) => ({ id: 9, ...payload });

    const response = await request(app)
      .post('/article/2/comment/')
      .send({ text: 'Nested comment' })
      .expect(201);

    assert.deepEqual(response.body, { id: 9, articleId: 2, text: 'Nested comment' });
  });

  it('does not expose a comment through another article', async () => {
    Article.findByPk = async () => ({ id: 2 });
    Comment.findOne = async ({ where }) => {
      assert.deepEqual(where, { id: 5, articleId: 2 });
      return null;
    };

    const response = await request(app).get('/article/2/comment/5/').expect(404);
    assert.equal(response.body.message, 'Comment not found');
  });

  it('validates the analytics period', async () => {
    const response = await request(app)
      .get('/analytic/comments/?dateFrom=2026-08-01&dateTo=2026-07-01')
      .expect(400);

    assert.equal(response.body.message, 'dateFrom must not be later than dateTo');
  });

  it('groups analytics comments by article', async () => {
    Comment.findAll = async () => [
      {
        toJSON: () => ({
          id: 1,
          text: 'First',
          articleId: 10,
          article: { id: 10, title: 'Grouped article' },
        }),
      },
      {
        toJSON: () => ({
          id: 2,
          text: 'Second',
          articleId: 10,
          article: { id: 10, title: 'Grouped article' },
        }),
      },
    ];

    const response = await request(app)
      .get('/analytic/comments/?dateFrom=2026-07-01T00:00:00Z&dateTo=2026-08-01T00:00:00Z')
      .expect(200);

    assert.equal(response.body.articles.length, 1);
    assert.equal(response.body.articles[0].article.title, 'Grouped article');
    assert.equal(response.body.articles[0].comments.length, 2);
    assert.equal(response.body.articles[0].comments[0].article, undefined);
  });
});
