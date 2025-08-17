<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-16">
    <div class="container mx-auto px-4">
      <div class="max-w-2xl mx-auto text-center">
        <div class="glass-card p-12">
          <div class="text-6xl mb-6">💔</div>
          <h1 class="text-4xl font-display font-bold text-gradient mb-6">
            Payment Cancelled
          </h1>
          <p class="text-xl text-gray-300 mb-8">
            No worries! Your spiritual journey continues. You can still access free readings and upgrade anytime.
          </p>
          
          <div class="bg-blue-900/20 border border-blue-400/30 rounded-lg p-6 mb-8">
            <h2 class="text-lg font-semibold text-blue-400 mb-2">You Still Have Access To:</h2>
            <ul class="text-gray-300 space-y-2">
              <li>🌟 3 free readings per day</li>
              <li>🃏 Basic card meanings</li>
              <li>🤖 Monica AI guidance</li>
              <li>📱 Mobile-friendly interface</li>
            </ul>
          </div>

          <div class="flex gap-4 justify-center">
            <router-link to="/demo" class="btn-primary">
              🔮 Try Free Reading
            </router-link>
            <router-link to="/" class="btn-secondary">
              🏠 Home
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
  console.log('💔 Payment cancelled page loaded')
  
  // Add notification
  if (window.notify) {
    window.notify({
      type: 'info',
      title: 'Payment Cancelled',
      message: 'No problem! You can upgrade anytime.',
      timeout: 3000
    })
  }
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