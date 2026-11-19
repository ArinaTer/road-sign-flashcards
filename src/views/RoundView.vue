<script setup>
import {computed, ref, useTemplateRef, watch} from 'vue';
import copy from '../content/study/round.json';
import modes from '../content/study/modes.json';
import statuses from '../content/study/statuses.json';
import {formatMessage} from '../domain/format.js';
import SessionFrame from '../components/study/SessionFrame.vue';
import SessionActions from '../components/study/SessionActions.vue';
import SignFlashcard from '../components/study/SignFlashcard.vue';
import AppButton from '../components/ui/AppButton.vue';

const props = defineProps({
  round: {type: Object, required: true},
});
const emit = defineEmits(['home', 'undo', 'reveal', 'answer']);

const body = useTemplateRef('body');
const flashcard = useTemplateRef('flashcard');
const dismissing = ref(false);
const index = computed(() => props.round.answers.length);
const card = computed(() => props.round.cards[index.value]);
const position = computed(() => formatMessage(copy.position, {
  current: index.value + 1,
  total: props.round.cards.length,
}));

watch([index, () => props.round.revealed], () => {
  const target = props.round.revealed ? '#sign-answer' : '[data-reveal]';
  body.value?.querySelector(target)?.focus({preventScroll: true});
}, {flush: 'post'});

function answer(status) {
  dismissing.value = false;
  emit('answer', status);
}
</script>

<template>
  <SessionFrame :can-undo="index > 0" :busy="dismissing" @home="$emit('home')" @undo="$emit('undo')">
    <div ref="body">
      <div class="session-heading">
        <h1 id="session-title" data-view-title tabindex="-1">{{ modes[round.mode].label }}</h1>
        <div>{{ position }}</div>
      </div>
      <progress :aria-label="copy.progressLabel" :value="index" :max="round.cards.length"></progress>
      <SignFlashcard :key="card.id" ref="flashcard" :card="card" :revealed="round.revealed"
        @reveal="$emit('reveal')" @dismiss="dismissing = true" @answer="answer" />
      <p v-if="round.revealed" class="swipe-hint">{{ copy.swipeHint }}</p>
      <SessionActions v-if="round.revealed" class="answer-actions">
        <AppButton class="answer-unknown" :disabled="dismissing" @click="flashcard.submit('unknown')">
          {{ statuses.unknown }}
        </AppButton>
        <AppButton class="answer-known" :disabled="dismissing" @click="flashcard.submit('known')">
          {{ statuses.known }}
        </AppButton>
      </SessionActions>
    </div>
  </SessionFrame>
</template>

<style scoped>
.session-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: .6rem 1rem;
  flex-wrap: wrap;
  margin-top: 1.2rem;
}
.session-heading h1 {
  font-size: clamp(1.75rem, 4.8vw, 2.6rem);
  letter-spacing: -.035em;
}
.session-heading div {
  color: var(--muted);
  font-weight: 650;
  font-size: .9rem;
}
progress {
  display: block;
  width: 100%;
  height: .45rem;
  margin-block: .85rem 1rem;
  border: 0;
  border-radius: 1rem;
  overflow: hidden;
  appearance: none;
  background: var(--line);
}
progress::-webkit-progress-bar {
  background: var(--line);
}
progress::-webkit-progress-value {
  background: var(--blue);
}
progress::-moz-progress-bar {
  background: var(--blue);
}
.swipe-hint {
  margin-top: .9rem;
  color: var(--muted);
  text-align: center;
  font-size: .875rem;
}
.answer-actions {
  margin-top: .6rem;
}
.answer-unknown {
  color: #ffb9bf;
  background: #38232d;
  border-color: #70444c;
}
.answer-known {
  color: var(--mint-ink);
  background: var(--mint-surface);
  border-color: #386c5f;
}
.answer-unknown:hover {
  background: #49303b;
  border-color: #ad6973;
}
.answer-known:hover {
  background: #224b42;
  border-color: #6ba999;
}
</style>
