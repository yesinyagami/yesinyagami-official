<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8">
    <div class="container mx-auto px-4 max-w-4xl">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-3xl md:text-4xl font-bold text-white mb-4">
          🔮 Free Tarot Reading
        </h1>
        <p class="text-gray-300">
          Get your personalized AI-powered tarot reading in just 3 simple steps
        </p>
      </div>

      <!-- Steps Indicator -->
      <div class="flex justify-center mb-8">
        <div class="flex items-center space-x-4">
          <div class="flex items-center">
            <div class="w-8 h-8 bg-yellow-400 text-black rounded-full flex items-center justify-center font-bold text-sm">1</div>
            <span class="ml-2 text-white hidden sm:inline">Question</span>
          </div>
          <div class="w-8 h-1 bg-gray-600"></div>
          <div class="flex items-center">
            <div class="w-8 h-8 bg-gray-600 text-white rounded-full flex items-center justify-center font-bold text-sm">2</div>
            <span class="ml-2 text-gray-400 hidden sm:inline">Choose Tier</span>
          </div>
          <div class="w-8 h-1 bg-gray-600"></div>
          <div class="flex items-center">
            <div class="w-8 h-8 bg-gray-600 text-white rounded-full flex items-center justify-center font-bold text-sm">3</div>
            <span class="ml-2 text-gray-400 hidden sm:inline">Get Reading</span>
          </div>
        </div>
      </div>

      <!-- Step 1: Question -->
      <div v-if="currentStep === 1" class="step-container">
        <!-- Free Minutes Banner -->
        <div class="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/30 rounded-xl p-4 mb-6">
          <div class="text-center">
            <h3 class="text-green-400 font-bold text-lg mb-2">🎁 FREE 3 MINUTES!</h3>
            <p class="text-gray-300 text-sm">Experience our AI-powered readings with no cost to start</p>
          </div>
        </div>
        
        <div class="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 mb-6">
          <h2 class="text-xl font-bold text-white mb-4">💭 What's on your mind?</h2>
          <div class="grid md:grid-cols-3 gap-3 mb-4">
            <button @click="question = 'What does my love life hold for me?'" class="quick-question-btn">
              💕 Love & Romance
            </button>
            <button @click="question = 'What career opportunities are coming my way?'" class="quick-question-btn">
              💼 Career & Money
            </button>
            <button @click="question = 'What spiritual guidance do I need right now?'" class="quick-question-btn">
              🌟 Spiritual Path
            </button>
          </div>
          <textarea
            v-model="question"
            placeholder="Or type your specific question here... (optional)"
            class="w-full h-32 bg-white/5 border border-white/30 rounded-lg p-4 text-white placeholder-gray-400 focus:border-yellow-400 focus:outline-none resize-none"
          ></textarea>
          <p class="text-gray-400 text-sm mt-2">
            💡 Leave blank for a general life reading
          </p>
        </div>
        
        <div class="text-center">
          <button @click="nextStep" class="cta-button-enhanced">
            <span class="button-glow"></span>
            <span class="relative z-10">🔮 Continue to Reading Options →</span>
          </button>
          <p class="text-yellow-400 text-sm mt-2 font-semibold">No payment required for this step!</p>
        </div>
      </div>

      <!-- Step 2: Choose Tier -->
      <div v-if="currentStep === 2" class="step-container">
        <div class="text-center mb-6">
          <h2 class="text-xl font-bold text-white mb-2">💎 Choose Your Reading Level</h2>
          <p class="text-gray-300">Select the depth of insight you want to receive</p>
        </div>

        <div class="grid gap-4 mb-6">
          <div 
            v-for="plan in pricingPlans" 
            :key="plan.id"
            @click="selectedTier = plan.id"
            :class="[
              'tier-card cursor-pointer',
              selectedTier === plan.id ? 'selected' : ''
            ]"
          >
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <h3 class="font-bold text-lg text-white">{{ plan.name }}</h3>
                <p class="text-yellow-400 font-semibold">${{ plan.minPrice }} - ${{ plan.maxPrice }}</p>
                <p class="text-gray-300 text-sm">{{ plan.cardCount }} cards • {{ plan.aiOrchestration }} AI oracle{{ plan.aiOrchestration > 1 ? 's' : '' }}</p>
              </div>
              <div class="text-2xl">
                {{ selectedTier === plan.id ? '✅' : '⚪' }}
              </div>
            </div>
          </div>
        </div>

        <div class="text-center space-y-4">
          <button @click="nextStep" :disabled="!selectedTier" class="cta-button-enhanced">
            <span class="button-glow"></span>
            <span class="relative z-10">✨ Get My Reading - ${{ getSelectedPlanPrice() }} ✨</span>
          </button>
          <p class="text-green-400 text-sm font-semibold">🔒 Secure Payment • Instant Access • No Refunds</p>
          <button @click="prevStep" class="back-button">
            ← Back
          </button>
        </div>
      </div>

      <!-- Step 3: Get Reading -->
      <div v-if="currentStep === 3" class="step-container">
        <div v-if="!reading" class="text-center">
          <div class="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-8 mb-6">
            <div class="text-6xl mb-4">🔮</div>
            <h2 class="text-xl font-bold text-white mb-4">Ready for Your Reading?</h2>
            <p class="text-gray-300 mb-2"><strong>Question:</strong> {{ question || 'General life guidance' }}</p>
            <p class="text-gray-300 mb-6"><strong>Tier:</strong> {{ selectedTierName }}</p>
            
            <button 
              @click="performReading" 
              :disabled="loading" 
              class="cta-button"
            >
              <span v-if="loading" class="flex items-center justify-center">
                <div class="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                Consulting the Divine...
              </span>
              <span v-else>
                ✨ Get My Reading Now
              </span>
            </button>
          </div>
          
          <button @click="prevStep" class="back-button">
            ← Back to choose tier
          </button>
        </div>

        <!-- Reading Result -->
        <div v-if="reading" class="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
          <div class="text-center mb-6">
            <h2 class="text-2xl font-bold text-yellow-400 mb-2">✨ Your Divine Reading</h2>
            <p class="text-gray-300">{{ selectedTierName }} • {{ question || 'General guidance' }}</p>
          </div>

          <!-- Cards Display -->
          <div class="grid grid-cols-3 gap-4 mb-6">
            <div v-for="card in reading.cards" :key="card.id" class="text-center">
              <div class="bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg p-4 mb-2 h-32 flex items-center justify-center">
                <div class="text-white text-center">
                  <div class="text-2xl mb-1">🃏</div>
                  <div class="text-xs font-semibold">{{ card.name }}</div>
                  <div class="text-xs opacity-75">{{ card.upright ? 'Upright' : 'Reversed' }}</div>
                </div>
              </div>
              <p class="text-xs text-gray-400">Position {{ card.position }}</p>
            </div>
          </div>

          <!-- Reading Text -->
          <div class="bg-black/30 rounded-lg p-6 mb-6">
            <div class="text-gray-200 whitespace-pre-line leading-relaxed">
              {{ reading.aiResponse }}
            </div>
          </div>

          <!-- Actions -->
          <div class="text-center space-y-4">
            <div class="text-sm text-gray-400">
              ⚠️ This was a free sample reading. For detailed interpretations, spiritual guidance, and premium features, upgrade to a paid tier.
            </div>
            <div class="flex flex-col sm:flex-row gap-3 justify-center">
              <button @click="newReading" class="cta-button">
                🔮 New Reading
              </button>
              <router-link to="/" class="back-button inline-block text-center">
                🏠 Back to Home
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useTarotStore } from '../stores/tarot'
import { useAuthStore } from '../stores/auth'

