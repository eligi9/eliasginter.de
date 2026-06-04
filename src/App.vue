<script setup>
import ProjectModule from './components/ProjectModule.vue'
import P5Canvas from './components/P5Canvas.vue'
import projects from './data/projects.json'

const sortedProjects = [...projects].sort((a, b) => {
  const yearA = Number(a.year) || 0
  const yearB = Number(b.year) || 0

  return yearB - yearA
})
</script>

<template>
  <header class="site-header">
    <a class="wordmark" href="#top" aria-label="Zum Anfang">Elias Ginter</a>
    <nav class="site-nav" aria-label="Hauptnavigation">
      <a href="#arbeiten" aria-label="Work">
        <span class="nav-label" aria-hidden="true">
          <span class="nav-letter"><span data-char="W">W</span></span>
          <span class="nav-letter"><span data-char="o">o</span></span>
          <span class="nav-letter"><span data-char="r">r</span></span>
          <span class="nav-letter"><span data-char="k">k</span></span>
        </span>
      </a>
      <a href="#profil" aria-label="About">
        <span class="nav-label" aria-hidden="true">
          <span class="nav-letter"><span data-char="A">A</span></span>
          <span class="nav-letter"><span data-char="b">b</span></span>
          <span class="nav-letter"><span data-char="o">o</span></span>
          <span class="nav-letter"><span data-char="u">u</span></span>
          <span class="nav-letter"><span data-char="t">t</span></span>
        </span>
      </a>
    </nav>
  </header>

  <main id="top">
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
        <img src="/media/elias-ginter-portrait.jpg" alt="Portrait von Elias Ginter" />
      </figure>
      <p>
        Ich entwickle Konzepte, Webinterfaces, audiovisuelle Arbeiten und interaktive
        Prototypen. Dieses Portfolio ist modular aufgebaut: Jede Arbeit kann als grosses
        Bild, Video, p5-Sketch oder Webapp eingebunden werden.
      </p>
    </section>
  </main>
</template>
