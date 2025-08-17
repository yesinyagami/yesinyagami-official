<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-16">
    <div class="container mx-auto px-4">
      <div class="max-w-2xl mx-auto text-center">
        <div class="glass-card p-12">
          <div class="text-6xl mb-6">✨</div>
          <h1 class="text-4xl font-display font-bold text-gradient mb-6">
            Payment Successful!
          </h1>
          <p class="text-xl text-gray-300 mb-8">
            Thank you for supporting Night God Tarot. Your divine journey has been enhanced!
          </p>
          
          <div class="bg-green-900/20 border border-green-400/30 rounded-lg p-6 mb-8">
            <h2 class="text-lg font-semibold text-green-400 mb-2">Your Benefits Include:</h2>
            <ul class="text-gray-300 space-y-2">
              <li>🔮 Unlimited AI-powered readings</li>
              <li>📚 Deep novel content integration</li>
              <li>🎭 Advanced personality analysis</li>
              <li>🌟 Priority customer support</li>
            </ul>
          </div>

          <div class="flex gap-4 justify-center">
            <router-link to="/demo" class="btn-primary">
              🔮 Start Reading
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
  console.log('✅ Payment success page loaded')
  
  // Add notification
  if (window.notify) {
    window.notify({
      type: 'success',
      title: 'Payment Successful!',
      message: 'Welcome to your enhanced spiritual journey.',
      timeout: 5000
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