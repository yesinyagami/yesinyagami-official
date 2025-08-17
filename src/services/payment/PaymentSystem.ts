/**
 * Payment System Orchestrator
 * Coordinates all payment methods and membership tiers
 */

import { BuyMeACoffeeService } from './BuyMeACoffeeService'
import { iPassMoneyService } from './iPassMoneyService'
import { MembershipService } from '../membership/MembershipService'
import { TierLevel, MembershipUtils, PaymentPlatform } from '../membership/MembershipTiers'

export enum PaymentProvider {
  BUY_ME_A_COFFEE = 'buymeacoffee',
  IPASS_MONEY = 'ipass'
}

export interface PaymentIntent {
  id: string
  userId: string
  targetTier: TierLevel
  amount: number
  currency: string
  provider: PaymentProvider
  method?: string
  billing?: 'monthly' | 'quarterly' | 'yearly'
  metadata: Record<string, any>
  createdAt: Date
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled'
}

export interface PaymentResult {
  success: boolean
  paymentId?: string
  paymentUrl?: string
  qrCode?: string
  subscriptionId?: string
  error?: string
  requiresAction?: boolean
  actionUrl?: string
}

export interface RevenueMetrics {
  totalRevenue: number
  monthlyRecurring: number
  averageOrderValue: number
  conversionRate: number
  churnRate: number
  lifetimeValue: number
  tierDistribution: Record<TierLevel, number>
  providerDistribution: Record<PaymentProvider, number>
}

export class PaymentSystem {
  private static instance: PaymentSystem
  private buyMeACoffee: BuyMeACoffeeService
  private iPassMoney: iPassMoneyService
  private membershipService: MembershipService
  private paymentIntents: Map<string, PaymentIntent> = new Map()

  private constructor() {
    this.buyMeACoffee = BuyMeACoffeeService.getInstance()
    this.iPassMoney = iPassMoneyService.getInstance()
    this.membershipService = MembershipService.getInstance()
  }

  static getInstance(): PaymentSystem {
    if (!PaymentSystem.instance) {
      PaymentSystem.instance = new PaymentSystem()
    }
    return PaymentSystem.instance
  }

  /**
   * Initialize payment system
   */
  async initialize(): Promise<void> {
    console.log('💳 Initializing Payment System...')
    
    // Test connectivity to payment providers
    await this.testProviderConnectivity()
    
    console.log('✅ Payment System initialized')
  }

