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
    const loadedAt = Date.now()
    const maxSegments = props.variant === 'hero' ? 180 : 90
    const minutePalette = [
      [111, 202, 189],
      [240, 109, 79],
      [221, 225, 82],
      [136, 164, 255],
      [244, 241, 232],
      [192, 121, 214],
    ]

    let random = () => 0.5
    let origin = { x: 0.5, y: 0.5 }
    let currentPoint = origin
    let segments = []
    let lastSecond = -1

    const createSeededRandom = (seed) => {
      let value = seed >>> 0
      return () => {
        value += 0x6d2b79f5
        let result = value
        result = Math.imul(result ^ (result >>> 15), result | 1)
        result ^= result + Math.imul(result ^ (result >>> 7), result | 61)
        return ((result ^ (result >>> 14)) >>> 0) / 4294967296
      }
    }

    const getCanvasSize = () => {
      const bounds = host.value.getBoundingClientRect()
      return {
        width: Math.max(1, Math.round(bounds.width)),
        height: Math.max(1, Math.round(bounds.height)),
      }
    }

    const createPoint = () => ({
      x: 0.08 + random() * 0.84,
      y: 0.08 + random() * 0.84,
    })

    const getSegmentColor = (date) => {
      const base = minutePalette[date.getMinutes() % minutePalette.length]
      const shadeStep = Math.floor(date.getSeconds() / 10)
      const shade = 0.56 + shadeStep * 0.075

      return base.map((channel) => Math.min(255, Math.round(channel * shade)))
    }

    const addSegment = (date) => {
      const nextPoint = createPoint()
      segments.push({
        from: currentPoint,
        to: nextPoint,
        color: getSegmentColor(date),
        createdAt: sketch.millis(),
        weight: 1.2 + random() * 3.8,
      })

      if (segments.length > maxSegments) {
        segments = segments.slice(segments.length - maxSegments)
      }

      currentPoint = nextPoint
    }

    const setupTimeSystem = () => {
      random = createSeededRandom(loadedAt)
      origin = createPoint()
      currentPoint = origin
      segments = []
      lastSecond = new Date().getSeconds()
    }

    const toCanvasPoint = (point) => ({
      x: point.x * sketch.width,
      y: point.y * sketch.height,
    })

    const drawBackgroundSystem = () => {
      sketch.background(13, 15, 17)
      sketch.stroke(244, 241, 232, 32)
      sketch.strokeWeight(1)

      for (let x = sketch.width / 8; x < sketch.width; x += sketch.width / 8) {
        sketch.line(x, 0, x, sketch.height)
      }

      for (let y = sketch.height / 8; y < sketch.height; y += sketch.height / 8) {
        sketch.line(0, y, sketch.width, y)
      }

      sketch.stroke(111, 202, 189, 18)
      sketch.strokeWeight(1.5)
      sketch.line(sketch.width * 0.5, 0, sketch.width * 0.5, sketch.height)
      sketch.line(0, sketch.height * 0.5, sketch.width, sketch.height * 0.5)
    }

    sketch.setup = () => {
      const { width, height } = getCanvasSize()
      const canvas = sketch.createCanvas(width, height)
      canvas.parent(host.value)
      sketch.pixelDensity(Math.min(window.devicePixelRatio, 2))
      sketch.noFill()
      sketch.strokeCap(sketch.ROUND)
      setupTimeSystem()

      resizeObserver = new ResizeObserver(() => {
        const nextSize = getCanvasSize()
        sketch.resizeCanvas(nextSize.width, nextSize.height)
      })
      resizeObserver.observe(host.value)
    }

    sketch.draw = () => {
      const now = new Date()
      const currentSecond = now.getSeconds()

      if (currentSecond !== lastSecond) {
        addSegment(now)
        lastSecond = currentSecond
      }

      drawBackgroundSystem()

      segments.forEach((segment, index) => {
        const from = toCanvasPoint(segment.from)
        const to = toCanvasPoint(segment.to)
        const age = sketch.millis() - segment.createdAt
        const progress = sketch.constrain(age / 880, 0, 1)
        const easedProgress = 1 - Math.pow(1 - progress, 3)
        const endX = sketch.lerp(from.x, to.x, easedProgress)
        const endY = sketch.lerp(from.y, to.y, easedProgress)
        const alpha = sketch.map(index, 0, Math.max(1, segments.length - 1), 45, 210)

        sketch.stroke(segment.color[0], segment.color[1], segment.color[2], alpha)
        sketch.strokeWeight(segment.weight)
        sketch.line(from.x, from.y, endX, endY)
      })

      const originPoint = toCanvasPoint(origin)
      const activePoint = toCanvasPoint(currentPoint)
      const pulse = 8 + Math.sin(sketch.frameCount * 0.08) * 3

      sketch.noStroke()
      sketch.fill(244, 241, 232, 180)
      sketch.circle(originPoint.x, originPoint.y, 7)
      sketch.fill(244, 241, 232, 95)
      sketch.circle(activePoint.x, activePoint.y, pulse)
      sketch.noFill()
    }

    sketch.windowResized = () => {
      const { width, height } = getCanvasSize()
      sketch.resizeCanvas(width, height)
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
