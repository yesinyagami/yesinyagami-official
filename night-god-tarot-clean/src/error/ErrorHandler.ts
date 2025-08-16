/**
 * Comprehensive Error Handling and Fallback System
 * Provides robust error handling, recovery strategies, and graceful degradation
 */

import { envManager } from '../config/env'

export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export enum ErrorType {
  API_ERROR = 'api_error',
  RATE_LIMIT = 'rate_limit',
  AUTHENTICATION = 'authentication',
  NETWORK = 'network',
  TIMEOUT = 'timeout',
  VALIDATION = 'validation',
  PROCESSING = 'processing',
  SECURITY = 'security',
  SYSTEM = 'system'
}

export interface ErrorInfo {
  id: string
  type: ErrorType
  severity: ErrorSeverity
  message: string
  originalError?: Error
  context: Record<string, any>
  timestamp: Date
  service?: string
  userId?: string
  recoverable: boolean
  retryAttempts?: number
  maxRetries?: number
}

export interface FallbackStrategy {
  name: string
  condition: (error: ErrorInfo) => boolean
  execute: (error: ErrorInfo, context: any) => Promise<any>
  priority: number
}

export interface ErrorRecoveryResult {
  success: boolean
  data?: any
  fallbackUsed?: string
  error?: ErrorInfo
  recoveryTime: number
}

export class ErrorHandler {
  private static instance: ErrorHandler
  private errorLog: ErrorInfo[] = []
  private fallbackStrategies: FallbackStrategy[] = []
  private recoveryAttempts: Map<string, number> = new Map()
  private circuitBreakers: Map<string, CircuitBreaker> = new Map()

