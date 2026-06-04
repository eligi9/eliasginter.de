<script setup>
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

const rollLetter = (event) => {
  event.currentTarget.classList.add('is-rolling')
}

const resetLetter = (event) => {
  event.currentTarget.classList.remove('is-rolling')
}
</script>

<template>
  <a :href="href" :aria-label="label">
    <span class="nav-label" aria-hidden="true">
      <span
        v-for="(letter, index) in label.split('')"
        :key="`${letter}-${index}`"
        class="nav-letter"
        @mouseenter="rollLetter"
        @animationend="resetLetter"
      >
        <span class="nav-letter-track">
          <span class="nav-face">{{ letter }}</span>
          <span class="nav-face">{{ letter }}</span>
        </span>
        <span class="nav-underline"></span>
      </span>
    </span>
  </a>
</template>
