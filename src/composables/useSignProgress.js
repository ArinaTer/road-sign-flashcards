import {ref, shallowReactive} from 'vue';
import {newCard, recordAnswer} from '../domain/repetition.js';
import {readProgress, writeProgress} from '../domain/progress-storage.js';

export function useSignProgress(ids) {
  const storageNotice = ref(null);
  let initialRecords = new Map();
  let storage;

  try {
    storage = window.localStorage;
    const saved = readProgress(storage, ids);
    initialRecords = saved.records;
    if (!saved.restored) storageNotice.value = 'damaged';
  } catch {
    storageNotice.value = 'unavailable';
  }

  const records = shallowReactive(initialRecords);

  function persist() {
    try {
      writeProgress(storage, records);
      storageNotice.value = null;
    } catch {
      storageNotice.value = 'unavailable';
    }
  }

  function progressFor(id) {
    return records.get(id) ?? newCard;
  }

  function answer(id, status, now) {
    const previous = records.get(id);
    records.set(id, recordAnswer(previous ?? newCard, status, now));
    persist();
    return previous;
  }

  function restore(id, previous) {
    if (previous) records.set(id, previous);
    else records.delete(id);
    persist();
  }

  function reset() {
    records.clear();
    persist();
  }

  return {storageNotice, progressFor, answer, restore, reset};
}
