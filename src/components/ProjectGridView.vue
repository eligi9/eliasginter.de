<script setup>
import ProjectModule from './ProjectModule.vue'

defineProps({
  projects: {
    type: Array,
    required: true,
  },
  categoryGroups: {
    type: Array,
    required: true,
  },
  activeCategory: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['select-category'])
</script>

<template>
  <section class="work-single" aria-labelledby="projects-title">
    <header class="work-header">
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
          v-for="group in categoryGroups"
          :key="group.id"
          class="project-filter-group"
        >
          <button
            v-for="category in group.items"
            :key="category.label"
            type="button"
            :class="{ 'is-active': activeCategory === category.label }"
            @click="emit('select-category', category.label)"
          >
            {{ category.label }}
          </button>
        </div>
      </div>
    </header>

    <section class="project-stack project-stack-filtered" aria-label="Gefilterte Arbeiten">
      <ProjectModule
        v-for="project in projects"
        :key="project.title"
        :project="project"
      />
    </section>
  </section>
</template>
