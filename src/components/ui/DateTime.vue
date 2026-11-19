<script setup>
import {formatDate} from '../../domain/format.js';

defineProps({timestamp: {type: Number, required: true}});
</script>

<template>
  <time :datetime="new Date(timestamp).toISOString()">{{ formatDate(timestamp) }}</time>
</template>
