<script setup>
defineProps({
  variant: {type: String, default: 'secondary'},
  type: {type: String, default: 'button'},
});
</script>

<template>
  <button :type="type" :class="variant === 'text' ? 'text-button' : ['button', `button-${variant}`]">
    <slot />
  </button>
</template>

<style scoped>
.button, .text-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: .35rem;
  font-weight: 700;
}
.button {
  min-height: 2.65rem;
  border-radius: .65rem;
  border: 1px solid transparent;
  padding: .46rem .95rem;
}
.button-primary {
  color: #071223;
  background: var(--blue);
}
.button-primary:hover {
  background: var(--blue-hover);
}
.button-secondary {
  border-color: #435c81;
  color: var(--accent);
  background: var(--raised);
}
.button-secondary:hover {
  background: #233855;
  border-color: #7798cb;
}
.button-danger {
  color: #210b10;
  background: #ff929f;
}
.button-danger:hover {
  background: #ffb3bd;
}
.text-button {
  min-height: 2.3rem;
  border: 0;
  padding: .25rem 0;
  color: var(--accent);
  background: none;
  font-size: .9rem;
}
.text-button:hover {
  text-decoration: underline;
  text-underline-offset: .2em;
}
</style>
