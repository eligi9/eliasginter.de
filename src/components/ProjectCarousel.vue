<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps({
  items: {
    type: Array,
    default: () => [],
  },
  title: {
    type: String,
    default: 'Projekt',
  },
})

const activeIndex = ref(0)

const galleryItems = computed(() => props.items.filter((item) => item?.src || item?.embedUrl))
const activeItem = computed(() => galleryItems.value[activeIndex.value])
const galleryLength = computed(() => galleryItems.value.length)

const getPlayableEmbedUrl = (item) => {
  if (!item?.embedUrl) return null

  return item.embedUrl.replace('controls=0', 'controls=1').replace('disablekb=1', 'disablekb=0')
}

watch(
  () => props.items,
  () => {
    activeIndex.value = 0
  },
)

const showPreviousImage = () => {
  if (galleryLength.value <= 1) return

  activeIndex.value = (activeIndex.value - 1 + galleryLength.value) % galleryLength.value
}

const showNextImage = () => {
  if (galleryLength.value <= 1) return

  activeIndex.value = (activeIndex.value + 1) % galleryLength.value
}
</script>

<template>
  <section class="project-gallery" aria-label="Projektgalerie">
    <figure v-if="activeItem" class="gallery-frame">
      <iframe
        v-if="activeItem.type === 'video'"
        class="gallery-video"
        :src="getPlayableEmbedUrl(activeItem)"
        :title="activeItem.alt || `${title} Video`"
        allow="autoplay; fullscreen; picture-in-picture"
        allowfullscreen
      ></iframe>
      <img v-else :src="activeItem.src" :alt="activeItem.alt || title" />
    </figure>

    <div class="gallery-controls">
      <button
        type="button"
        :disabled="galleryLength <= 1"
        aria-label="Vorheriges Galeriebild"
        @click="showPreviousImage"
      >
        ←
      </button>
      <p>{{ activeIndex + 1 }} / {{ Math.max(galleryLength, 1) }}</p>
      <button
        type="button"
        :disabled="galleryLength <= 1"
        aria-label="Nächstes Galeriebild"
        @click="showNextImage"
      >
        →
      </button>
    </div>
  </section>
</template>
