/**
 * AI Proxy Server
 * Secure backend proxy for all AI API calls with rate limiting and monitoring
 */

import express from 'express'
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'
import cors from 'cors'
import { KeyManager } from '../security/KeyManager'
import { envManager } from '../config/env'

export interface ProxyRequest {
  service: 'openai' | 'monica' | 'google' | 'perplexity'
  endpoint: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  body?: any
  headers?: Record<string, string>
  userId?: string
  sessionId?: string
}

export interface ProxyResponse {
  success: boolean
  data?: any
  error?: string
  metadata: {
    service: string
    endpoint: string
    processingTime: number
    tokensUsed?: number
    cached?: boolean
    rateLimited?: boolean
  }
}

export class AIProxy {
  private app: express.Application
  private keyManager: KeyManager
  private server: any
  private requestLog: Map<string, any[]> = new Map()
  private cache: Map<string, any> = new Map()

  constructor() {
    this.app = express()
    this.keyManager = KeyManager.getInstance()
    this.setupMiddleware()
    this.setupRoutes()
  }

  /**
   * Setup security middleware
   */
  private setupMiddleware(): void {
    // Security headers
    this.app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", "data:", "https:"],
        },
      },
      hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true
      }
    }))

    // CORS configuration
    this.app.use(cors({
      origin: this.getAllowedOrigins(),
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Session-ID', 'X-User-ID']
    }))

    // Body parsing
    this.app.use(express.json({ limit: '10mb' }))
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }))

    // Rate limiting
    this.setupRateLimiting()

    // Request logging
    this.app.use(this.logRequests.bind(this))
  }

  /**
   * Setup rate limiting for different services
   */
  private setupRateLimiting(): void {
    const config = envManager.getSecurityConfig()

    // General rate limiting
    const generalLimiter = rateLimit({
      windowMs: config.proxy.rateLimit.windowMs,
      max: config.proxy.rateLimit.maxRequests,
      message: {
        error: 'Too many requests from this IP, please try again later.',
        retryAfter: config.proxy.rateLimit.windowMs / 1000
      },
      standardHeaders: true,
      legacyHeaders: false,
      keyGenerator: (req) => {
        return req.ip + ':' + (req.headers['x-user-id'] || 'anonymous')
      }
    })

    // Monica-specific rate limiting (60 requests per minute)
    const monicaLimiter = rateLimit({
      windowMs: 60000, // 1 minute
      max: 60,
      message: {
        error: 'Monica API rate limit exceeded (60 requests per minute)',
        retryAfter: 60
      },
      keyGenerator: (req) => 'monica:' + (req.headers['x-user-id'] || req.ip)
    })

    // Apply rate limiting
    this.app.use('/api/ai-proxy', generalLimiter)
    this.app.use('/api/ai-proxy/monica', monicaLimiter)
  }

  /**
   * Setup API routes
   */
  private setupRoutes(): void {
    // Health check
    this.app.get('/api/ai-proxy/health', (req, res) => {
      res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        services: this.getServiceHealth(),
        version: '1.0.0'
      })
    })

    // Main proxy endpoint
    this.app.post('/api/ai-proxy/:service', this.handleProxyRequest.bind(this))

    // Service-specific endpoints
    this.app.post('/api/ai-proxy/openai/:endpoint(*)', this.handleOpenAI.bind(this))
    this.app.post('/api/ai-proxy/monica/:endpoint(*)', this.handleMonica.bind(this))
    this.app.post('/api/ai-proxy/google/:endpoint(*)', this.handleGoogle.bind(this))
    this.app.post('/api/ai-proxy/perplexity/:endpoint(*)', this.handlePerplexity.bind(this))

    // Admin endpoints (with additional auth in production)
    this.app.get('/api/ai-proxy/admin/stats', this.getStats.bind(this))
    this.app.get('/api/ai-proxy/admin/logs', this.getLogs.bind(this))
    this.app.post('/api/ai-proxy/admin/clear-cache', this.clearCache.bind(this))

    // Error handler
    this.app.use(this.errorHandler.bind(this))
  }

  /**
   * Handle generic proxy requests
   */
  private async handleProxyRequest(req: express.Request, res: express.Response): Promise<void> {
    const startTime = Date.now()
    const service = req.params.service as ProxyRequest['service']
    
    try {
      if (!this.isValidService(service)) {
        res.status(400).json({
          success: false,
          error: `Invalid service: ${service}`,
          metadata: { service, processingTime: Date.now() - startTime }
        })
        return
      }

      const proxyRequest: ProxyRequest = {
        service,
        endpoint: req.body.endpoint || '',
        method: req.body.method || 'POST',
        body: req.body.body,
        headers: req.body.headers || {},
        userId: req.headers['x-user-id'] as string,
        sessionId: req.headers['x-session-id'] as string
      }

      const response = await this.makeProxyCall(proxyRequest, startTime)
      res.json(response)

    } catch (error) {
      console.error(`Proxy request failed for ${service}:`, error)
      res.status(500).json({
        success: false,
        error: 'Internal proxy error',
        metadata: { service, processingTime: Date.now() - startTime }
      })
    }
  }

  /**
   * Handle OpenAI requests
   */
  private async handleOpenAI(req: express.Request, res: express.Response): Promise<void> {
    const startTime = Date.now()
    const endpoint = req.params.endpoint

    try {
      const apiKey = await this.keyManager.getKey('openai')
      const config = envManager.getAIConfig('openai')

      const response = await fetch(`${config.baseUrl}/${endpoint}`, {
        method: req.method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'OpenAI-Organization': config.organization || '',
          ...req.body.headers
        },
        body: JSON.stringify(req.body.body)
      })

      const data = await response.json()
      const processingTime = Date.now() - startTime

      res.json({
        success: response.ok,
        data: response.ok ? data : undefined,
        error: !response.ok ? data.error?.message || 'OpenAI API error' : undefined,
        metadata: {
          service: 'openai',
          endpoint,
          processingTime,
          tokensUsed: data.usage?.total_tokens
        }
      })

    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
        metadata: {
          service: 'openai',
          endpoint,
          processingTime: Date.now() - startTime
        }
      })
    }
  }

  /**
   * Handle Monica AI requests with special rate limiting
   */
  private async handleMonica(req: express.Request, res: express.Response): Promise<void> {
    const startTime = Date.now()
    const endpoint = req.params.endpoint

    try {
      const apiKey = await this.keyManager.getKey('monica')
      const config = envManager.getAIConfig('monica')

      // Check cache for Monica requests (since it's unlimited but we want to be efficient)
      const cacheKey = this.generateCacheKey('monica', endpoint, req.body.body)
      const cached = this.cache.get(cacheKey)
      
      if (cached && this.isCacheValid(cached)) {
        res.json({
          success: true,
          data: cached.data,
          metadata: {
            service: 'monica',
            endpoint,
            processingTime: Date.now() - startTime,
            cached: true
          }
        })
        return
      }

      const response = await fetch(`${config.baseUrl}/${endpoint}`, {
        method: req.method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          ...req.body.headers
        },
        body: JSON.stringify(req.body.body)
      })

      const data = await response.json()
      const processingTime = Date.now() - startTime

      // Cache successful Monica responses for 5 minutes
      if (response.ok) {
        this.cache.set(cacheKey, {
          data,
          timestamp: Date.now(),
          ttl: 300000 // 5 minutes
        })
      }

      res.json({
        success: response.ok,
        data: response.ok ? data : undefined,
        error: !response.ok ? data.error?.message || 'Monica API error' : undefined,
        metadata: {
          service: 'monica',
          endpoint,
          processingTime,
          tokensUsed: data.usage?.total_tokens
        }
      })

    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
        metadata: {
          service: 'monica',
          endpoint,
          processingTime: Date.now() - startTime
        }
      })
    }
  }

  /**
   * Handle Google AI requests
   */
  private async handleGoogle(req: express.Request, res: express.Response): Promise<void> {
    const startTime = Date.now()
    const endpoint = req.params.endpoint

    try {
      const apiKey = await this.keyManager.getKey('google')
      const config = envManager.getAIConfig('google')

      const url = `${config.baseUrl}/${endpoint}?key=${apiKey}`
      const response = await fetch(url, {
        method: req.method,
        headers: {
          'Content-Type': 'application/json',
          ...req.body.headers
        },
        body: JSON.stringify(req.body.body)
      })

      const data = await response.json()
      const processingTime = Date.now() - startTime

      res.json({
        success: response.ok,
        data: response.ok ? data : undefined,
        error: !response.ok ? data.error?.message || 'Google AI API error' : undefined,
        metadata: {
          service: 'google',
          endpoint,
          processingTime,
          tokensUsed: data.usageMetadata?.totalTokenCount
        }
      })

    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
        metadata: {
          service: 'google',
          endpoint,
          processingTime: Date.now() - startTime
        }
      })
    }
  }

  /**
   * Handle Perplexity AI requests
   */
  private async handlePerplexity(req: express.Request, res: express.Response): Promise<void> {
    const startTime = Date.now()
    const endpoint = req.params.endpoint

    try {
      const apiKey = await this.keyManager.getKey('perplexity')
      const config = envManager.getAIConfig('perplexity')

      const response = await fetch(`${config.baseUrl}/${endpoint}`, {
        method: req.method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          ...req.body.headers
        },
        body: JSON.stringify(req.body.body)
      })

      const data = await response.json()
      const processingTime = Date.now() - startTime

      res.json({
        success: response.ok,
        data: response.ok ? data : undefined,
        error: !response.ok ? data.error?.message || 'Perplexity API error' : undefined,
        metadata: {
          service: 'perplexity',
          endpoint,
          processingTime,
          tokensUsed: data.usage?.total_tokens
        }
      })

    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
        metadata: {
          service: 'perplexity',
          endpoint,
          processingTime: Date.now() - startTime
        }
      })
    }
  }

  /**
   * Make proxy call with enhanced security
   */
  private async makeProxyCall(request: ProxyRequest, startTime: number): Promise<ProxyResponse> {
    try {
      const apiKey = await this.keyManager.getKey(request.service)
      const config = envManager.getAIConfig(request.service)

      // Build URL and headers based on service
      const { url, headers } = this.buildRequestConfig(request, config, apiKey)

      const response = await fetch(url, {
        method: request.method,
        headers,
        body: request.body ? JSON.stringify(request.body) : undefined
      })

      const data = await response.json()
      const processingTime = Date.now() - startTime

      return {
        success: response.ok,
        data: response.ok ? data : undefined,
        error: !response.ok ? data.error?.message || `${request.service} API error` : undefined,
        metadata: {
          service: request.service,
          endpoint: request.endpoint,
          processingTime,
          tokensUsed: this.extractTokenCount(data)
        }
      }

    } catch (error) {
      return {
        success: false,
        error: error.message,
        metadata: {
          service: request.service,
          endpoint: request.endpoint,
          processingTime: Date.now() - startTime
        }
      }
    }
  }

  /**
   * Build request configuration for different services
   */
  private buildRequestConfig(request: ProxyRequest, config: any, apiKey: string) {
    const baseHeaders = {
      'Content-Type': 'application/json',
      ...request.headers
    }

    switch (request.service) {
      case 'openai':
      case 'monica':
      case 'perplexity':
        return {
          url: `${config.baseUrl}${request.endpoint}`,
          headers: {
            ...baseHeaders,
            'Authorization': `Bearer ${apiKey}`
          }
        }

      case 'google':
        return {
          url: `${config.baseUrl}${request.endpoint}?key=${apiKey}`,
          headers: baseHeaders
        }

      default:
        throw new Error(`Unsupported service: ${request.service}`)
    }
  }

  /**
   * Extract token count from response
   */
  private extractTokenCount(data: any): number | undefined {
    return data?.usage?.total_tokens || 
           data?.usageMetadata?.totalTokenCount || 
           data?.tokens || 
           undefined
  }

  /**
   * Generate cache key
   */
  private generateCacheKey(service: string, endpoint: string, body: any): string {
    const content = JSON.stringify({ service, endpoint, body })
    return require('crypto').createHash('sha256').update(content).digest('hex')
  }

  /**
   * Check if cache entry is valid
   */
  private isCacheValid(cached: any): boolean {
    return Date.now() - cached.timestamp < cached.ttl
  }

  /**
   * Log requests for monitoring
   */
  private logRequests(req: express.Request, res: express.Response, next: express.NextFunction): void {
    const userId = req.headers['x-user-id'] as string || 'anonymous'
    const sessionId = req.headers['x-session-id'] as string || 'unknown'
    
    const logEntry = {
      timestamp: new Date(),
      method: req.method,
      url: req.url,
      userId,
      sessionId,
      ip: req.ip,
      userAgent: req.headers['user-agent']
    }

    if (!this.requestLog.has(userId)) {
      this.requestLog.set(userId, [])
    }
    
    const userLogs = this.requestLog.get(userId)!
    userLogs.push(logEntry)
    
    // Keep only last 100 requests per user
    if (userLogs.length > 100) {
      userLogs.splice(0, userLogs.length - 100)
    }

    next()
  }

  /**
   * Get allowed origins for CORS
   */
  private getAllowedOrigins(): string[] {
    const config = envManager.getConfig()
    const origins = ['http://localhost:3000', 'http://localhost:5173']
    
    if (config.environment === 'production') {
      origins.push('https://night-god-tarot.com', 'https://www.night-god-tarot.com')
    }
    
    return origins
  }

  /**
   * Validate service name
   */
  private isValidService(service: string): service is ProxyRequest['service'] {
    return ['openai', 'monica', 'google', 'perplexity'].includes(service)
  }

  /**
   * Get service health status
   */
  private getServiceHealth(): Record<string, any> {
    return {
      openai: { status: 'unknown' },
      monica: { status: 'unknown' },
      google: { status: 'unknown' },
      perplexity: { status: 'unknown' }
    }
  }

  /**
   * Get proxy statistics
   */
  private getStats(req: express.Request, res: express.Response): void {
    const stats = {
      totalRequests: Array.from(this.requestLog.values()).reduce((sum, logs) => sum + logs.length, 0),
      uniqueUsers: this.requestLog.size,
      cacheSize: this.cache.size,
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      keyStatus: this.keyManager.getKeyStatus()
    }

    res.json(stats)
  }

  /**
   * Get recent logs
   */
  private getLogs(req: express.Request, res: express.Response): void {
    const limit = parseInt(req.query.limit as string) || 50
    const userId = req.query.userId as string

    if (userId && this.requestLog.has(userId)) {
      const userLogs = this.requestLog.get(userId)!.slice(-limit)
      res.json({ logs: userLogs })
    } else {
      const allLogs = Array.from(this.requestLog.values())
        .flat()
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
        .slice(0, limit)
      
      res.json({ logs: allLogs })
    }
  }

  /**
   * Clear cache
   */
  private clearCache(req: express.Request, res: express.Response): void {
    const oldSize = this.cache.size
    this.cache.clear()
    
    res.json({
      success: true,
      message: `Cleared ${oldSize} cache entries`
    })
  }

  /**
   * Error handler
   */
  private errorHandler(error: any, req: express.Request, res: express.Response, next: express.NextFunction): void {
    console.error('Proxy error:', error)
    
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      requestId: req.headers['x-request-id'] || 'unknown'
    })
  }

  /**
   * Start the proxy server
   */
  async start(port: number = 3001): Promise<void> {
    await this.keyManager.initializeKeys()
    
    this.server = this.app.listen(port, () => {
      console.log(`🛡️ AI Proxy server running on port ${port}`)
    })
  }

  /**
   * Stop the proxy server
   */
  async stop(): Promise<void> {
    if (this.server) {
      this.server.close()
      console.log('🛡️ AI Proxy server stopped')
    }
    
    await this.keyManager.cleanup()
    this.requestLog.clear()
    this.cache.clear()
  }
}

export default AIProxy