  private constructor() {
    this.initializeFallbackStrategies()
    this.initializeCircuitBreakers()
  }

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler()
    }
    return ErrorHandler.instance
  }

  /**
   * Initialize fallback strategies
   */
  private initializeFallbackStrategies(): void {
    this.fallbackStrategies = [
      // Monica fallback for other AI services
      {
        name: 'monica-universal-fallback',
        condition: (error) => error.service !== 'monica' && error.type === ErrorType.API_ERROR,
        execute: this.useMonicaFallback.bind(this),
        priority: 1
      },

      // Cached response fallback
      {
        name: 'cached-response',
        condition: (error) => error.type === ErrorType.RATE_LIMIT || error.type === ErrorType.TIMEOUT,
        execute: this.useCachedResponse.bind(this),
        priority: 2
      },

      // Simplified response fallback
      {
        name: 'simplified-response',
        condition: (error) => error.severity === ErrorSeverity.MEDIUM || error.severity === ErrorSeverity.HIGH,
        execute: this.generateSimplifiedResponse.bind(this),
        priority: 3
      },

      // Emergency wisdom fallback
      {
        name: 'emergency-wisdom',
        condition: (error) => error.severity === ErrorSeverity.CRITICAL,
        execute: this.generateEmergencyWisdom.bind(this),
        priority: 4
      },

      // System degradation fallback
      {
        name: 'graceful-degradation',
        condition: (error) => error.type === ErrorType.SYSTEM,
        execute: this.gracefulDegradation.bind(this),
        priority: 5
      }
    ]

    console.log(`🛡️ Initialized ${this.fallbackStrategies.length} fallback strategies`)
  }

  /**
   * Initialize circuit breakers for services
   */
  private initializeCircuitBreakers(): void {
    const services = ['openai', 'monica', 'google', 'perplexity']
    
    services.forEach(service => {
      this.circuitBreakers.set(service, new CircuitBreaker({
        failureThreshold: 5,
        resetTimeout: 60000, // 1 minute
        monitoringPeriod: 300000 // 5 minutes
      }))
    })

    console.log(`⚡ Initialized circuit breakers for ${services.length} services`)
  }

  /**
   * Handle error with automatic recovery
   */
  async handleError(error: Error | ErrorInfo, context: any = {}): Promise<ErrorRecoveryResult> {
    const startTime = Date.now()
    
    // Convert Error to ErrorInfo if needed
    const errorInfo = this.normalizeError(error, context)
    
    // Log the error
    this.logError(errorInfo)
    
    // Check circuit breaker
    if (errorInfo.service && this.isCircuitOpen(errorInfo.service)) {
      return this.handleCircuitOpen(errorInfo, startTime)
    }

    // Attempt recovery with fallback strategies
    try {
      const result = await this.attemptRecovery(errorInfo, context)
      
      // Update circuit breaker on success
      if (result.success && errorInfo.service) {
        this.circuitBreakers.get(errorInfo.service)?.recordSuccess()
      }
      
      return result
    } catch (recoveryError) {
      // Update circuit breaker on failure
      if (errorInfo.service) {
        this.circuitBreakers.get(errorInfo.service)?.recordFailure()
      }
      
      return {
        success: false,
        error: errorInfo,
        recoveryTime: Date.now() - startTime
      }
    }
  }

  /**
   * Attempt recovery using fallback strategies
   */
  private async attemptRecovery(error: ErrorInfo, context: any): Promise<ErrorRecoveryResult> {
    const startTime = Date.now()
    
    // Sort strategies by priority
    const applicableStrategies = this.fallbackStrategies
      .filter(strategy => strategy.condition(error))
      .sort((a, b) => a.priority - b.priority)

    // Try each applicable strategy
    for (const strategy of applicableStrategies) {
      try {
        console.log(`🔄 Attempting recovery with strategy: ${strategy.name}`)
        
        const result = await strategy.execute(error, context)
        
        if (result) {
          console.log(`✅ Recovery successful with strategy: ${strategy.name}`)
          return {
            success: true,
            data: result,
            fallbackUsed: strategy.name,
            recoveryTime: Date.now() - startTime
          }
        }
      } catch (strategyError) {
        console.warn(`❌ Strategy ${strategy.name} failed:`, strategyError.message)
        continue
      }
    }

    // No strategy worked
    return {
      success: false,
      error,
      recoveryTime: Date.now() - startTime
    }
  }

  /**
   * Monica universal fallback strategy
   */
  private async useMonicaFallback(error: ErrorInfo, context: any): Promise<any> {
    try {
      // Use Monica for any AI operation that failed
      const monicaPrompt = this.buildMonicaFallbackPrompt(error, context)
      
      // This would make a Monica API call
      // For now, return a structured fallback response
      return this.createMonicaFallbackResponse(error, context)
    } catch (monicaError) {
      throw new Error(`Monica fallback failed: ${monicaError.message}`)
    }
  }

  /**
   * Use cached response strategy
   */
  private async useCachedResponse(error: ErrorInfo, context: any): Promise<any> {
    // Check if we have a cached response for similar requests
    const cacheKey = this.generateCacheKey(context)
    const cached = this.getCachedResponse(cacheKey)
    
    if (cached) {
      console.log('📱 Using cached response for fallback')
      return cached
    }
    
    throw new Error('No cached response available')
  }

  /**
   * Generate simplified response
   */
  private async generateSimplifiedResponse(error: ErrorInfo, context: any): Promise<any> {
    // Create a basic but meaningful response
    const cards = context.cards || []
    const question = context.question || 'seeking guidance'
    
    return {
      title: 'A Message of Guidance',
      message: `Though the digital paths may be uncertain, the wisdom of the cards remains clear. 
                Your question about "${question}" has been heard by the universe. 
                ${cards.length > 0 ? `The cards ${cards.map(c => c.name).join(', ')} ` : 'The cards '}
                speak of trust, patience, and inner wisdom. This moment calls for reflection and faith in your journey.`,
      guidance: [
        'Trust your inner wisdom above all external guidance',
        'This challenge is an opportunity for growth',
        'The universe supports your highest good',
        'Take one small, aligned action today'
      ],
      affirmation: 'I trust the process of my life and the wisdom within me.',
      fallbackReason: 'Simplified response due to technical difficulties'
    }
  }

  /**
   * Generate emergency wisdom
   */
  private async generateEmergencyWisdom(error: ErrorInfo, context: any): Promise<any> {
    const universalWisdom = [
      'In times of uncertainty, trust that you are exactly where you need to be.',
      'Every challenge carries within it the seeds of wisdom and growth.',
      'Your inner light shines brightest when external sources seem dim.',
      'The universe conspires to support your highest good, even in difficult moments.',
      'This too shall pass, and you will emerge stronger and wiser.'
    ]

    const randomWisdom = universalWisdom[Math.floor(Math.random() * universalWisdom.length)]

    return {
      title: 'Universal Wisdom',
      message: randomWisdom,
      guidance: 'When all systems fail, remember that the greatest wisdom comes from within. Take a moment to breathe, center yourself, and trust your inner knowing.',
      affirmation: 'I am resilient, wise, and supported by the universe.',
      emergency: true,
      timestamp: new Date().toISOString()
    }
  }

  /**
   * Graceful degradation strategy
   */
  private async gracefulDegradation(error: ErrorInfo, context: any): Promise<any> {
    return {
      title: 'System Message',
      message: 'We are experiencing technical difficulties, but your journey continues. Sometimes the universe asks us to turn inward and trust our own wisdom.',
      guidance: 'Use this moment to reflect on what you already know to be true. The answers you seek may already be within you.',
      affirmation: 'I trust my inner guidance and the perfect timing of my journey.',
      degraded: true,
      retryAfter: 300000 // 5 minutes
    }
  }

  /**
   * Build Monica fallback prompt
   */
  private buildMonicaFallbackPrompt(error: ErrorInfo, context: any): string {
    return `Emergency guidance request - ${error.service} service unavailable.
    
    Original context: ${JSON.stringify(context)}
    Error: ${error.message}
    
    Please provide comprehensive tarot guidance including:
    1. Immediate wisdom and comfort
    2. Practical guidance
    3. Spiritual perspective
    4. Affirmation for the user
    
    Create a complete, meaningful response that addresses the user's needs.`
  }

  /**
   * Create Monica fallback response
   */
  private createMonicaFallbackResponse(error: ErrorInfo, context: any): any {
    return {
      title: 'Wisdom Flows Through All Channels',
      message: `Dear seeker, though one path may be blocked, wisdom finds many ways to reach you. 
                Your question has been received with love and understanding.`,
      guidance: this.generateContextualGuidance(context),
      affirmation: 'I am open to receiving wisdom in all its forms.',
      fallbackService: 'monica-universal',
      originalService: error.service
    }
  }

  /**
   * Generate contextual guidance
   */
  private generateContextualGuidance(context: any): string[] {
    const guidance = [
      'Trust that this moment of technical difficulty has its own teaching',
      'Your question is valid and deserves a thoughtful response',
      'Sometimes the universe asks us to pause and listen more deeply'
    ]

    if (context.cards && context.cards.length > 0) {
      guidance.push(`The cards you drew - ${context.cards.map(c => c.name).join(', ')} - still hold their wisdom`)
    }

    if (context.question) {
      guidance.push(`Your question about "${context.question}" shows wisdom in seeking guidance`)
    }

    return guidance
  }

  /**
   * Normalize error to ErrorInfo format
   */
  private normalizeError(error: Error | ErrorInfo, context: any = {}): ErrorInfo {
    if ('id' in error) {
      return error as ErrorInfo
    }

    const baseError = error as Error
    
    return {
      id: this.generateErrorId(),
      type: this.classifyError(baseError),
      severity: this.assessSeverity(baseError, context),
      message: baseError.message,
      originalError: baseError,
      context,
      timestamp: new Date(),
      service: context.service,
      userId: context.userId,
      recoverable: this.isRecoverable(baseError),
      retryAttempts: 0,
      maxRetries: 3
    }
  }

  /**
   * Classify error type
   */
  private classifyError(error: Error): ErrorType {
    const message = error.message.toLowerCase()
    
    if (message.includes('rate limit') || message.includes('quota')) return ErrorType.RATE_LIMIT
    if (message.includes('unauthorized') || message.includes('forbidden')) return ErrorType.AUTHENTICATION
    if (message.includes('timeout') || message.includes('timed out')) return ErrorType.TIMEOUT
    if (message.includes('network') || message.includes('fetch')) return ErrorType.NETWORK
    if (message.includes('validation') || message.includes('invalid')) return ErrorType.VALIDATION
    if (message.includes('security') || message.includes('key')) return ErrorType.SECURITY
    if (message.includes('api') || message.includes('service')) return ErrorType.API_ERROR
    
    return ErrorType.SYSTEM
  }

  /**
   * Assess error severity
   */
  private assessSeverity(error: Error, context: any): ErrorSeverity {
    const message = error.message.toLowerCase()
    
    if (message.includes('critical') || message.includes('fatal')) return ErrorSeverity.CRITICAL
    if (message.includes('authentication') || message.includes('security')) return ErrorSeverity.HIGH
    if (message.includes('rate limit') || message.includes('timeout')) return ErrorSeverity.MEDIUM
    
    return ErrorSeverity.LOW
  }

  /**
   * Check if error is recoverable
   */
  private isRecoverable(error: Error): boolean {
    const unrecoverableTypes = ['authentication', 'forbidden', 'invalid key']
    const message = error.message.toLowerCase()
    
    return !unrecoverableTypes.some(type => message.includes(type))
  }

  /**
   * Check if circuit is open for a service
   */
  private isCircuitOpen(service: string): boolean {
    const circuitBreaker = this.circuitBreakers.get(service)
    return circuitBreaker ? circuitBreaker.isOpen() : false
  }

  /**
   * Handle circuit open scenario
   */
  private handleCircuitOpen(error: ErrorInfo, startTime: number): ErrorRecoveryResult {
    return {
      success: false,
      error: {
        ...error,
        message: `Service ${error.service} circuit breaker is open`,
        type: ErrorType.SYSTEM
      },
      recoveryTime: Date.now() - startTime
    }
  }

  /**
   * Log error for monitoring
   */
  private logError(error: ErrorInfo): void {
    this.errorLog.push(error)
    
    // Keep only last 1000 errors
    if (this.errorLog.length > 1000) {
      this.errorLog.splice(0, this.errorLog.length - 1000)
    }

    // Log to console based on severity
    const logLevel = this.getLogLevel(error.severity)
    console[logLevel](`${error.severity.toUpperCase()} ${error.type}: ${error.message}`, {
      service: error.service,
      userId: error.userId,
      context: error.context
    })
  }

  /**
   * Get log level for severity
   */
  private getLogLevel(severity: ErrorSeverity): 'log' | 'warn' | 'error' {
    switch (severity) {
      case ErrorSeverity.LOW: return 'log'
      case ErrorSeverity.MEDIUM: return 'warn'
      case ErrorSeverity.HIGH:
      case ErrorSeverity.CRITICAL: return 'error'
    }
  }

  /**
   * Generate unique error ID
   */
  private generateErrorId(): string {
    return `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * Generate cache key
   */
  private generateCacheKey(context: any): string {
    const key = JSON.stringify({
      cards: context.cards?.map(c => c.id),
      question: context.question,
      userId: context.userId
    })
    return require('crypto').createHash('md5').update(key).digest('hex')
  }

  /**
   * Get cached response (placeholder)
   */
  private getCachedResponse(cacheKey: string): any {
    // In production, this would check Redis or other cache
    return null
  }

  /**
   * Get error statistics
   */
  getErrorStats(): any {
    const recentErrors = this.errorLog.filter(error => 
      Date.now() - error.timestamp.getTime() < 3600000 // Last hour
    )

    const errorsByType = recentErrors.reduce((acc, error) => {
      acc[error.type] = (acc[error.type] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const errorsBySeverity = recentErrors.reduce((acc, error) => {
      acc[error.severity] = (acc[error.severity] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return {
      totalErrors: this.errorLog.length,
      recentErrors: recentErrors.length,
      errorsByType,
      errorsBySeverity,
      circuitBreakerStatus: this.getCircuitBreakerStatus()
    }
  }

  /**
   * Get circuit breaker status
   */
  private getCircuitBreakerStatus(): Record<string, any> {
    const status: Record<string, any> = {}
    
    for (const [service, breaker] of this.circuitBreakers.entries()) {
      status[service] = {
        isOpen: breaker.isOpen(),
        failureCount: breaker.getFailureCount(),
        lastFailureTime: breaker.getLastFailureTime()
      }
    }
    
    return status
  }

  /**
   * Reset error tracking
   */
  reset(): void {
    this.errorLog = []
    this.recoveryAttempts.clear()
    this.circuitBreakers.forEach(breaker => breaker.reset())
  }

  /**
   * Cleanup resources
   */
  cleanup(): void {
    this.reset()
    console.log('🧹 Error handler cleaned up')
  }
}

/**
 * Circuit Breaker implementation
 */
class CircuitBreaker {
  private failureCount = 0
  private lastFailureTime: Date | null = null
  private state: 'closed' | 'open' | 'half-open' = 'closed'
  
  constructor(
    private config: {
      failureThreshold: number
      resetTimeout: number
      monitoringPeriod: number
    }
  ) {}

  recordSuccess(): void {
    this.failureCount = 0
    this.state = 'closed'
  }

  recordFailure(): void {
    this.failureCount++
    this.lastFailureTime = new Date()
    
    if (this.failureCount >= this.config.failureThreshold) {
      this.state = 'open'
    }
  }

  isOpen(): boolean {
    if (this.state === 'closed') return false
    
    if (this.state === 'open' && this.lastFailureTime) {
      const timeSinceLastFailure = Date.now() - this.lastFailureTime.getTime()
      if (timeSinceLastFailure >= this.config.resetTimeout) {
        this.state = 'half-open'
        return false
      }
    }
    
    return this.state === 'open'
  }

  getFailureCount(): number {
    return this.failureCount
  }

  getLastFailureTime(): Date | null {
    return this.lastFailureTime
  }

  reset(): void {
    this.failureCount = 0
    this.lastFailureTime = null
    this.state = 'closed'
  }
}

export default ErrorHandler