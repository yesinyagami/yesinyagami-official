/**
 * Payment Webhook Handlers
 * Handles webhooks from Buy Me a Coffee and iPass Money
 */

import express from 'express'
import crypto from 'crypto'
import { PaymentSystem, PaymentProvider } from '../../services/payment/PaymentSystem'

export class PaymentWebhooks {
  private paymentSystem: PaymentSystem
  private router: express.Router

  constructor() {
    this.paymentSystem = PaymentSystem.getInstance()
    this.router = express.Router()
    this.setupRoutes()
  }

  /**
   * Setup webhook routes
   */
  private setupRoutes(): void {
    // Buy Me a Coffee webhook
    this.router.post('/buymeacoffee', 
      this.validateBuyMeACoffeeWebhook.bind(this),
      this.handleBuyMeACoffeeWebhook.bind(this)
    )

    // iPass Money webhook  
    this.router.post('/ipass',
      this.validateiPassWebhook.bind(this),
      this.handleiPassWebhook.bind(this)
    )

    // Webhook health check
    this.router.get('/health', this.healthCheck.bind(this))

    // Webhook test endpoints (development only)
    if (process.env.NODE_ENV === 'development') {
      this.router.post('/test/buymeacoffee', this.testBuyMeACoffeeWebhook.bind(this))
      this.router.post('/test/ipass', this.testiPassWebhook.bind(this))
    }
  }

  /**
   * Validate Buy Me a Coffee webhook
   */
  private validateBuyMeACoffeeWebhook(
    req: express.Request, 
    res: express.Response, 
    next: express.NextFunction
  ): void {
    try {
      // Buy Me a Coffee sends webhook data in the request body
      const webhookSecret = process.env.BUYMEACOFFEE_WEBHOOK_SECRET
      
      if (!webhookSecret) {
        console.warn('Buy Me a Coffee webhook secret not configured')
        // Allow in development, reject in production
        if (process.env.NODE_ENV === 'production') {
          return res.status(401).json({ error: 'Webhook secret not configured' })
        }
      }

      // Verify webhook signature if secret is provided
      if (webhookSecret) {
        const signature = req.headers['x-bmac-signature'] as string
        const payload = JSON.stringify(req.body)
        const expectedSignature = crypto
          .createHmac('sha256', webhookSecret)
          .update(payload)
          .digest('hex')

        if (signature !== expectedSignature) {
          return res.status(401).json({ error: 'Invalid webhook signature' })
        }
      }

      next()
    } catch (error) {
      console.error('Buy Me a Coffee webhook validation failed:', error)
      res.status(400).json({ error: 'Webhook validation failed' })
    }
  }

  /**
   * Validate iPass Money webhook
   */
  private validateiPassWebhook(
    req: express.Request, 
    res: express.Response, 
    next: express.NextFunction
  ): void {
    try {
      const webhookSecret = process.env.IPASS_WEBHOOK_SECRET
      
      if (!webhookSecret) {
        console.warn('iPass webhook secret not configured')
        if (process.env.NODE_ENV === 'production') {
          return res.status(401).json({ error: 'Webhook secret not configured' })
        }
      }

      // Verify iPass webhook signature
      if (webhookSecret) {
        const signature = req.headers['x-ipass-signature'] as string
        const timestamp = req.headers['x-ipass-timestamp'] as string
        const payload = `${timestamp}.${JSON.stringify(req.body)}`
        
        const expectedSignature = crypto
          .createHmac('sha256', webhookSecret)
          .update(payload)
          .digest('hex')

        if (signature !== `v1=${expectedSignature}`) {
          return res.status(401).json({ error: 'Invalid webhook signature' })
        }

        // Check timestamp (reject if older than 5 minutes)
        const webhookTime = parseInt(timestamp) * 1000
        const currentTime = Date.now()
        if (currentTime - webhookTime > 300000) { // 5 minutes
          return res.status(401).json({ error: 'Webhook timestamp too old' })
        }
      }

      next()
    } catch (error) {
      console.error('iPass webhook validation failed:', error)
      res.status(400).json({ error: 'Webhook validation failed' })
    }
  }

  /**
   * Handle Buy Me a Coffee webhook
   */
  private async handleBuyMeACoffeeWebhook(
    req: express.Request, 
    res: express.Response
  ): Promise<void> {
    try {
      console.log('☕ Received Buy Me a Coffee webhook:', req.body)

      // Process the webhook
      await this.paymentSystem.handleWebhook(PaymentProvider.BUY_ME_A_COFFEE, req.body)

      // Send success response
      res.status(200).json({ 
        success: true, 
        message: 'Webhook processed successfully',
        timestamp: new Date().toISOString()
      })

      // Log successful processing
      console.log('✅ Buy Me a Coffee webhook processed successfully')

    } catch (error) {
      console.error('❌ Buy Me a Coffee webhook processing failed:', error)
      
      // Send error response
      res.status(500).json({ 
        success: false, 
        error: 'Webhook processing failed',
        timestamp: new Date().toISOString()
      })
    }
  }

