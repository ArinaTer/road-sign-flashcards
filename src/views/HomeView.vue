<script setup>
import copy from '../content/home/study-modes.json';
import modeCardCopy from '../content/home/mode-card.json';
import modes from '../content/study/modes.json';
import {cardCount, formatMessage} from '../domain/format.js';
import {countedModes} from '../domain/study-modes.js';
import GroupPicker from '../components/home/GroupPicker.vue';
import ProgressSummary from '../components/home/ProgressSummary.vue';
import ModeCard from '../components/home/ModeCard.vue';
import AppButton from '../components/ui/AppButton.vue';
import AppIcon from '../components/ui/AppIcon.vue';

defineProps({
  counts: {type: Object, required: true},
  total: {type: Number, required: true},
  nextReviewAt: Number,
});
defineEmits(['start', 'reset']);

const group = defineModel({type: String, required: true});
</script>

<template>
  <section class="study" aria-labelledby="study-title">
    <div class="section-heading">
      <h1 id="study-title" data-view-title tabindex="-1">{{ copy.title }}</h1>
      <GroupPicker v-model="group" />
    </div>
    <ProgressSummary :counts="counts" />
    <div class="mode-grid">
      <ModeCard v-for="mode in countedModes" :key="mode" :mode="mode" :count="counts[mode]"
        :next-review-at="nextReviewAt" @start="$emit('start', $event)" />
    </div>
    <div class="all-mode">
      <span class="mode-icon"><AppIcon name="grid" /></span>
      <div>
        <h3>{{ modes.all.label }}</h3>
        <p>{{ formatMessage(copy.allCardsDescription, {count: cardCount(total)}) }}</p>
      </div>
      <AppButton :aria-label="modes.all.label" @click="$emit('start', 'all')">{{ modeCardCopy.start }}</AppButton>
    </div>
    <div class="reset-action">
      <AppButton variant="text" @click="$emit('reset')">{{ copy.reset }}</AppButton>
    </div>
  </section>
</template>

<style scoped>
.study {
  margin-top: 2.1rem;
}
.section-heading {
  display: flex;
  justify-content: space-between;
  align-items: end;
  gap: .9rem 1.5rem;
  margin-bottom: 1rem;
}
.section-heading h1 {
  font-size: clamp(1.65rem, 3.6vw, 2.1rem);
  letter-spacing: -.027em;
}
.mode-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: .85rem;
  margin-top: 1rem;
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
.all-mode h3 {
  font-size: 1.12rem;
  letter-spacing: -.016em;
}
.all-mode p {
  color: var(--muted);
  font-size: .9rem;
}
.all-mode {
  margin-top: .85rem;
  padding: .9rem 1rem;
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 1rem;
  display: flex;
  align-items: center;
  gap: .8rem;
}
.all-mode p {
  margin-top: .2rem;
}
.all-mode .button {
  margin-left: auto;
}
.reset-action {
  display: flex;
  justify-content: flex-end;
  margin-top: .7rem;
}

@media (max-width: 57rem) {
  .mode-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 42rem) {
  .section-heading {
    align-items: stretch;
    flex-direction: column;
  }
  .mode-grid {
    gap: .6rem;
  }
  .mode-icon {
    width: 2.1rem;
    height: 2.1rem;
  }
  .mode-icon svg {
    width: 1.2rem;
    height: 1.2rem;
  }
  .all-mode {
    padding: .75rem;
  }
}

@media (max-width: 24rem) {
  .mode-grid {
    grid-template-columns: 1fr;
  }
}
</style>
