<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import ProjectModule from './components/ProjectModule.vue'
import P5Canvas from './components/P5Canvas.vue'
import ProjectCarousel from './components/ProjectCarousel.vue'
import RollingNavLink from './components/RollingNavLink.vue'
import ScrollToTopButton from './components/ScrollToTopButton.vue'
import about from './data/about.json'
import { useProjectsStore } from './stores/projects'

const navItems = [
  { href: '#/projects', label: 'Work' },
  { href: '#profil', label: 'About' },
]

const projectsStore = useProjectsStore()
const routeHash = ref(window.location.hash || '#top')

const syncRoute = () => {
  routeHash.value = window.location.hash || '#top'
}

const projectRouteId = computed(() => {
  const match = routeHash.value.match(/^#\/projects\/([^/?#]+)/)

  return match ? decodeURIComponent(match[1]) : null
})

const isProjectIndex = computed(() => routeHash.value === '#/projects')
const selectedProject = computed(() => projectsStore.getProjectById(projectRouteId.value))
const selectedGallery = computed(() => projectsStore.getProjectGallery(selectedProject.value))
const formatList = (items = []) => items.join(', ')
const abstractParagraphs = computed(() => selectedProject.value?.abstract?.split('\n\n') || [])
const isNavItemActive = (item) => {
  if (item.href === '#/projects') {
    return routeHash.value.startsWith('#/projects')
  }

  return routeHash.value === item.href
}

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
        :active="isNavItemActive(item)"
      />
    </nav>
  </header>

  <main v-if="selectedProject" id="top" class="project-detail-page">
    <article class="project-detail" aria-labelledby="project-detail-title">
      <a class="project-detail-back-link" href="#/projects" aria-label="Zurück zur Projektübersicht">
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
          <path d="M19 12H5" />
          <path d="M12 5l-7 7l7 7" />
        </svg>
      </a>

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

      <ProjectCarousel :items="selectedGallery" :title="selectedProject.title" />

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
            Projekt öffnen
          </a>
        </aside>
      </section>
    </article>
  </main>

  <main v-else-if="isProjectIndex" id="top" class="projects-page">
    <section class="projects-overview" aria-labelledby="projects-title">
      <div class="projects-heading">
        <a class="projects-back-link" href="#top" aria-label="Zurück zur Startseite">
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
            <path d="M19 12H5" />
            <path d="M12 5l-7 7l7 7" />
          </svg>
        </a>
        <div>
          <p class="section-kicker">Work</p>
          <h1 id="projects-title">Ausgewählte Projekte</h1>
        </div>
      </div>

      <div class="project-filters" aria-label="Projekte filtern">
        <div
          v-for="group in projectsStore.categoryFilters"
          :key="group.id"
          class="project-filter-group"
        >
          <button
            v-for="category in group.items"
            :key="category.label"
            type="button"
            :class="{ 'is-active': projectsStore.activeCategory === category.label }"
            @click="projectsStore.setCategory(category.label)"
          >
            {{ category.label }}
          </button>
        </div>
      </div>
    </section>

    <section class="project-stack project-stack-filtered" aria-label="Gefilterte Arbeiten">
      <ProjectModule
        v-for="project in projectsStore.filteredProjects"
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

    <section id="arbeiten" class="project-stack" aria-label="Ausgewählte Arbeiten">
      <ProjectModule
        v-for="project in projectsStore.sortedProjects"
        :key="project.title"
        :project="project"
      />
    </section>

    <section id="profil" class="profile-section" aria-labelledby="profile-title">
      <div>
        <p class="section-kicker">{{ about.kicker }}</p>
        <h2 id="profile-title">{{ about.title }}</h2>
      </div>
      <figure class="profile-portrait">
        <img src="/media/elias-ginter-cutout.png" alt="Portrait von Elias Ginter" />
      </figure>
      <div class="profile-copy">
        <p v-for="paragraph in about.paragraphs" :key="paragraph">{{ paragraph }}</p>
      </div>
    </section>
  </main>

  <footer class="site-footer">
    <div class="social-links">
      <!-- Icons: Tabler Icons, MIT License, https://tabler.io/icons -->
      <a
        class="social-link mail-link"
        href="mailto:eligi9@gmx.de"
        aria-label="E-Mail an Elias Ginter"
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
          <path d="M3 7a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-10z" />
          <path d="M3 7l9 6l9 -6" />
        </svg>
      </a>
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

  <ScrollToTopButton />
</template>
