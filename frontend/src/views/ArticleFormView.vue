<template>
  <h1>{{ id ? 'Edit article' : 'New article' }}</h1>
</template>

<script setup>
defineProps({ id: { type: String, default: null } });
</script>