const tarotStore = useTarotStore()
const authStore = useAuthStore()

const currentStep = ref(1)
const question = ref('')
const selectedTier = ref('')
const loading = ref(false)
const reading = ref(null)

const pricingPlans = ref([
  { id: 'quick_insight', name: 'Quick Insight', minPrice: 10, maxPrice: 25, cardCount: 3, aiOrchestration: 1 },
  { id: 'professional', name: 'Professional', minPrice: 30, maxPrice: 75, cardCount: 5, aiOrchestration: 2 },
  { id: 'premium', name: 'Premium', minPrice: 80, maxPrice: 150, cardCount: 7, aiOrchestration: 3 },
  { id: 'vip', name: 'VIP Experience', minPrice: 200, maxPrice: 500, cardCount: 10, aiOrchestration: 4 },
  { id: 'ultra', name: 'Ultra Divine', minPrice: 1000, maxPrice: 10000, cardCount: 15, aiOrchestration: 4 }
])

const selectedTierName = computed(() => {
  const tier = pricingPlans.value.find(p => p.id === selectedTier.value)
  return tier ? tier.name : ''
})

onMounted(async () => {
  await tarotStore.fetchPricing()
  if (tarotStore.pricingPlans.length > 0) {
    pricingPlans.value = tarotStore.pricingPlans
  }
})

function getSelectedPlanPrice() {
  const tier = pricingPlans.value.find(p => p.id === selectedTier.value)
  return tier ? `${tier.minPrice}-${tier.maxPrice}` : '10-25'
}

