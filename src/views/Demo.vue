<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-16">
    <div class="container mx-auto px-4">
      <!-- Header -->
      <div class="text-center mb-12">
        <h1 class="text-5xl font-display font-bold text-gradient mb-6">
          🔮 Divine Tarot Reading
        </h1>
        <p class="text-xl text-gray-300 max-w-2xl mx-auto">
          Experience the power of AI-guided tarot wisdom. Choose your cards and receive insights from multiple AI intelligences working in harmony.
        </p>
      </div>

      <!-- Reading Interface -->
      <div class="max-w-4xl mx-auto">
        <!-- Question Input -->
        <div class="glass-card p-8 mb-8">
          <h2 class="text-2xl font-semibold mb-4 text-gradient">Ask Your Question</h2>
          <textarea
            v-model="question"
            placeholder="What guidance do you seek from the divine realm? (Optional - leave blank for a general reading)"
            class="w-full h-32 bg-transparent border-2 border-purple-500/30 rounded-lg p-4 text-white placeholder-gray-400 focus:border-gold-400 focus:outline-none transition-colors"
          ></textarea>
        </div>

        <!-- Card Selection -->
        <div class="glass-card p-8 mb-8">
          <h2 class="text-2xl font-semibold mb-6 text-gradient">Select Your Cards</h2>
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div
              v-for="(card, index) in availableCards"
              :key="card.id"
              @click="selectCard(card)"
              :class="[
                'cursor-pointer transition-all duration-300 transform hover:scale-105',
                selectedCards.includes(card) ? 'ring-2 ring-gold-400' : ''
              ]"
            >
              <TarotCard :card="card" :selected="selectedCards.includes(card)" />
            </div>
          </div>
          
          <div class="mt-6 text-center">
            <p class="text-gray-300 mb-4">
              Selected: {{ selectedCards.length }}/3 cards
            </p>
            <button
              @click="clearSelection"
              class="btn-secondary mr-4"
              :disabled="selectedCards.length === 0"
            >
              Clear Selection
            </button>
            <button
              @click="shuffleCards"
              class="btn-secondary"
            >
              🔄 Shuffle Cards
            </button>
          </div>
        </div>

        <!-- Reading Button -->
        <div class="text-center mb-8">
          <button
            @click="performReading"
            :disabled="selectedCards.length === 0 || isLoading"
            class="btn-primary text-lg px-8 py-4"
            :class="{ 'opacity-50 cursor-not-allowed': selectedCards.length === 0 || isLoading }"
          >
            <span v-if="isLoading" class="flex items-center gap-2">
              <div class="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
              Consulting the Divine...
            </span>
            <span v-else>
              ✨ Reveal Divine Wisdom
            </span>
          </button>
        </div>

        <!-- Reading Result -->
        <div v-if="reading" class="glass-card p-8">
          <h2 class="text-3xl font-display font-bold text-gradient mb-6">
            {{ reading.title }}
          </h2>
          
          <!-- Selected Cards Display -->
          <div class="grid md:grid-cols-3 gap-6 mb-8">
            <div
              v-for="(card, index) in selectedCards"
              :key="card.id"
              class="text-center"
            >
              <TarotCard :card="card" :position="cardPositions[index]" />
              <h3 class="text-lg font-semibold mt-4 text-gold-400">
                {{ cardPositions[index] }}
              </h3>
            </div>
          </div>

          <!-- AI Analysis -->
          <div class="space-y-6">
            <div v-if="reading.collectiveWisdom" class="border-l-4 border-cyan-400 pl-6">
              <h3 class="text-xl font-semibold text-cyan-400 mb-2">
                🌍 Collective Wisdom
              </h3>
              <p class="text-gray-300 leading-relaxed">
                {{ reading.collectiveWisdom }}
              </p>
            </div>

            <div v-if="reading.personalAnalysis" class="border-l-4 border-purple-400 pl-6">
              <h3 class="text-xl font-semibold text-purple-400 mb-2">
                🧠 Personal Analysis
              </h3>
              <p class="text-gray-300 leading-relaxed">
                {{ reading.personalAnalysis }}
              </p>
            </div>

            <div v-if="reading.wisdomIntegration" class="border-l-4 border-green-400 pl-6">
              <h3 class="text-xl font-semibold text-green-400 mb-2">
                🔗 Wisdom Integration
              </h3>
              <p class="text-gray-300 leading-relaxed">
                {{ reading.wisdomIntegration }}
              </p>
            </div>

            <div v-if="reading.poeticSublimation" class="border-l-4 border-gold-400 pl-6">
              <h3 class="text-xl font-semibold text-gold-400 mb-2">
                🎨 Poetic Expression
              </h3>
              <p class="text-gray-300 leading-relaxed italic">
                {{ reading.poeticSublimation }}
              </p>
            </div>

            <div class="border-l-4 border-rose-400 pl-6">
              <h3 class="text-xl font-semibold text-rose-400 mb-2">
                ✨ Final Wisdom
              </h3>
              <div class="text-gray-300 leading-relaxed" v-html="reading.mainText"></div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-4 mt-8 justify-center">
            <button @click="newReading" class="btn-primary">
              🔮 New Reading
            </button>
            <button @click="shareReading" class="btn-secondary">
              📤 Share Reading
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useTarotStore } from '../stores/tarot'
import TarotCard from '../components/TarotCard.vue'

