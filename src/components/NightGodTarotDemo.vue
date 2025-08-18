<template>
  <div class="glass-card p-8 text-center">
    <h3 class="text-2xl font-semibold text-gradient mb-4">✨ Experience Divine Guidance</h3>
    <p class="text-gray-300 mb-6">
      Get a taste of our AI-powered tarot system with a personalized three-card reading.
    </p>
    <router-link to="/demo" class="btn-primary">
      🔮 Try Free Reading
    </router-link>
  </div>
</template>

<script setup lang="ts">
// Mini demo component for the home page
</script>

<style scoped>
.text-gradient {
  background: linear-gradient(135deg, #ffd700, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
</style>