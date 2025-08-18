<template>
  <div
    :class="[
      'relative group cursor-pointer transition-all duration-700 transform touch-feedback card-3d',
      'hover:scale-110 focus:scale-110 focus:outline-none focus:ring-2 focus:ring-gold-400',
      {
        'animate-mystic-glow': selected,
        'hover:shadow-magic': !selected,
        'touch-target': true,
        'card-flip': isRevealed && showBack
      }
    ]"
    @click="handleCardSelect"
    @keydown.enter="handleCardSelect"
    @keydown.space.prevent="handleCardSelect"
    tabindex="0"
    role="button"
    :aria-label="`Select ${card.name} card from ${card.arcana} arcana`"
    :aria-pressed="selected"
  >
    <!-- Card Container -->
    <div class="relative w-full aspect-[2/3] rounded-xl overflow-hidden bg-gradient-to-br from-purple-900/20 to-slate-900/20 backdrop-blur-sm border border-white/10 card-face">
      
      <!-- Card Image -->
      <div class="absolute inset-0 flex items-center justify-center">
        <div
          v-if="!isRevealed && showBack"
          class="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-800 to-blue-800"
        >
          <div class="text-gold-400 text-4xl">🌙</div>
        </div>
        <img
          v-else-if="card.imageUrl || card.image"
          :src="card.imageUrl || card.image"
          :alt="card.name"
          class="w-full h-full object-cover"
          @error="handleImageError"
        />
        <div
          v-else
          class="w-full h-full flex flex-col items-center justify-center text-center p-4 bg-gradient-to-br from-purple-800/30 to-blue-800/30"
        >
          <!-- Fallback Design -->
          <div class="text-4xl mb-2">{{ getCardEmoji(card) }}</div>
          <h3 class="text-sm font-semibold text-white mb-1">{{ card.name }}</h3>
          <p class="text-xs text-gray-300">{{ card.arcana }}</p>
          <div class="absolute top-2 right-2 text-xs bg-black/50 px-2 py-1 rounded">
            {{ card.number }}
          </div>
        </div>
      </div>

      <!-- Magical Selection Indicator -->
      <div
        v-if="selected"
        class="absolute inset-0 bg-gradient-to-br from-gold-400/30 to-purple-600/30 border-2 border-gold-400 rounded-xl animate-pulse-ring"
      >
        <div class="absolute inset-0 bg-gradient-to-br from-gold-400/10 to-purple-600/10 rounded-xl animate-spin-slow"></div>
      </div>
      
      <!-- Mystical Particles -->
      <div v-if="selected || mysticalGlow" class="absolute inset-0 pointer-events-none">
        <div class="particle particle-1 animate-float-1"></div>
        <div class="particle particle-2 animate-float-2"></div>
        <div class="particle particle-3 animate-float-3"></div>
        <div class="particle particle-4 animate-float-4"></div>
      </div>

      <!-- Hover Overlay -->
      <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div class="absolute bottom-0 left-0 right-0 p-3">
          <h3 class="text-white font-semibold text-sm">{{ card.name }}</h3>
          <p class="text-gray-300 text-xs">{{ card.arcana }}</p>
          <div v-if="position" class="text-gold-400 text-xs mt-1">{{ position }}</div>
        </div>
      </div>

      <!-- Arcana Badge -->
      <div class="absolute top-2 left-2">
        <span class="text-xs px-2 py-1 rounded-full bg-black/50 text-white">
          {{ card.arcana }}
        </span>
      </div>

      <!-- Element/Suit Badge -->
      <div v-if="card.element || card.suit" class="absolute top-2 right-2">
        <span class="text-xs px-2 py-1 rounded-full bg-black/50 text-white">
          {{ card.element || card.suit }}
        </span>
      </div>
    </div>

    <!-- Card Info Panel (expandable) -->
    <div
      v-if="showDetails && isRevealed"
      class="absolute top-full left-0 right-0 mt-2 p-4 bg-black/90 backdrop-blur-sm rounded-lg border border-white/20 z-10 text-sm"
    >
      <h4 class="font-semibold text-gold-400 mb-2">{{ card.name }}</h4>
      <p class="text-gray-300 mb-2">{{ card.meaning || (card.meanings?.upright?.general) || 'Ancient wisdom awaits...' }}</p>
      <div class="flex flex-wrap gap-1">
        <span
          v-for="keyword in getKeywords(card)"
          :key="keyword"
          class="text-xs px-2 py-1 bg-purple-600/30 text-purple-200 rounded"
        >
          {{ keyword }}
        </span>
      </div>
    </div>

    <!-- Enhanced Mystical Aura -->
    <div
      v-if="selected || mysticalGlow"
      class="absolute inset-0 -z-10 mystical-aura rounded-xl"
    >
      <div class="aura-layer-1 animate-pulse-glow"></div>
      <div class="aura-layer-2 animate-pulse-glow-delay"></div>
      <div class="aura-layer-3 animate-spin-slow"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { TarotCard } from '../types/tarot'

