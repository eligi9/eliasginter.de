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
const hasCustomPoster = computed(() => {
  const poster = props.project.media?.poster
  return hasVideoEmbed.value && poster && poster !== '/media/video-poster.svg'
})

const sendPlayerMessage = (message, origin) => {
  if (!videoFrame.value?.contentWindow) return

  videoFrame.value.contentWindow.postMessage(JSON.stringify(message), origin)
}

const sendVideoCommand = (method) => {
  if (props.project.videoEmbed?.provider === 'youtube') {
    const youtubeMethod = method === 'play' ? 'playVideo' : 'pauseVideo'
    sendPlayerMessage({ event: 'command', func: youtubeMethod, args: [] }, 'https://www.youtube-nocookie.com')
    return
  }

  sendPlayerMessage({ method }, 'https://player.vimeo.com')
}

const playVideo = () => {
  if (props.project.videoEmbed?.provider === 'youtube') {
    sendPlayerMessage({ event: 'command', func: 'unMute', args: [] }, 'https://www.youtube-nocookie.com')
    sendPlayerMessage({ event: 'command', func: 'setVolume', args: [100] }, 'https://www.youtube-nocookie.com')
    sendPlayerMessage({ event: 'command', func: 'playVideo', args: [] }, 'https://www.youtube-nocookie.com')
    return
  }

  sendPlayerMessage({ method: 'setVolume', value: 1 }, 'https://player.vimeo.com')
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
      <iframe
        v-else-if="hasVideoEmbed"
        ref="videoFrame"
        class="media-fill media-embed"
        :src="project.videoEmbed.embedUrl"
        :title="`${project.title} Video`"
        allow="autoplay; fullscreen; picture-in-picture"
        allowfullscreen
      ></iframe>
      <img
        v-if="hasCustomPoster"
        class="media-fill media-poster"
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
      <img
        v-else
        class="media-fill media-image"
        :src="project.media.src"
        :alt="project.media.alt"
      />
    </div>

    <div class="project-info">
      <h2>{{ project.title }}</h2>
      <p class="project-kicker">{{ project.kicker }}</p>
      <p v-if="project.year" class="project-year">{{ project.year }}</p>
      <p>{{ project.description }}</p>
      <ul aria-label="Schlagworte">
        <li v-for="item in project.tags" :key="item">{{ item }}</li>
      </ul>
    </div>
  </article>
</template>
