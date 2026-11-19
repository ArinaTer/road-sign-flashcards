<script setup>
import copy from '../../content/layout/storage-notice.json';

defineProps({status: String});
</script>

<template>
  <p v-if="status" class="notice" role="status">{{ copy[status] }}</p>
</template>

<style scoped>
.notice {
  padding: .8rem 1rem;
  margin-top: 1.25rem;
  border-radius: .7rem;
  border: 1px solid #725323;
  color: var(--amber-ink);
  background: var(--amber-surface);
}
</style>
