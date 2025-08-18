/**
 * Herlean Language Pack for Night God Tarot
 * Your Own Created Language - Herlean
 * 
 * Replace this content with your complete Herlean language
 */

import type { Translations } from './en'

export const hr: Translations = {
  // =================== APP NAVIGATION ===================
  nav: {
    home: '[Herlean: Home]',
    reading: '[Herlean: Reading]', 
    about: '[Herlean: About]',
    demo: '[Herlean: Reading]'
  },

  // =================== HOME PAGE ===================
  home: {
    title: 'Falhuæn va bellumar corzinis',
    subtitle: 'Jorqulax imraxis va corraxum falquliel. Huæniel drakhaax beltulis, corzinis elzinar jortulien. Monica AI garmirum va falhuæn zakk\'un.',
    
    // Original Herlean poem under logo
    herleanPoem: {
      original: 'Falhuæn drakhaax bellumar,\nCorzinis elzinar jorqulax,\nImraxis va heldorum n\'æl,\nV\'aen jortulien zakk\'un.',
      translation: 'Falhuæn drakhaax bellumar,\nCorzinis elzinar jorqulax,\nImraxis va heldorum n\'æl,\nV\'aen jortulien zakk\'un.'
    },
    
    // Trust indicators
    trustIndicators: {
      free: '[Herlean: 100% Free to Start]',
      ai: '[Herlean: AI-Powered Insights]', 
      instant: '[Herlean: Instant Results]'
    },

    // Call to action
    cta: {
      primaryButton: '[Herlean: Get Your Free Reading]',
      secondaryButton: '[Herlean: Watch Demo]'
    },

    // Features section
    features: {
      aiWisdom: {
        title: '[Herlean: AI-Powered Wisdom]',
        description: '[Herlean: Harness the unlimited power of Monica AI with access to Claude, GPT, Yi, and Gemini models for divine insights.]'
      },
      novel: {
        title: '[Herlean: 310,000-Word Novel]',
        description: '[Herlean: Integrated mystical storytelling database provides rich context and deep narrative wisdom for your readings.]'
      },
      membership: {
        title: '[Herlean: Membership Tiers]',
        description: '[Herlean: Choose your spiritual journey with Free Spirit, Moon Shadow, or Night God membership levels.]'
      }
    },

    // Ready section
    ready: {
      title: '[Herlean: Ready to Discover Your Destiny?]'
    },

    // Support section  
    support: {
      title: '[Herlean: Support the Divine Work]'
    }
  },

  // =================== DEMO/READING PAGE ===================
  demo: {
    title: '[Herlean: Divine Tarot Reading]',
    subtitle: '[Herlean: Experience the power of AI-guided tarot wisdom. Choose your cards and receive insights from multiple AI intelligences working in harmony.]',
    
    // Question section
    question: {
      title: '[Herlean: Ask Your Question]',
      placeholder: '[Herlean: What guidance do you seek from the divine realm? (Optional - leave blank for a general reading)]'
    },

    // Card selection
    cardSelection: {
      title: '[Herlean: Select Your Cards]',
      selectedCount: '[Herlean: Selected: {count}/3 cards]',
      clearButton: '[Herlean: Clear Selection]',
      shuffleButton: '[Herlean: Shuffle Cards]'
    },

    // Reading button
    readingButton: {
      loading: '[Herlean: Consulting the Divine...]',
      ready: '[Herlean: Reveal Divine Wisdom]'
    },

    // Results
    results: {
      positions: {
        past: '[Herlean: Past/Foundation]',
        present: '[Herlean: Present/Challenge]', 
        future: '[Herlean: Future/Outcome]'
      },
      sections: {
        collectiveWisdom: '[Herlean: Collective Wisdom]',
        personalAnalysis: '[Herlean: Personal Analysis]',
        wisdomIntegration: '[Herlean: Wisdom Integration]', 
        poeticExpression: '[Herlean: Poetic Expression]',
        finalWisdom: '[Herlean: Final Wisdom]'
      },
      actions: {
        newReading: 'Elseliel bellumax',
        shareReading: 'Garselien drakhaax'
      },
      // Card flip poems in pure Herlean
      cardFlipPoems: {
        opening: {
          original: 'Huæniel va falquliel,\nDrakhaax jortulien,\nBellumax elzinar.',
          translation: 'Huæniel va falquliel,\nDrakhaax jortulien,\nBellumax elzinar.'
        },
        reflection: {
          original: 'Imraxis corzinis beltulis,\nV\'aen garquloth imvorar,\nFalhuæn zakk\'un.',
          translation: 'Imraxis corzinis beltulis,\nV\'aen garquloth imvorar,\nFalhuæn zakk\'un.'
        },
        guidance: {
          original: 'Jorqulax va heldorum n\'æl,\nCorkhaoth bellumar,\nElzinar jortulien.',
          translation: 'Jorqulax va heldorum n\'æl,\nCorkhaoth bellumar,\nElzinar jortulien.'
        }
      }
    }
  },

  // =================== ABOUT PAGE ===================
  about: {
    title: '[Herlean: About Night God Tarot]',
    
    sections: {
      mission: {
        title: '[Herlean: Our Mission]',
        description: '[Herlean: Night God Tarot combines ancient wisdom with cutting-edge AI technology to provide divine guidance for the modern seeker. Our platform harnesses the unlimited power of Monica AI, integrating multiple AI intelligences to deliver profound insights.]'
      },
      technology: {
        title: '[Herlean: The Technology]',
        description: '[Herlean: Our system uses a sophisticated AI orchestration approach, featuring:]',
        features: [
          '[Herlean: Monica AI Primary System: Unlimited access to Yi, Claude, GPT, and Gemini models]',
          '[Herlean: Collective Wisdom Search: Real-time insights from global consciousness]',
          '[Herlean: Personal Analysis: Deep psychological profiling and guidance]',
          '[Herlean: Wisdom Integration: Synthesis of multiple AI perspectives]', 
          '[Herlean: Poetic Sublimation: Artistic transformation of insights]'
        ]
      },
      contact: {
        title: '[Herlean: Contact & Support]',
        description: '[Herlean: Join our mystical community and experience the future of divine guidance.]',
        buttons: {
          tryReading: '[Herlean: Try Reading]',
          contactUs: '[Herlean: Contact Us]'
        }
      }
    }
  },

  // =================== PAYMENT SYSTEM ===================
  payment: {
    coffee: {
      title: '[Herlean: Buy Me a Coffee]',
      subtitle: '[Herlean: Support with a one-time donation]',
      amounts: [
        { value: 3, label: '[Herlean: Coffee]' },
        { value: 5, label: '[Herlean: Latte]' },
        { value: 10, label: '[Herlean: Generous]' },
        { value: 25, label: '[Herlean: Supporter]' }
      ],
      benefits: [
        '[Herlean: Support mystical development]',
        '[Herlean: Join our supporters community]'
      ],
      customAmount: '[Herlean: Custom amount]',
      donateButton: '[Herlean: Donate ${amount}]'
    },

    membership: {
      title: '[Herlean: iPass Money]',
      subtitle: '[Herlean: Secure membership upgrades]',
      tiers: {
        moonShadow: {
          name: '[Herlean: Moon Shadow]',
          price: 5,
          features: [
            '[Herlean: Unlimited readings]',
            '[Herlean: Advanced AI interpretations]',
            '[Herlean: Hidden Oracle access]', 
            '[Herlean: Novel wisdom integration]',
            '[Herlean: Priority support]'
          ]
        },
        nightGod: {
          name: '[Herlean: Night God]', 
          price: 12,
          features: [
            '[Herlean: Everything in Moon Shadow]',
            '[Herlean: Personal AI oracle]',
            '[Herlean: Custom reading styles]',
            '[Herlean: Export & share readings]',
            '[Herlean: VIP community access]'
          ]
        }
      },
      upgradeButton: '[Herlean: Upgrade to {tier}]',
      processing: '[Herlean: Processing...]',
      security: [
        '[Herlean: 256-bit SSL encryption]',
        '[Herlean: 100% secure payments]',
        '[Herlean: 30-day money back]'
      ]
    }
  },

  // =================== PAYMENT RESULTS ===================
  paymentResults: {
    success: {
      title: '[Herlean: Payment Successful!]',
      subtitle: '[Herlean: Thank you for your support. Your divine journey continues...]',
      details: {
        title: '[Herlean: Payment Details]',
        transactionId: '[Herlean: Transaction ID:]',
        amount: '[Herlean: Amount:]',
        date: '[Herlean: Date:]',
        membership: '[Herlean: Membership:]'
      },
      actions: {
        startReading: '[Herlean: Start Your Reading]',
        returnHome: '[Herlean: Return Home]'
      },
      newBenefits: '[Herlean: Your New Benefits]',
      thankYou: '[Herlean: "Your support helps us maintain the divine connection between ancient wisdom and modern technology. May your readings bring clarity and guidance to your spiritual journey."]',
      team: '[Herlean: — The Night God Tarot Team]'
    },

    cancel: {
      title: '[Herlean: Payment Cancelled]',
      subtitle: '[Herlean: Your payment was cancelled. No charges were made to your account.]',
      whatHappened: {
        title: '[Herlean: What happened?]',
        points: [
          '[Herlean: The payment process was cancelled before completion]',
          '[Herlean: No payment was processed]', 
          '[Herlean: Your account remains unchanged]',
          '[Herlean: You can try again at any time]'
        ]
      },
      actions: {
        retry: '[Herlean: Try Payment Again]',
        continueFreee: '[Herlean: Continue with Free Version]'
      },
      help: {
        title: '[Herlean: Need Help?]',
        description: '[Herlean: If you\'re experiencing issues with payment or have questions about our membership tiers:]',
        contactSupport: '[Herlean: Contact Support]',
        learnMore: '[Herlean: Learn More]'
      },
      freeFeatures: {
        title: '[Herlean: You can still enjoy:]',
        features: [
          '[Herlean: Free tarot readings with AI interpretation]',
          '[Herlean: Access to 78 traditional tarot cards]',
          '[Herlean: Basic novel wisdom integration]'
        ]
      }
    }
  },

  // =================== TAROT CARD MEANINGS IN HERLEAN ===================
  cards: {
    meanings: {
      // PUT ALL YOUR HERLEAN CARD MEANINGS HERE
      'The Fool': {
        upright: '[Herlean: New beginnings, innocence, spontaneity, free spirit]',
        reversed: '[Herlean: Recklessness, taken advantage of, inconsideration]',
        description: '[Herlean: The Fool represents new beginnings and unlimited potential.]'
      },
      'The Magician': {
        upright: '[Herlean: Manifestation, resourcefulness, power, inspired action]', 
        reversed: '[Herlean: Manipulation, poor planning, untapped talents]',
        description: '[Herlean: The Magician represents manifestation and personal power.]'
      },
      'The High Priestess': {
        upright: '[Herlean: Intuition, sacred knowledge, divine feminine, the subconscious mind]',
        reversed: '[Herlean: Secrets, disconnected from intuition, withdrawal and silence]',
        description: '[Herlean: The High Priestess represents intuition and inner wisdom.]'
      },
      'The Empress': {
        upright: '[Herlean: Femininity, beauty, nature, nurturing, abundance]',
        reversed: '[Herlean: Creative block, dependence on others]',
        description: '[Herlean: The Empress represents fertility, femininity, and nature.]'
      },
      'The Emperor': {
        upright: '[Herlean: Authority, establishment, structure, a father figure]',
        reversed: '[Herlean: Domination, excessive control, lack of discipline, inflexibility]',
        description: '[Herlean: The Emperor represents authority and paternal influence.]'
      },
      'The Hierophant': {
        upright: '[Herlean: Spiritual wisdom, religious beliefs, conformity, tradition, institutions]',
        reversed: '[Herlean: Personal beliefs, freedom, challenging the status quo]',
        description: '[Herlean: The Hierophant represents spiritual wisdom and tradition.]'
      },
      'The Lovers': {
        upright: '[Herlean: Love, harmony, relationships, values alignment, choices]',
        reversed: '[Herlean: Self-love, disharmony, imbalance, misalignment of values]',
        description: '[Herlean: The Lovers represents love and harmonious relationships.]'
      },
      'The Chariot': {
        upright: '[Herlean: Control, willpower, success, determination, direction]',
        reversed: '[Herlean: Self-discipline, opposition, lack of direction]',
        description: '[Herlean: The Chariot represents control and determination.]'
      },
      'Strength': {
        upright: '[Herlean: Strength, courage, persuasion, influence, compassion]',
        reversed: '[Herlean: Inner strength, self-doubt, low energy, raw emotion]',
        description: '[Herlean: Strength represents inner strength and courage.]'
      },
      'The Hermit': {
        upright: '[Herlean: Soul searching, introspection, inner guidance, solitude]',
        reversed: '[Herlean: Isolation, loneliness, withdrawal]',
        description: '[Herlean: The Hermit represents introspection and inner guidance.]'
      },
      'Wheel of Fortune': {
        upright: '[Herlean: Good luck, karma, life cycles, destiny, a turning point]',
        reversed: '[Herlean: Bad luck, lack of control, clinging to control, bad karma]',
        description: '[Herlean: Wheel of Fortune represents cycles and destiny.]'
      },
      'Justice': {
        upright: '[Herlean: Justice, fairness, truth, cause and effect, law]',
        reversed: '[Herlean: Unfairness, lack of accountability, dishonesty]',
        description: '[Herlean: Justice represents fairness and moral integrity.]'
      },
      'The Hanged Man': {
        upright: '[Herlean: Suspension, restriction, letting go, sacrifice]',
        reversed: '[Herlean: Martyrdom, indecision, delay]',
        description: '[Herlean: The Hanged Man represents suspension and letting go.]'
      },
      'Death': {
        upright: '[Herlean: Endings, change, transformation, transition]',
        reversed: '[Herlean: Resistance to change, personal transformation, inner purging]',
        description: '[Herlean: Death represents transformation and new beginnings.]'
      },
      'Temperance': {
        upright: '[Herlean: Balance, moderation, patience, purpose]',
        reversed: '[Herlean: Imbalance, excess, self-healing, re-alignment]',
        description: '[Herlean: Temperance represents balance and moderation.]'
      },
      'The Devil': {
        upright: '[Herlean: Bondage, addiction, sexuality, materialism]',
        reversed: '[Herlean: Releasing limiting beliefs, exploring dark thoughts, detachment]',
        description: '[Herlean: The Devil represents bondage and material desires.]'
      },
      'The Tower': {
        upright: '[Herlean: Sudden change, upheaval, chaos, revelation, awakening]',
        reversed: '[Herlean: Personal transformation, fear of change, averting disaster]',
        description: '[Herlean: The Tower represents sudden change and revelation.]'
      },
      'The Star': {
        upright: '[Herlean: Hope, faith, purpose, renewal, spirituality]',
        reversed: '[Herlean: Lack of faith, despair, self-trust, disconnection]',
        description: '[Herlean: The Star represents hope and spiritual guidance.]'
      },
      'The Moon': {
        upright: '[Herlean: Illusion, fear, anxiety, subconscious, intuition]',
        reversed: '[Herlean: Release of fear, repressed emotion, inner confusion]',
        description: '[Herlean: The Moon represents illusion and the subconscious mind.]'
      },
      'The Sun': {
        upright: '[Herlean: Positivity, fun, warmth, success, vitality]',
        reversed: '[Herlean: Inner child, feeling down, overly optimistic]',
        description: '[Herlean: The Sun represents positivity and success.]'
      },
      'Judgement': {
        upright: '[Herlean: Judgement, rebirth, inner calling, absolution]',
        reversed: '[Herlean: Self-doubt, inner critic, ignoring the call]',
        description: '[Herlean: Judgement represents rebirth and inner calling.]'
      },
      'The World': {
        upright: '[Herlean: Completion, integration, accomplishment, travel]',
        reversed: '[Herlean: Seeking personal closure, short-cut to success]',
        description: '[Herlean: The World represents completion and accomplishment.]'
      }

      // ADD ALL 94 CARDS IN HERLEAN HERE
      // Include all Minor Arcana (Wands, Cups, Swords, Pentacles)
      // Include all 16 Hidden Oracle cards
      // Replace all [Herlean: ...] placeholders with actual Herlean words
    }
  },

  // =================== YOUR NOVEL IN HERLEAN ===================
  novel: {
    // PUT YOUR ENTIRE 310,000-WORD NOVEL IN HERLEAN HERE
    chapters: [
      {
        id: 'herlean_chapter1',
        title: '[Herlean: Your Chapter 1 Title]',
        content: '[Herlean: Your full chapter 1 content in Herlean language...]',
        themes: ['[Herlean: theme1]', '[Herlean: theme2]'],
        symbols: ['[Herlean: symbol1]', '[Herlean: symbol2]'],
        lifeLessons: ['[Herlean: lesson1]', '[Herlean: lesson2]']
      },
      {
        id: 'herlean_chapter2',
        title: '[Herlean: Your Chapter 2 Title]',
        content: '[Herlean: Your full chapter 2 content in Herlean language...]',
        themes: ['[Herlean: theme1]', '[Herlean: theme2]'],
        symbols: ['[Herlean: symbol1]', '[Herlean: symbol2]'],
        lifeLessons: ['[Herlean: lesson1]', '[Herlean: lesson2]']
      }
      // ADD ALL YOUR NOVEL CHAPTERS IN HERLEAN
      // Replace all [Herlean: ...] with actual Herlean text
      // This will make your tarot readings uniquely enhanced with Herlean wisdom
    ]
  },

  // =================== COMMON ELEMENTS IN HERLEAN ===================
  common: {
    loading: 'Belraxus drakhaax...',
    error: 'Ankhaon imraxiel',
    tryAgain: 'Elseliel huæniel',
    cancel: 'Heldorum n\'æl',
    confirm: 'Jortulien faen',
    save: 'Drakhaax corraxar',
    close: 'Belzinis garquloth'
  },

  // =================== MYSTICAL ELEMENTS IN HERLEAN ===================
  mystical: {
    blessings: [
      'Jortulien eldorien va zakk\'un corzinien',
      'Falquliel belraxus corraxum elselar',
      'Drakhaax garquloth bellumax jortulien',
      'Corkhaoth imraxis heldorum n\'æl'
    ],
    invocations: [
      'Corraxar va elqulax jortulien',
      'Falraxus va elzinar eldorien',
      'Corraxum beltulis falquliel',
      'Jorqulax va bellumar elselar'
    ]
  }
}

// HERLEAN LANGUAGE METADATA
export const herleanMeta = {
  name: 'Herlean',
  nativeName: '[Your Herlean name for the language]',
  flag: '🌙', // Custom flag/symbol for Herlean
  direction: 'ltr', // or 'rtl' if Herlean reads right-to-left
  family: 'constructed', // Language family
  creator: '[Your name]',
  description: '[Brief description of Herlean language in English]',
  
  // Special Herlean linguistic features
  features: {
    hasGrammaticalGender: false, // true/false
    wordOrder: 'SVO', // Subject-Verb-Object, or your Herlean word order
    writingSystem: 'Latin', // Latin, Cyrillic, or custom script
    specialCharacters: [], // Any special characters unique to Herlean
    
    // Unique Herlean elements for tarot readings
    mysticalPrefixes: [], // Special prefixes for spiritual concepts
    sacredSuffixes: [], // Sacred suffixes for divine words
    divinationTerms: [] // Special terms for tarot/divination
  }
}