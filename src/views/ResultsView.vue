<script setup>
import {computed} from 'vue';
import copy from '../content/study/results.json';
import modes from '../content/study/modes.json';
import statuses from '../content/study/statuses.json';
import SessionFrame from '../components/study/SessionFrame.vue';
import SessionActions from '../components/study/SessionActions.vue';
import ProgressStats from '../components/ui/ProgressStats.vue';
import AppButton from '../components/ui/AppButton.vue';
import AppIcon from '../components/ui/AppIcon.vue';

const props = defineProps({round: {type: Object, required: true}});
defineEmits(['home', 'undo', 'mistakes']);

const unknown = computed(() => props.round.answers.filter(answer => answer.status === 'unknown').length);
const items = computed(() => [
  {label: copy.viewed, value: props.round.answers.length},
  {label: statuses.known, value: props.round.answers.length - unknown.value},
  {label: statuses.unknown, value: unknown.value},
]);
</script>

<template>
  <SessionFrame can-undo @home="$emit('home')" @undo="$emit('undo')">
    <div class="result-panel">
      <span class="result-icon"><AppIcon name="check" /></span>
      <h1 id="session-title" data-view-title tabindex="-1">{{ copy.title }}</h1>
      <p>{{ modes[round.mode].label }}</p>
      <ProgressStats class="result-stats" :items="items" centered />
      <SessionActions>
        <AppButton v-if="unknown > 0" variant="primary" @click="$emit('mistakes')">
          {{ modes.mistakes.label }}
        </AppButton>
        <AppButton @click="$emit('home')">{{ copy.home }}</AppButton>
      </SessionActions>
    </div>
  </SessionFrame>
</template>

<style scoped>
.result-panel {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 1.35rem;
  text-align: center;
  padding: 1.5rem;
  box-shadow: 0 .35rem 1.25rem var(--shadow);
}
.result-panel h1 {
  font-size: clamp(1.75rem, 4.8vw, 2.6rem);
  letter-spacing: -.035em;
}
.result-panel {
  margin-top: 1rem;
  padding: 2rem 1.5rem;
}
.result-icon {
  width: 3.5rem;
  height: 3.5rem;
  display: grid;
  place-items: center;
  margin: 0 auto .9rem;
  background: var(--mint-surface);
  color: var(--mint-ink);
  border-radius: 1rem;
}
.result-panel > p {
  margin-top: .55rem;
  color: var(--muted);
}
.result-stats {
  margin-top: 1.35rem;
}
</style>
