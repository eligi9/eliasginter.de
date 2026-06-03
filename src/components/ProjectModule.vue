<script setup>
import { computed, ref } from 'vue'
import P5Canvas from './P5Canvas.vue'

const props = defineProps({
  project: {
    type: Object,
    required: true,
  },
})

const videoFrame = ref(null)

const hasVideoEmbed = computed(() => Boolean(props.project.videoEmbed?.embedUrl))

const sendVideoCommand = (method) => {
  if (!videoFrame.value?.contentWindow) return

  videoFrame.value.contentWindow.postMessage(
    JSON.stringify({ method }),
    'https://player.vimeo.com',
  )
}

const playVideo = () => {
  sendVideoCommand('play')
}

const pauseVideo = () => {
  sendVideoCommand('pause')
}
</script>

<template>
  <article class="project-module">
    <div
      class="project-media"
      @mouseenter="playVideo"
      @mouseleave="pauseVideo"
    >
      <P5Canvas v-if="project.type === 'p5'" />
      <template v-else-if="hasVideoEmbed">
        <img
          class="media-fill media-poster"
          :src="project.media.poster"
          :alt="project.media.alt"
        />
        <iframe
          ref="videoFrame"
          class="media-fill media-embed"
          :src="project.videoEmbed.embedUrl"
          :title="`${project.title} Video`"
          allow="autoplay; fullscreen; picture-in-picture"
          allowfullscreen
        ></iframe>
      </template>
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
