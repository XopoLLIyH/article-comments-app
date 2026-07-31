<template>
  <v-form ref="form" @submit.prevent="submit">
    <v-text-field
      v-model="draft.title"
      label="Title"
      :rules="requiredRules"
      maxlength="255"
      counter
      autofocus
    />
    <v-textarea
      v-model="draft.text"
      label="Article text"
      :rules="requiredRules"
      rows="10"
      auto-grow
    />
    <div class="d-flex ga-3">
      <v-btn type="submit" color="primary" :loading="submitting">
        {{ article ? 'Save changes' : 'Create article' }}
      </v-btn>
      <v-btn variant="text" :disabled="submitting" @click="$emit('cancel')">
        Cancel
      </v-btn>
    </div>
  </v-form>
</template>

<script setup>
import { reactive, ref, watch } from 'vue';

const props = defineProps({
  article: { type: Object, default: null },
  submitting: { type: Boolean, default: false },
});
const emit = defineEmits(['submit', 'cancel']);

const form = ref(null);
const draft = reactive({ title: '', text: '' });
const requiredRules = [(value) => Boolean(value?.trim()) || 'This field is required'];

watch(
  () => props.article,
  (article) => {
    draft.title = article?.title || '';
    draft.text = article?.text || '';
  },
  { immediate: true },
);

async function submit() {
  const { valid } = await form.value.validate();
  if (valid) emit('submit', { title: draft.title.trim(), text: draft.text.trim() });
}
</script>

