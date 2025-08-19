<template>
  <div
    :class="[
      'relative group cursor-pointer transition-all duration-500 transform hover:scale-105',
      {
        'animate-glow': selected,
        'hover:shadow-glow': !selected
      }
    ]"
    @click="$emit('select', card)"
  >
    <!-- Card Container -->
    <div class="relative w-full aspect-[2/3] rounded-xl overflow-hidden bg-gradient-to-br from-purple-900/20 to-slate-900/20 backdrop-blur-sm border border-white/10">
      
      <!-- Card Image -->
      <div class="absolute inset-0 flex items-center justify-center">
        <div
          v-if="!isRevealed && showBack"
          class="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-800 to-blue-800"
        >
          <div class="text-gold-400 text-4xl">🌙</div>
        </div>
        <img
          v-else-if="card.image"
          :src="card.image"
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

      <!-- Selection Indicator -->
      <div
        v-if="selected"
        class="absolute inset-0 bg-gradient-to-br from-gold-400/20 to-gold-600/20 border-2 border-gold-400 rounded-xl"
      ></div>

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
      <p class="text-gray-300 mb-2">{{ card.meanings?.upright?.general || 'No meaning available' }}</p>
      <div class="flex flex-wrap gap-1">
        <span
          v-for="keyword in (card.keywords?.upright || [])"
          :key="keyword"
          class="text-xs px-2 py-1 bg-purple-600/30 text-purple-200 rounded"
        >
          {{ keyword }}
        </span>
      </div>
    </div>

    <!-- Glow Effect -->
    <div
      v-if="selected || mysticalGlow"
      class="absolute inset-0 -z-10 bg-gradient-to-br from-gold-400/30 to-purple-600/30 blur-lg rounded-xl animate-pulse"
    ></div>
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

// Reveal card after a delay if showing back initially
if (props.showBack) {
  setTimeout(() => {
    isRevealed.value = true
  }, 500)
}
</script>

<style scoped>
.animate-glow {
  animation: glow 2s ease-in-out infinite;
}

@keyframes glow {
  0%, 100% {
    box-shadow: 0 0 20px rgba(255, 215, 0, 0.3);
  }
  50% {
    box-shadow: 0 0 30px rgba(255, 215, 0, 0.6);
  }
}

.shadow-glow {
  box-shadow: 0 0 20px rgba(139, 92, 246, 0.3);
}
</style>