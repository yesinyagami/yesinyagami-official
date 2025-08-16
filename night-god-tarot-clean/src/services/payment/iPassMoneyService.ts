/**
 * iPass Money Payment Integration
 * Handles Taiwan-focused payments, subscriptions, and invoicing for Night God tier
 */

import crypto from 'crypto'
import { MembershipService } from '../membership/MembershipService'
import { TierLevel } from '../membership/MembershipTiers'

export enum PaymentMethod {
  CREDIT_CARD = 'credit-card',
  LINE_PAY = 'line-pay',
  JKO_PAY = 'jko-pay',
  TAIWAN_PAY = 'taiwan-pay',
  APPLE_PAY = 'apple-pay',
  GOOGLE_PAY = 'google-pay'
}

export enum InvoiceType {
  ELECTRONIC = 'electronic',
  PAPER = 'paper',
  DONATION = 'donation'
}

export enum SubscriptionInterval {
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  YEARLY = 'yearly'
}

export interface iPassConfig {
  merchantId: string
  apiKey: string
  apiSecret: string
  environment: 'sandbox' | 'production'
  webhookUrl: string
  returnUrl: string
  cancelUrl: string
}

export interface PaymentRequest {
  orderId: string
  userId: string
  amount: number
  currency: 'TWD'
  description: string
  method: PaymentMethod
  invoice: InvoiceRequest
  subscription?: SubscriptionRequest
  metadata: Record<string, any>
}

export interface InvoiceRequest {
  type: InvoiceType
  buyerEmail?: string
  buyerName?: string
  buyerPhone?: string
  buyerAddress?: string
  taxId?: string
  donationCode?: string
}

export interface SubscriptionRequest {
  interval: SubscriptionInterval
  startDate?: Date
  endDate?: Date
  autoRenew: boolean
  trialDays?: number
}

export interface PaymentResponse {
  success: boolean
  paymentId: string
  orderId: string
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled'
  amount: number
  currency: string
  paymentUrl?: string
  qrCode?: string
  error?: string
  metadata: Record<string, any>
}

export interface SubscriptionInfo {
  subscriptionId: string
  userId: string
  tier: TierLevel
  status: 'active' | 'pending' | 'cancelled' | 'expired'
  interval: SubscriptionInterval
  amount: number
  currency: string
  startDate: Date
  endDate: Date
  nextBillingDate: Date
  autoRenew: boolean
  paymentMethod: PaymentMethod
  invoiceSettings: InvoiceRequest
  metadata: Record<string, any>
}

export class iPassMoneyService {
  private static instance: iPassMoneyService
  private membershipService: MembershipService
  private config: iPassConfig
  private subscriptions: Map<string, SubscriptionInfo> = new Map()
  private payments: Map<string, PaymentResponse> = new Map()

  private constructor() {
    this.membershipService = MembershipService.getInstance()
    this.config = {
      merchantId: process.env.IPASS_MERCHANT_ID || '',
      apiKey: process.env.IPASS_API_KEY || '',
      apiSecret: process.env.IPASS_API_SECRET || '',
      environment: (process.env.IPASS_ENVIRONMENT as 'sandbox' | 'production') || 'sandbox',
      webhookUrl: process.env.IPASS_WEBHOOK_URL || '/api/webhooks/ipass',
      returnUrl: process.env.IPASS_RETURN_URL || '/payment/success',
      cancelUrl: process.env.IPASS_CANCEL_URL || '/payment/cancel'
    }
  }

  static getInstance(): iPassMoneyService {
    if (!iPassMoneyService.instance) {
      iPassMoneyService.instance = new iPassMoneyService()
    }
    return iPassMoneyService.instance
  }

  /**
   * Create payment for Night God tier
   */
  async createPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      const orderId = request.orderId || this.generateOrderId()
      
