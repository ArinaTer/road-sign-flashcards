<script setup>
import {computed} from 'vue';
import copy from '../../content/home/mode-card.json';
import modes from '../../content/study/modes.json';
import {cardCount} from '../../domain/format.js';
import AppButton from '../ui/AppButton.vue';
import AppIcon from '../ui/AppIcon.vue';
import DateTime from '../ui/DateTime.vue';

const props = defineProps({
  mode: {type: String, required: true},
  count: {type: Number, required: true},
  nextReviewAt: Number,
});
defineEmits(['start']);

const modeIcons = {new: 'book', unknown: 'flag', due: 'clock', known: 'repeat'};
const modeCopy = computed(() => modes[props.mode]);
</script>

<template>
  <article :class="['mode-card', `mode-${mode}`]">
    <div class="mode-top">
      <span class="mode-icon"><AppIcon :name="modeIcons[mode]" /></span>
      <span class="mode-count">{{ cardCount(count) }}</span>
    </div>
    <h3>{{ modeCopy.label }}</h3>
    <p>{{ modeCopy.detail }}</p>
    <div class="mode-action">
      <AppButton v-if="count > 0" :variant="mode === 'new' ? 'primary' : 'secondary'"
        :aria-label="modeCopy.label" @click="$emit('start', mode)">
        {{ copy.start }}
      </AppButton>
      <p v-else class="empty-state">{{ modeCopy.empty }}</p>
      <template v-if="mode === 'due' && count === 0 && nextReviewAt != null">
        <p class="next-date">{{ copy.nearestReview }} <DateTime :timestamp="nextReviewAt" /></p>
        <AppButton variant="text" class="early-button" @click="$emit('start', 'known')">{{ copy.earlyReview }}</AppButton>
      </template>
    </div>
  </article>
</template>

<style scoped>
.mode-card {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 1rem;
  min-width: 0;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: .4rem;
}
.mode-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: .35rem;
  margin-bottom: .55rem;
}
.mode-icon {
  display: grid;
  place-items: center;
  color: var(--indigo-ink);
  background: var(--indigo-surface);
  width: 2.6rem;
  height: 2.6rem;
  border-radius: .72rem;
  flex: none;
}
.mode-unknown .mode-icon {
  color: var(--amber-ink);
  background: var(--amber-surface);
}
.mode-due .mode-icon {
  color: var(--violet-ink);
  background: var(--violet-surface);
}
.mode-known .mode-icon {
  color: var(--mint-ink);
  background: var(--mint-surface);
}
.mode-count {
  color: var(--muted);
  font-size: .875rem;
  font-weight: 650;
}
.mode-card h3 {
  font-size: 1.12rem;
  letter-spacing: -.016em;
}
.mode-card p {
  color: var(--muted);
  font-size: .9rem;
}
.mode-action {
  margin-top: auto;
  padding-top: .6rem;
}
.mode-card .empty-state {
  margin-block: .37rem;
  color: var(--muted);
  font-weight: 640;
}
.mode-card .next-date {
  margin-block: .2rem .45rem;
}
.early-button {
  text-align: left;
}

@media (max-width: 42rem) {
  .mode-card {
    padding: .75rem;
  }
  .mode-icon {
    width: 2.1rem;
    height: 2.1rem;
  }
  .mode-icon svg {
    width: 1.2rem;
    height: 1.2rem;
  }
}
</style>
