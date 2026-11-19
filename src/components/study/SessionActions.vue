<template>
  <div class="round-actions"><slot /></div>
</template>

<style scoped>
.round-actions {
  display: flex;
  justify-content: center;
  gap: .65rem;
  flex-wrap: wrap;
  margin-top: 1rem;
}
.round-actions :slotted(button) {
  min-width: 8.75rem;
  min-height: 2.85rem;
}
</style>
