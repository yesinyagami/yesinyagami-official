<template>
  <section class="mt-20">
    <h2 class="text-4xl font-display font-bold text-gradient text-center mb-12">
      Choose Your Spiritual Journey
    </h2>
    
    <div class="grid md:grid-cols-3 gap-8">
      <!-- Free Spirit -->
      <div class="glass-card p-8 text-center">
        <div class="text-4xl mb-4">🌟</div>
        <h3 class="text-xl font-semibold text-gradient mb-4">Free Spirit</h3>
        <div class="text-3xl font-bold mb-4">$0</div>
        <ul class="text-gray-300 space-y-2 mb-6">
          <li>✨ 3 free readings per day</li>
          <li>🃏 Basic card meanings</li>
          <li>🤖 Monica AI guidance</li>
          <li>📱 Mobile friendly</li>
        </ul>
        <button class="btn-secondary w-full">Current Plan</button>
      </div>

      <!-- Moon Shadow -->
      <div class="glass-card p-8 text-center relative">
        <div class="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-purple-600 text-white px-4 py-1 rounded-full text-sm">
          Popular
        </div>
        <div class="text-4xl mb-4">🌙</div>
        <h3 class="text-xl font-semibold text-gradient mb-4">Moon Shadow</h3>
        <div class="text-3xl font-bold mb-4">$5</div>
        <ul class="text-gray-300 space-y-2 mb-6">
          <li>🔮 Unlimited readings</li>
          <li>📚 Advanced interpretations</li>
          <li>🎨 Multiple reading styles</li>
          <li>💾 Reading history</li>
        </ul>
        <BuyMeCoffeeButton class="w-full" />
      </div>

      <!-- Night God -->
      <div class="glass-card p-8 text-center border-gold-400/50">
        <div class="text-4xl mb-4">👑</div>
        <h3 class="text-xl font-semibold text-gradient mb-4">Night God</h3>
        <div class="text-3xl font-bold mb-4">$15</div>
        <ul class="text-gray-300 space-y-2 mb-6">
          <li>🌟 Everything in Moon Shadow</li>
          <li>📖 Novel content integration</li>
          <li>🎭 AI personality analysis</li>
          <li>🎯 Personalized guidance</li>
        </ul>
        <button class="btn-primary w-full">Upgrade with iPass</button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import BuyMeCoffeeButton from './payment/BuyMeCoffeeButton.vue'
</script>

<style scoped>
.text-gradient {
  background: linear-gradient(135deg, #ffd700, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
</style>