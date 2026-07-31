<template>
  <h1 class="mb-6">Comment analytics</h1>

  <v-form @submit.prevent="load">
    <v-row align="center">
      <v-col cols="12" md="5">
        <v-text-field v-model="dateFrom" type="datetime-local" label="From" :rules="rules" />
      </v-col>
      <v-col cols="12" md="5">
        <v-text-field v-model="dateTo" type="datetime-local" label="To" :rules="rules" />
      </v-col>
      <v-col cols="12" md="2">
        <v-btn type="submit" color="primary" block :loading="loading">
          Apply
        </v-btn>
      </v-col>
    </v-row>
  </v-form>

  <v-alert v-if="error" type="error" class="mb-4">{{ error }}</v-alert>
  <v-progress-linear v-if="loading" indeterminate color="primary" class="mb-4" />

  <div v-if="groups.length" class="d-flex flex-column ga-4">
    <v-card v-for="group in groups" :key="group.article.id">
      <v-card-title>
        <router-link :to="{ name: 'article', params: { id: group.article.id } }">
          {{ group.article.title }}
        </router-link>
        <v-chip class="ml-3" size="small">{{ group.comments.length }}</v-chip>
      </v-card-title>
      <v-list lines="two">
        <v-list-item v-for="comment in group.comments" :key="comment.id">
          <v-list-item-title class="text-wrap">{{ comment.text }}</v-list-item-title>
          <v-list-item-subtitle>{{ formatDate(comment.createdAt) }}</v-list-item-subtitle>
        </v-list-item>
      </v-list>
    </v-card>
  </div>
  <v-alert v-else-if="searched && !loading" type="info" variant="tonal">
    No comments were created during this period.
  </v-alert>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useStore } from 'vuex';
import { formatDate } from '../utils/date';

const store = useStore();
const now = new Date();
const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
const dateFrom = ref(toLocalInput(weekAgo));
const dateTo = ref(toLocalInput(now));
const searched = ref(false);
const groups = computed(() => store.state.analytics.groups);
const loading = computed(() => store.state.analytics.loading);
const error = computed(() => store.state.analytics.error);
const rules = [(value) => Boolean(value) || 'Date is required'];

function toLocalInput(date) {
  const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return offsetDate.toISOString().slice(0, 16);
}

async function load() {
  if (!dateFrom.value || !dateTo.value) return;
  searched.value = true;
  await store.dispatch('analytics/fetchComments', {
    dateFrom: new Date(dateFrom.value).toISOString(),
    dateTo: new Date(dateTo.value).toISOString(),
  });
}

onMounted(load);
</script>
