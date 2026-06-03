<script setup>
import { computed, ref } from 'vue'
import P5Canvas from './P5Canvas.vue'

const props = defineProps({
  project: {
    type: Object,
    required: true,
  },
})

const isVideoHovered = ref(false)

const hasVideoEmbed = computed(() => Boolean(props.project.videoEmbed?.embedUrl))
</script>

<template>
  <article class="project-module">
    <div
      class="project-media"
      @mouseenter="isVideoHovered = true"
      @mouseleave="isVideoHovered = false"
    >
      <P5Canvas v-if="project.type === 'p5'" />
      <iframe
        v-else-if="hasVideoEmbed && isVideoHovered"
        class="media-fill media-embed"
        :src="project.videoEmbed.embedUrl"
        :title="`${project.title} Video`"
        allow="autoplay; fullscreen; picture-in-picture"
        allowfullscreen
      ></iframe>
      <img
        v-else-if="hasVideoEmbed"
        class="media-fill"
        :src="project.media.poster"
        :alt="project.media.alt"
      />
      <video
        v-else-if="project.type === 'video'"
        class="media-fill"
        autoplay
        muted
        loop
        playsinline
        :poster="project.media.poster"
      ></video>
      <img v-else class="media-fill" :src="project.media.src" :alt="project.media.alt" />
    </div>

    <div class="project-info">
      <p class="section-kicker">{{ project.kicker }}</p>
      <h2>{{ project.title }}</h2>
      <p>{{ project.description }}</p>
      <ul aria-label="Schlagworte">
        <li v-for="item in project.tags" :key="item">{{ item }}</li>
      </ul>
    </div>
  </article>
</template>
