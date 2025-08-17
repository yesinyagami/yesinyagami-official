<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
    <div class="container mx-auto px-4 py-16">
      <!-- Hero Section -->
      <section class="text-center mb-20">
        <h1 class="text-6xl font-display font-bold text-gradient mb-8 animate-fade-in">
          Night God Tarot
        </h1>
        <p class="text-xl text-gray-300 mb-12 max-w-3xl mx-auto animate-slide-in">
          Experience divine guidance through AI-powered tarot readings with unlimited Monica AI intelligence.
          Unlock the mysteries of your past, present, and future.
        </p>
        <div class="flex gap-6 justify-center flex-wrap">
          <router-link to="/demo" class="btn-primary animate-glow">
            🔮 Start Reading
          </router-link>
          <router-link to="/about" class="btn-secondary">
            📖 Learn More
          </router-link>
        </div>
      </section>

      <!-- Features Section -->
      <section class="grid md:grid-cols-3 gap-8 mb-20">
        <div class="glass-card text-center p-8">
          <div class="text-4xl mb-4">🤖</div>
          <h3 class="text-xl font-semibold mb-4 text-gradient">AI-Powered Wisdom</h3>
          <p class="text-gray-300">
            Harness the unlimited power of Monica AI with access to Claude, GPT, Yi, and Gemini models for divine insights.
          </p>
        </div>
        
        <div class="glass-card text-center p-8">
          <div class="text-4xl mb-4">📚</div>
          <h3 class="text-xl font-semibold mb-4 text-gradient">310,000-Word Novel</h3>
          <p class="text-gray-300">
            Integrated mystical storytelling database provides rich context and deep narrative wisdom for your readings.
          </p>
        </div>
        
        <div class="glass-card text-center p-8">
          <div class="text-4xl mb-4">🌟</div>
          <h3 class="text-xl font-semibold mb-4 text-gradient">Membership Tiers</h3>
          <p class="text-gray-300">
            Choose your spiritual journey with Free Spirit, Moon Shadow, or Night God membership levels.
          </p>
        </div>
      </section>

      <!-- Demo Section -->
      <section class="text-center">
        <h2 class="text-4xl font-display font-bold text-gradient mb-8">
          Ready to Discover Your Destiny?
        </h2>
        <NightGodTarotDemo />
      </section>

      <!-- Membership Features -->
      <MembershipFeatures />

      <!-- Payment Section -->
      <section class="text-center mt-20">
        <h2 class="text-4xl font-display font-bold text-gradient mb-8">
          Support the Divine Work
        </h2>
        <div class="flex gap-8 justify-center flex-wrap">
          <BuyMeCoffeeButton />
          <PaymentModal />
        </div>
      </section>

      <!-- Story Integration -->
      <StoryReader />

      <!-- Supporters Wall -->
      <SupportersWall />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import NightGodTarotDemo from '../components/NightGodTarotDemo.vue'
import MembershipFeatures from '../components/MembershipFeatures.vue'
import BuyMeCoffeeButton from '../components/payment/BuyMeCoffeeButton.vue'
import PaymentModal from '../components/PaymentModal.vue'
import StoryReader from '../components/StoryReader.vue'
import SupportersWall from '../components/SupportersWall.vue'

onMounted(() => {
  console.log('🏠 Home view mounted - Night God Tarot')
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