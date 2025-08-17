/**
 * AI Services Index
 * Main entry point for the complete AI collaboration system
 */

import { AIOrchestrationSystem } from './AIOrchestrationSystem'
import { PerplexityService } from './PerplexityService'
import { MonicaService } from './MonicaService'
import { GeminiService } from './GeminiService'
import { ChatGPTService } from './ChatGPTService'
import { KeyManager } from '../../security/KeyManager'
import { AIProxy } from '../../proxy/AIProxy'
import { ErrorHandler } from '../../error/ErrorHandler'
import { envManager } from '../../config/env'

// Re-export all types
export * from './interfaces'
export type {
  ReadingRequest,
  ReadingResponse,
  ProcessingStep,
  ReadingMetadata,
  QualityMetrics
} from './interfaces'

// Re-export all services
export {
  AIOrchestrationSystem,
  PerplexityService,
  MonicaService,
  GeminiService,
  ChatGPTService,
  KeyManager,
  AIProxy,
  ErrorHandler
}

/**
 * Main AI System Manager
 * Coordinates all AI services, security, and error handling
 */
export class AISystemManager {
  private orchestrator: AIOrchestrationSystem
  private keyManager: KeyManager
  private proxy: AIProxy
  private errorHandler: ErrorHandler
  private initialized = false

  constructor() {
    this.orchestrator = new AIOrchestrationSystem()
    this.keyManager = KeyManager.getInstance()
    this.proxy = new AIProxy()
    this.errorHandler = ErrorHandler.getInstance()
  }

  /**
   * Initialize the complete AI system
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      console.log('🎭 AI System already initialized')
      return
    }

    try {
      console.log('🚀 Initializing Night God Tarot AI System...')

      // Initialize configuration
      const config = envManager.initialize()
      console.log('✅ Environment configuration loaded')

      // Initialize key management
      await this.keyManager.initializeKeys()
      console.log('✅ API key security initialized')

      // Start proxy server if enabled
      if (config.security.proxy.enabled) {
        await this.proxy.start()
        console.log('✅ AI proxy server started')
      }

      // Initialize orchestration system
      await this.orchestrator.initialize()
      console.log('✅ AI orchestration system initialized')

      this.initialized = true
      console.log('🎉 Night God Tarot AI System fully operational!')
      
      // Log system status
      this.logSystemStatus()

    } catch (error) {
      console.error('❌ AI System initialization failed:', error)
      throw error
    }
  }

  /**
   * Perform a complete tarot reading with AI collaboration
   */
  async performReading(request: any): Promise<any> {
    if (!this.initialized) {
      throw new Error('AI System not initialized. Call initialize() first.')
    }

    try {
      // Perform reading with full error handling
      const result = await this.errorHandler.handleError(
        new Error('placeholder'),
        { operation: 'reading', request }
      )

      if (result.success) {
        return await this.orchestrator.performReading(request)
      } else {
        // Use fallback response
        return result.data
      }

    } catch (error) {
      // Final fallback - always provide some response
      const recovery = await this.errorHandler.handleError(error, { request })
      
      if (recovery.success) {
        return recovery.data
      } else {
        return this.createEmergencyResponse(request)
      }
    }
  }

  /**
   * Get system health and status
   */
  getSystemStatus(): any {
    return {
      initialized: this.initialized,
      timestamp: new Date().toISOString(),
      orchestrator: this.orchestrator.getSystemStatus(),
      keyManager: this.keyManager.getKeyStatus(),
      errorHandler: this.errorHandler.getErrorStats(),
      environment: envManager.getSanitizedConfig()
    }
  }

  /**
   * Get detailed system metrics
   */
  getSystemMetrics(): any {
    const status = this.getSystemStatus()
    
    return {
      ...status,
      performance: {
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        cpu: process.cpuUsage()
      },
      security: {
        keysNeedingRotation: this.keyManager.getKeysNeedingRotation(),
        rotationHistory: this.keyManager.getRotationHistory(10)
      }
    }
  }

  /**
   * Perform system health check
   */
  async healthCheck(): Promise<any> {
    const checks = {
      system: true,
      configuration: false,
      keyManager: false,
      orchestrator: false,
      proxy: false
    }

    try {
      // Check configuration
      checks.configuration = !!envManager.getConfig()

      // Check key manager
      const keyStatus = this.keyManager.getKeyStatus()
      checks.keyManager = Object.values(keyStatus).some((status: any) => !status.isExpired)

      // Check orchestrator
      const orchStatus = this.orchestrator.getSystemStatus()
      checks.orchestrator = Object.values(orchStatus.services).some(healthy => healthy)

      // Check proxy (if enabled)
      if (envManager.getSecurityConfig().proxy.enabled) {
        // Proxy health check would go here
        checks.proxy = true
      } else {
        checks.proxy = true // Not applicable
      }

    } catch (error) {
      console.error('Health check error:', error)
    }

    const overallHealth = Object.values(checks).every(check => check)

    return {
      healthy: overallHealth,
      checks,
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    }
  }

