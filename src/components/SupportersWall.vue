<template>
  <section class="mt-20">
    <h2 class="text-4xl font-display font-bold text-gradient text-center mb-8">
      🙏 Divine Supporters
    </h2>
    <div class="glass-card p-8">
      <p class="text-center text-gray-300 mb-8">
        Thank you to our amazing supporters who make this mystical journey possible.
      </p>
      
      <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div
          v-for="supporter in supporters"
          :key="supporter.id"
          class="text-center p-4 bg-white/5 rounded-lg border border-white/10"
        >
          <div class="w-12 h-12 bg-gradient-to-br from-gold-400 to-purple-600 rounded-full mx-auto mb-2 flex items-center justify-center text-lg">
            {{ supporter.avatar }}
          </div>
          <div class="text-sm font-medium text-white">{{ supporter.name }}</div>
          <div class="text-xs text-gray-400">{{ supporter.tier }}</div>
        </div>
      </div>
      
      <div class="text-center mt-8">
        <router-link to="/demo" class="btn-secondary">
          Join Our Community
        </router-link>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const supporters = ref([
  { id: 1, name: 'StarSeeker', avatar: '🌟', tier: 'Night God' },
  { id: 2, name: 'MoonChild', avatar: '🌙', tier: 'Moon Shadow' },
  { id: 3, name: 'CrystalGaze', avatar: '🔮', tier: 'Night God' },
  { id: 4, name: 'SoulWanderer', avatar: '✨', tier: 'Moon Shadow' },
  { id: 5, name: 'MysticDreamer', avatar: '🌠', tier: 'Night God' },
  { id: 6, name: 'SageWisdom', avatar: '🧙', tier: 'Moon Shadow' },
])
</script>

<style scoped>
.text-gradient {
  background: linear-gradient(135deg, #ffd700, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
</style>