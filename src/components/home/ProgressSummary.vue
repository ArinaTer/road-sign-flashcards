<script setup>
import {computed} from 'vue';
import copy from '../../content/home/progress-summary.json';
import ProgressStats from '../ui/ProgressStats.vue';

const props = defineProps({counts: {type: Object, required: true}});

const items = computed(() => [
  {label: copy.known, value: props.counts.known},
  {label: copy.remaining, value: props.counts.new + props.counts.unknown},
  {label: copy.due, value: props.counts.due},
]);
</script>

<template>
  <ProgressStats :items="items" :label="copy.label" />
</template>
