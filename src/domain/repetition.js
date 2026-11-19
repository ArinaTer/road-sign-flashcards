const day = 24 * 60 * 60 * 1000;
const intervals = [1, 3, 7, 14, 30];
export const newCard = Object.freeze({
  status: 'new',
  repetitionStep: 0,
  nextReviewAt: null,
  lastReviewedAt: null,
});

function isTimestamp(value) {
  return Number.isSafeInteger(value) && value >= 0 && value <= 8.64e15;
}

export function isValidProgress(value) {
  if (!value || typeof value !== 'object') return false;
  const {status, repetitionStep, nextReviewAt, lastReviewedAt} = value;
  if (status === 'known') {
    return Number.isInteger(repetitionStep) && repetitionStep >= 0 &&
      repetitionStep < intervals.length && isTimestamp(lastReviewedAt) &&
      isTimestamp(nextReviewAt) && nextReviewAt > lastReviewedAt;
  }
  if (repetitionStep !== 0 || nextReviewAt !== null) return false;
  return (status === 'unknown' && isTimestamp(lastReviewedAt)) ||
    (status === 'new' && lastReviewedAt === null);
}

export function isDue(record, now) {
  return record.status === 'known' && record.nextReviewAt <= now;
}

export function recordAnswer(previous, status, now) {
  if (status === 'unknown') {
    return {...newCard, status, lastReviewedAt: now};
  }
  if (previous.status === 'known' && !isDue(previous, now)) {
    return {...previous, lastReviewedAt: now};
  }
  const repetitionStep = previous.status === 'known'
    ? Math.min(previous.repetitionStep + 1, intervals.length - 1)
    : 0;
  return {
    status,
    repetitionStep,
    nextReviewAt: now + intervals[repetitionStep] * day,
    lastReviewedAt: now,
  };
}