interface Props {
  card: TarotCard
  selected?: boolean
  showBack?: boolean
  showDetails?: boolean
  position?: string
  mysticalGlow?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  selected: false,
  showBack: false,
  showDetails: false,
  mysticalGlow: false
})

const emit = defineEmits<{
  select: [card: TarotCard]
}>()

const isRevealed = ref(!props.showBack)
const imageError = ref(false)

const cardPosition = computed(() => props.position || '')

function handleImageError() {
  imageError.value = true
  console.warn(`Failed to load image for card: ${props.card.name}`)
}

function getCardEmoji(card: TarotCard): string {
  // Major Arcana emojis
  const majorArcanaEmojis: Record<string, string> = {
    'The Fool': '🃏',
    'The Magician': '🎩',
    'The High Priestess': '🌙',
    'The Empress': '👑',
    'The Emperor': '🏰',
    'The Hierophant': '⛪',
    'The Lovers': '💕',
    'The Chariot': '🏇',
    'Strength': '🦁',
    'The Hermit': '🔦',
    'Wheel of Fortune': '🎡',
    'Justice': '⚖️',
    'The Hanged Man': '🙃',
    'Death': '💀',
    'Temperance': '⚗️',
    'The Devil': '👹',
    'The Tower': '🗼',
    'The Star': '⭐',
    'The Moon': '🌙',
    'The Sun': '☀️',
    'Judgement': '📯',
    'The World': '🌍'
  }

  // Suit emojis
  const suitEmojis: Record<string, string> = {
    'wands': '🔥',
    'cups': '💧',
    'swords': '⚔️',
    'pentacles': '💰'
  }

  // Check major arcana first
  if (card.arcana === 'major' && majorArcanaEmojis[card.name]) {
    return majorArcanaEmojis[card.name]
  }

  // Check suit
  if (card.suit && suitEmojis[card.suit]) {
    return suitEmojis[card.suit]
  }

  // Hidden cards
  if (card.arcana === 'hidden') {
    return '🔮'
  }

  // Default
  return '🃏'
}

function getKeywords(card: any): string[] {
  if (Array.isArray(card.keywords)) {
    return card.keywords
  }
  if (card.keywords?.upright) {
    return card.keywords.upright
  }
  return ['mystical', 'divine', 'wisdom']
}

function handleCardSelect() {
  emit('select', props.card)
}

// Reveal card after a delay if showing back initially
if (props.showBack) {
  setTimeout(() => {
    isRevealed.value = true
  }, 500)
}
</script>

<style scoped>
/* Card 3D Effects */
.card-3d {
  perspective: 1000px;
  transform-style: preserve-3d;
}

.card-face {
  transition: transform 0.6s cubic-bezier(0.23, 1, 0.320, 1);
}

.card-flip .card-face {
  transform: rotateY(180deg);
}

/* Enhanced Glow Animations */
.animate-mystic-glow {
  animation: mystic-glow 3s ease-in-out infinite;
}

@keyframes mystic-glow {
  0%, 100% {
    box-shadow: 
      0 0 20px rgba(255, 215, 0, 0.4),
      0 0 40px rgba(147, 51, 234, 0.3),
      inset 0 0 20px rgba(255, 215, 0, 0.1);
  }
  33% {
    box-shadow: 
      0 0 30px rgba(147, 51, 234, 0.6),
      0 0 60px rgba(255, 215, 0, 0.4),
      inset 0 0 30px rgba(147, 51, 234, 0.2);
  }
  66% {
    box-shadow: 
      0 0 25px rgba(59, 130, 246, 0.5),
      0 0 50px rgba(147, 51, 234, 0.4),
      inset 0 0 25px rgba(59, 130, 246, 0.15);
  }
}

