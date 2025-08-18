/**
 * Payment Service - Secure payment processing for Night God Tarot
 * Handles Buy Me Coffee and iPass Money integrations with security
 */

interface PaymentConfig {
  provider: 'buymeacoffee' | 'ipass'
  environment: 'sandbox' | 'production'
  apiKey?: string
  webhookSecret?: string
}

interface PaymentIntent {
  id: string
  amount: number
  currency: string
  status: 'pending' | 'processing' | 'succeeded' | 'failed' | 'cancelled'
  provider: string
  metadata: PaymentMetadata
  paymentUrl?: string
  expiresAt: Date
  createdAt: Date
}

interface PaymentMetadata {
  userId?: string
  membershipTier?: string
  donationAmount?: number
  customMessage?: string
  returnUrl: string
  cancelUrl: string
}

interface PaymentResult {
  success: boolean
  paymentIntent?: PaymentIntent
  error?: string
  redirectUrl?: string
}

class PaymentService {
  private config: PaymentConfig
  private baseUrl: string

  constructor(config: PaymentConfig) {
    this.config = config
    this.baseUrl = this.config.environment === 'production' 
      ? 'https://api.nightgodtarot.com'
      : 'http://localhost:3001'
  }

  /**
   * Create a secure payment intent for Buy Me Coffee
   */
  async createCoffeePayment(amount: number, message?: string): Promise<PaymentResult> {
    try {
      // Validate amount
      if (!this.validateAmount(amount, 'coffee')) {
        return { success: false, error: 'Invalid donation amount' }
      }

      // Sanitize user input
      const sanitizedMessage = this.sanitizeInput(message || '')

      const paymentData = {
        provider: 'buymeacoffee',
        amount: amount,
        currency: 'USD',
        type: 'donation',
        metadata: {
          customMessage: sanitizedMessage,
          returnUrl: `${window.location.origin}/payment-success`,
          cancelUrl: `${window.location.origin}/payment-cancel`,
          userId: this.getCurrentUserId()
        }
      }

      const response = await this.secureApiCall('/api/payments/create-intent', {
        method: 'POST',
        body: JSON.stringify(paymentData)
      })

      if (response.success) {
        // Track payment initiation
        this.trackPaymentEvent('coffee_payment_initiated', {
          amount,
          provider: 'buymeacoffee'
        })

        return {
          success: true,
          paymentIntent: response.data,
          redirectUrl: response.data.paymentUrl
        }
      } else {
        return { success: false, error: response.error || 'Payment creation failed' }
      }

    } catch (error) {
      console.error('Coffee payment creation error:', error)
      return { success: false, error: 'Network error. Please try again.' }
    }
  }

  /**
   * Create a secure payment intent for iPass membership upgrade
   */
  async createMembershipPayment(tierId: string, amount: number): Promise<PaymentResult> {
    try {
      // Validate membership tier and amount
      if (!this.validateMembershipTier(tierId, amount)) {
        return { success: false, error: 'Invalid membership tier or amount' }
      }

      const paymentData = {
        provider: 'ipass',
        amount: amount,
        currency: 'USD',
        type: 'membership',
        metadata: {
          membershipTier: tierId,
          returnUrl: `${window.location.origin}/membership-success`,
          cancelUrl: `${window.location.origin}/membership-cancel`,
          userId: this.getCurrentUserId()
        }
      }

      const response = await this.secureApiCall('/api/payments/create-intent', {
        method: 'POST',
        body: JSON.stringify(paymentData)
      })

      if (response.success) {
        // Track membership upgrade initiation
        this.trackPaymentEvent('membership_upgrade_initiated', {
          tier: tierId,
          amount,
          provider: 'ipass'
        })

        return {
          success: true,
          paymentIntent: response.data,
          redirectUrl: response.data.paymentUrl
        }
      } else {
        return { success: false, error: response.error || 'Payment creation failed' }
      }

    } catch (error) {
      console.error('Membership payment creation error:', error)
      return { success: false, error: 'Network error. Please try again.' }
    }
  }

  /**
   * Verify payment status with security checks
   */
  async verifyPayment(paymentId: string): Promise<PaymentResult> {
    try {
      const response = await this.secureApiCall(`/api/payments/verify/${paymentId}`, {
        method: 'GET'
      })

      if (response.success) {
        const payment = response.data

        // Verify payment integrity
        if (!this.verifyPaymentIntegrity(payment)) {
          return { success: false, error: 'Payment verification failed' }
        }

        // Track successful payment
        if (payment.status === 'succeeded') {
          this.trackPaymentEvent('payment_verified', {
            paymentId,
            amount: payment.amount,
            provider: payment.provider
          })
        }

        return { success: true, paymentIntent: payment }
      } else {
        return { success: false, error: response.error || 'Payment verification failed' }
      }

    } catch (error) {
      console.error('Payment verification error:', error)
      return { success: false, error: 'Verification failed. Please contact support.' }
    }
  }

