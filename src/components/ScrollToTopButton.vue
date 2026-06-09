<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'

const isVisible = ref(false)
let lastScrollY = 0
let isTicking = false

const updateVisibility = () => {
  const currentScrollY = window.scrollY
  const isScrollingUp = currentScrollY < lastScrollY

  isVisible.value = isScrollingUp && currentScrollY > 280
  lastScrollY = currentScrollY
  isTicking = false
}

const handleScroll = () => {
  if (isTicking) return

  window.requestAnimationFrame(updateVisibility)
  isTicking = true
}

const scrollToTop = () => {
  isVisible.value = false
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
}

onMounted(() => {
  lastScrollY = window.scrollY
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <button
    class="scroll-top-button"
    :class="{ 'is-visible': isVisible }"
    type="button"
    aria-label="Zurück nach oben"
    @click="scrollToTop"
  >
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2.4"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M12 19V5" />
      <path d="M5 12l7 -7l7 7" />
    </svg>
  </button>
</template>

<style scoped>
.scroll-top-button {
  position: fixed;
  z-index: 20;
  left: max(clamp(18px, 4vw, 56px), env(safe-area-inset-left));
  bottom: max(clamp(18px, 4vw, 48px), env(safe-area-inset-bottom));
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  padding: 0;
  border: 1px solid rgba(244, 241, 232, 0.24);
  border-radius: 0;
  background: rgba(13, 15, 17, 0.72);
  color: #ffffff;
  opacity: 0;
  pointer-events: none;
  transform: translateY(14px);
  transition:
    opacity 180ms ease,
    transform 180ms ease,
    border-color 180ms ease,
    background 180ms ease;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.scroll-top-button.is-visible {
  opacity: 1;
  pointer-events: auto;
  transform: translateY(0);
}

.scroll-top-button:hover,
.scroll-top-button:focus-visible {
  border-color: rgba(244, 241, 232, 0.72);
  background: rgba(13, 15, 17, 0.92);
}

.scroll-top-button:focus-visible {
  outline: 1px solid currentColor;
  outline-offset: 6px;
}

.scroll-top-button svg {
  width: 25px;
  height: 25px;
}

@media (max-width: 780px) {
  .scroll-top-button {
    left: max(18px, env(safe-area-inset-left));
    bottom: max(18px, env(safe-area-inset-bottom));
    width: 48px;
    height: 48px;
  }
}
</style>