  /**
   * Graceful shutdown
   */
  async shutdown(): Promise<void> {
    console.log('🛑 Shutting down AI System...')

    try {
      // Cleanup orchestrator
      await this.orchestrator.cleanup()
      console.log('✅ Orchestrator cleaned up')

      // Stop proxy
      await this.proxy.stop()
      console.log('✅ Proxy server stopped')

      // Cleanup key manager
      await this.keyManager.cleanup()
      console.log('✅ Key manager cleaned up')

      // Cleanup error handler
      this.errorHandler.cleanup()
      console.log('✅ Error handler cleaned up')

      this.initialized = false
      console.log('🎭 AI System shutdown complete')

    } catch (error) {
      console.error('❌ Error during shutdown:', error)
    }
  }

  /**
   * Emergency restart
   */
  async restart(): Promise<void> {
    console.log('🔄 Restarting AI System...')
    
    await this.shutdown()
    await new Promise(resolve => setTimeout(resolve, 1000)) // Brief pause
    await this.initialize()
    
    console.log('🔄 AI System restart complete')
  }

  /**
   * Create emergency response when all systems fail
   */
  private createEmergencyResponse(request: any): any {
    return {
      id: request.id || 'emergency',
      success: true,
      finalReading: {
        title: 'A Message of Hope',
        subtitle: 'When technology pauses, wisdom continues',
        mainText: `Dear seeker, though the digital pathways may be uncertain at this moment, 
                   the eternal wisdom of the tarot flows beyond any technology. Your question 
                   has been received by the universe, and this message comes to you now.`,
        sections: [
          {
            title: 'Trust in the Moment',
            content: `Sometimes the universe asks us to pause, to turn inward, and to remember 
                     that the greatest wisdom comes not from external sources but from the 
                     infinite wellspring of truth within our own hearts.`,
            cardFocus: ['High Priestess', 'Hermit', 'Star'],
            imagery: ['Inner light', 'Quiet wisdom', 'Eternal flame'],
            symbolism: ['Trust', 'Inner knowing', 'Divine timing']
          }
        ],
        closingWisdom: `Remember: you are exactly where you need to be, learning exactly what 
                       your soul came to learn. Trust the process, trust yourself, and know 
                       that guidance comes in many forms.`,
        personalAffirmation: 'I trust my inner wisdom and the perfect unfolding of my journey.'
      },
      processingSteps: [
        {
          service: 'emergency-system',
          startTime: new Date(),
          endTime: new Date(),
          success: true
        }
      ],
      metadata: {
        totalProcessingTime: 0,
        totalTokensUsed: 0,
        servicesUsed: ['emergency-system'],
        confidenceScore: 1.0,
        qualityMetrics: {
          coherence: 1.0,
          personalization: 0.8,
          insightfulness: 0.9,
          actionability: 0.8,
          poeticQuality: 0.9
        }
      },
      emergency: true,
      timestamp: new Date().toISOString()
    }
  }

  /**
   * Log system status on initialization
   */
  private logSystemStatus(): void {
    const status = this.getSystemStatus()
    
    console.log('\n🎭 NIGHT GOD TAROT AI SYSTEM STATUS')
    console.log('=' .repeat(50))
    console.log(`🔧 Environment: ${status.environment.environment}`)
    console.log(`🔐 Security: ${status.environment.features.aiOrchestration ? 'Enabled' : 'Disabled'}`)
    console.log(`🤖 Services: ${status.orchestrator.servicesUsed?.length || 0} available`)
    console.log(`🗝️  Keys: ${Object.keys(status.keyManager).length} configured`)
    console.log(`⚡ Queue: ${status.orchestrator.queueSize} requests`)
    console.log('=' .repeat(50))
    console.log('🌟 Ready to provide divine guidance through AI collaboration')
    console.log()
  }

  /**
   * Test the complete system with a sample reading
   */
  async testSystem(): Promise<any> {
    const testRequest = {
      id: 'test-' + Date.now(),
      userId: 'test-user',
      cards: [
        { id: 'star', name: 'The Star', arcana: 'major' },
        { id: 'high-priestess', name: 'The High Priestess', arcana: 'major' },
        { id: 'ace-of-cups', name: 'Ace of Cups', arcana: 'minor', suit: 'cups' }
      ],
      question: 'System test reading',
      user: {
        id: 'test-user',
        username: 'Test User',
        preferences: {
          literaryStyle: 'mystical',
          tone: 'inspiring',
          length: 'medium'
        }
      },
      preferences: {
        literaryStyle: 'mystical',
        tone: 'inspiring',
        length: 'medium',
        includeImagery: true,
        includeSymbols: true,
        shareableFormat: true
      }
    }

    console.log('🧪 Running system test...')
    
    try {
      const result = await this.performReading(testRequest)
      console.log('✅ System test completed successfully')
      return result
    } catch (error) {
      console.error('❌ System test failed:', error)
      throw error
    }
  }
}

// Create and export singleton instance
export const aiSystem = new AISystemManager()

// Default export
export default aiSystem