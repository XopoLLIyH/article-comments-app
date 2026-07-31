<template>
  <h1 class="mb-6">{{ id ? 'Edit article' : 'New article' }}</h1>
  <v-alert v-if="error" type="error" class="mb-4">{{ error }}</v-alert>
  <v-skeleton-loader v-if="id && loading && !article" type="article" />
  <ArticleForm
    v-else
    :article="article"
    :submitting="loading"
    @submit="save"
    @cancel="cancel"
  />
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import ArticleForm from '../components/ArticleForm.vue';

const props = defineProps({ id: { type: String, default: null } });
const store = useStore();
const router = useRouter();
const article = computed(() => (props.id ? store.state.articles.current : null));
const loading = computed(() => store.state.articles.loading);
const error = computed(() => store.state.articles.error);

onMounted(() => {
  if (props.id) store.dispatch('articles/fetchArticle', props.id);
});

async function save(payload) {
  const saved = props.id
    ? await store.dispatch('articles/updateArticle', { id: props.id, ...payload })
    : await store.dispatch('articles/createArticle', payload);
  await router.push({ name: 'article', params: { id: saved.id } });
}

function cancel() {
  router.push(props.id
    ? { name: 'article', params: { id: props.id } }
    : { name: 'articles' });
}
</script>
