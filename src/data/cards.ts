import type { TarotCard } from '../types/tarot'

export const tarotCards: TarotCard[] = [
  // Major Arcana
  {
    id: 1,
    name: 'The Fool',
    arcana: 'major',
    suit: null,
    rank: null,
    number: 0,
    keywords: ['new beginnings', 'innocence', 'spontaneity', 'free spirit'],
    meaning: 'The Fool represents new beginnings, having faith in the future, being inexperienced, not knowing what to expect, having beginner\'s luck, improvisation and believing in the universe.',
    reversedMeaning: 'When reversed, The Fool can represent recklessness, taking foolish risks, being unprepared, having poor judgment, or being gullible.',
    imageUrl: '/assets/01_The_Fool.png',
    element: 'air',
    planet: 'Uranus',
    zodiac: 'Aquarius'
  },
  {
    id: 2,
    name: 'The Magician',
    arcana: 'major',
    suit: null,
    rank: null,
    number: 1,
    keywords: ['manifestation', 'resourcefulness', 'power', 'inspired action'],
    meaning: 'The Magician represents manifestation, resourcefulness, power, and inspired action. You have the tools and abilities to achieve your goals.',
    reversedMeaning: 'Reversed, The Magician can indicate manipulation, poor planning, or unused talents.',
    imageUrl: '/assets/02_The_Magician.png',
    element: 'air',
    planet: 'Mercury',
    zodiac: 'Gemini'
  },
  {
    id: 3,
    name: 'The High Priestess',
    arcana: 'major',
    suit: null,
    rank: null,
    number: 2,
    keywords: ['intuition', 'sacred knowledge', 'divine feminine', 'subconscious mind'],
    meaning: 'The High Priestess represents intuition, sacred knowledge, divine feminine, and the subconscious mind. Trust your inner voice.',
    reversedMeaning: 'Reversed, she can indicate blocked intuition, secrets, or withdrawal from the world.',
    imageUrl: '/assets/03_The_High_Priestess.png',
    element: 'water',
    planet: 'Moon',
    zodiac: 'Cancer'
  },
  // Add more major arcana cards...
  
  // Minor Arcana - Wands
  {
    id: 23,
    name: 'Ace of Wands',
    arcana: 'minor',
    suit: 'wands',
    rank: 'ace',
    number: 1,
    keywords: ['inspiration', 'new opportunities', 'growth', 'potential'],
    meaning: 'The Ace of Wands represents inspiration, new opportunities, and growth. A spark of creative energy is emerging.',
    reversedMeaning: 'Reversed, it can indicate lack of energy, delays, or missed opportunities.',
    imageUrl: '/assets/23_Ace_of_Wands.png',
    element: 'fire',
    planet: 'Mars',
    zodiac: 'Aries'
  },
  
  // Hidden Cards
  {
    id: 79,
    name: 'The Hidden Oracle',
    arcana: 'hidden',
    suit: null,
    rank: null,
    number: 0,
    keywords: ['hidden wisdom', 'divine secrets', 'mystical knowledge', 'inner sight'],
    meaning: 'The Hidden Oracle reveals secret wisdom and divine knowledge that exists beyond the veil of ordinary perception.',
    reversedMeaning: 'Reversed, it suggests hidden truths being revealed or the need to look deeper within.',
    imageUrl: '/assets/79_The_Hidden_Oracle.png',
    element: 'spirit',
    planet: 'Neptune',
    zodiac: 'Pisces'
  }
  // More cards would be added here...
]

// Generate remaining cards programmatically for demo
function generateAllCards(): TarotCard[] {
  const cards = [...tarotCards]
  
  // Generate remaining major arcana (4-22)
  const majorArcanaNames = [
    'The Empress', 'The Emperor', 'The Hierophant', 'The Lovers', 'The Chariot',
    'Strength', 'The Hermit', 'Wheel of Fortune', 'Justice', 'The Hanged Man',
    'Death', 'Temperance', 'The Devil', 'The Tower', 'The Star', 'The Moon',
    'The Sun', 'Judgement', 'The World'
  ]
  
  majorArcanaNames.forEach((name, index) => {
    if (!cards.find(c => c.name === name)) {
      cards.push({
        id: index + 4,
        name,
        arcana: 'major',
        suit: null,
        rank: null,
        number: index + 3,
        keywords: ['transformation', 'spiritual growth', 'life lesson'],
        meaning: `${name} represents important life themes and spiritual lessons.`,
        reversedMeaning: `When reversed, ${name} may indicate resistance to change or internal conflict.`,
        imageUrl: `/assets/${String(index + 4).padStart(2, '0')}_${name.replace(/\s+/g, '_')}.png`,
        element: index % 4 === 0 ? 'fire' : index % 4 === 1 ? 'water' : index % 4 === 2 ? 'air' : 'earth',
        planet: 'Jupiter',
        zodiac: 'Sagittarius'
      })
    }
  })
  
  // Generate minor arcana
  const suits = ['wands', 'cups', 'swords', 'pentacles']
  const ranks = ['ace', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'page', 'knight', 'queen', 'king']
  
  suits.forEach((suit, suitIndex) => {
    ranks.forEach((rank, rankIndex) => {
      const id = 23 + (suitIndex * 14) + rankIndex
      if (!cards.find(c => c.id === id)) {
        cards.push({
          id,
          name: `${rank.charAt(0).toUpperCase() + rank.slice(1)} of ${suit.charAt(0).toUpperCase() + suit.slice(1)}`,
          arcana: 'minor',
          suit: suit as any,
          rank: rank as any,
          number: rankIndex + 1,
          keywords: [`${suit}`, 'growth', 'manifestation'],
          meaning: `The ${rank} of ${suit} represents progression and development in the suit of ${suit}.`,
          reversedMeaning: `Reversed, it may indicate blockages or challenges in the area of ${suit}.`,
          imageUrl: `/assets/${String(id).padStart(2, '0')}_${rank.charAt(0).toUpperCase() + rank.slice(1)}_of_${suit.charAt(0).toUpperCase() + suit.slice(1)}.png`,
          element: suitIndex === 0 ? 'fire' : suitIndex === 1 ? 'water' : suitIndex === 2 ? 'air' : 'earth',
          planet: 'Mercury',
          zodiac: 'Gemini'
        })
      }
    })
  })
  
  // Generate hidden cards
  const hiddenCards = [
    'The Shadow Guide', 'The Light Bearer', 'The Dream Walker', 'The Soul Mirror',
    'The Time Keeper', 'The Fate Weaver', 'The Spirit Guardian', 'The Mystic Vision',
    'The Sacred Journey', 'The Inner Truth', 'The Cosmic Balance', 'The Divine Messenger',
    'The Eternal Flame', 'The Wisdom Keeper', 'The Heart\'s Desire'
  ]
  
  hiddenCards.forEach((name, index) => {
    const id = 80 + index
    if (!cards.find(c => c.id === id)) {
      cards.push({
        id,
        name,
        arcana: 'hidden',
        suit: null,
        rank: null,
        number: index + 1,
        keywords: ['mystery', 'hidden wisdom', 'divine guidance', 'spiritual insight'],
        meaning: `${name} reveals hidden truths and provides divine guidance from beyond the veil.`,
        reversedMeaning: `When reversed, ${name} suggests the need to trust in divine timing and inner knowing.`,
        imageUrl: `/assets/${String(id).padStart(2, '0')}_${name.replace(/\s+/g, '_')}.png`,
        element: 'spirit',
        planet: 'Neptune',
        zodiac: 'Pisces'
      })
    }
  })
  
  return cards
}

export const allTarotCards = generateAllCards()