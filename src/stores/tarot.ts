import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { TarotCard, TarotReading, ReadingRequest } from '../types/tarot'
import { useAuthStore } from './auth'

export const useTarotStore = defineStore('tarot', () => {
  const authStore = useAuthStore()
  
  // State
  const cards = ref<TarotCard[]>([])
  const currentReading = ref<TarotReading | null>(null)
  const readings = ref([])
  const pricingPlans = ref([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const majorArcana = computed(() => 
    cards.value.filter(card => card.arcana === 'major')
  )
  
  const minorArcana = computed(() => 
    cards.value.filter(card => card.arcana === 'minor')
  )
  
  const hiddenCards = computed(() => 
    cards.value.filter(card => card.arcana === 'hidden')
  )

  // Actions
  async function loadCards() {
    isLoading.value = true
    error.value = null
    
    try {
      // Load tarot cards from data
      const { tarotCards } = await import('../data/cards')
      cards.value = tarotCards
      console.log(`🃏 Loaded ${cards.value.length} tarot cards`)
    } catch (err) {
      error.value = 'Failed to load tarot cards'
      console.error('Error loading cards:', err)
      
      // Fallback cards for demo
      cards.value = generateFallbackCards()
    } finally {
      isLoading.value = false
    }
  }

  async function performReading(request: ReadingRequest): Promise<TarotReading> {
    isLoading.value = true
    error.value = null
    
    try {
      console.log('🔮 Performing tarot reading via API...')
      
      const response = await authStore.api.post('/readings/create', {
        question: request.question,
        tier: request.user.preferences?.tier || 'quick_insight',
        customAmount: request.user.preferences?.customAmount
      })
      
      currentReading.value = response.data.reading
      return response.data.reading
      
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Failed to perform reading'
      console.error('Reading error:', err)
      
      // Fallback reading for development
      const fallbackReading = generateFallbackReading(request)
      currentReading.value = fallbackReading
      return fallbackReading
      
    } finally {
      isLoading.value = false
    }
  }

  async function fetchPricing() {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await authStore.api.get('/readings/pricing')
      pricingPlans.value = response.data.plans
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Failed to fetch pricing'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function fetchReadingHistory(page = 1, limit = 10) {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await authStore.api.get('/readings/history', {
        params: { page, limit }
      })
      readings.value = response.data.readings
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Failed to fetch reading history'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function createPaymentIntent(paymentData: {
    readingId: string
    amount: number
    currency?: string
  }) {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await authStore.api.post('/payments/create-payment-intent', paymentData)
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Failed to create payment intent'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  function shuffleCards(): TarotCard[] {
    const shuffled = [...cards.value]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  function getRandomCards(count: number): TarotCard[] {
    const shuffled = shuffleCards()
    return shuffled.slice(0, count)
  }

  function clearReading() {
    currentReading.value = null
    error.value = null
  }

  // Helper functions
  function generateFallbackCards(): TarotCard[] {
    const majorArcanaNames = [
      'The Fool', 'The Magician', 'The High Priestess', 'The Empress', 'The Emperor',
      'The Hierophant', 'The Lovers', 'The Chariot', 'Strength', 'The Hermit',
      'Wheel of Fortune', 'Justice', 'The Hanged Man', 'Death', 'Temperance',
      'The Devil', 'The Tower', 'The Star', 'The Moon', 'The Sun',
      'Judgement', 'The World'
    ]

    const suits = ['Wands', 'Cups', 'Swords', 'Pentacles']
    const ranks = ['Ace', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Page', 'Knight', 'Queen', 'King']

    const hiddenCards = [
      'The Hidden Oracle', 'The Shadow Guide', 'The Light Bearer', 'The Dream Walker',
      'The Soul Mirror', 'The Time Keeper', 'The Fate Weaver', 'The Spirit Guardian',
      'The Mystic Vision', 'The Sacred Journey', 'The Inner Truth', 'The Cosmic Balance',
      'The Divine Messenger', 'The Eternal Flame', 'The Wisdom Keeper', 'The Heart\'s Desire'
    ]

    const cards: TarotCard[] = []

    // Major Arcana
    majorArcanaNames.forEach((name, index) => {
      cards.push({
        id: index + 1,
        name,
        arcana: 'major',
        suit: null,
        rank: null,
        number: index,
        keywords: [`keyword1-${index}`, `keyword2-${index}`],
        meaning: `The meaning of ${name} represents...`,
        reversedMeaning: `When reversed, ${name} indicates...`,
        imageUrl: `/assets/${String(index + 1).padStart(2, '0')}_${name.replace(/\s+/g, '_')}.png`,
        element: index % 4 === 0 ? 'fire' : index % 4 === 1 ? 'water' : index % 4 === 2 ? 'air' : 'earth',
        planet: 'Mars',
        zodiac: 'Aries'
      })
    })

    // Minor Arcana
    suits.forEach((suit, suitIndex) => {
      ranks.forEach((rank, rankIndex) => {
        const cardNumber = 23 + (suitIndex * 14) + rankIndex
        cards.push({
          id: cardNumber,
          name: `${rank} of ${suit}`,
          arcana: 'minor',
          suit: suit.toLowerCase() as any,
          rank: rank.toLowerCase() as any,
          number: rankIndex + 1,
          keywords: [`${suit.toLowerCase()}-${rank.toLowerCase()}`, 'growth'],
          meaning: `The ${rank} of ${suit} represents...`,
          reversedMeaning: `When reversed, the ${rank} of ${suit} indicates...`,
          imageUrl: `/assets/${String(cardNumber).padStart(2, '0')}_${rank}_of_${suit}.png`,
          element: suitIndex === 0 ? 'fire' : suitIndex === 1 ? 'water' : suitIndex === 2 ? 'air' : 'earth',
          planet: 'Mercury',
          zodiac: 'Gemini'
        })
      })
    })

    // Hidden Cards
    hiddenCards.forEach((name, index) => {
      cards.push({
        id: 79 + index,
        name,
        arcana: 'hidden',
        suit: null,
        rank: null,
        number: index,
        keywords: ['mystery', 'hidden wisdom', 'divine guidance'],
        meaning: `${name} reveals hidden truths and divine guidance...`,
        reversedMeaning: `When reversed, ${name} suggests...`,
        imageUrl: `/assets/${String(79 + index).padStart(2, '0')}_${name.replace(/\s+/g, '_')}.png`,
        element: 'spirit',
        planet: 'Neptune',
        zodiac: 'Pisces'
      })
    })

    return cards
  }

  function generateFallbackReading(request: ReadingRequest): TarotReading {
    const cardNames = request.cards.map(c => c.name).join(', ')
    
    return {
      id: `reading-${Date.now()}`,
      title: '✨ Divine Guidance Revealed',
      mainText: `
        <p>The cosmic forces have aligned to bring you this sacred message through the cards: <strong>${cardNames}</strong>.</p>
        
        <p>Your question about "${request.question}" has been heard by the universe, and the divine response flows through these ancient symbols of wisdom.</p>
        
        <p>The path ahead requires courage, wisdom, and trust in your inner knowing. Each card speaks to a different aspect of your journey:</p>
        
        <ul>
          <li><strong>Past/Foundation:</strong> The foundations you've built serve you well</li>
          <li><strong>Present/Challenge:</strong> Current circumstances offer growth opportunities</li>
          <li><strong>Future/Outcome:</strong> Success awaits those who persevere with wisdom</li>
        </ul>
        
        <p>Trust in the process, embrace the transformation, and step boldly into your destined future.</p>
      `,
      cards: request.cards,
      timestamp: new Date(),
      confidence: 0.95,
      tags: ['guidance', 'transformation', 'destiny'],
      collectiveWisdom: 'The universe speaks through these cards, revealing patterns that connect your current situation to the greater cosmic flow.',
      personalAnalysis: 'Your personal energy signature resonates with themes of growth, challenge, and ultimate triumph.',
      wisdomIntegration: 'By integrating the lessons from your past with present awareness, you create a foundation for manifesting your highest potential.',
      poeticSublimation: 'Like stars that shine brightest in the darkest night, your soul\'s light emerges most brilliantly through life\'s challenges.'
    }
  }

  return {
    // State
    cards,
    currentReading,
    readings,
    pricingPlans,
    isLoading,
    error,
    
    // Getters
    majorArcana,
    minorArcana,
    hiddenCards,
    
    // Actions
    loadCards,
    performReading,
    shuffleCards,
    getRandomCards,
    clearReading,
    fetchPricing,
    fetchReadingHistory,
    createPaymentIntent
  }
})