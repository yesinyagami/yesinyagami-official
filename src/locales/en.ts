/**
 * English Language Pack for Night God Tarot
 * Replace this content with your own language and text
 */

export const en = {
  // =================== APP NAVIGATION ===================
  nav: {
    home: 'Home',
    reading: 'Reading', 
    about: 'About',
    demo: 'Reading'
  },

  // =================== HOME PAGE ===================
  home: {
    title: 'Unlock Your Divine Destiny',
    subtitle: 'Experience the most advanced AI-powered tarot readings that blend ancient wisdom with cutting-edge technology. Unlock the mysteries of your past, present, and future with unlimited Monica AI intelligence.',
    
    // Herlean poem under logo
    herleanPoem: {
      original: 'Falhuæn drakhaax bellumar,\nCorzinis elzinar jorqulax,\nImraxis va heldorum n\'æl,\nV\'aen jortulien zakk\'un.',
      translation: 'From memory springs destiny\'s light,\nPure souls wield ancient might,\nLove conquers the darkest night,\nTruth illuminates your sight.'
    },
    
    // Trust indicators
    trustIndicators: {
      free: '100% Free to Start',
      ai: 'AI-Powered Insights', 
      instant: 'Instant Results'
    },

    // Call to action
    cta: {
      primaryButton: 'Get Your Free Reading',
      secondaryButton: 'Watch Demo'
    },

    // Features section
    features: {
      aiWisdom: {
        title: 'AI-Powered Wisdom',
        description: 'Harness the unlimited power of Monica AI with access to Claude, GPT, Yi, and Gemini models for divine insights.'
      },
      novel: {
        title: '310,000-Word Novel',
        description: 'Integrated mystical storytelling database provides rich context and deep narrative wisdom for your readings.'
      },
      membership: {
        title: 'Membership Tiers',
        description: 'Choose your spiritual journey with Free Spirit, Moon Shadow, or Night God membership levels.'
      }
    },

    // Ready section
    ready: {
      title: 'Ready to Discover Your Destiny?'
    },

    // Support section  
    support: {
      title: 'Support the Divine Work'
    }
  },

  // =================== DEMO/READING PAGE ===================
  demo: {
    title: 'Divine Tarot Reading',
    subtitle: 'Experience the power of AI-guided tarot wisdom. Choose your cards and receive insights from multiple AI intelligences working in harmony.',
    
    // Question section
    question: {
      title: 'Ask Your Question',
      placeholder: 'What guidance do you seek from the divine realm? (Optional - leave blank for a general reading)'
    },

    // Card selection
    cardSelection: {
      title: 'Select Your Cards',
      selectedCount: 'Selected: {count}/3 cards',
      clearButton: 'Clear Selection',
      shuffleButton: 'Shuffle Cards'
    },

    // Reading button
    readingButton: {
      loading: 'Consulting the Divine...',
      ready: 'Reveal Divine Wisdom'
    },

    // Results
    results: {
      positions: {
        past: 'Past/Foundation',
        present: 'Present/Challenge', 
        future: 'Future/Outcome'
      },
      sections: {
        collectiveWisdom: 'Collective Wisdom',
        personalAnalysis: 'Personal Analysis',
        wisdomIntegration: 'Wisdom Integration', 
        poeticExpression: 'Poetic Expression',
        finalWisdom: 'Final Wisdom'
      },
      actions: {
        newReading: 'New Reading',
        shareReading: 'Share Reading'
      },
      // Card flip poems
      cardFlipPoems: {
        opening: {
          original: 'Huæniel va falquliel,\nDrakhaax jortulien,\nBellumax elzinar.',
          translation: 'Awakening brings wisdom,\nMemory shines with truth,\nDestiny pure unfolds.'
        },
        reflection: {
          original: 'Imraxis corzinis beltulis,\nV\'aen garquloth imvorar,\nFalhuæn zakk\'un.',
          translation: 'Love guides your sacred path,\nYour song awakens spirit,\nInsight finds you.'
        },
        guidance: {
          original: 'Jorqulax va heldorum n\'æl,\nCorkhaoth bellumar,\nElzinar jortulien.',
          translation: 'Power over darkness rises,\nHope destiny awakens,\nPurity shines eternal.'
        }
      }
    }
  },

  // =================== ABOUT PAGE ===================
  about: {
    title: 'About Night God Tarot',
    
    sections: {
      mission: {
        title: 'Our Mission',
        description: 'Night God Tarot combines ancient wisdom with cutting-edge AI technology to provide divine guidance for the modern seeker. Our platform harnesses the unlimited power of Monica AI, integrating multiple AI intelligences to deliver profound insights.'
      },
      technology: {
        title: 'The Technology',
        description: 'Our system uses a sophisticated AI orchestration approach, featuring:',
        features: [
          'Monica AI Primary System: Unlimited access to Yi, Claude, GPT, and Gemini models',
          'Collective Wisdom Search: Real-time insights from global consciousness',
          'Personal Analysis: Deep psychological profiling and guidance',
          'Wisdom Integration: Synthesis of multiple AI perspectives', 
          'Poetic Sublimation: Artistic transformation of insights'
        ]
      },
      contact: {
        title: 'Contact & Support',
        description: 'Join our mystical community and experience the future of divine guidance.',
        buttons: {
          tryReading: 'Try Reading',
          contactUs: 'Contact Us'
        }
      }
    }
  },

  // =================== PAYMENT SYSTEM ===================
  payment: {
    coffee: {
      title: 'Buy Me a Coffee',
      subtitle: 'Support with a one-time donation',
      amounts: [
        { value: 3, label: 'Coffee' },
        { value: 5, label: 'Latte' },
        { value: 10, label: 'Generous' },
        { value: 25, label: 'Supporter' }
      ],
      benefits: [
        'Support mystical development',
        'Join our supporters community'
      ],
      customAmount: 'Custom amount',
      donateButton: 'Donate ${amount}'
    },

    membership: {
      title: 'iPass Money',
      subtitle: 'Secure membership upgrades',
      tiers: {
        moonShadow: {
          name: 'Moon Shadow',
          price: 5,
          features: [
            'Unlimited readings',
            'Advanced AI interpretations',
            'Hidden Oracle access', 
            'Novel wisdom integration',
            'Priority support'
          ]
        },
        nightGod: {
          name: 'Night God', 
          price: 12,
          features: [
            'Everything in Moon Shadow',
            'Personal AI oracle',
            'Custom reading styles',
            'Export & share readings',
            'VIP community access'
          ]
        }
      },
      upgradeButton: 'Upgrade to {tier}',
      processing: 'Processing...',
      security: [
        '256-bit SSL encryption',
        '100% secure payments',
        '30-day money back'
      ]
    }
  },

  // =================== PAYMENT RESULTS ===================
  paymentResults: {
    success: {
      title: 'Payment Successful!',
      subtitle: 'Thank you for your support. Your divine journey continues...',
      details: {
        title: 'Payment Details',
        transactionId: 'Transaction ID:',
        amount: 'Amount:',
        date: 'Date:',
        membership: 'Membership:'
      },
      actions: {
        startReading: 'Start Your Reading',
        returnHome: 'Return Home'
      },
      newBenefits: 'Your New Benefits',
      thankYou: '"Your support helps us maintain the divine connection between ancient wisdom and modern technology. May your readings bring clarity and guidance to your spiritual journey."',
      team: '— The Night God Tarot Team'
    },

    cancel: {
      title: 'Payment Cancelled',
      subtitle: 'Your payment was cancelled. No charges were made to your account.',
      whatHappened: {
        title: 'What happened?',
        points: [
          'The payment process was cancelled before completion',
          'No payment was processed', 
          'Your account remains unchanged',
          'You can try again at any time'
        ]
      },
      actions: {
        retry: 'Try Payment Again',
        continueFreee: 'Continue with Free Version'
      },
      help: {
        title: 'Need Help?',
        description: 'If you\'re experiencing issues with payment or have questions about our membership tiers:',
        contactSupport: 'Contact Support',
        learnMore: 'Learn More'
      },
      freeFeatures: {
        title: 'You can still enjoy:',
        features: [
          'Free tarot readings with AI interpretation',
          'Access to 78 traditional tarot cards',
          'Basic novel wisdom integration'
        ]
      }
    }
  },

  // =================== TAROT CARD MEANINGS ===================
  cards: {
    // You can replace these with your own interpretations
    meanings: {
      // Major Arcana
      'The Fool': {
        upright: 'New beginnings, innocence, spontaneity, free spirit',
        reversed: 'Recklessness, taken advantage of, inconsideration',
        description: 'The Fool represents new beginnings and unlimited potential.'
      },
      'The Magician': {
        upright: 'Manifestation, resourcefulness, power, inspired action', 
        reversed: 'Manipulation, poor planning, untapped talents',
        description: 'The Magician represents manifestation and personal power.'
      },
      // Add all 94 cards here...
    }
  },

  // =================== NOVEL CONTENT ===================
  novel: {
    // This is where you put your 310,000-word novel content
    chapters: [
      {
        id: 'chapter1',
        title: 'Your Chapter 1 Title',
        content: 'Your full chapter 1 content goes here...',
        themes: ['theme1', 'theme2'],
        symbols: ['symbol1', 'symbol2'],
        lifeLessons: ['lesson1', 'lesson2']
      }
      // Add all your chapters...
    ]
  },

  // =================== COMMON ELEMENTS ===================
  common: {
    loading: 'Loading...',
    error: 'An error occurred',
    tryAgain: 'Try Again',
    cancel: 'Cancel',
    confirm: 'Confirm',
    save: 'Save',
    close: 'Close'
  },

  // =================== MYSTICAL ELEMENTS ===================
  mystical: {
    blessings: [
      'May the stars guide your path',
      'Wisdom flows through ancient channels',
      'The cards speak eternal truths',
      'Divine light illuminates all shadows'
    ],
    invocations: [
      'By moonlight and starfire',
      'Through realms seen and unseen',
      'With wisdom of ages past',
      'In harmony with cosmic forces'
    ]
  }
}

export type Translations = any