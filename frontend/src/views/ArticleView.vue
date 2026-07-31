<template>
  <v-alert v-if="error" type="error" class="mb-4">{{ error }}</v-alert>
  <v-skeleton-loader v-if="loading && !article" type="article" />
  <template v-else-if="article">
    <div class="d-flex justify-space-between align-start mb-4">
      <div>
        <h1>{{ article.title }}</h1>
        <div class="text-medium-emphasis">Updated {{ formatDate(article.updatedAt) }}</div>
      </div>
      <div class="d-flex ga-2">
        <v-btn
          prepend-icon="mdi-pencil"
          :to="{ name: 'article-edit', params: { id } }"
        >
          Edit
        </v-btn>
        <v-btn color="error" prepend-icon="mdi-delete" :loading="loading" @click="removeArticle">
          Delete
        </v-btn>
      </div>
    </div>

    <v-card class="mb-8">
      <v-card-text class="article-text">{{ article.text }}</v-card-text>
    </v-card>

    <h2 class="mb-4">Comments</h2>
    <CommentList
      :comments="comments"
      :loading="commentsLoading"
      @update="updateComment"
      @delete="deleteComment"
    />
    <CommentForm ref="commentForm" :submitting="commentsLoading" @submit="addComment" />
  </template>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import CommentForm from '../components/CommentForm.vue';
import CommentList from '../components/CommentList.vue';
import { formatDate } from '../utils/date';

const props = defineProps({ id: { type: String, required: true } });
const store = useStore();
const router = useRouter();
const commentForm = ref(null);
const article = computed(() => store.state.articles.current);
const comments = computed(() => store.state.comments.items);
const loading = computed(() => store.state.articles.loading);
const commentsLoading = computed(() => store.state.comments.loading);
const error = computed(() => store.state.articles.error || store.state.comments.error);

onMounted(() => Promise.all([
  store.dispatch('articles/fetchArticle', props.id),
  store.dispatch('comments/fetchComments', props.id),
]));

async function removeArticle() {
  if (!window.confirm('Delete this article and all of its comments?')) return;
  await store.dispatch('articles/deleteArticle', props.id);
  await router.push({ name: 'articles' });
}

async function addComment(text) {
  await store.dispatch('comments/addComment', { articleId: props.id, text });
  commentForm.value.clear();
}

async function updateComment(payload, done) {
  await store.dispatch('comments/updateComment', { articleId: props.id, ...payload });
  done();
}

async function deleteComment(commentId) {
  if (!window.confirm('Delete this comment?')) return;
  await store.dispatch('comments/deleteComment', { articleId: props.id, id: commentId });
}
</script>

<style scoped>
.article-text {
  white-space: pre-wrap;
  line-height: 1.7;
}
</style>