.shadow-magic {
  box-shadow: 
    0 0 20px rgba(139, 92, 246, 0.4),
    0 0 40px rgba(147, 51, 234, 0.2);
}

/* Mystical Aura Layers */
.mystical-aura {
  filter: blur(8px);
}

.aura-layer-1 {
  position: absolute;
  inset: -10px;
  background: radial-gradient(circle, rgba(255, 215, 0, 0.3) 0%, transparent 70%);
  border-radius: inherit;
}

.aura-layer-2 {
  position: absolute;
  inset: -20px;
  background: radial-gradient(circle, rgba(147, 51, 234, 0.2) 0%, transparent 60%);
  border-radius: inherit;
}

.aura-layer-3 {
  position: absolute;
  inset: -30px;
  background: conic-gradient(from 0deg, rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1), rgba(255, 215, 0, 0.1), rgba(59, 130, 246, 0.1));
  border-radius: inherit;
}

/* Particle Effects */
.particle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: radial-gradient(circle, rgba(255, 215, 0, 0.8) 0%, transparent 70%);
  border-radius: 50%;
}

.particle-1 {
  top: 10%;
  left: 20%;
}

.particle-2 {
  top: 30%;
  right: 15%;
}

.particle-3 {
  bottom: 25%;
  left: 30%;
}

.particle-4 {
  bottom: 15%;
  right: 25%;
}

/* Animation Keyframes */
@keyframes pulse-glow {
  0%, 100% {
    opacity: 0.6;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.1);
  }
}

@keyframes pulse-glow-delay {
  0%, 100% {
    opacity: 0.4;
    transform: scale(1.05);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.15);
  }
}

@keyframes spin-slow {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes pulse-ring {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.7;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes float-1 {
  0%, 100% {
    transform: translateY(0px) translateX(0px);
    opacity: 0.6;
  }
  33% {
    transform: translateY(-8px) translateX(4px);
    opacity: 1;
  }
  66% {
    transform: translateY(-4px) translateX(-2px);
    opacity: 0.8;
  }
}

@keyframes float-2 {
  0%, 100% {
    transform: translateY(0px) translateX(0px);
    opacity: 0.7;
  }
  50% {
    transform: translateY(-12px) translateX(-6px);
    opacity: 1;
  }
}

@keyframes float-3 {
  0%, 100% {
    transform: translateY(0px) translateX(0px);
    opacity: 0.5;
  }
  25% {
    transform: translateY(6px) translateX(3px);
    opacity: 0.9;
  }
  75% {
    transform: translateY(-6px) translateX(-3px);
    opacity: 0.7;
  }
}

@keyframes float-4 {
  0%, 100% {
    transform: translateY(0px) translateX(0px);
    opacity: 0.8;
  }
  40% {
    transform: translateY(-10px) translateX(5px);
    opacity: 1;
  }
  80% {
    transform: translateY(2px) translateX(-4px);
    opacity: 0.6;
  }
}

/* Apply Animations */
.animate-pulse-glow {
  animation: pulse-glow 2s ease-in-out infinite;
}

.animate-pulse-glow-delay {
  animation: pulse-glow-delay 2s ease-in-out infinite 0.5s;
}

.animate-spin-slow {
  animation: spin-slow 8s linear infinite;
}

.animate-pulse-ring {
  animation: pulse-ring 1.5s ease-in-out infinite;
}

.animate-float-1 {
  animation: float-1 3s ease-in-out infinite;
}

.animate-float-2 {
  animation: float-2 4s ease-in-out infinite 0.5s;
}

.animate-float-3 {
  animation: float-3 3.5s ease-in-out infinite 1s;
}

.animate-float-4 {
  animation: float-4 4.5s ease-in-out infinite 1.5s;
}

/* Mobile touch optimizations */
@media (hover: none) and (pointer: coarse) {
  .touch-feedback:active {
    background-color: rgba(255, 215, 0, 0.1);
    transform: scale(0.98);
    transition: all 0.1s ease;
  }
  
  /* Remove hover effects on touch devices */
  .touch-feedback:hover {
    transform: none;
  }
}

/* Enhanced focus states for accessibility */
.touch-feedback:focus {
  outline: 2px solid #ffd700;
  outline-offset: 2px;
}
</style>