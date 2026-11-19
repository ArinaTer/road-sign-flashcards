import {isValidProgress} from './repetition.js';

const progressKey = 'road-sign-flashcards.progress';
const progressVersion = 1;

export function readProgress(storage, ids) {
  const records = new Map();
  const raw = storage.getItem(progressKey);
  if (raw === null) return {records, restored: true};

  let saved;
  try {
    saved = JSON.parse(raw);
  } catch {
    return {records, restored: false};
  }
  if (saved?.version !== progressVersion || !saved.records ||
      typeof saved.records !== 'object' || Array.isArray(saved.records)) {
    return {records, restored: false};
  }
  let restored = true;
  for (const id of ids) {
    if (!Object.hasOwn(saved.records, id)) continue;
    if (isValidProgress(saved.records[id])) {
      records.set(id, saved.records[id]);
    } else {
      restored = false;
    }
  }
  return {records, restored};
}

export function writeProgress(storage, records) {
  storage.setItem(progressKey, JSON.stringify({
    version: progressVersion,
    records: Object.fromEntries(records),
  }));
}
