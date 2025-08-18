<template>
  <div id="app" class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
    <!-- Header -->
    <BrandedHeader />
    
    <!-- Main Content -->
    <main class="relative z-10">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    
    <!-- Particle Effects -->
    <ParticleSystem />
    
    <!-- Star Field Background -->
    <StarField />
    
    <!-- Audio System -->
    <AudioSystem />
    
    <!-- Notifications -->
    <NotificationContainer />
    
    <!-- Hidden Admin Portal (Only visible on triple-click) -->
    <HiddenAdminPortal />
    
    <!-- Welcome Guide for New Users -->
    <WelcomeGuide />
    
    <!-- Live Chat Support -->
    <LiveChat />
    
    <!-- Social Proof Elements -->
    <SocialProof />
    
    <!-- Performance Optimizer -->
    <PerformanceOptimizer />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import BrandedHeader from './components/BrandedHeader.vue'
import ParticleSystem from './components/effects/ParticleSystem.vue'
import StarField from './components/ui/StarField.vue'
import AudioSystem from './components/effects/AudioSystem.vue'
import NotificationContainer from './components/ui/NotificationContainer.vue'
import HiddenAdminPortal from './components/admin/HiddenAdminPortal.vue'
import WelcomeGuide from './components/onboarding/WelcomeGuide.vue'
import LiveChat from './components/LiveChat.vue'
import SocialProof from './components/SocialProof.vue'
import PerformanceOptimizer from './components/PerformanceOptimizer.vue'

const router = useRouter()

onMounted(() => {
  // Remove loading screen
  const loadingElement = document.querySelector('.loading')
  if (loadingElement) {
    (loadingElement as HTMLElement).style.opacity = '0'
    setTimeout(() => {
      loadingElement.remove()
    }, 500)
  }
  
  // Application mounted - production ready
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

#app {
  font-family: 'Inter', sans-serif;
}
</style>