function nextStep() {
  if (currentStep.value < 3) {
    currentStep.value++
    
    // Update steps indicator
    const stepElements = document.querySelectorAll('.w-8.h-8')
    if (stepElements[currentStep.value - 1]) {
      stepElements[currentStep.value - 1].classList.remove('bg-gray-600')
      stepElements[currentStep.value - 1].classList.add('bg-yellow-400', 'text-black')
    }
    
    // Track conversion funnel
    if (currentStep.value === 3) {
      // User reached payment step - high intent
      if (window.gtag) {
        window.gtag('event', 'begin_checkout', {
          currency: 'USD',
          value: pricingPlans.value.find(p => p.id === selectedTier.value)?.minPrice || 10
        })
      }
    }
  }
}

function prevStep() {
  if (currentStep.value > 1) {
    currentStep.value--
    
    // Update steps indicator
    const stepElements = document.querySelectorAll('.w-8.h-8')
    if (stepElements[currentStep.value]) {
      stepElements[currentStep.value].classList.remove('bg-yellow-400', 'text-black')
      stepElements[currentStep.value].classList.add('bg-gray-600', 'text-white')
    }
  }
}

async function performReading() {
  loading.value = true
  
  try {
    // For demo, we'll make a simple API call or show a fallback
    const response = await authStore.api.post('/readings/create', {
      question: question.value || 'What guidance do I need for my life path?',
      tier: selectedTier.value || 'quick_insight'
    })
    
    reading.value = response.data.reading
  } catch (error) {
    console.error('Reading failed:', error)
    // Fallback reading for demo
    const tier = pricingPlans.value.find(p => p.id === selectedTier.value)
    reading.value = {
      cards: Array.from({ length: tier?.cardCount || 3 }, (_, i) => ({
        id: i + 1,
        name: ['The Fool', 'The Magician', 'The High Priestess', 'The Empress', 'The Emperor'][i] || 'Mystery Card',
        upright: Math.random() > 0.5,
        position: i + 1
      })),
      aiResponse: `🌙 **NIGHT GOD TAROT READING** 🌙

**Your Question:** ${question.value || 'General life guidance'}

**Divine Message:**
The universe has aligned these mystical symbols to guide your path. Through our AI orchestration system, we channel ancient wisdom with modern intelligence.

**Interpretation:**
The cards reveal a journey of growth and transformation ahead. Your current path is supported by divine forces, and important changes are coming that will lead to greater fulfillment.

**Guidance:**
Trust in the process and remain open to new opportunities. The universe is preparing you for something greater.

*This is a sample reading. Upgrade for detailed interpretations and spiritual guidance.*`
    }
  } finally {
    loading.value = false
  }
}

function newReading() {
  currentStep.value = 1
  question.value = ''
  selectedTier.value = ''
  reading.value = null
  
  // Reset steps indicator
  const stepElements = document.querySelectorAll('.w-8.h-8')
  stepElements.forEach((el, index) => {
    if (index === 0) {
      el.classList.add('bg-yellow-400', 'text-black')
      el.classList.remove('bg-gray-600', 'text-white')
    } else {
      el.classList.remove('bg-yellow-400', 'text-black')
      el.classList.add('bg-gray-600', 'text-white')
    }
  })
}
</script>

<style scoped>
.step-container {
  max-width: 600px;
  margin: 0 auto;
}

.tier-card {
  @apply bg-white/5 border border-white/20 rounded-lg p-4 transition-all duration-300 hover:bg-white/10 hover:border-yellow-400/50 transform hover:scale-105;
}

.tier-card.selected {
  @apply border-yellow-400 bg-gradient-to-r from-yellow-400/20 to-orange-400/20;
  box-shadow: 0 0 30px rgba(255, 193, 7, 0.3);
  animation: tier-glow 2s ease-in-out infinite;
}

@keyframes tier-glow {
  0%, 100% {
    box-shadow: 0 0 30px rgba(255, 193, 7, 0.3);
  }
  50% {
    box-shadow: 0 0 40px rgba(255, 193, 7, 0.6);
  }
}

.cta-button {
  @apply px-8 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold rounded-lg hover:from-yellow-300 hover:to-yellow-400 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed;
}

.cta-button-enhanced {
  @apply relative px-10 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold text-lg rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed transform;
  box-shadow: 0 10px 30px rgba(34, 197, 94, 0.3);
}

.cta-button-enhanced:hover {
  box-shadow: 0 15px 40px rgba(34, 197, 94, 0.5);
}

.button-glow {
  @apply absolute inset-0 bg-gradient-to-r from-white/20 to-transparent;
  animation: button-shine 2s ease-in-out infinite;
}

@keyframes button-shine {
  0% {
    transform: translateX(-100%);
  }
  50% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.quick-question-btn {
  @apply bg-gradient-to-r from-purple-500/30 to-pink-500/30 border border-purple-400/50 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:from-purple-500/50 hover:to-pink-500/50 transition-all duration-300 transform hover:scale-105;
}

.back-button {
  @apply px-6 py-2 border border-gray-500 text-gray-300 rounded-lg hover:bg-gray-500 hover:text-white transition-colors duration-300;
}
</style>