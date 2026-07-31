<template>
  <v-list v-if="comments.length" lines="three" class="pa-0">
    <v-list-item v-for="comment in comments" :key="comment.id" class="px-0 border-b">
      <template v-if="editingId === comment.id">
        <v-textarea v-model="editingText" label="Comment" rows="2" :rules="rules" auto-grow />
        <div class="d-flex ga-2 mb-2">
          <v-btn size="small" color="primary" :loading="loading" @click="save(comment)">
            Save
          </v-btn>
          <v-btn size="small" variant="text" @click="cancelEdit">
            Cancel
          </v-btn>
        </div>
      </template>
      <template v-else>
        <v-list-item-title class="text-wrap">{{ comment.text }}</v-list-item-title>
        <v-list-item-subtitle>{{ formatDate(comment.createdAt) }}</v-list-item-subtitle>
      </template>
      <template #append>
        <div v-if="editingId !== comment.id">
          <v-btn
            icon="mdi-pencil"
            variant="text"
            size="small"
            aria-label="Edit comment"
            @click="startEdit(comment)"
          />
          <v-btn
            icon="mdi-delete"
            variant="text"
            size="small"
            color="error"
            aria-label="Delete comment"
            :loading="loading"
            @click="$emit('delete', comment.id)"
          />
        </div>
      </template>
    </v-list-item>
  </v-list>
  <v-alert v-else type="info" variant="tonal">No comments yet.</v-alert>
</template>

<script setup>
import { ref } from 'vue';
import { formatDate } from '../utils/date';

defineProps({
  comments: { type: Array, required: true },
  loading: { type: Boolean, default: false },
});
const emit = defineEmits(['update', 'delete']);
const editingId = ref(null);
const editingText = ref('');
const rules = [(value) => Boolean(value?.trim()) || 'Comment cannot be empty'];

function startEdit(comment) {
  editingId.value = comment.id;
  editingText.value = comment.text;
}

function cancelEdit() {
  editingId.value = null;
  editingText.value = '';
}

function save(comment) {
  if (!editingText.value.trim()) return;
  emit('update', { id: comment.id, text: editingText.value.trim() }, cancelEdit);
}
</script>
