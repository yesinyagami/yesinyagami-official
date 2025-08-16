/**
 * Base AI Service Implementation
 * Provides common functionality for all AI services
 */

import type { 
  IAIService, 
  AIServiceConfig, 
  UsageStats, 
  RateLimitStatus,
  AIRequest,
  AIResponse 
} from './interfaces'
import { envManager } from '../../config/env'

export abstract class BaseAIService implements IAIService {
  public abstract readonly name: string
  public abstract readonly version: string
  public abstract readonly capabilities: string[]

  protected config: AIServiceConfig
  protected stats: UsageStats
  protected isInitialized: boolean = false
  protected lastHealthCheck: Date | null = null

  constructor() {
    this.stats = {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      averageResponseTime: 0,
      totalTokens: 0,
      lastRequest: new Date(),
      rateLimitStatus: {
        remaining: 0,
        reset: new Date(),
        limit: 1000,
        window: 3600000 // 1 hour
      }
    }
  }

  /**
   * Initialize the service with configuration
   */
  async initialize(config: AIServiceConfig): Promise<void> {
    this.config = config
    this.validateConfig()
    await this.performInitialization()
    this.isInitialized = true
    
    if (envManager.getConfig().debug) {
      console.log(`✅ ${this.name} service initialized`)
    }
  }

  /**
   * Abstract method for service-specific initialization
   */
  protected abstract performInitialization(): Promise<void>

  /**
   * Validate service configuration
   */
  protected validateConfig(): void {
    if (!this.config.apiKey) {
      throw new Error(`${this.name}: API key is required`)
    }
    if (!this.config.baseUrl) {
      throw new Error(`${this.name}: Base URL is required`)
    }
    if (!this.config.timeout || this.config.timeout <= 0) {
      throw new Error(`${this.name}: Valid timeout is required`)
    }
  }

  /**
   * Check service health
   */
  async isHealthy(): Promise<boolean> {
    try {
      if (!this.isInitialized) {
        return false
      }

      // Cache health check for 5 minutes
      const now = new Date()
      if (this.lastHealthCheck && 
          (now.getTime() - this.lastHealthCheck.getTime()) < 300000) {
        return true
      }

      const healthy = await this.performHealthCheck()
      this.lastHealthCheck = healthy ? now : null
      return healthy
    } catch (error) {
      console.error(`${this.name} health check failed:`, error)
      return false
    }
  }

  /**
   * Abstract method for service-specific health check
   */
  protected abstract performHealthCheck(): Promise<boolean>

  /**
   * Get current usage statistics
   */
  getUsageStats(): UsageStats {
    return { ...this.stats }
  }

  /**
   * Cleanup resources
   */
  async cleanup(): Promise<void> {
    this.isInitialized = false
    this.lastHealthCheck = null
    await this.performCleanup()
    
    if (envManager.getConfig().debug) {
      console.log(`🧹 ${this.name} service cleaned up`)
    }
  }

  /**
   * Abstract method for service-specific cleanup
   */
  protected abstract performCleanup(): Promise<void>

  /**
   * Make HTTP request with common error handling and metrics
   */
  protected async makeRequest<T extends AIResponse>(
    endpoint: string,
    options: RequestInit,
    request: AIRequest
  ): Promise<T> {
    const startTime = Date.now()
    this.stats.totalRequests++
    this.stats.lastRequest = new Date()

    try {
      // Check rate limits
      await this.checkRateLimit()

      // Make the request
      const url = `${this.config.baseUrl}${endpoint}`
      const response = await this.executeRequest(url, options)
      
      // Process response
      const data = await this.processResponse<T>(response, startTime)
      
      // Update success metrics
      this.updateSuccessMetrics(startTime, data.tokens)
      
      return data
    } catch (error) {
      this.updateFailureMetrics()
      throw this.handleRequestError(error)
    }
  }

