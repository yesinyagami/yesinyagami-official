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

const router = useRouter()

onMounted(() => {
  // Remove loading screen
  const loadingElement = document.querySelector('.loading')
  if (loadingElement) {
    loadingElement.style.opacity = '0'
    setTimeout(() => {
      loadingElement.remove()
    }, 500)
  }
  
  console.log('🌟 Night God Tarot application mounted')
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