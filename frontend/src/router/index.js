import { createRouter, createWebHistory } from 'vue-router';
import ArticlesView from '../views/ArticlesView.vue';
import ArticleView from '../views/ArticleView.vue';
import ArticleFormView from '../views/ArticleFormView.vue';
import AnalyticsView from '../views/AnalyticsView.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/articles' },
    { path: '/articles', name: 'articles', component: ArticlesView },
    { path: '/articles/new', name: 'article-new', component: ArticleFormView },
    { path: '/articles/:id', name: 'article', component: ArticleView, props: true },
    { path: '/articles/:id/edit', name: 'article-edit', component: ArticleFormView, props: true },
    { path: '/analytics', name: 'analytics', component: AnalyticsView },
  ],
});

export default router;

