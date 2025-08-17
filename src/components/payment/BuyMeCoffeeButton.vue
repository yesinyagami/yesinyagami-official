<template>
  <a
    :href="buyMeCoffeeUrl"
    target="_blank"
    rel="noopener noreferrer"
    class="btn-secondary inline-flex items-center gap-2 hover:bg-yellow-600/20 hover:border-yellow-400/50 transition-colors"
  >
    <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20 3H4v10c0 2.21 1.79 4 4 4h6c2.21 0 4-1.79 4-4v-3h2c1.11 0 2-.89 2-2V5c0-1.11-.89-2-2-2zm0 5h-2V5h2v3z"/>
      <path d="M4 19h16v2H4z"/>
    </svg>
    Buy Me a Coffee
  </a>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const buyMeCoffeeUrl = computed(() => {
  const baseUrl = import.meta.env.BUYMEACOFFEE_PROFILE_URL || 'https://buymeacoffee.com/nightgodtarot'
  return baseUrl
})
</script>