  /**
   * Execute HTTP request with timeout
   */
  private async executeRequest(url: string, options: RequestInit): Promise<Response> {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout)

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`,
          'User-Agent': 'NightGodTarot/1.0',
          ...options.headers
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      return response
    } finally {
      clearTimeout(timeoutId)
    }
  }

  /**
   * Process API response
   */
  private async processResponse<T extends AIResponse>(
    response: Response, 
    startTime: number
  ): Promise<T> {
    const data = await response.json()
    const processingTime = Date.now() - startTime

    // Update rate limit info if provided
    this.updateRateLimitFromHeaders(response.headers)

    return {
      success: true,
      data: data,
      processingTime,
      tokens: this.extractTokenUsage(data),
      model: this.extractModel(data)
    } as T
  }

  /**
   * Extract token usage from response
   */
  protected extractTokenUsage(data: any): number | undefined {
    return data?.usage?.total_tokens || 
           data?.tokens || 
           data?.token_count ||
           undefined
  }

  /**
   * Extract model information from response
   */
  protected extractModel(data: any): string | undefined {
    return data?.model || 
           data?.engine || 
           this.config.model ||
           undefined
  }

  /**
   * Update rate limit information from response headers
   */
  private updateRateLimitFromHeaders(headers: Headers): void {
    const remaining = headers.get('x-ratelimit-remaining') || 
                     headers.get('ratelimit-remaining')
    const reset = headers.get('x-ratelimit-reset') || 
                 headers.get('ratelimit-reset')
    const limit = headers.get('x-ratelimit-limit') || 
                 headers.get('ratelimit-limit')

    if (remaining) this.stats.rateLimitStatus.remaining = parseInt(remaining)
    if (reset) this.stats.rateLimitStatus.reset = new Date(parseInt(reset) * 1000)
    if (limit) this.stats.rateLimitStatus.limit = parseInt(limit)
  }

  /**
   * Check rate limits before making requests
   */
  private async checkRateLimit(): Promise<void> {
    const { remaining, reset } = this.stats.rateLimitStatus
    const now = new Date()

    if (remaining <= 0 && reset > now) {
      const waitTime = reset.getTime() - now.getTime()
      throw new Error(`Rate limit exceeded. Reset in ${Math.ceil(waitTime / 1000)} seconds`)
    }

    // Optional: Add artificial rate limiting for good citizenship
    if (this.config.rateLimitMs) {
      await this.sleep(this.config.rateLimitMs)
    }
  }

  /**
   * Update metrics on successful request
   */
  private updateSuccessMetrics(startTime: number, tokens?: number): void {
    this.stats.successfulRequests++
    const responseTime = Date.now() - startTime
    
    // Calculate rolling average response time
    const totalRequests = this.stats.successfulRequests
    this.stats.averageResponseTime = 
      (this.stats.averageResponseTime * (totalRequests - 1) + responseTime) / totalRequests

    if (tokens) {
      this.stats.totalTokens += tokens
    }
  }

  /**
   * Update metrics on failed request
   */
  private updateFailureMetrics(): void {
    this.stats.failedRequests++
  }

  /**
   * Handle request errors consistently
   */
  private handleRequestError(error: any): Error {
    if (error.name === 'AbortError') {
      return new Error(`${this.name}: Request timeout after ${this.config.timeout}ms`)
    }
    
    if (error.message?.includes('Rate limit')) {
      return new Error(`${this.name}: Rate limit exceeded`)
    }

    if (error.message?.includes('401') || error.message?.includes('Unauthorized')) {
      return new Error(`${this.name}: Invalid API key`)
    }

    if (error.message?.includes('403') || error.message?.includes('Forbidden')) {
      return new Error(`${this.name}: Access forbidden`)
    }

    return new Error(`${this.name}: ${error.message || 'Unknown error'}`)
  }

  /**
   * Utility: Sleep for specified milliseconds
   */
  protected sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  /**
   * Utility: Retry logic for failed requests
   */
  protected async withRetry<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    baseDelay: number = 1000
  ): Promise<T> {
    let lastError: Error

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await operation()
      } catch (error) {
        lastError = error as Error
        
        if (attempt === maxRetries) {
          break
        }

        // Exponential backoff with jitter
        const delay = baseDelay * Math.pow(2, attempt) + Math.random() * 1000
        await this.sleep(delay)
        
        if (envManager.getConfig().debug) {
          console.warn(`${this.name}: Retry ${attempt + 1}/${maxRetries} after ${delay}ms`)
        }
      }
    }

    throw lastError!
  }

  /**
   * Utility: Validate required fields in request
   */
  protected validateRequest(request: any, requiredFields: string[]): void {
    for (const field of requiredFields) {
      if (!request[field]) {
        throw new Error(`${this.name}: Missing required field: ${field}`)
      }
    }
  }
}

export default BaseAIService