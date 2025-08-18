<template>
  <div id="particles" class="fixed inset-0 pointer-events-none z-0"></div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'

let animationId: number | null = null
let particles: Array<{
  x: number
  y: number
  vx: number
  vy: number
  opacity: number
  size: number
}> = []

onMounted(() => {
  createParticles()
  animateParticles()
})

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
})

function createParticles() {
  const container = document.getElementById('particles')
  if (!container) return

  // Create canvas
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  canvas.style.position = 'absolute'
  canvas.style.top = '0'
  canvas.style.left = '0'
  canvas.style.pointerEvents = 'none'
  container.appendChild(canvas)

  function resize() {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  }

  resize()
  window.addEventListener('resize', resize)

  // Initialize particles
  for (let i = 0; i < 50; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      opacity: Math.random() * 0.3 + 0.1,
      size: Math.random() * 2 + 1
    })
  }

  function animateParticles() {
    if (!ctx || !canvas) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    particles.forEach(particle => {
      // Update position
      particle.x += particle.vx
      particle.y += particle.vy

      // Wrap around edges
      if (particle.x < 0) particle.x = canvas.width
      if (particle.x > canvas.width) particle.x = 0
      if (particle.y < 0) particle.y = canvas.height
      if (particle.y > canvas.height) particle.y = 0

      // Draw particle
      ctx.beginPath()
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(255, 215, 0, ${particle.opacity})`
      ctx.fill()

      // Add glow effect
      ctx.beginPath()
      ctx.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(139, 92, 246, ${particle.opacity * 0.3})`
      ctx.fill()
    })

    animationId = requestAnimationFrame(animateParticles)
  }

  animateParticles()
}
</script>

<style scoped>
#particles {
  z-index: 0;
}
</style>