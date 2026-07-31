<template>
  <div class="d-flex justify-space-between align-center mb-6">
    <h1>Articles</h1>
    <v-btn color="primary" prepend-icon="mdi-plus" :to="{ name: 'article-new' }">
      New article
    </v-btn>
  </div>

  <v-alert v-if="error" type="error" class="mb-4">{{ error }}</v-alert>
  <v-data-table
    :headers="headers"
    :items="articles"
    :loading="loading"
    item-value="id"
    hover
  >
    <template #item.title="{ item }">
      <router-link :to="{ name: 'article', params: { id: item.id } }">
        {{ item.title }}
      </router-link>
    </template>
    <template #item.createdAt="{ value }">{{ formatDate(value) }}</template>
    <template #item.updatedAt="{ value }">{{ formatDate(value) }}</template>
    <template #no-data>No articles yet.</template>
  </v-data-table>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { formatDate } from '../utils/date';

const store = useStore();
const articles = computed(() => store.state.articles.items);
const loading = computed(() => store.state.articles.loading);
const error = computed(() => store.state.articles.error);
const headers = [
  { title: 'ID', key: 'id', width: 80 },
  { title: 'Title', key: 'title' },
  { title: 'Created', key: 'createdAt' },
  { title: 'Modified', key: 'updatedAt' },
];

onMounted(() => store.dispatch('articles/fetchArticles'));
</script>

