<script setup>
import P5Canvas from './P5Canvas.vue'

defineProps({
  project: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <article class="project-module">
    <div class="project-media">
      <P5Canvas v-if="project.type === 'p5'" />
      <video
        v-else-if="project.type === 'video'"
        class="media-fill"
        autoplay
        muted
        loop
        playsinline
        poster="/media/video-poster.svg"
      ></video>
      <img v-else class="media-fill" src="/media/concept-board.svg" alt="" />
    </div>

    <div class="project-info">
      <p class="section-kicker">{{ project.kicker }}</p>
      <h2>{{ project.title }}</h2>
      <p>{{ project.description }}</p>
      <ul aria-label="Schlagworte">
        <li v-for="item in project.meta" :key="item">{{ item }}</li>
      </ul>
    </div>
  </article>
</template>
