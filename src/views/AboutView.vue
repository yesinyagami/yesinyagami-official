<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-16">
    <div class="container mx-auto px-4">
      <div class="max-w-4xl mx-auto">
        <h1 class="text-5xl font-display font-bold text-gradient text-center mb-8">
          About Night God Tarot
        </h1>
        
        <div class="glass-card p-8 mb-8">
          <h2 class="text-2xl font-semibold text-gradient mb-4">Our Mission</h2>
          <p class="text-gray-300 leading-relaxed mb-6">
            Night God Tarot combines ancient wisdom with cutting-edge AI technology to provide 
            divine guidance for the modern seeker. Our platform harnesses the unlimited power 
            of Monica AI, integrating multiple AI intelligences to deliver profound insights.
          </p>
          
          <h2 class="text-2xl font-semibold text-gradient mb-4">The Technology</h2>
          <p class="text-gray-300 leading-relaxed mb-6">
            Our system uses a sophisticated AI orchestration approach, featuring:
          </p>
          <ul class="text-gray-300 space-y-2 mb-6">
            <li>🤖 <strong>Monica AI Primary System:</strong> Unlimited access to Yi, Claude, GPT, and Gemini models</li>
            <li>🌍 <strong>Collective Wisdom Search:</strong> Real-time insights from global consciousness</li>
            <li>🧠 <strong>Personal Analysis:</strong> Deep psychological profiling and guidance</li>
            <li>🔗 <strong>Wisdom Integration:</strong> Synthesis of multiple AI perspectives</li>
            <li>🎨 <strong>Poetic Sublimation:</strong> Artistic transformation of insights</li>
          </ul>
        </div>

        <div class="glass-card p-8">
          <h2 class="text-2xl font-semibold text-gradient mb-4">Contact & Support</h2>
          <p class="text-gray-300 mb-4">
            Join our mystical community and experience the future of divine guidance.
          </p>
          <div class="flex gap-4 justify-center">
            <router-link to="/demo" class="btn-primary">
              🔮 Try Reading
            </router-link>
            <a href="mailto:contact@nightgodtarot.com" class="btn-secondary">
              📧 Contact Us
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

onMounted(() => {
  console.log('📖 About view mounted')
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