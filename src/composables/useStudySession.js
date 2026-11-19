import {computed, onMounted, onUnmounted, ref, watchEffect} from 'vue';
import {catalog} from '../domain/catalog.js';
import {cardsFor, countedModes, shuffle} from '../domain/study-modes.js';

export function useStudySession(progress) {
  const group = ref('all');
  const now = ref(Date.now());
  const round = ref(null);
  const screen = computed(() => {
    if (!round.value) return 'home';
    return round.value.answers.length === round.value.cards.length ? 'results' : 'round';
  });
  const selectedCards = computed(() => group.value === 'all'
    ? catalog
    : catalog.filter(card => card.groupId === group.value));
  const counts = computed(() => Object.fromEntries(countedModes.map(mode => [
    mode, mode === 'all' ? selectedCards.value.length
      : cardsFor(mode, selectedCards.value, progress.progressFor, now.value).length,
  ])));
  const nextReviewAt = computed(() => {
    const next = Math.min(...selectedCards.value.map(card => {
      const record = progress.progressFor(card.id);
      return record.status === 'known' && record.nextReviewAt > now.value
        ? record.nextReviewAt
        : Infinity;
    }));
    return Number.isFinite(next) ? next : null;
  });

  function refreshTime() {
    now.value = Date.now();
  }

  function refreshVisibleTab() {
    if (!document.hidden) refreshTime();
  }

  onMounted(() => {
    refreshTime();
    window.addEventListener('focus', refreshTime);
    document.addEventListener('visibilitychange', refreshVisibleTab);
  });

  onUnmounted(() => {
    window.removeEventListener('focus', refreshTime);
    document.removeEventListener('visibilitychange', refreshVisibleTab);
  });

  watchEffect(onCleanup => {
    const timestamp = now.value;
    const next = nextReviewAt.value;
    if (screen.value !== 'home' || next === null) return;

    const delay = Math.min(2_147_483_647, Math.max(1, next - timestamp));
    const timer = setTimeout(refreshTime, delay);
    onCleanup(() => clearTimeout(timer));
  });

  function goHome() {
    refreshTime();
    round.value = null;
  }

  function startRound(mode) {
    refreshTime();
    const queue = mode === 'mistakes'
      ? round.value.answers.filter(answer => answer.status === 'unknown').map(answer => answer.card)
      : cardsFor(mode, selectedCards.value, progress.progressFor, now.value);
    if (queue.length === 0) {
      goHome();
      return;
    }
    round.value = {mode, cards: shuffle(queue), answers: [], revealed: false};
  }

  function revealCard() {
    round.value.revealed = true;
  }

  function answerCard(status) {
    const current = round.value;
    if (screen.value !== 'round' || !current.revealed) return;
    const card = current.cards[current.answers.length];
    const previous = progress.answer(card.id, status, Date.now());
    current.answers.push({card, previous, status});
    current.revealed = false;
  }

  function undoAnswer() {
    const answer = round.value?.answers.pop();
    if (!answer) return;
    progress.restore(answer.card.id, answer.previous);
    round.value.revealed = true;
  }

  return {
    group, round, screen, counts, nextReviewAt,
    goHome, startRound, revealCard, answerCard, undoAnswer,
  };
}
