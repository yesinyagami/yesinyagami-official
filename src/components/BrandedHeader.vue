<template>
  <header class="relative z-50 bg-black/20 backdrop-blur-sm border-b border-white/10">
    <nav class="container mx-auto px-4 py-4">
      <div class="flex items-center justify-between">
        <!-- Logo -->
        <router-link to="/" class="flex items-center gap-3 group">
          <div class="w-12 h-12 group-hover:scale-110 transition-transform">
            <img src="@/assets/night-god-logo.jpg" alt="Night God Tarot" class="w-full h-full object-cover rounded-full shadow-lg" />
          </div>
          <div>
            <h1 class="text-xl font-display font-bold text-gradient">Night God Tarot</h1>
            <p class="text-xs text-gray-400">Divine AI Wisdom</p>
          </div>
        </router-link>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center gap-6">
          <router-link
            to="/"
            class="nav-link"
            :class="{ 'nav-link-active': $route.name === 'home' }"
          >
            🏠 Home
          </router-link>
          <router-link
            to="/demo"
            class="nav-link"
            :class="{ 'nav-link-active': $route.name === 'demo' }"
          >
            🔮 Reading
          </router-link>
          <router-link
            to="/about"
            class="nav-link"
            :class="{ 'nav-link-active': $route.name === 'about' }"
          >
            📖 About
          </router-link>
        </div>

        <!-- Mobile Menu Button -->
        <button
          @click="toggleMobileMenu"
          class="md:hidden p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
        >
          <svg v-if="!mobileMenuOpen" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
          <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- Mobile Menu -->
      <div
        v-if="mobileMenuOpen"
        class="md:hidden mt-4 p-4 bg-black/30 backdrop-blur-sm rounded-lg border border-white/10"
      >
        <div class="flex flex-col gap-3">
          <router-link
            to="/"
            class="nav-link block py-2"
            :class="{ 'nav-link-active': $route.name === 'home' }"
            @click="closeMobileMenu"
          >
            🏠 Home
          </router-link>
          <router-link
            to="/demo"
            class="nav-link block py-2"
            :class="{ 'nav-link-active': $route.name === 'demo' }"
            @click="closeMobileMenu"
          >
            🔮 Reading
          </router-link>
          <router-link
            to="/about"
            class="nav-link block py-2"
            :class="{ 'nav-link-active': $route.name === 'about' }"
            @click="closeMobileMenu"
          >
            📖 About
          </router-link>
        </div>
      </div>
    </nav>

    <!-- AI Status Indicator -->
    <div class="absolute top-4 right-4 flex items-center gap-2 text-xs">
      <div class="flex items-center gap-1 bg-black/30 px-2 py-1 rounded-full">
        <div :class="['w-2 h-2 rounded-full', aiStatus.connected ? 'bg-green-400' : 'bg-red-400']"></div>
        <span class="text-white">{{ aiStatus.text }}</span>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const mobileMenuOpen = ref(false)
const aiConnected = ref(true)

const aiStatus = computed(() => ({
  connected: aiConnected.value,
  text: aiConnected.value ? 'Monica AI Ready' : 'AI Offline'
}))

function toggleMobileMenu() {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

function closeMobileMenu() {
  mobileMenuOpen.value = false
}

onMounted(() => {
  // Check AI system status
  // Header component mounted
})
</script>

<style scoped>
.text-gradient {
  background: linear-gradient(135deg, #ffd700, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.nav-link {
  @apply text-gray-300 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-white/10;
}

.nav-link-active {
  @apply text-gold-400 bg-gold-400/10;
}
</style>