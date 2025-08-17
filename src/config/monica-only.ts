/**
 * Monica-Only Configuration
 * Configure the system to use only Monica AI (unlimited usage)
 * Perfect for testing and production without paid API costs
 */

import { envManager } from './env'

export class MonicaOnlyConfig {
  private static instance: MonicaOnlyConfig

  static getInstance(): MonicaOnlyConfig {
    if (!MonicaOnlyConfig.instance) {
      MonicaOnlyConfig.instance = new MonicaOnlyConfig()
    }
    return MonicaOnlyConfig.instance
  }

  /**
   * Configure system for Monica-only mode
   */
  enableMonicaOnlyMode(): void {
    console.log('🤖 Enabling Monica-Only Mode...')
    
    // Override environment variables to use Monica for all services
    process.env.MONICA_ONLY_MODE = 'true'
    process.env.OPENAI_API_KEY = '' // Disable ChatGPT
    process.env.GOOGLE_API_KEY = '' // Disable Gemini
    process.env.PERPLEXITY_API_KEY = '' // Disable Perplexity
    
    // Ensure Monica is configured
    if (!process.env.MONICA_API_KEY) {
      console.warn('⚠️ MONICA_API_KEY not set! Please configure Monica API key.')
    }

    console.log('✅ Monica-Only Mode enabled')
    console.log('📊 System will use Monica AI for all operations:')
    console.log('   • Collective Consciousness Search → Monica')
    console.log('   • Personal Psychological Analysis → Monica (Primary)')
    console.log('   • Wisdom Integration → Monica')
    console.log('   • Poetic Sublimation → Monica')
  }

  /**
   * Check if Monica-only mode is enabled
   */
  isMonicaOnlyMode(): boolean {
    return process.env.MONICA_ONLY_MODE === 'true'
  }

  /**
   * Get service routing configuration for Monica-only mode
   */
  getServiceRouting(): Record<string, string> {
    if (this.isMonicaOnlyMode()) {
      return {
        'collective-consciousness': 'monica',
        'personal-analysis': 'monica',
        'wisdom-integration': 'monica',
        'poetic-sublimation': 'monica'
      }
    }

    return {
      'collective-consciousness': 'perplexity',
      'personal-analysis': 'monica',
      'wisdom-integration': 'gemini',
      'poetic-sublimation': 'chatgpt'
    }
  }

  /**
   * Get Monica rate limiting for optimal usage
   */
  getMonicaRateLimiting(): any {
    return {
      maxRequestsPerMinute: 60,
      maxConcurrentRequests: 5,
      retryDelay: 1000,
      backoffMultiplier: 2,
      maxRetries: 3
    }
  }
}

export default MonicaOnlyConfig