import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { TarotCard, TarotReading, ReadingRequest } from '../types/tarot'
import { aiSystem } from '../services/ai'

export const useTarotStore = defineStore('tarot', () => {
  // State
  const cards = ref<TarotCard[]>([])
  const currentReading = ref<TarotReading | null>(null)
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
      console.log('🔮 Performing tarot reading with AI system...')
      
      // Use AI system for reading
      const result = await aiSystem.performReading({
        userId: request.userId,
        cards: request.cards || [],
        question: request.question,
        spreadId: request.spreadId
      })
      
      currentReading.value = result.finalReading
      return result.finalReading
      
    } catch (err) {
      error.value = 'Failed to perform reading'
      console.error('Reading error:', err)
      
      // Fallback reading for development
      const fallbackReading = generateFallbackReading(request)
      currentReading.value = fallbackReading
      return fallbackReading
      
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
        id: `${index + 1}`,
        name,
        arcana: 'major',
        number: index,
        keywords: {
          upright: [`keyword1-${index}`, `keyword2-${index}`],
          reversed: [`reversed1-${index}`, `reversed2-${index}`]
        },
        meanings: {
          upright: {
            general: `The meaning of ${name} represents...`,
            love: 'Love interpretation...',
            career: 'Career interpretation...',
            spiritual: 'Spiritual interpretation...'
          },
          reversed: {
            general: `When reversed, ${name} indicates...`,
            love: 'Reversed love interpretation...',
            career: 'Reversed career interpretation...',
            spiritual: 'Reversed spiritual interpretation...'
          }
        },
        image: `/assets/${String(index + 1).padStart(2, '0')}_${name.replace(/\s+/g, '_')}.png`,
        description: `Description of ${name}...`,
        element: index % 4 === 0 ? 'fire' : index % 4 === 1 ? 'water' : index % 4 === 2 ? 'air' : 'earth'
      })
    })

    // Minor Arcana
    suits.forEach((suit, suitIndex) => {
      ranks.forEach((rank, rankIndex) => {
        const cardNumber = 23 + (suitIndex * 14) + rankIndex
        cards.push({
          id: `${cardNumber}`,
          name: `${rank} of ${suit}`,
          arcana: 'minor',
          suit: suit.toLowerCase() as 'wands' | 'cups' | 'swords' | 'pentacles',
          number: rankIndex + 1,
          keywords: {
            upright: [`${suit.toLowerCase()}-${rank.toLowerCase()}`, 'growth'],
            reversed: [`blocked-${suit.toLowerCase()}`, 'stagnation']
          },
          meanings: {
            upright: {
              general: `The ${rank} of ${suit} represents...`,
              love: 'Love interpretation...',
              career: 'Career interpretation...',
              spiritual: 'Spiritual interpretation...'
            },
            reversed: {
              general: `When reversed, the ${rank} of ${suit} indicates...`,
              love: 'Reversed love interpretation...',
              career: 'Reversed career interpretation...',
              spiritual: 'Reversed spiritual interpretation...'
            }
          },
          image: `/assets/${String(cardNumber).padStart(2, '0')}_${rank}_of_${suit}.png`,
          description: `Description of ${rank} of ${suit}...`,
          element: suitIndex === 0 ? 'fire' : suitIndex === 1 ? 'water' : suitIndex === 2 ? 'air' : 'earth'
        })
      })
    })

    // Hidden Cards
    hiddenCards.forEach((name, index) => {
      cards.push({
        id: `${79 + index}`,
        name,
        arcana: 'hidden',
        number: index,
        keywords: {
          upright: ['mystery', 'hidden wisdom', 'divine guidance'],
          reversed: ['illusion', 'false guidance', 'confusion']
        },
        meanings: {
          upright: {
            general: `${name} reveals hidden truths and divine guidance...`,
            love: 'Hidden love interpretation...',
            career: 'Hidden career interpretation...',
            spiritual: 'Hidden spiritual interpretation...'
          },
          reversed: {
            general: `When reversed, ${name} suggests...`,
            love: 'Reversed hidden love interpretation...',
            career: 'Reversed hidden career interpretation...',
            spiritual: 'Reversed hidden spiritual interpretation...'
          }
        },
        image: `/assets/${String(79 + index).padStart(2, '0')}_${name.replace(/\s+/g, '_')}.png`,
        description: `Description of ${name}...`,
      })
    })

    return cards
  }

  function generateFallbackReading(request: ReadingRequest): TarotReading {
    const cardNames = request.cards?.map((c: any) => c.name).join(', ') || 'No cards'
    
    return {
      id: `reading-${Date.now()}`,
      userId: request.userId,
      spreadId: request.spreadId,
      question: request.question,
      cards: request.cards || [],
      interpretation: `
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
      timestamp: new Date(),
      isPublic: false,
      tags: ['guidance', 'transformation', 'destiny']
    }
  }

  return {
    // State
    cards,
    currentReading,
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
    clearReading
  }
})