      // Build payment request for iPass Money API
      const paymentData = {
        merchant_id: this.config.merchantId,
        order_id: orderId,
        amount: request.amount,
        currency: request.currency,
        description: request.description,
        payment_method: request.method,
        return_url: this.config.returnUrl,
        cancel_url: this.config.cancelUrl,
        webhook_url: this.config.webhookUrl,
        invoice: this.buildInvoiceData(request.invoice),
        subscription: request.subscription ? this.buildSubscriptionData(request.subscription) : null,
        metadata: request.metadata,
        timestamp: Date.now()
      }

      // Add signature for security
      paymentData['signature'] = this.generateSignature(paymentData)

      // Make API call to iPass Money
      const response = await this.callIPassAPI('/payments/create', paymentData)

      const paymentResponse: PaymentResponse = {
        success: response.success,
        paymentId: response.payment_id,
        orderId: orderId,
        status: response.status,
        amount: request.amount,
        currency: request.currency,
        paymentUrl: response.payment_url,
        qrCode: response.qr_code,
        error: response.error,
        metadata: request.metadata
      }

      // Store payment record
      this.payments.set(paymentResponse.paymentId, paymentResponse)

      // Create subscription record if needed
      if (request.subscription && response.subscription_id) {
        await this.createSubscription(request.userId, response.subscription_id, request, response)
      }

