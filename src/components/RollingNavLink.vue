<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  href: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  active: {
    type: Boolean,
    default: false,
  },
})

const isHoverActive = ref(false)
const isActive = computed(() => props.active || isHoverActive.value)

const rollLetter = (event) => {
  isHoverActive.value = true
  event.currentTarget.classList.add('is-rolling')
}

const resetLetter = (event) => {
  event.currentTarget.classList.remove('is-rolling')
}

const deactivateWord = () => {
  isHoverActive.value = false
}
</script>

<template>
  <a :href="href" :aria-label="label" :aria-current="active ? 'page' : null">
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
