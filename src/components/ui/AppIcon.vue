<script setup>
defineProps({name: {type: String, required: true}});

const paths = {
  book: ['M4 19V5a2 2 0 0 1 2-2h13v16H6a2 2 0 1 0 0 4h13v-4M8 7h7m-7 4h5'],
  flag: ['M5 21V4m0 1c6-5 8 5 14 0v10c-6 5-8-5-14 0'],
  clock: ['M12 7.5v5l3 2'],
  repeat: ['M20 9H8a4 4 0 0 0-4 4m13-7 3 3-3 3M4 15h12a4 4 0 0 0 4-4M7 12l-3 3 3 3'],
  undo: ['m9 14-5-5 5-5M4 9h10a5 5 0 0 1 0 10h-3'],
  check: ['m5 12 4 4L19 6'],
  chevron: ['m7 10 5 5 5-5'],
};
</script>

<template>
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <circle v-if="name === 'clock'" cx="12" cy="12" r="8.5" />
    <path v-for="path in paths[name]" :key="path" :d="path" />
  </svg>
</template>