  /**
   * Handle iPass Money webhook
   */
  private async handleiPassWebhook(
    req: express.Request, 
    res: express.Response
  ): Promise<void> {
    try {
      console.log('💳 Received iPass Money webhook:', req.body)

      // Process the webhook
      await this.paymentSystem.handleWebhook(PaymentProvider.IPASS_MONEY, req.body)

      // Send success response
      res.status(200).json({ 
        success: true, 
        message: 'Webhook processed successfully',
        timestamp: new Date().toISOString()
      })

      // Log successful processing
      console.log('✅ iPass Money webhook processed successfully')

    } catch (error) {
      console.error('❌ iPass Money webhook processing failed:', error)
      
      // Send error response
      res.status(500).json({ 
        success: false, 
        error: 'Webhook processing failed',
        timestamp: new Date().toISOString()
      })
    }
  }

  /**
   * Webhook health check
   */
  private healthCheck(req: express.Request, res: express.Response): void {
    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      webhooks: {
        buymeacoffee: '/api/webhooks/buymeacoffee',
        ipass: '/api/webhooks/ipass'
      },
      environment: process.env.NODE_ENV || 'development'
    })
  }

  /**
   * Test Buy Me a Coffee webhook (development only)
   */
  private async testBuyMeACoffeeWebhook(
    req: express.Request, 
    res: express.Response
  ): Promise<void> {
    if (process.env.NODE_ENV === 'production') {
      return res.status(404).json({ error: 'Not found' })
    }

    const testData = {
      supporter_name: 'Test Supporter',
      supporter_email: 'test@example.com',
      support_amount: '299',
      support_coffees: '3',
      support_message: 'Test support for Night God Tarot!',
      support_created_on: new Date().toISOString(),
      support_id: `test_${Date.now()}`,
      supporter_id: `supporter_${Date.now()}`,
      is_recurring: false,
      is_private: false,
      ...req.body
    }

    try {
      await this.paymentSystem.handleWebhook(PaymentProvider.BUY_ME_A_COFFEE, testData)
      res.status(200).json({ 
        success: true, 
        message: 'Test webhook processed',
        testData 
      })
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: error.message 
      })
    }
  }

  /**
   * Test iPass Money webhook (development only)
   */
  private async testiPassWebhook(
    req: express.Request, 
    res: express.Response
  ): Promise<void> {
    if (process.env.NODE_ENV === 'production') {
      return res.status(404).json({ error: 'Not found' })
    }

    const testData = {
      event_type: 'payment.completed',
      payment_id: `test_payment_${Date.now()}`,
      order_id: `test_order_${Date.now()}`,
      merchant_id: 'test_merchant',
      amount: 899,
      currency: 'TWD',
      status: 'completed',
      payment_method: 'credit-card',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      metadata: {
        userId: 'test_user',
        tier: 'nightGod'
      },
      invoice_number: `INV${Date.now()}`,
      ...req.body
    }

    try {
      await this.paymentSystem.handleWebhook(PaymentProvider.IPASS_MONEY, testData)
      res.status(200).json({ 
        success: true, 
        message: 'Test webhook processed',
        testData 
      })
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: error.message 
      })
    }
  }

  /**
   * Get webhook router
   */
  getRouter(): express.Router {
    return this.router
  }
}

/**
 * Webhook Server Setup
 * Sets up Express server for handling webhooks
 */
export class WebhookServer {
  private app: express.Application
  private webhooks: PaymentWebhooks
  private server: any

  constructor() {
    this.app = express()
    this.webhooks = new PaymentWebhooks()
    this.setupMiddleware()
    this.setupRoutes()
  }

  /**
   * Setup middleware
   */
  private setupMiddleware(): void {
    // Raw body parser for webhooks (needed for signature verification)
    this.app.use('/api/webhooks', express.raw({ type: 'application/json' }))
    
    // Regular JSON parser for other routes
    this.app.use(express.json())
    this.app.use(express.urlencoded({ extended: true }))

    // CORS
    this.app.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*')
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
      next()
    })

    // Request logging
    this.app.use((req, res, next) => {
      console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`)
      next()
    })
  }

  /**
   * Setup routes
   */
  private setupRoutes(): void {
    // Webhook routes
    this.app.use('/api/webhooks', this.webhooks.getRouter())

    // Health check
    this.app.get('/health', (req, res) => {
      res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        service: 'Night God Tarot Webhook Server'
      })
    })

    // Default route
    this.app.use('*', (req, res) => {
      res.status(404).json({
        error: 'Not found',
        path: req.originalUrl,
        timestamp: new Date().toISOString()
      })
    })

    // Error handler
    this.app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
      console.error('Server error:', error)
      res.status(500).json({
        error: 'Internal server error',
        timestamp: new Date().toISOString()
      })
    })
  }

  /**
   * Start webhook server
   */
  async start(port: number = 3002): Promise<void> {
    return new Promise((resolve) => {
      this.server = this.app.listen(port, () => {
        console.log(`🔗 Webhook server running on port ${port}`)
        console.log(`📡 Buy Me a Coffee webhook: http://localhost:${port}/api/webhooks/buymeacoffee`)
        console.log(`💳 iPass Money webhook: http://localhost:${port}/api/webhooks/ipass`)
        resolve()
      })
    })
  }

  /**
   * Stop webhook server
   */
  async stop(): Promise<void> {
    if (this.server) {
      this.server.close()
      console.log('🔗 Webhook server stopped')
    }
  }

  /**
   * Get Express app (for testing)
   */
  getApp(): express.Application {
    return this.app
  }
}

export default PaymentWebhooks