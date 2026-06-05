<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import ProjectModule from './components/ProjectModule.vue'
import P5Canvas from './components/P5Canvas.vue'
import RollingNavLink from './components/RollingNavLink.vue'
import projects from './data/projects.json'

const sortedProjects = [...projects].sort((a, b) => {
  const yearA = Number(a.year) || 0
  const yearB = Number(b.year) || 0

  return yearB - yearA
})

const navItems = [
  { href: '#/projects', label: 'Work' },
  { href: '#profil', label: 'About' },
]

const routeHash = ref(window.location.hash || '#top')
const activeCategory = ref('Alle')
const activeGalleryIndex = ref(0)

const syncRoute = () => {
  routeHash.value = window.location.hash || '#top'
}

const projectRouteId = computed(() => {
  const match = routeHash.value.match(/^#\/projects\/([^/?#]+)/)

  return match ? decodeURIComponent(match[1]) : null
})

const isProjectIndex = computed(() => routeHash.value === '#/projects')
const selectedProject = computed(() => sortedProjects.find((project) => project.id === projectRouteId.value))
const allCategories = computed(() => {
  const categories = new Set()

  sortedProjects.forEach((project) => {
    project.tags?.forEach((tag) => categories.add(tag))
  })

  return ['Alle', ...Array.from(categories).sort((a, b) => a.localeCompare(b))]
})

const filteredProjects = computed(() => {
  if (activeCategory.value === 'Alle') {
    return sortedProjects
  }

  return sortedProjects.filter((project) => project.tags?.includes(activeCategory.value))
})

const selectedGallery = computed(() => {
  const project = selectedProject.value

  if (!project) {
    return []
  }

  if (Array.isArray(project.gallery) && project.gallery.length > 0) {
    return project.gallery
  }

  const fallbackImage = project.media?.src || project.media?.poster

  return fallbackImage
    ? [{ src: fallbackImage, alt: project.media?.alt || project.title }]
    : []
})

const activeGalleryItem = computed(() => selectedGallery.value[activeGalleryIndex.value])

const setCategory = (category) => {
  activeCategory.value = category
}

const showPreviousImage = () => {
  if (selectedGallery.value.length <= 1) return

  activeGalleryIndex.value =
    (activeGalleryIndex.value - 1 + selectedGallery.value.length) % selectedGallery.value.length
}

const showNextImage = () => {
  if (selectedGallery.value.length <= 1) return

  activeGalleryIndex.value = (activeGalleryIndex.value + 1) % selectedGallery.value.length
}

const formatList = (items = []) => items.join(', ')
const abstractParagraphs = computed(() => selectedProject.value?.abstract?.split('\n\n') || [])

watch(projectRouteId, () => {
  activeGalleryIndex.value = 0
})

onMounted(() => {
  window.addEventListener('hashchange', syncRoute)
})

onBeforeUnmount(() => {
  window.removeEventListener('hashchange', syncRoute)
})
</script>

<template>
  <header class="site-header">
    <a class="wordmark" href="#top" aria-label="Zum Anfang">Elias Ginter</a>
    <nav class="site-nav" aria-label="Hauptnavigation">
      <RollingNavLink
        v-for="item in navItems"
        :key="item.href"
        :href="item.href"
        :label="item.label"
      />
    </nav>
  </header>

  <main v-if="selectedProject" id="top" class="project-detail-page">
    <article class="project-detail" aria-labelledby="project-detail-title">
      <a class="back-link" href="#/projects">Zurueck zu den Projekten</a>

      <header class="project-detail-hero">
        <div>
          <p class="section-kicker">{{ selectedProject.kicker }}</p>
          <h1 id="project-detail-title">{{ selectedProject.title }}</h1>
          <p>{{ selectedProject.summary || selectedProject.description }}</p>
        </div>
        <dl class="project-detail-facts">
          <div v-if="selectedProject.year">
            <dt>Jahr</dt>
            <dd>{{ selectedProject.year }}</dd>
          </div>
          <div v-if="selectedProject.status">
            <dt>Status</dt>
            <dd>{{ selectedProject.status }}</dd>
          </div>
          <div v-if="selectedProject.role?.length">
            <dt>Rolle</dt>
            <dd>{{ formatList(selectedProject.role) }}</dd>
          </div>
        </dl>
      </header>

      <section class="project-gallery" aria-label="Projektgalerie">
        <figure v-if="activeGalleryItem" class="gallery-frame">
          <img :src="activeGalleryItem.src" :alt="activeGalleryItem.alt || selectedProject.title" />
        </figure>
        <div class="gallery-controls">
          <button
            type="button"
            :disabled="selectedGallery.length <= 1"
            aria-label="Vorheriges Galeriebild"
            @click="showPreviousImage"
          >
            ←
          </button>
          <p>{{ activeGalleryIndex + 1 }} / {{ Math.max(selectedGallery.length, 1) }}</p>
          <button
            type="button"
            :disabled="selectedGallery.length <= 1"
            aria-label="Naechstes Galeriebild"
            @click="showNextImage"
          >
            →
          </button>
        </div>
      </section>

      <section class="project-detail-body">
        <div class="project-copy">
          <p v-for="paragraph in abstractParagraphs" :key="paragraph">{{ paragraph }}</p>
        </div>
        <aside class="project-detail-meta" aria-label="Projektinformationen">
          <div v-if="selectedProject.tools?.length">
            <h2>Tools</h2>
            <ul>
              <li v-for="tool in selectedProject.tools" :key="tool">{{ tool }}</li>
            </ul>
          </div>
          <div v-if="selectedProject.themes?.length">
            <h2>Themen</h2>
            <ul>
              <li v-for="theme in selectedProject.themes" :key="theme">{{ theme }}</li>
            </ul>
          </div>
          <div v-if="selectedProject.tags?.length">
            <h2>Kategorien</h2>
            <ul>
              <li v-for="tag in selectedProject.tags" :key="tag">{{ tag }}</li>
            </ul>
          </div>
          <a
            v-if="selectedProject.links?.live"
            class="project-live-link"
            :href="selectedProject.links.live"
            target="_blank"
            rel="noreferrer"
          >
            Projekt oeffnen
          </a>
        </aside>
      </section>
    </article>
  </main>

  <main v-else-if="isProjectIndex" id="top" class="projects-page">
    <section class="projects-overview" aria-labelledby="projects-title">
      <div class="projects-heading">
        <p class="section-kicker">Work</p>
        <h1 id="projects-title">Ausgewaehlte Projekte</h1>
      </div>

      <div class="project-filters" aria-label="Projekte filtern">
        <button
          v-for="category in allCategories"
          :key="category"
          type="button"
          :class="{ 'is-active': activeCategory === category }"
          @click="setCategory(category)"
        >
          {{ category }}
        </button>
      </div>
    </section>

    <section class="project-stack project-stack-filtered" aria-label="Gefilterte Arbeiten">
      <ProjectModule
        v-for="project in filteredProjects"
        :key="project.title"
        :project="project"
      />
    </section>
  </main>

  <main v-else id="top">
    <section class="hero" aria-labelledby="hero-title">
      <div class="hero-media">
        <P5Canvas variant="hero" />
      </div>
      <div class="hero-copy">
        <h1 id="hero-title">
          <span>Digital Design</span>
          <span>Abstract Concepts</span>
          <span>Interactive Experiences</span>
        </h1>
      </div>
    </section>

    <section id="arbeiten" class="project-stack" aria-label="Ausgewaehlte Arbeiten">
      <ProjectModule
        v-for="project in sortedProjects"
        :key="project.title"
        :project="project"
      />
    </section>

    <section id="profil" class="profile-section" aria-labelledby="profile-title">
      <div>
        <p class="section-kicker">Profil</p>
        <h2 id="profile-title">Student der interaktiven Medien zwischen Informatik und Design.</h2>
      </div>
      <figure class="profile-portrait">
        <img src="/media/elias-ginter-cutout.png" alt="Portrait von Elias Ginter" />
      </figure>
      <p>
        Elias Ginter entwickelt Konzepte, Webinterfaces, audiovisuelle Arbeiten und
        interaktive Prototypen. Das Portfolio ist modular aufgebaut: Jede Arbeit kann als
        grosses Bild, Video, p5-Sketch oder Webapp eingebunden werden.
      </p>
    </section>
  </main>

  <footer class="site-footer">
    <div class="social-links">
      <!-- Icons: Tabler Icons, MIT License, https://tabler.io/icons -->
      <a
        class="social-link soundcloud-link"
        href="https://soundcloud.com/user-628460177-629700480?utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing"
        target="_blank"
        rel="noreferrer"
        aria-label="Elias Ginter auf SoundCloud"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
          focusable="false"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M17 11h1c1.38 0 3 1.274 3 3c0 1.657 -1.5 3 -3 3l-6 0v-10c3 0 4.5 1.5 5 4" />
          <path d="M9 8l0 9" />
          <path d="M6 17l0 -7" />
          <path d="M3 16l0 -2" />
        </svg>
      </a>
      <a
        class="social-link linkedin-link"
        href="https://www.linkedin.com/in/elias-ginter-9a55671a0"
        target="_blank"
        rel="noreferrer"
        aria-label="Elias Ginter auf LinkedIn"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
          focusable="false"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M8 11v5" />
          <path d="M8 8v.01" />
          <path d="M12 16v-5" />
          <path d="M16 16v-3a2 2 0 1 0 -4 0" />
          <path d="M3 7a4 4 0 0 1 4 -4h10a4 4 0 0 1 4 4v10a4 4 0 0 1 -4 4h-10a4 4 0 0 1 -4 -4l0 -10" />
        </svg>
      </a>
    </div>
    <nav class="legal-nav" aria-label="Rechtliches">
      <a href="/impressum.html">Impressum</a>
      <a href="/datenschutz.html">Datenschutz</a>
    </nav>
  </footer>
</template>
