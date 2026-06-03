<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'module',
  },
})

const host = ref(null)
let sketchInstance
let resizeObserver

onMounted(async () => {
  const { default: p5 } = await import('p5')

  sketchInstance = new p5((sketch) => {
    let points = []

    const getCanvasSize = () => {
      const bounds = host.value.getBoundingClientRect()
      return {
        width: Math.max(1, Math.round(bounds.width)),
        height: Math.max(1, Math.round(bounds.height)),
      }
    }

    const resetPoints = () => {
      const count = props.variant === 'hero' ? 72 : 46
      points = Array.from({ length: count }, () => ({
        x: sketch.random(sketch.width),
        y: sketch.random(sketch.height),
        speed: sketch.random(0.35, 1.4),
        radius: sketch.random(1.5, 5),
      }))
    }

    sketch.setup = () => {
      const { width, height } = getCanvasSize()
      const canvas = sketch.createCanvas(width, height)
      canvas.parent(host.value)
      sketch.pixelDensity(Math.min(window.devicePixelRatio, 2))
      sketch.noStroke()
      resetPoints()

      resizeObserver = new ResizeObserver(() => {
        const nextSize = getCanvasSize()
        sketch.resizeCanvas(nextSize.width, nextSize.height)
        resetPoints()
      })
      resizeObserver.observe(host.value)
    }

    sketch.draw = () => {
      sketch.background(13, 15, 17, 34)

      const cursorX = sketch.mouseX || sketch.width * 0.5
      const cursorY = sketch.mouseY || sketch.height * 0.5

      points.forEach((point, index) => {
        const angle = sketch.noise(index, sketch.frameCount * 0.004) * sketch.TAU
        point.x += Math.cos(angle) * point.speed
        point.y += Math.sin(angle) * point.speed

        if (point.x < -20) point.x = sketch.width + 20
        if (point.x > sketch.width + 20) point.x = -20
        if (point.y < -20) point.y = sketch.height + 20
        if (point.y > sketch.height + 20) point.y = -20

        const distance = sketch.dist(point.x, point.y, cursorX, cursorY)
        const pull = sketch.map(Math.min(distance, 240), 0, 240, 1, 0)

        sketch.fill(244, 241, 232, 70 + pull * 130)
        sketch.circle(point.x, point.y, point.radius + pull * 7)

        if (index % 3 === 0) {
          sketch.stroke(115, 202, 190, 26 + pull * 60)
          sketch.line(point.x, point.y, cursorX, cursorY)
          sketch.noStroke()
        }
      })
    }

    sketch.windowResized = () => {
      const { width, height } = getCanvasSize()
      sketch.resizeCanvas(width, height)
      resetPoints()
    }
  })
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  sketchInstance?.remove()
})
</script>

<template>
  <div ref="host" class="p5-host" aria-label="Interaktiver p5-Sketch"></div>
</template>
