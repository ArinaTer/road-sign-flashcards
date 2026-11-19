<script setup>
import {useTemplateRef} from 'vue';
import copy from '../../content/layout/reset-dialog.json';
import AppButton from '../ui/AppButton.vue';

const emit = defineEmits(['confirm']);
const dialog = useTemplateRef('dialog');

function open() {
  dialog.value.returnValue = '';
  dialog.value.showModal();
}

function handleClose() {
  if (dialog.value.returnValue === 'confirm') emit('confirm');
}

defineExpose({open});
</script>

<template>
  <dialog ref="dialog" aria-labelledby="reset-title" @close="handleClose">
    <h2 id="reset-title">{{ copy.title }}</h2>
    <p>{{ copy.description }}</p>
    <p>{{ copy.storageDescription }}</p>
    <form method="dialog" class="dialog-actions">
      <AppButton type="submit" value="cancel" autofocus>{{ copy.cancel }}</AppButton>
      <AppButton type="submit" variant="danger" value="confirm">{{ copy.confirm }}</AppButton>
    </form>
  </dialog>
</template>

<style scoped>
dialog {
  max-width: min(27rem, calc(100% - 2rem));
  border: 1px solid var(--line);
  border-radius: 1rem;
  padding: 1.35rem;
  color: var(--ink);
  background: var(--surface);
}
dialog::backdrop {
  background: #04070dcc;
}
dialog p {
  margin-top: .65rem;
  color: var(--muted);
}
.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: .5rem;
  margin-top: 1rem;
  flex-wrap: wrap;
}
</style>
