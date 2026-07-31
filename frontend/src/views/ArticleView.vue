<template>
  <h1>Article {{ id }}</h1>
</template>

<script setup>
defineProps({ id: { type: String, required: true } });
</script>