      console.log(`💳 Created iPass payment: ${orderId} for ${request.amount} TWD`)
      return paymentResponse

    } catch (error) {
      console.error('iPass payment creation failed:', error)
      throw error
    }
  }

  /**
   * Create subscription record
   */
  private async createSubscription(
    userId: string, 
    subscriptionId: string, 
    request: PaymentRequest, 
    response: any
  ): Promise<void> {
    const subscription: SubscriptionInfo = {
      subscriptionId,
      userId,
      tier: TierLevel.NIGHT_GOD,
      status: 'pending',
      interval: request.subscription!.interval,
      amount: request.amount,
      currency: request.currency,
      startDate: request.subscription!.startDate || new Date(),
      endDate: request.subscription!.endDate || this.calculateEndDate(request.subscription!.interval),
      nextBillingDate: this.calculateNextBillingDate(request.subscription!.interval),
      autoRenew: request.subscription!.autoRenew,
      paymentMethod: request.method,
      invoiceSettings: request.invoice,
      metadata: request.metadata
    }

    this.subscriptions.set(subscriptionId, subscription)
    console.log(`📋 Created subscription ${subscriptionId} for user ${userId}`)
  }

  /**
   * Process iPass webhook
   */
  async processWebhook(webhookData: any): Promise<void> {
    try {
      // Validate webhook signature
      if (!this.validateWebhookSignature(webhookData)) {
        throw new Error('Invalid webhook signature')
      }

      const { event_type, payment_id, subscription_id, status, metadata } = webhookData

      switch (event_type) {
        case 'payment.completed':
          await this.handlePaymentCompleted(payment_id, webhookData)
          break
        
        case 'payment.failed':
          await this.handlePaymentFailed(payment_id, webhookData)
          break

        case 'subscription.activated':
          await this.handleSubscriptionActivated(subscription_id, webhookData)
          break

        case 'subscription.renewed':
          await this.handleSubscriptionRenewed(subscription_id, webhookData)
          break

        case 'subscription.cancelled':
          await this.handleSubscriptionCancelled(subscription_id, webhookData)
          break

        case 'invoice.issued':
          await this.handleInvoiceIssued(webhookData)
          break

        default:
          console.warn(`Unknown webhook event: ${event_type}`)
      }

      console.log(`📡 Processed iPass webhook: ${event_type}`)

    } catch (error) {
      console.error('iPass webhook processing failed:', error)
      throw error
    }
  }

  /**
   * Handle payment completed
   */
  private async handlePaymentCompleted(paymentId: string, data: any): Promise<void> {
    const payment = this.payments.get(paymentId)
    if (!payment) return

    payment.status = 'completed'
    this.payments.set(paymentId, payment)

    // Upgrade user to Night God tier
    if (payment.metadata.userId) {
      await this.membershipService.upgradeMembership(
        payment.metadata.userId,
        TierLevel.NIGHT_GOD,
        paymentId,
        'ipass',
        {
          paymentMethod: payment.metadata.paymentMethod,
          amount: payment.amount,
          invoiceNumber: data.invoice_number
        }
      )
    }
  }

  /**
   * Handle payment failed
   */
  private async handlePaymentFailed(paymentId: string, data: any): Promise<void> {
    const payment = this.payments.get(paymentId)
    if (!payment) return

    payment.status = 'failed'
    payment.error = data.error_message
    this.payments.set(paymentId, payment)

    console.log(`❌ Payment failed: ${paymentId} - ${data.error_message}`)
  }

  /**
   * Handle subscription activated
   */
  private async handleSubscriptionActivated(subscriptionId: string, data: any): Promise<void> {
    const subscription = this.subscriptions.get(subscriptionId)
    if (!subscription) return

    subscription.status = 'active'
    this.subscriptions.set(subscriptionId, subscription)

    // Activate Night God tier membership
    await this.membershipService.upgradeMembership(
      subscription.userId,
      TierLevel.NIGHT_GOD,
      subscriptionId,
      'ipass',
      {
        subscriptionId,
        interval: subscription.interval,
        nextBillingDate: subscription.nextBillingDate
      }
    )

    console.log(`✅ Subscription activated: ${subscriptionId}`)
  }

  /**
   * Handle subscription renewed
   */
  private async handleSubscriptionRenewed(subscriptionId: string, data: any): Promise<void> {
    const subscription = this.subscriptions.get(subscriptionId)
    if (!subscription) return

    // Update billing dates
    subscription.nextBillingDate = this.calculateNextBillingDate(subscription.interval)
    subscription.endDate = this.calculateEndDate(subscription.interval)
    this.subscriptions.set(subscriptionId, subscription)

    // Renew membership
    await this.membershipService.renewMembership(subscription.userId)

    console.log(`🔄 Subscription renewed: ${subscriptionId}`)
  }

  /**
   * Handle subscription cancelled
   */
  private async handleSubscriptionCancelled(subscriptionId: string, data: any): Promise<void> {
    const subscription = this.subscriptions.get(subscriptionId)
    if (!subscription) return

    subscription.status = 'cancelled'
    subscription.autoRenew = false
    this.subscriptions.set(subscriptionId, subscription)

    // Cancel user subscription
    await this.membershipService.cancelSubscription(subscription.userId, 'ipass_cancellation')

    console.log(`❌ Subscription cancelled: ${subscriptionId}`)
  }

  /**
   * Handle invoice issued
   */
  private async handleInvoiceIssued(data: any): Promise<void> {
    // Store invoice information
    console.log(`📄 Invoice issued: ${data.invoice_number}`)
  }

  /**
   * Cancel subscription
   */
  async cancelSubscription(subscriptionId: string, reason: string = 'user_requested'): Promise<boolean> {
    try {
      const subscription = this.subscriptions.get(subscriptionId)
      if (!subscription) return false

      // Call iPass API to cancel subscription
      const cancelData = {
        merchant_id: this.config.merchantId,
        subscription_id: subscriptionId,
        reason,
        timestamp: Date.now()
      }

      cancelData['signature'] = this.generateSignature(cancelData)

      const response = await this.callIPassAPI('/subscriptions/cancel', cancelData)

      if (response.success) {
        subscription.status = 'cancelled'
        subscription.autoRenew = false
        this.subscriptions.set(subscriptionId, subscription)

        // Cancel membership
        await this.membershipService.cancelSubscription(subscription.userId, reason)

        console.log(`❌ Cancelled subscription: ${subscriptionId}`)
        return true
      }

      return false

    } catch (error) {
      console.error('Subscription cancellation failed:', error)
      return false
    }
  }

  /**
   * Get subscription info
   */
  getSubscription(subscriptionId: string): SubscriptionInfo | null {
    return this.subscriptions.get(subscriptionId) || null
  }

  /**
   * Get user subscriptions
   */
  getUserSubscriptions(userId: string): SubscriptionInfo[] {
    return Array.from(this.subscriptions.values())
      .filter(sub => sub.userId === userId)
      .sort((a, b) => b.startDate.getTime() - a.startDate.getTime())
  }

  /**
   * Generate payment options for Taiwan market
   */
  getPaymentOptions(): any[] {
    return [
      {
        method: PaymentMethod.CREDIT_CARD,
        name: '信用卡',
        icon: '💳',
        description: '支援 VISA、MasterCard、JCB',
        fees: '0%',
        popular: true
      },
      {
        method: PaymentMethod.LINE_PAY,
        name: 'LINE Pay',
        icon: '🟢',
        description: '使用 LINE 快速付款',
        fees: '0%',
        bonus: 'LINE Points 回饋'
      },
      {
        method: PaymentMethod.JKO_PAY,
        name: '街口支付',
        icon: '🏪',
        description: '街口支付快速結帳',
        fees: '0%',
        bonus: '街口幣回饋'
      },
      {
        method: PaymentMethod.TAIWAN_PAY,
        name: 'Taiwan Pay',
        icon: '🇹🇼',
        description: '台灣行動支付',
        fees: '0%'
      },
      {
        method: PaymentMethod.APPLE_PAY,
        name: 'Apple Pay',
        icon: '🍎',
        description: 'Touch ID / Face ID 快速付款',
        fees: '0%'
      },
      {
        method: PaymentMethod.GOOGLE_PAY,
        name: 'Google Pay',
        icon: '🔵',
        description: 'Google 快速付款',
        fees: '0%'
      }
    ]
  }

  /**
   * Generate invoice options
   */
  getInvoiceOptions(): any[] {
    return [
      {
        type: InvoiceType.ELECTRONIC,
        name: '電子發票',
        description: '發票將寄送至您的 Email',
        required: ['email'],
        popular: true
      },
      {
        type: InvoiceType.PAPER,
        name: '紙本發票',
        description: '郵寄紙本發票至指定地址',
        required: ['name', 'phone', 'address'],
        additionalFee: 15
      },
      {
        type: InvoiceType.DONATION,
        name: '發票捐贈',
        description: '將發票捐贈給公益團體',
        required: ['donationCode'],
        bonus: '做愛心！'
      }
    ]
  }

  /**
   * Calculate subscription pricing with Taiwan-specific discounts
   */
  calculateSubscriptionPricing(interval: SubscriptionInterval): any {
    const basePrice = 899 // Night God tier base price

    const pricing = {
      [SubscriptionInterval.MONTHLY]: {
        price: basePrice,
        total: basePrice,
        discount: 0,
        description: '每月付款'
      },
      [SubscriptionInterval.QUARTERLY]: {
        price: basePrice * 3,
        total: basePrice * 2.7, // 10% discount
        discount: 10,
        description: '季付優惠 - 省 10%',
        savings: basePrice * 0.3
      },
      [SubscriptionInterval.YEARLY]: {
        price: basePrice * 12,
        total: basePrice * 10, // 2 months free
        discount: 17,
        description: '年付最優惠 - 送 2 個月',
        savings: basePrice * 2
      }
    }

    return pricing[interval]
  }

  /**
   * Build invoice data for API
   */
  private buildInvoiceData(invoice: InvoiceRequest): any {
    return {
      type: invoice.type,
      buyer_email: invoice.buyerEmail,
      buyer_name: invoice.buyerName,
      buyer_phone: invoice.buyerPhone,
      buyer_address: invoice.buyerAddress,
      tax_id: invoice.taxId,
      donation_code: invoice.donationCode
    }
  }

  /**
   * Build subscription data for API
   */
  private buildSubscriptionData(subscription: SubscriptionRequest): any {
    return {
      interval: subscription.interval,
      start_date: subscription.startDate?.toISOString(),
      end_date: subscription.endDate?.toISOString(),
      auto_renew: subscription.autoRenew,
      trial_days: subscription.trialDays
    }
  }

  /**
   * Calculate end date based on interval
   */
  private calculateEndDate(interval: SubscriptionInterval): Date {
    const now = new Date()
    
    switch (interval) {
      case SubscriptionInterval.MONTHLY:
        return new Date(now.setMonth(now.getMonth() + 1))
      case SubscriptionInterval.QUARTERLY:
        return new Date(now.setMonth(now.getMonth() + 3))
      case SubscriptionInterval.YEARLY:
        return new Date(now.setFullYear(now.getFullYear() + 1))
      default:
        return new Date(now.setMonth(now.getMonth() + 1))
    }
  }

  /**
   * Calculate next billing date
   */
  private calculateNextBillingDate(interval: SubscriptionInterval): Date {
    return this.calculateEndDate(interval)
  }

  /**
   * Generate order ID
   */
  private generateOrderId(): string {
    return `NGT_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * Generate API signature
   */
  private generateSignature(data: any): string {
    const sortedKeys = Object.keys(data).sort()
    const signatureString = sortedKeys
      .map(key => `${key}=${data[key]}`)
      .join('&') + `&key=${this.config.apiSecret}`
    
    return crypto.createHash('sha256').update(signatureString).digest('hex')
  }

  /**
   * Validate webhook signature
   */
  private validateWebhookSignature(data: any): boolean {
    const receivedSignature = data.signature
    delete data.signature
    
    const calculatedSignature = this.generateSignature(data)
    return receivedSignature === calculatedSignature
  }

  /**
   * Call iPass Money API
   */
  private async callIPassAPI(endpoint: string, data: any): Promise<any> {
    const baseUrl = this.config.environment === 'production' 
      ? 'https://api.ipass.com.tw' 
      : 'https://sandbox-api.ipass.com.tw'
    
    const response = await fetch(`${baseUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`
      },
      body: JSON.stringify(data)
    })

    if (!response.ok) {
      throw new Error(`iPass API error: ${response.status} ${response.statusText}`)
    }

    return await response.json()
  }

  /**
   * Get payment and subscription statistics
   */
  getPaymentStats(): any {
    const payments = Array.from(this.payments.values())
    const subscriptions = Array.from(this.subscriptions.values())

    const totalRevenue = payments
      .filter(p => p.status === 'completed')
      .reduce((sum, p) => sum + p.amount, 0)

    const activeSubscriptions = subscriptions.filter(s => s.status === 'active').length
    const monthlyRecurring = subscriptions
      .filter(s => s.status === 'active' && s.interval === SubscriptionInterval.MONTHLY)
      .reduce((sum, s) => sum + s.amount, 0)

    return {
      totalPayments: payments.length,
      completedPayments: payments.filter(p => p.status === 'completed').length,
      totalRevenue,
      totalSubscriptions: subscriptions.length,
      activeSubscriptions,
      monthlyRecurringRevenue: monthlyRecurring,
      averageOrderValue: payments.length > 0 ? totalRevenue / payments.length : 0,
      paymentMethodDistribution: this.getPaymentMethodDistribution()
    }
  }

  /**
   * Get payment method distribution
   */
  private getPaymentMethodDistribution(): Record<string, number> {
    const payments = Array.from(this.payments.values())
    return payments.reduce((acc, payment) => {
      const method = payment.metadata.paymentMethod || 'unknown'
      acc[method] = (acc[method] || 0) + 1
      return acc
    }, {} as Record<string, number>)
  }

  /**
   * Cleanup resources
   */
  cleanup(): void {
    this.subscriptions.clear()
    this.payments.clear()
  }
}

export default iPassMoneyService