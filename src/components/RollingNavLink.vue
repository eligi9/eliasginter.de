<script setup>
import { ref } from 'vue'

defineProps({
  href: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
})

const isActive = ref(false)

const rollLetter = (event) => {
  isActive.value = true
  event.currentTarget.classList.add('is-rolling')
}

const resetLetter = (event) => {
  event.currentTarget.classList.remove('is-rolling')
}

const deactivateWord = () => {
  isActive.value = false
}
</script>

<template>
  <a :href="href" :aria-label="label">
    <span
      class="nav-label"
      :class="{ 'is-active': isActive }"
      aria-hidden="true"
      @mouseleave="deactivateWord"
    >
      <span
        v-for="(letter, index) in label.split('')"
        :key="`${letter}-${index}`"
        class="nav-letter"
        @mouseenter="rollLetter"
        @animationend="resetLetter"
      >
        <span class="nav-letter-window">
          <span class="nav-letter-track">
            <span class="nav-face">{{ letter }}</span>
            <span class="nav-face">{{ letter }}</span>
          </span>
        </span>
        <span class="nav-hover-overline" aria-hidden="true"></span>
        <span class="nav-underline-window">
          <span class="nav-underline-track">
            <span class="nav-underline"></span>
            <span class="nav-underline"></span>
          </span>
        </span>
      </span>
    </span>
  </a>
</template>