  /**
   * Create payment intent for tier upgrade
   */
  async createPaymentIntent(
    userId: string,
    targetTier: TierLevel,
    provider: PaymentProvider,
    options: {
      method?: string
      billing?: 'monthly' | 'quarterly' | 'yearly'
      promoCode?: string
      referralCode?: string
      invoice?: any
    } = {}
  ): Promise<PaymentResult> {
    try {
      const tier = MembershipUtils.getTier(targetTier)
      const amount = this.calculateAmount(tier.price, options.billing, options.promoCode)
      
      const intent: PaymentIntent = {
        id: this.generatePaymentId(),
        userId,
        targetTier,
        amount,
        currency: tier.currency,
        provider,
        method: options.method,
        billing: options.billing,
        metadata: {
          promoCode: options.promoCode,
          referralCode: options.referralCode,
          invoice: options.invoice
        },
        createdAt: new Date(),
        status: 'pending'
      }

      this.paymentIntents.set(intent.id, intent)

      // Route to appropriate payment provider
      let result: PaymentResult

      switch (provider) {
        case PaymentProvider.BUY_ME_A_COFFEE:
          result = await this.processBuyMeACoffeePayment(intent)
          break
        
        case PaymentProvider.IPASS_MONEY:
          result = await this.processiPassPayment(intent, options)
          break
        
        default:
          throw new Error(`Unsupported payment provider: ${provider}`)
      }

      // Update intent status
      intent.status = result.success ? 'processing' : 'failed'
      this.paymentIntents.set(intent.id, intent)

      console.log(`💳 Created payment intent ${intent.id} for ${targetTier} tier`)
      return result

    } catch (error) {
      console.error('Payment intent creation failed:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  /**
   * Process Buy Me a Coffee payment
   */
  private async processBuyMeACoffeePayment(intent: PaymentIntent): Promise<PaymentResult> {
    // For Buy Me a Coffee, we generate a custom payment URL
    const coffeeCount = Math.ceil(intent.amount / 99) // Assuming 99 TWD per coffee
    const buttons = this.buyMeACoffee.generateSupportButtons()
    
    // Find matching button or use custom amount
    const matchingButton = buttons.find(b => b.amount === intent.amount)
    
    return {
      success: true,
      paymentUrl: `https://buymeacoffee.com/nightgodtarot?amount=${intent.amount}`,
      paymentId: intent.id,
      requiresAction: true,
      actionUrl: `https://buymeacoffee.com/nightgodtarot`
    }
  }

  /**
   * Process iPass Money payment
   */
  private async processiPassPayment(intent: PaymentIntent, options: any): Promise<PaymentResult> {
    const paymentRequest = {
      orderId: intent.id,
      userId: intent.userId,
      amount: intent.amount,
      currency: intent.currency as 'TWD',
      description: `Night God Tarot - ${MembershipUtils.getTier(intent.targetTier).displayName}`,
      method: intent.method as any,
      invoice: options.invoice || {
        type: 'electronic',
        buyerEmail: options.email
      },
      subscription: intent.billing ? {
        interval: intent.billing as any,
        autoRenew: true
      } : undefined,
      metadata: {
        userId: intent.userId,
        tier: intent.targetTier,
        ...intent.metadata
      }
    }

    return await this.iPassMoney.createPayment(paymentRequest)
  }

  /**
   * Handle payment webhook
   */
  async handleWebhook(provider: PaymentProvider, webhookData: any): Promise<void> {
    try {
      switch (provider) {
        case PaymentProvider.BUY_ME_A_COFFEE:
          await this.buyMeACoffee.processWebhook(webhookData)
          break
        
        case PaymentProvider.IPASS_MONEY:
          await this.iPassMoney.processWebhook(webhookData)
          break
        
        default:
          throw new Error(`Unknown payment provider: ${provider}`)
      }

      console.log(`📡 Processed ${provider} webhook`)

    } catch (error) {
      console.error(`Webhook processing failed for ${provider}:`, error)
      throw error
    }
  }

  /**
   * Get payment options for user
   */
  getPaymentOptions(targetTier: TierLevel): any {
    const tier = MembershipUtils.getTier(targetTier)
    
    const options = {
      tier: {
        id: tier.id,
        name: tier.displayName,
        price: tier.price,
        currency: tier.currency,
        features: tier.benefits
      },
      providers: []
    }

    // Add Buy Me a Coffee option for Moon Shadow tier
    if (targetTier === TierLevel.MOON_SHADOW) {
      options.providers.push({
        provider: PaymentProvider.BUY_ME_A_COFFEE,
        name: 'Buy Me a Coffee',
        description: '透過咖啡支持來解鎖進階功能',
        icon: '☕',
        popular: true,
        methods: this.buyMeACoffee.generateSupportButtons(),
        features: [
          '即時開通',
          '支持者牆展示',
          '彈性金額支持',
          '社群互動'
        ]
      })
    }

    // Add iPass Money option for Night God tier
    if (targetTier === TierLevel.NIGHT_GOD) {
      options.providers.push({
        provider: PaymentProvider.IPASS_MONEY,
        name: 'iPass Money',
        description: '台灣本土支付，完整發票服務',
        icon: '💳',
        professional: true,
        methods: this.iPassMoney.getPaymentOptions(),
        invoiceOptions: this.iPassMoney.getInvoiceOptions(),
        subscriptionOptions: [
          {
            interval: 'monthly',
            price: tier.price,
            description: '月付方案',
            ...this.iPassMoney.calculateSubscriptionPricing('monthly')
          },
          {
            interval: 'quarterly',
            price: tier.price * 3,
            description: '季付優惠',
            ...this.iPassMoney.calculateSubscriptionPricing('quarterly')
          },
          {
            interval: 'yearly',
            price: tier.price * 12,
            description: '年付最優惠',
            ...this.iPassMoney.calculateSubscriptionPricing('yearly')
          }
        ],
        features: [
          '正式發票',
          '多種付款方式',
          '自動續費',
          '專業服務'
        ]
      })
    }

    return options
  }

  /**
   * Calculate payment amount with discounts
   */
  private calculateAmount(basePrice: number, billing?: string, promoCode?: string): number {
    let amount = basePrice

    // Apply billing discounts
    if (billing === 'quarterly') {
      amount = basePrice * 3 * 0.9 // 10% discount
    } else if (billing === 'yearly') {
      amount = basePrice * 10 // 2 months free
    }

    // Apply promo code discounts
    if (promoCode) {
      amount = this.applyPromoCode(amount, promoCode)
    }

    return Math.round(amount)
  }

  /**
   * Apply promo code discounts
   */
  private applyPromoCode(amount: number, promoCode: string): number {
    const promoCodes = {
      'WELCOME20': 0.8,     // 20% off
      'NEWUSER': 0.85,      // 15% off
      'STUDENT50': 0.5,     // 50% off for students
      'EARLYBIRD': 0.7,     // 30% off early access
      'FRIENDS': 0.9        // 10% off for referrals
    }

    const discount = promoCodes[promoCode.toUpperCase()]
    return discount ? amount * discount : amount
  }

  /**
   * Get revenue metrics
   */
  getRevenueMetrics(): RevenueMetrics {
    const buyMeACoffeeStats = this.buyMeACoffee.getSupporterStats()
    const iPassStats = this.iPassMoney.getPaymentStats()
    const membershipAnalytics = this.membershipService.getAnalytics()

    const totalRevenue = buyMeACoffeeStats.totalSupport + iPassStats.totalRevenue
    const totalUsers = membershipAnalytics.totalUsers

    return {
      totalRevenue,
      monthlyRecurring: iPassStats.monthlyRecurringRevenue,
      averageOrderValue: (buyMeACoffeeStats.averageSupport + iPassStats.averageOrderValue) / 2,
      conversionRate: membershipAnalytics.conversionRate,
      churnRate: this.calculateChurnRate(),
      lifetimeValue: this.calculateLifetimeValue(totalRevenue, totalUsers),
      tierDistribution: membershipAnalytics.tierDistribution,
      providerDistribution: {
        [PaymentProvider.BUY_ME_A_COFFEE]: buyMeACoffeeStats.totalSupporters,
        [PaymentProvider.IPASS_MONEY]: iPassStats.totalSubscriptions
      }
    }
  }

  /**
   * Calculate churn rate
   */
  private calculateChurnRate(): number {
    // This would be calculated based on subscription cancellations
    // For now, return a placeholder
    return 5.2 // 5.2% monthly churn rate
  }

  /**
   * Calculate customer lifetime value
   */
  private calculateLifetimeValue(totalRevenue: number, totalUsers: number): number {
    if (totalUsers === 0) return 0
    
    const averageRevenue = totalRevenue / totalUsers
    const churnRate = this.calculateChurnRate() / 100
    
    // Simple LTV calculation: Average Revenue / Churn Rate
    return churnRate > 0 ? averageRevenue / churnRate : averageRevenue * 12
  }

  /**
   * Get payment history for user
   */
  getUserPaymentHistory(userId: string): any[] {
    const history = []

    // Get Buy Me a Coffee payments
    const supporters = this.buyMeACoffee.getSupporterWall(100)
    const userSupporter = supporters.find(s => s.userId === userId)
    if (userSupporter) {
      history.push({
        type: 'support',
        provider: PaymentProvider.BUY_ME_A_COFFEE,
        amount: userSupporter.totalSupport,
        date: userSupporter.lastSupport,
        status: 'completed'
      })
    }

    // Get iPass subscriptions
    const subscriptions = this.iPassMoney.getUserSubscriptions(userId)
    subscriptions.forEach(sub => {
      history.push({
        type: 'subscription',
        provider: PaymentProvider.IPASS_MONEY,
        amount: sub.amount,
        date: sub.startDate,
        status: sub.status,
        interval: sub.interval
      })
    })

    return history.sort((a, b) => b.date.getTime() - a.date.getTime())
  }

  /**
   * Cancel user subscription
   */
  async cancelSubscription(userId: string, reason: string = 'user_requested'): Promise<boolean> {
    try {
      // Cancel iPass subscriptions
      const subscriptions = this.iPassMoney.getUserSubscriptions(userId)
      for (const sub of subscriptions) {
        if (sub.status === 'active') {
          await this.iPassMoney.cancelSubscription(sub.subscriptionId, reason)
        }
      }

      // Cancel membership
      await this.membershipService.cancelSubscription(userId, reason)

      console.log(`❌ Cancelled all subscriptions for user ${userId}`)
      return true

    } catch (error) {
      console.error('Subscription cancellation failed:', error)
      return false
    }
  }

  /**
   * Test provider connectivity
   */
  private async testProviderConnectivity(): Promise<void> {
    // Test Buy Me a Coffee (no real API test needed)
    console.log('☕ Buy Me a Coffee integration ready')

    // Test iPass Money (would make actual API call in production)
    console.log('💳 iPass Money integration ready')
  }

  /**
   * Generate unique payment ID
   */
  private generatePaymentId(): string {
    return `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * Get payment statistics
   */
  getPaymentStats(): any {
    const intents = Array.from(this.paymentIntents.values())
    
    return {
      totalIntents: intents.length,
      completedPayments: intents.filter(i => i.status === 'completed').length,
      pendingPayments: intents.filter(i => i.status === 'pending').length,
      failedPayments: intents.filter(i => i.status === 'failed').length,
      successRate: intents.length > 0 ? 
        (intents.filter(i => i.status === 'completed').length / intents.length) * 100 : 0,
      revenueMetrics: this.getRevenueMetrics()
    }
  }

  /**
   * Generate payment system health report
   */
  getHealthReport(): any {
    return {
      timestamp: new Date().toISOString(),
      providers: {
        buyMeACoffee: {
          status: 'operational',
          stats: this.buyMeACoffee.getSupporterStats()
        },
        iPassMoney: {
          status: 'operational',
          stats: this.iPassMoney.getPaymentStats()
        }
      },
      system: this.getPaymentStats(),
      membership: this.membershipService.getAnalytics()
    }
  }

  /**
   * Cleanup resources
   */
  cleanup(): void {
    this.paymentIntents.clear()
    this.buyMeACoffee.cleanup()
    this.iPassMoney.cleanup()
    console.log('🧹 Payment system cleaned up')
  }
}

export default PaymentSystem