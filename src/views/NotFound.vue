<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-16">
    <div class="container mx-auto px-4">
      <div class="max-w-2xl mx-auto text-center">
        <div class="glass-card p-12">
          <div class="text-8xl mb-6">🔮</div>
          <h1 class="text-6xl font-display font-bold text-gradient mb-6">
            404
          </h1>
          <h2 class="text-2xl font-semibold text-white mb-4">
            The Mystical Path is Unclear
          </h2>
          <p class="text-xl text-gray-300 mb-8">
            The divine forces have hidden this page from view. Perhaps the universe is guiding you elsewhere.
          </p>
          
          <div class="flex gap-4 justify-center">
            <router-link to="/" class="btn-primary">
              🏠 Return Home
            </router-link>
            <router-link to="/demo" class="btn-secondary">
              🔮 Seek Guidance
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

onMounted(() => {
  console.log('👻 404 page loaded')
})
</script>

<style scoped>
.text-gradient {
  background: linear-gradient(135deg, #ffd700, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
</style>