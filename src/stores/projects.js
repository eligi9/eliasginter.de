import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import projectItems from '../data/projects.json'

const categoryFilters = [
  {
    id: 'primary',
    items: [
      { label: 'Abstract Concepts', matches: ['Abstract Concept', 'Abstract Concepts'] },
      { label: 'Digital Design', matches: ['Digital Design'] },
      { label: 'Interactive Experience', matches: ['Interactive Experience'] },
    ],
  },
  {
    id: 'secondary',
    items: [
      { label: 'Sounddesign', matches: ['Sounddesign', 'Sound Design'] },
      { label: 'Code', matches: ['Frontend Development', 'Backend Development', 'Web Development', 'Webapp', 'Web App'] },
      { label: 'Motion', matches: ['Motion', 'Motion Design', 'Animation'] },
      { label: 'Film', matches: ['Film'] },
      { label: 'Physical Interface', matches: ['Physical Interface'] },
    ],
  },
]

const getProjectSearchText = (project) => {
  const values = [
    project.title,
    project.kicker,
    project.type,
    ...(project.tags || []),
    ...(project.role || []),
    ...(project.tools || []),
    ...(project.themes || []),
  ]

  return values.join(' ').toLowerCase()
}

export const useProjectsStore = defineStore('projects', () => {
  const activeCategory = ref('Alle')
  const projects = ref(projectItems)

  const sortedProjects = computed(() =>
    [...projects.value].sort((a, b) => {
      const yearA = Number(a.year) || 0
      const yearB = Number(b.year) || 0

      return yearB - yearA
    }),
  )

  const flatCategoryFilters = computed(() => categoryFilters.flatMap((group) => group.items))

  const filteredProjects = computed(() => {
    if (activeCategory.value === 'Alle') {
      return sortedProjects.value
    }

    const activeFilter = flatCategoryFilters.value.find(
      (category) => category.label === activeCategory.value,
    )

    if (!activeFilter?.matches) {
      return sortedProjects.value
    }

    return sortedProjects.value.filter((project) => {
      const searchText = getProjectSearchText(project)

      return activeFilter.matches.some((match) => searchText.includes(match.toLowerCase()))
    })
  })

  const setCategory = (category) => {
    activeCategory.value = activeCategory.value === category ? 'Alle' : category
  }

  const getProjectById = (projectId) =>
    sortedProjects.value.find((project) => project.id === projectId)

  const getProjectGallery = (project) => {
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
  }

  return {
    activeCategory,
    categoryFilters,
    filteredProjects,
    flatCategoryFilters,
    getProjectById,
    getProjectGallery,
    projects,
    setCategory,
    sortedProjects,
  }
})
