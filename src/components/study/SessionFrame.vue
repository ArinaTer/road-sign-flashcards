<script setup>
import copy from '../../content/study/session-nav.json';
import AppButton from '../ui/AppButton.vue';
import AppIcon from '../ui/AppIcon.vue';

defineProps({canUndo: Boolean, busy: Boolean});
defineEmits(['home', 'undo']);
</script>

<template>
  <section class="session" aria-labelledby="session-title">
    <div class="session-top">
      <AppButton variant="text" :disabled="busy" @click="$emit('home')">{{ copy.home }}</AppButton>
      <AppButton v-if="canUndo" variant="text" :disabled="busy" @click="$emit('undo')">
        <AppIcon name="undo" />
        {{ copy.undo }}
      </AppButton>
    </div>
    <slot />
  </section>
</template>

<style scoped>
.session {
  max-width: 43rem;
  margin: 1.75rem auto 0;
}
.session-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: .6rem 1rem;
  flex-wrap: wrap;
}

.session-top svg {
  width: 1.15rem;
  height: 1.15rem;
}
</style>