  /**
   * Handle payment success callback
   */
  async handlePaymentSuccess(paymentId: string, signature?: string): Promise<boolean> {
    try {
      // Verify the payment with signature if provided
      const verificationResult = await this.verifyPayment(paymentId)
      
      if (!verificationResult.success || !verificationResult.paymentIntent) {
        return false
      }

      const payment = verificationResult.paymentIntent

      // Process based on payment type
      if (payment.metadata.membershipTier) {
        await this.processMembershipUpgrade(payment)
      } else {
        await this.processDonation(payment)
      }

      // Track successful completion
      this.trackPaymentEvent('payment_completed', {
        paymentId,
        amount: payment.amount,
        provider: payment.provider,
        type: payment.metadata.membershipTier ? 'membership' : 'donation'
      })

      return true

    } catch (error) {
      console.error('Payment success handling error:', error)
      return false
    }
  }

  /**
   * Handle payment failure or cancellation
   */
  async handlePaymentFailure(paymentId: string, reason: string): Promise<void> {
    try {
      // Track payment failure
      this.trackPaymentEvent('payment_failed', {
        paymentId,
        reason,
        timestamp: new Date().toISOString()
      })

      // Notify backend of failure
      await this.secureApiCall('/api/payments/failure', {
        method: 'POST',
        body: JSON.stringify({ paymentId, reason })
      })

    } catch (error) {
      console.error('Payment failure handling error:', error)
    }
  }

  /**
   * Get payment history for user
   */
  async getPaymentHistory(limit: number = 10): Promise<PaymentIntent[]> {
    try {
      const response = await this.secureApiCall(`/api/payments/history?limit=${limit}`, {
        method: 'GET'
      })

      return response.success ? response.data : []

    } catch (error) {
      console.error('Payment history error:', error)
      return []
    }
  }

  // =================== PRIVATE SECURITY METHODS ===================

  private async secureApiCall(endpoint: string, options: RequestInit): Promise<any> {
    const headers = new Headers(options.headers)
    
    // Add security headers
    headers.set('Content-Type', 'application/json')
    headers.set('X-Requested-With', 'XMLHttpRequest')
    
    // Add auth token if available
    const authToken = this.getAuthToken()
    if (authToken) {
      headers.set('Authorization', `Bearer ${authToken}`)
    }

    // Add CSRF protection
    const csrfToken = this.getCSRFToken()
    if (csrfToken) {
      headers.set('X-CSRF-Token', csrfToken)
    }

    // Add request timestamp for replay attack protection
    headers.set('X-Request-Time', Date.now().toString())

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
      credentials: 'include', // Include cookies for session management
      mode: 'cors'
    })

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  private validateAmount(amount: number, type: 'coffee' | 'membership'): boolean {
    if (typeof amount !== 'number' || amount <= 0) {
      return false
    }

    if (type === 'coffee') {
      // Coffee donations: $1 - $500
      return amount >= 1 && amount <= 500
    } else {
      // Membership: $5 - $50
      return amount >= 5 && amount <= 50
    }
  }

  private validateMembershipTier(tierId: string, amount: number): boolean {
    const validTiers: Record<string, number> = {
      'moon-shadow': 5,
      'night-god': 12
    }

    return validTiers[tierId] === amount
  }

  private sanitizeInput(input: string): string {
    // Remove potential XSS attacks
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/[<>]/g, '')
      .trim()
      .substring(0, 500) // Limit length
  }

  private verifyPaymentIntegrity(payment: PaymentIntent): boolean {
    // Check required fields
    if (!payment.id || !payment.amount || !payment.provider) {
      return false
    }

    // Check amount is positive
    if (payment.amount <= 0) {
      return false
    }

    // Check timestamp is reasonable (within last 24 hours)
    const now = new Date()
    const paymentTime = new Date(payment.createdAt)
    const timeDiff = now.getTime() - paymentTime.getTime()
    
    if (timeDiff > 24 * 60 * 60 * 1000) { // 24 hours
      return false
    }

    return true
  }

  private async processMembershipUpgrade(payment: PaymentIntent): Promise<void> {
    // This would update user's membership tier in the backend
    await this.secureApiCall('/api/user/upgrade-membership', {
      method: 'POST',
      body: JSON.stringify({
        paymentId: payment.id,
        tier: payment.metadata.membershipTier
      })
    })
  }

  private async processDonation(payment: PaymentIntent): Promise<void> {
    // This would record the donation and possibly send thank you email
    await this.secureApiCall('/api/donations/record', {
      method: 'POST',
      body: JSON.stringify({
        paymentId: payment.id,
        amount: payment.amount,
        message: payment.metadata.customMessage
      })
    })
  }

  private trackPaymentEvent(eventName: string, data: any): void {
    // Google Analytics tracking
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', eventName, data)
    }

    // Console logging for development
    console.log(`Payment Event: ${eventName}`, data)
  }

  private getCurrentUserId(): string | undefined {
    // Get user ID from localStorage or context
    return localStorage.getItem('userId') || undefined
  }

  private getAuthToken(): string | null {
    return localStorage.getItem('authToken')
  }

  private getCSRFToken(): string | null {
    // Get CSRF token from meta tag or cookie
    const metaElement = document.querySelector('meta[name="csrf-token"]')
    return metaElement ? metaElement.getAttribute('content') : null
  }
}

// Create and export singleton instance
export const paymentService = new PaymentService({
  provider: 'ipass', // default provider
  environment: import.meta.env.PROD ? 'production' : 'sandbox'
})

// Export types for use in components
export type { PaymentIntent, PaymentResult, PaymentMetadata }