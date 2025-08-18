<template>
  <div class="fixed inset-0 pointer-events-none z-0">
    <div
      v-for="star in stars"
      :key="star.id"
      :style="{
        left: star.x + '%',
        top: star.y + '%',
        animationDelay: star.delay + 's',
        animationDuration: star.duration + 's'
      }"
      :class="['absolute w-1 h-1 bg-white rounded-full animate-pulse', star.class]"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Star {
  id: number
  x: number
  y: number
  delay: number
  duration: number
  class: string
}

const stars = ref<Star[]>([])

onMounted(() => {
  generateStars()
})

function generateStars() {
  const starCount = 100
  const starClasses = [
    'opacity-20',
    'opacity-30',
    'opacity-40',
    'opacity-50'
  ]

  for (let i = 0; i < starCount; i++) {
    stars.value.push({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 3,
      duration: Math.random() * 3 + 2,
      class: starClasses[Math.floor(Math.random() * starClasses.length)]
    })
  }
}
</script>

<style scoped>
@keyframes twinkle {
  0%, 100% {
    opacity: 0.2;
    transform: scale(0.8);
  }
  50% {
    opacity: 1;
    transform: scale(1.2);
  }
}

.animate-pulse {
  animation: twinkle var(--duration) ease-in-out infinite;
}
</style>