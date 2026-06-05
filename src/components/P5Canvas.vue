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
    const maxSegments = props.variant === 'hero' ? 240 : 90
    const lineDrawDuration = 880
    const backgroundColor = [13, 15, 17]
    const trailFadeAlpha = 0.45
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
    let trailLayer

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

    const getSegmentColor = (elapsedSeconds) => {
      const elapsedMinute = Math.floor(elapsedSeconds / 60)
      const secondInMinute = elapsedSeconds % 60
      const base = minutePalette[elapsedMinute % minutePalette.length]
      const shadeStep = Math.floor(secondInMinute / 10)
      const shade = 0.5 + shadeStep * 0.12

      return base.map((channel) => Math.min(255, Math.round(channel * shade)))
    }

    const getMinuteColor = (minuteIndex) => {
      const base = minutePalette[minuteIndex % minutePalette.length]

      return base.map((channel) => Math.min(255, Math.round(channel * 0.9)))
    }

    const getSegmentWeight = (from, to) => {
      const distance = Math.hypot(to.x - from.x, to.y - from.y)
      const weight = 1.15 / Math.max(0.22, distance)

      return sketch.constrain(weight, 1.35, 5.2)
    }

    const addSegment = (date) => {
      const elapsedSeconds = Math.floor((date.getTime() - loadedAt) / 1000)
      const nextPoint = createPoint()
      segments.push({
        from: currentPoint,
        to: nextPoint,
        color: getSegmentColor(elapsedSeconds),
        createdAt: sketch.millis(),
        weight: getSegmentWeight(currentPoint, nextPoint),
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

    const setupTrailLayer = () => {
      trailLayer = sketch.createGraphics(sketch.width, sketch.height)
      trailLayer.pixelDensity(Math.min(window.devicePixelRatio, 2))
      trailLayer.noFill()
      trailLayer.strokeCap(sketch.ROUND)
    }

    const drawGridSystem = () => {
      sketch.stroke(244, 241, 232, 20)
      sketch.strokeWeight(1)

      for (let x = sketch.width / 8; x < sketch.width; x += sketch.width / 8) {
        sketch.line(x, 0, x, sketch.height)
      }

      for (let y = sketch.height / 8; y < sketch.height; y += sketch.height / 8) {
        sketch.line(0, y, sketch.width, y)
      }

      sketch.stroke(111, 202, 189, 12)
      sketch.strokeWeight(1)
      sketch.line(sketch.width * 0.5, 0, sketch.width * 0.5, sketch.height)
      sketch.line(0, sketch.height * 0.5, sketch.width, sketch.height * 0.5)
    }

    const drawBackgroundSystem = () => {
      sketch.background(backgroundColor[0], backgroundColor[1], backgroundColor[2])
      drawGridSystem()
    }

    const fadeTrailLayer = () => {
      if (!trailLayer) {
        return
      }

      trailLayer.push()
      trailLayer.noStroke()
      trailLayer.fill(backgroundColor[0], backgroundColor[1], backgroundColor[2], trailFadeAlpha)
      trailLayer.rect(0, 0, trailLayer.width, trailLayer.height)
      trailLayer.pop()
    }

    const drawMinuteTally = (now) => {
      if (props.variant !== 'hero') {
        return
      }

      const elapsedMinutes = Math.floor((now.getTime() - loadedAt) / 60000)

      if (elapsedMinutes <= 0) {
        return
      }

      const isCompact = sketch.width < 680
      const lineHeight = isCompact ? 18 : 24
      const lineGap = isCompact ? 5 : 7
      const groupGap = isCompact ? 13 : 18
      const rowGap = isCompact ? 11 : 14
      const strokeWidth = isCompact ? 2 : 2.5
      const maxGroupsPerRow = Math.max(1, Math.floor((sketch.width * 0.34) / (lineGap * 4 + groupGap)))
      const groups = Math.ceil(elapsedMinutes / 5)
      const rows = Math.ceil(groups / maxGroupsPerRow)
      const groupWidth = lineGap * 4
      const totalWidth = Math.min(groups, maxGroupsPerRow) * groupWidth + (Math.min(groups, maxGroupsPerRow) - 1) * groupGap
      const startX = sketch.width - totalWidth - (isCompact ? 18 : 34)
      const startY = sketch.height - rows * (lineHeight + rowGap) - (isCompact ? 20 : 34)

      sketch.push()
      sketch.strokeCap(sketch.ROUND)

      for (let minute = 0; minute < elapsedMinutes; minute += 1) {
        const group = Math.floor(minute / 5)
        const mark = minute % 5
        const row = Math.floor(group / maxGroupsPerRow)
        const col = group % maxGroupsPerRow
        const x = startX + col * (groupWidth + groupGap)
        const y = startY + row * (lineHeight + rowGap)
        const color = getMinuteColor(minute)

        sketch.stroke(color[0], color[1], color[2], 225)
        sketch.strokeWeight(strokeWidth)

        if (mark === 4) {
          sketch.line(x - 2, y + lineHeight - 1, x + groupWidth + 2, y + 1)
        } else {
          const markX = x + mark * lineGap
          sketch.line(markX, y, markX, y + lineHeight)
        }
      }

      sketch.pop()
    }

    sketch.setup = () => {
      const { width, height } = getCanvasSize()
      const canvas = sketch.createCanvas(width, height)
      canvas.parent(host.value)
      sketch.pixelDensity(Math.min(window.devicePixelRatio, 2))
      sketch.noFill()
      sketch.strokeCap(sketch.ROUND)
      setupTimeSystem()
      setupTrailLayer()
      drawBackgroundSystem()

      resizeObserver = new ResizeObserver(() => {
        const nextSize = getCanvasSize()
        sketch.resizeCanvas(nextSize.width, nextSize.height)
        setupTrailLayer()
        drawBackgroundSystem()
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

      if (props.variant === 'hero') {
        sketch.background(backgroundColor[0], backgroundColor[1], backgroundColor[2])
        fadeTrailLayer()
      } else {
        drawBackgroundSystem()
      }

      segments.forEach((segment, index) => {
        const target = props.variant === 'hero' ? trailLayer : sketch
        const from = toCanvasPoint(segment.from)
        const to = toCanvasPoint(segment.to)
        const age = sketch.millis() - segment.createdAt
        const progress = sketch.constrain(age / lineDrawDuration, 0, 1)
        const easedProgress = 1 - Math.pow(1 - progress, 3)
        const endX = sketch.lerp(from.x, to.x, easedProgress)
        const endY = sketch.lerp(from.y, to.y, easedProgress)
        const alpha = props.variant === 'hero'
          ? sketch.map(progress, 0, 1, 120, 225)
          : sketch.map(index, 0, Math.max(1, segments.length - 1), 45, 210)

        target.stroke(segment.color[0], segment.color[1], segment.color[2], alpha)
        target.strokeWeight(segment.weight)
        target.line(from.x, from.y, endX, endY)
      })

      if (props.variant === 'hero') {
        sketch.image(trailLayer, 0, 0)
        drawGridSystem()
        segments = segments.filter((segment) => sketch.millis() - segment.createdAt <= lineDrawDuration)
      }

      const originPoint = toCanvasPoint(origin)
      const activePoint = toCanvasPoint(currentPoint)
      const pulse = 8 + Math.sin(sketch.frameCount * 0.08) * 3

      sketch.noStroke()
      sketch.fill(244, 241, 232, 180)
      sketch.circle(originPoint.x, originPoint.y, 7)
      sketch.fill(244, 241, 232, 95)
      sketch.circle(activePoint.x, activePoint.y, pulse)
      sketch.noFill()

      drawMinuteTally(now)
    }

    sketch.windowResized = () => {
      const { width, height } = getCanvasSize()
      sketch.resizeCanvas(width, height)
      setupTrailLayer()
      drawBackgroundSystem()
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
