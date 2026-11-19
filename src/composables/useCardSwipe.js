import {computed, onBeforeUnmount, ref} from 'vue';

const intentDistance = 9;
const dismissDuration = 180;

function cardTransform(distance) {
  const angle = Math.max(-12, Math.min(12, distance / 15));
  return `translateX(${distance}px) rotate(${angle}deg)`;
}

export function useCardSwipe({surface, canSwipe, onDismiss, onAnswer}) {
  const distance = ref(0);
  const dragging = ref(false);
  const dismissing = ref(null);
  let pointer = null;
  let moved = false;
  let animation;

  const transform = computed(() => cardTransform(distance.value));
  const direction = computed(() => {
    if (dismissing.value) return dismissing.value;
    if (Math.abs(distance.value) < intentDistance) return null;
    return distance.value > 0 ? 'known' : 'unknown';
  });

  function onPointerDown(event) {
    if (!event.isPrimary || event.button !== 0 || dismissing.value) return;
    moved = false;
    pointer = {id: event.pointerId, x: event.clientX, y: event.clientY};
    if (canSwipe()) event.currentTarget.setPointerCapture(event.pointerId);
  }

  function onPointerMove(event) {
    if (pointer?.id !== event.pointerId) return;
    const dx = event.clientX - pointer.x;
    const dy = event.clientY - pointer.y;
    if (!dragging.value && Math.max(Math.abs(dx), Math.abs(dy)) < intentDistance) return;
    moved = true;
    if (!canSwipe() || (!dragging.value && Math.abs(dy) >= Math.abs(dx))) {
      pointer = null;
      return;
    }
    dragging.value = true;
    distance.value = dx;
  }

  function onPointerUp(event) {
    if (pointer?.id !== event.pointerId) return;
    const dx = event.clientX - pointer.x;
    const dy = event.clientY - pointer.y;
    moved ||= Math.max(Math.abs(dx), Math.abs(dy)) >= intentDistance;
    pointer = null;
    dragging.value = false;

    const threshold = Math.min(105, Math.max(55, surface.value.clientWidth * .23));
    if (canSwipe() && Math.abs(dx) >= threshold && Math.abs(dx) > Math.abs(dy)) {
      submit(dx > 0 ? 'known' : 'unknown');
    } else {
      distance.value = 0;
    }
  }

  function cancelPointer(event) {
    if (pointer?.id !== event.pointerId) return;
    pointer = null;
    dragging.value = false;
    distance.value = 0;
  }

  function isTap(event) {
    return event.detail === 0 || !moved;
  }

  function submit(status) {
    if (!canSwipe() || dismissing.value) return;
    dismissing.value = status;
    pointer = null;
    dragging.value = false;
    onDismiss();

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !surface.value.animate) {
      onAnswer(status);
      return;
    }

    const exit = status === 'known' ? window.innerWidth : -window.innerWidth;
    animation = surface.value.animate([
      {transform: cardTransform(distance.value), opacity: 1},
      {transform: cardTransform(exit), opacity: 0},
    ], {duration: dismissDuration, easing: 'ease-in', fill: 'forwards'});
    animation.finished.then(() => onAnswer(status), () => {});
  }

  onBeforeUnmount(() => animation?.cancel());

  return {
    direction, dragging, transform, isTap, submit,
    onPointerDown, onPointerMove, onPointerUp, cancelPointer,
  };
}
