import {isDue} from './repetition.js';

export const countedModes = ['new', 'unknown', 'due', 'known'];

export function cardsFor(mode, cards, progressFor, now) {
  if (mode === 'all') return cards.slice();
  if (mode === 'due') return cards.filter(card => isDue(progressFor(card.id), now));
  return cards.filter(card => progressFor(card.id).status === mode);
}

export function shuffle(cards) {
  for (let index = cards.length - 1; index > 0; index--) {
    const other = Math.floor(Math.random() * (index + 1));
    [cards[index], cards[other]] = [cards[other], cards[index]];
  }
  return cards;
}
