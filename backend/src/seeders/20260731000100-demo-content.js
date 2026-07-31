'use strict';

module.exports = {
  async up(queryInterface) {
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    await queryInterface.bulkInsert('articles', [
      {
        id: 1,
        title: 'Getting started',
        text: 'This seeded article demonstrates the article and comment API.',
        created_at: yesterday,
        updated_at: yesterday,
      },
      {
        id: 2,
        title: 'Sequelize and PostgreSQL',
        text: 'Migrations keep the database schema explicit and reproducible.',
        created_at: now,
        updated_at: now,
      },
    ]);

    await queryInterface.bulkInsert('comments', [
      { id: 1, article_id: 1, text: 'The first comment.', created_at: yesterday, updated_at: yesterday },
      { id: 2, article_id: 1, text: 'A newer comment.', created_at: now, updated_at: now },
      { id: 3, article_id: 2, text: 'Migrations are ready.', created_at: now, updated_at: now },
    ]);

    await queryInterface.sequelize.query("SELECT setval(pg_get_serial_sequence('articles', 'id'), COALESCE(MAX(id), 1)) FROM articles");
    await queryInterface.sequelize.query("SELECT setval(pg_get_serial_sequence('comments', 'id'), COALESCE(MAX(id), 1)) FROM comments");
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('comments', { id: [1, 2, 3] });
    await queryInterface.bulkDelete('articles', { id: [1, 2] });
  },
};
