<script setup>
import {useTemplateRef, watch} from 'vue';
import copy from './content/layout/document.json';
import ResetDialog from './components/layout/ResetDialog.vue';
import StorageNotice from './components/layout/StorageNotice.vue';
import HomeView from './views/HomeView.vue';
import RoundView from './views/RoundView.vue';
import ResultsView from './views/ResultsView.vue';
import {catalog} from './domain/catalog.js';
import {useSignProgress} from './composables/useSignProgress.js';
import {useStudySession} from './composables/useStudySession.js';

const main = useTemplateRef('main');
const resetDialog = useTemplateRef('resetDialog');
const progress = useSignProgress(catalog.map(card => card.id));
const {storageNotice} = progress;
const {
  group, round, screen, counts, nextReviewAt,
  goHome, startRound, revealCard, answerCard, undoAnswer,
} = useStudySession(progress);

watch(screen, () => {
  const target = screen.value === 'round' && round.value.revealed ? '#sign-answer' : '[data-view-title]';
  main.value?.querySelector(target)?.focus();
}, {flush: 'post'});

function resetProgress() {
  progress.reset();
  goHome();
}
</script>

<template>
  <main ref="main" class="shell app-main" :aria-label="copy.mainLabel">
    <StorageNotice :status="storageNotice" />
    <HomeView v-if="screen === 'home'" v-model="group" :counts="counts"
      :next-review-at="nextReviewAt" @start="startRound" @reset="resetDialog.open()" />
    <RoundView v-else-if="screen === 'round'" :round="round"
      @home="goHome" @undo="undoAnswer" @reveal="revealCard" @answer="answerCard" />
    <ResultsView v-else :round="round" @home="goHome" @undo="undoAnswer" @mistakes="startRound('mistakes')" />
  </main>
  <ResetDialog ref="resetDialog" @confirm="resetProgress" />
</template>

<style scoped>
.app-main {
  padding-bottom: 1.5rem;
}
</style>
