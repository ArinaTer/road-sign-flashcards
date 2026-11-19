<script setup>
import copy from '../../content/home/group-picker.json';
import {groups} from '../../domain/catalog.js';
import AppIcon from '../ui/AppIcon.vue';

const group = defineModel({type: String, required: true});
</script>

<template>
  <div class="group-picker">
    <label for="group">{{ copy.label }}</label>
    <div class="select-wrap">
      <select id="group" v-model="group">
        <option value="all">{{ copy.all }}</option>
        <option v-for="item in groups" :key="item.id" :value="item.id">{{ item.title }}</option>
      </select>
      <AppIcon name="chevron" />
    </div>
  </div>
</template>

<style scoped>
.group-picker {
  display: flex;
  align-items: center;
  gap: .7rem;
}
.group-picker label {
  white-space: nowrap;
  font-weight: 600;
  font-size: .875rem;
  color: var(--muted);
}
.select-wrap {
  position: relative;
  min-width: 0;
}
.select-wrap select {
  width: 100%;
  max-width: 20.5rem;
  appearance: none;
  color: var(--ink);
  background: var(--surface);
  padding: .62rem 2.15rem .62rem .85rem;
  border: 1px solid var(--line);
  border-radius: .65rem;
  cursor: pointer;
  font-weight: 600;
  text-overflow: ellipsis;
}
.select-wrap svg {
  position: absolute;
  right: .64rem;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  width: 1.24rem;
}

@media (max-width: 42rem) {
  .group-picker {
    align-items: start;
    flex-direction: column;
    gap: .32rem;
  }
  .select-wrap, .select-wrap select {
    max-width: unset;
    width: 100%;
  }
}
</style>
