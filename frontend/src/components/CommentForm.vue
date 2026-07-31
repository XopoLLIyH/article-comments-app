<template>
  <v-form ref="form" class="mt-6" @submit.prevent="submit">
    <v-textarea
      v-model="text"
      label="Add a comment"
      :rules="rules"
      rows="3"
      auto-grow
    />
    <v-btn type="submit" color="primary" :loading="submitting" prepend-icon="mdi-send">
      Add comment
    </v-btn>
  </v-form>
</template>

<script setup>
import { ref } from 'vue';

defineProps({ submitting: { type: Boolean, default: false } });
const emit = defineEmits(['submit']);
const form = ref(null);
const text = ref('');
const rules = [(value) => Boolean(value?.trim()) || 'Comment cannot be empty'];

async function submit() {
  const { valid } = await form.value.validate();
  if (valid) emit('submit', text.value.trim());
}

function clear() {
  text.value = '';
  form.value?.resetValidation();
}

defineExpose({ clear });
</script>

