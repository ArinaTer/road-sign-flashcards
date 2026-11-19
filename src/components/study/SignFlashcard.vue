<script setup>
import {useTemplateRef} from 'vue';
import copy from '../../content/study/flashcard.json';
import statuses from '../../content/study/statuses.json';
import {useCardSwipe} from '../../composables/useCardSwipe.js';

const props = defineProps({
  card: {type: Object, required: true},
  revealed: Boolean,
});
const emit = defineEmits(['reveal', 'dismiss', 'answer']);
const surface = useTemplateRef('surface');
const {
  direction, dragging, transform, isTap, submit,
  onPointerDown, onPointerMove, onPointerUp, cancelPointer,
} = useCardSwipe({
  surface,
  canSwipe: () => props.revealed,
  onDismiss: () => emit('dismiss'),
  onAnswer: status => emit('answer', status),
});

function flip(event) {
  if (isTap(event)) emit('reveal');
}

defineExpose({submit});
</script>

<template>
  <div class="card-viewport">
    <article ref="surface" class="flashcard" :class="{
      'is-revealed': revealed, 'is-dragging': dragging,
      'is-known': direction === 'known', 'is-unknown': direction === 'unknown',
    }" :style="{transform}" @pointerdown="onPointerDown" @pointermove="onPointerMove"
      @pointerup="onPointerUp" @pointercancel="cancelPointer" @lostpointercapture="cancelPointer">
      <div class="card-flip">
        <button type="button" class="card-face card-front" data-reveal :aria-label="copy.flip"
          :aria-hidden="revealed" :inert="revealed" @click="flip">
          <img :src="card.imageUrl" alt="" draggable="false">
        </button>
        <div class="card-face card-back" :aria-hidden="!revealed" :inert="!revealed">
          <div v-if="direction" class="swipe-label" aria-hidden="true">{{ statuses[direction] }}</div>
          <img class="answer-image" :src="card.imageUrl" :alt="copy.imageAlt" draggable="false">
          <dl v-if="card.code" class="sign-details">
            <dt>{{ copy.number }}</dt>
            <dd class="sign-number">{{ card.code }}</dd>
          </dl>
          <h2 id="sign-answer" tabindex="-1">{{ card.name }}</h2>
          <div class="description">
            <p v-for="(paragraph, index) in card.description" :key="index">{{ paragraph }}</p>
          </div>
        </div>
      </div>
    </article>
  </div>
</template>

<style scoped>
.card-viewport {
  overflow-x: clip;
  overflow-clip-margin: .3rem;
  perspective: 90rem;
}

.flashcard {
  --swipe-color: var(--line);
  perspective: 90rem;
  transition: transform .18s ease-out;
  touch-action: pan-y pinch-zoom;
  user-select: none;
}
.is-revealed { cursor: grab; }
.is-dragging {
  cursor: grabbing;
  transition: none;
}
.is-known { --swipe-color: var(--mint-ink); }
.is-unknown { --swipe-color: #ff9ba5; }

.card-flip {
  display: grid;
  position: relative;
  transform-style: preserve-3d;
  transition: transform .32s cubic-bezier(.22, .68, .29, 1);
}
.is-revealed .card-flip { transform: rotateY(180deg); }

.card-face {
  grid-area: 1 / 1;
  min-width: 0;
  border: 1px solid var(--swipe-color);
  border-radius: 1.3rem;
  background: var(--surface);
  color: var(--ink);
  backface-visibility: hidden;
}
.card-front {
  display: grid;
  place-items: center;
  min-height: 20rem;
  padding: 2rem;
  background: radial-gradient(ellipse at 50% 43%, #243b57, var(--surface) 78%);
  transition: border-color .16s ease;
}
.card-front:hover { border-color: #6b8bbc; }
.card-front:focus-visible { outline-offset: -5px; }
.is-revealed .card-front {
  position: absolute;
  inset: 0;
  min-height: 0;
}
.card-front img {
  width: min(100%, 15rem);
  height: clamp(8rem, 28vw, 12rem);
  object-fit: contain;
}
.card-back {
  position: absolute;
  inset: 0;
  overflow: hidden;
  transform: rotateY(180deg);
  padding: clamp(1.25rem, 4vw, 2rem);
}
.is-revealed .card-back {
  position: relative;
  inset: auto;
  overflow: visible;
}
.answer-image {
  width: min(100%, 14rem);
  height: clamp(6.5rem, 20vw, 9rem);
  margin: 0 auto;
  object-fit: contain;
}
.sign-details {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: .45rem;
  margin: .85rem 0 0;
}
.sign-details dt {
  color: var(--muted);
  font-size: .875rem;
  font-weight: 600;
}
.sign-number {
  color: var(--accent);
  font-size: 1rem;
  font-weight: 750;
  font-variant-numeric: tabular-nums;
}
.card-back h2 {
  margin: .6rem auto 0;
  color: var(--ink);
  font-size: clamp(1.8rem, 5.7vw, 2.85rem);
  font-weight: 800;
  letter-spacing: -.035em;
  line-height: 1.08;
  text-align: center;
  text-wrap: balance;
  overflow-wrap: anywhere;
}
.description {
  color: var(--muted);
  border-top: 1px solid var(--line);
  margin-top: 1.15rem;
  padding-top: 1.1rem;
  line-height: 1.6;
}
.description p + p { margin-top: .85rem; }
.swipe-label {
  position: absolute;
  z-index: 1;
  top: .65rem;
  left: .65rem;
  border: 1px solid currentColor;
  border-radius: .45rem;
  padding: .15rem .45rem;
  background: var(--paper);
  color: var(--swipe-color);
  font-weight: 750;
  font-size: .875rem;
}
.is-known .swipe-label {
  left: auto;
  right: .65rem;
}

@media (max-width: 35rem) {
  .card-front { min-height: 18rem; }
}

@media (prefers-reduced-motion: reduce) {
  .flashcard, .card-flip, .card-front { transition: none; }
}
</style>
