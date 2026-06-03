<script setup>
import ProjectModule from './components/ProjectModule.vue'
import P5Canvas from './components/P5Canvas.vue'

const projects = [
  {
    kicker: 'Webapp / Interaction',
    title: 'Interface als Spielfeld',
    type: 'p5',
    description:
      'Ein experimenteller Sketch fuer generative Navigation, Bewegung und direkte Interaktion.',
    meta: ['p5.js', 'Vue', 'Prototyping'],
  },
  {
    kicker: 'Video / Schnitt',
    title: 'Rhythmus im Stadtraum',
    type: 'video',
    description:
      'Kurzer Video-Case mit grossflaechiger Praesentation und knappem Kontext zum Konzept.',
    meta: ['Editing', 'Sound', 'Konzept'],
  },
  {
    kicker: 'Design / Konzept',
    title: 'Visuelles System',
    type: 'image',
    description:
      'Bildstarke Dokumentation fuer Gestaltungskonzepte, Mockups, Fotos oder Prozessmaterial.',
    meta: ['Branding', 'Layout', 'Research'],
  },
]
</script>

<template>
  <header class="site-header">
    <a class="wordmark" href="#top" aria-label="Zum Anfang">Elias Ginter</a>
    <nav class="site-nav" aria-label="Hauptnavigation">
      <a href="#arbeiten">Arbeiten</a>
      <a href="#profil">Profil</a>
      <a href="mailto:hello@example.com">Kontakt</a>
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
        v-for="project in projects"
        :key="project.title"
        :project="project"
      />
    </section>

    <section id="profil" class="profile-section" aria-labelledby="profile-title">
      <div>
        <p class="section-kicker">Profil</p>
        <h2 id="profile-title">Student der interaktiven Medien zwischen Informatik und Design.</h2>
      </div>
      <p>
        Ich entwickle Konzepte, Webinterfaces, audiovisuelle Arbeiten und interaktive
        Prototypen. Dieses Portfolio ist modular aufgebaut: Jede Arbeit kann als grosses
        Bild, Video, p5-Sketch oder Webapp eingebunden werden.
      </p>
    </section>
  </main>
</template>