const tarotStore = useTarotStore()

const question = ref('')
const selectedCards = ref([])
const availableCards = ref([])
const reading = ref(null)
const isLoading = ref(false)

const cardPositions = ['Past/Foundation', 'Present/Challenge', 'Future/Outcome']

onMounted(async () => {
  console.log('🔮 Demo view mounted')
  await tarotStore.loadCards()
  shuffleCards()
})

function shuffleCards() {
  const allCards = [...tarotStore.cards]
  for (let i = allCards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allCards[i], allCards[j]] = [allCards[j], allCards[i]]
  }
  availableCards.value = allCards.slice(0, 20) // Show 20 random cards
}

function selectCard(card) {
  if (selectedCards.value.includes(card)) {
    selectedCards.value = selectedCards.value.filter(c => c.id !== card.id)
  } else if (selectedCards.value.length < 3) {
    selectedCards.value.push(card)
  }
}

function clearSelection() {
  selectedCards.value = []
}

async function performReading() {
  if (selectedCards.value.length === 0) return
  
  isLoading.value = true
  
  try {
    const readingRequest = {
      cards: selectedCards.value,
      question: question.value || 'General life guidance',
      spread: 'three-card',
      user: {
        id: 'demo-user',
        name: 'Seeker',
        preferences: {
          style: 'mystical',
          depth: 'detailed'
        }
      }
    }
    
    reading.value = await tarotStore.performReading(readingRequest)
  } catch (error) {
    console.error('Reading failed:', error)
    // Fallback reading for demo
    reading.value = {
      title: '✨ Divine Guidance Revealed',
      collectiveWisdom: 'The universe speaks through these cards, revealing patterns that connect your current situation to the greater cosmic flow. Ancient wisdom suggests that this moment holds significant potential for transformation.',
      personalAnalysis: 'Your personal energy signature resonates with themes of growth, challenge, and ultimate triumph. The cards reflect your inner strength and readiness to embrace change.',
      wisdomIntegration: 'By integrating the lessons from your past experiences with present awareness, you create a foundation for manifesting your highest potential.',
      poeticSublimation: 'Like stars that shine brightest in the darkest night, your soul\'s light emerges most brilliantly through life\'s challenges, illuminating paths previously unseen.',
      mainText: 'The divine has spoken through these sacred cards. Your journey unfolds with purpose, guided by cosmic wisdom and inner knowing. Trust in the process, embrace the transformation, and step boldly into your destined future.'
    }
  } finally {
    isLoading.value = false
  }
}

function newReading() {
  reading.value = null
  selectedCards.value = []
  question.value = ''
  shuffleCards()
}

function shareReading() {
  // Implementation for sharing functionality
  console.log('Share reading:', reading.value)
}
</script>

<style scoped>
.text-gradient {
  background: linear-gradient(135deg, #ffd700, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
</style>