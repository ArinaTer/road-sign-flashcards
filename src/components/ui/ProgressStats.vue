<script setup>
defineProps({
  items: {type: Array, required: true},
  label: String,
  centered: Boolean,
});
</script>

<template>
  <dl class="progress-strip" :class="{'is-centered': centered}" :aria-label="label">
    <div v-for="item in items" :key="item.label">
      <dt>{{ item.label }}</dt>
      <dd>{{ item.value }}</dd>
    </div>
  </dl>
</template>

<style scoped>
.progress-strip {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  border: 1px solid var(--line);
  border-radius: 1rem;
  background: var(--raised);
  overflow: hidden;
}
.progress-strip > div {
  display: flex;
  align-items: center;
  gap: .1rem .85rem;
  padding: .75rem 1.2rem;
  flex-wrap: wrap;
}
.progress-strip > div + div {
  border-left: 1px solid var(--line);
}
.progress-strip dt {
  color: var(--muted);
  font-size: .9rem;
  font-weight: 630;
}
.progress-strip dd {
  order: -1;
  font-size: 1.55rem;
  line-height: 1.2;
  font-weight: 770;
  font-variant-numeric: tabular-nums;
}

.is-centered > div {
  flex-direction: column;
}

@media (max-width: 42rem) {
  .progress-strip > div {
    flex-direction: column;
    align-items: flex-start;
    padding: .65rem .55rem;
    gap: .25rem;
  }
  .is-centered > div {
    align-items: center;
  }
}
</style>
