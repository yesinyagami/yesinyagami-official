/**
 * Buy Me a Coffee Payment Integration
 * Handles payments, supporter wall, and rewards for Moon Shadow tier
 */

import { MembershipService } from '../membership/MembershipService'
import { TierLevel } from '../membership/MembershipTiers'

export interface BuyMeACoffeeConfig {
  profileUrl: string
  webhookSecret: string
  supporterWallEnabled: boolean
  customAmounts: number[]
  rewards: Record<string, string>
}

export interface BuyMeACoffeePayment {
  supporterId: string
  supporterName: string
  supporterEmail?: string
  supportMessage?: string
  amount: number
  currency: string
  coffeeCount: number
  timestamp: Date
  paymentId: string
  recurring: boolean
  isPrivate: boolean
}

export interface SupporterProfile {
  id: string
  name: string
  totalSupport: number
  coffeeCount: number
  joinDate: Date
  lastSupport: Date
  isPrivate: boolean
  avatar?: string
  message?: string
  tier: 'coffee' | 'pizza' | 'bouquet' | 'custom'
  userId?: string // If linked to Night God Tarot account
}

export class BuyMeACoffeeService {
  private static instance: BuyMeACoffeeService
  private membershipService: MembershipService
  private supporters: Map<string, SupporterProfile> = new Map()
  private payments: BuyMeACoffeePayment[] = []
  private config: BuyMeACoffeeConfig

  private constructor() {
    this.membershipService = MembershipService.getInstance()
    this.config = {
      profileUrl: process.env.BUYMEACOFFEE_PROFILE_URL || 'https://buymeacoffee.com/nightgodtarot',
      webhookSecret: process.env.BUYMEACOFFEE_WEBHOOK_SECRET || '',
      supporterWallEnabled: true,
      customAmounts: [99, 299, 599, 999],
      rewards: {
        coffee: '1-day-premium',      // 1 coffee = 1 day Moon Shadow
        pizza: '7-days-premium',      // 3-5 coffees = 1 week Moon Shadow  
        bouquet: '30-days-premium',   // 10+ coffees = 1 month Moon Shadow
        custom: 'custom-duration'     // Custom amounts = calculated duration
      }
    }
  }

  static getInstance(): BuyMeACoffeeService {
    if (!BuyMeACoffeeService.instance) {
      BuyMeACoffeeService.instance = new BuyMeACoffeeService()
    }
    return BuyMeACoffeeService.instance
  }

  /**
   * Process Buy Me a Coffee webhook
   */
  async processWebhook(webhookData: any): Promise<void> {
    try {
      // Validate webhook signature
      if (!this.validateWebhookSignature(webhookData)) {
        throw new Error('Invalid webhook signature')
      }

      const payment = this.parseWebhookData(webhookData)
      
      // Store payment record
      this.payments.push(payment)
      
      // Update or create supporter profile
      await this.updateSupporterProfile(payment)
      
      // Process membership benefits
      await this.processMembershipBenefits(payment)
      
      console.log(`☕ Processed Buy Me a Coffee payment: ${payment.amount} ${payment.currency} from ${payment.supporterName}`)
      
    } catch (error) {
      console.error('Buy Me a Coffee webhook processing failed:', error)
      throw error
    }
  }

  /**
   * Parse webhook data into payment object
   */
  private parseWebhookData(data: any): BuyMeACoffeePayment {
    return {
      supporterId: data.supporter_id || data.supporter?.id || `supporter_${Date.now()}`,
      supporterName: data.supporter_name || data.supporter?.name || 'Anonymous Supporter',
      supporterEmail: data.supporter_email || data.supporter?.email,
      supportMessage: data.support_message || data.message,
      amount: parseFloat(data.support_amount || data.amount || 0),
      currency: data.currency || 'TWD',
      coffeeCount: parseInt(data.support_coffees || data.coffees || 1),
      timestamp: new Date(data.support_created_on || data.created_at || Date.now()),
      paymentId: data.support_id || data.id || `payment_${Date.now()}`,
      recurring: data.is_recurring || false,
      isPrivate: data.is_private || false
    }
  }

  /**
   * Update supporter profile
   */
  private async updateSupporterProfile(payment: BuyMeACoffeePayment): Promise<void> {
    let supporter = this.supporters.get(payment.supporterId)
    
    if (!supporter) {
      supporter = {
        id: payment.supporterId,
        name: payment.supporterName,
        totalSupport: 0,
        coffeeCount: 0,
        joinDate: payment.timestamp,
        lastSupport: payment.timestamp,
        isPrivate: payment.isPrivate,
        tier: 'coffee'
      }
    }

    // Update supporter data
    supporter.totalSupport += payment.amount
    supporter.coffeeCount += payment.coffeeCount
    supporter.lastSupport = payment.timestamp
    supporter.message = payment.supportMessage

    // Determine supporter tier based on total coffee count
    if (supporter.coffeeCount >= 10) {
      supporter.tier = 'bouquet'
    } else if (supporter.coffeeCount >= 3) {
      supporter.tier = 'pizza'
    } else {
      supporter.tier = 'coffee'
    }

    this.supporters.set(payment.supporterId, supporter)
  }

  /**
   * Process membership benefits for payment
   */
  private async processMembershipBenefits(payment: BuyMeACoffeePayment): Promise<void> {
    // Try to find linked user account
    const userId = await this.findLinkedUser(payment.supporterEmail)
    
    if (!userId) {
      console.log(`No linked account found for supporter ${payment.supporterName}`)
      return
    }

    // Calculate premium duration based on amount
    const premiumDays = this.calculatePremiumDays(payment.amount, payment.coffeeCount)
    
    if (premiumDays > 0) {
      // Upgrade to Moon Shadow tier
      await this.membershipService.upgradeMembership(
        userId,
        TierLevel.MOON_SHADOW,
        payment.paymentId,
        'buymeacoffee',
        {
          supporterId: payment.supporterId,
          supporterName: payment.supporterName,
          amount: payment.amount,
          coffeeCount: payment.coffeeCount,
          duration: premiumDays,
          message: payment.supportMessage
        }
      )

      console.log(`🎉 Granted ${premiumDays} days of Moon Shadow tier to user ${userId}`)
    }
  }

  /**
   * Calculate premium days based on coffee count and amount
   */
  private calculatePremiumDays(amount: number, coffeeCount: number): number {
    // Base calculation: 1 coffee = 1 day, with bonuses for larger amounts
    let days = coffeeCount

    // Bonus days for larger amounts
    if (amount >= 999) {
      days += 15 // Bonus 15 days for large support
    } else if (amount >= 599) {
      days += 10 // Bonus 10 days
    } else if (amount >= 299) {
      days += 5  // Bonus 5 days
    }

    // Minimum 1 day for any payment
    return Math.max(days, 1)
  }

  /**
   * Find linked user account by email
   */
  private async findLinkedUser(email?: string): Promise<string | null> {
    if (!email) return null
    
    // This would typically query the user database
    // For now, return null - user would need to link account manually
    return null
  }

  /**
   * Link supporter to user account
   */
  async linkSupporterToUser(supporterId: string, userId: string): Promise<boolean> {
    const supporter = this.supporters.get(supporterId)
    if (!supporter) return false

    supporter.userId = userId
    this.supporters.set(supporterId, supporter)

    // Grant any pending benefits
    const userPayments = this.payments.filter(p => p.supporterId === supporterId)
    for (const payment of userPayments) {
      await this.processMembershipBenefits(payment)
    }

    console.log(`🔗 Linked supporter ${supporterId} to user ${userId}`)
    return true
  }

  /**
   * Get supporter wall data
   */
  getSupporterWall(limit: number = 50): SupporterProfile[] {
    return Array.from(this.supporters.values())
      .filter(supporter => !supporter.isPrivate)
      .sort((a, b) => b.totalSupport - a.totalSupport)
      .slice(0, limit)
  }

  /**
   * Get top supporters by coffee count
   */
  getTopSupporters(limit: number = 10): SupporterProfile[] {
    return Array.from(this.supporters.values())
      .filter(supporter => !supporter.isPrivate)
      .sort((a, b) => b.coffeeCount - a.coffeeCount)
      .slice(0, limit)
  }

  /**
   * Get recent supporters
   */
  getRecentSupporters(limit: number = 20): SupporterProfile[] {
    return Array.from(this.supporters.values())
      .filter(supporter => !supporter.isPrivate)
      .sort((a, b) => b.lastSupport.getTime() - a.lastSupport.getTime())
      .slice(0, limit)
  }

  /**
   * Get supporter statistics
   */
  getSupporterStats(): any {
    const supporters = Array.from(this.supporters.values())
    const totalSupport = supporters.reduce((sum, s) => sum + s.totalSupport, 0)
    const totalCoffees = supporters.reduce((sum, s) => sum + s.coffeeCount, 0)

    const tierCounts = supporters.reduce((acc, supporter) => {
      acc[supporter.tier] = (acc[supporter.tier] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const monthlySupport = this.payments
      .filter(p => {
        const oneMonthAgo = new Date()
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)
        return p.timestamp >= oneMonthAgo
      })
      .reduce((sum, p) => sum + p.amount, 0)

    return {
      totalSupporters: supporters.length,
      totalSupport,
      totalCoffees,
      monthlySupport,
      averageSupport: supporters.length > 0 ? totalSupport / supporters.length : 0,
      tierDistribution: tierCounts,
      publicSupporters: supporters.filter(s => !s.isPrivate).length,
      recentPayments: this.payments.slice(-10)
    }
  }

  /**
   * Generate Buy Me a Coffee integration code
   */
  generateEmbedCode(): string {
    return `
      <!-- Buy Me a Coffee Integration -->
      <script data-name="BMC-Widget" 
              data-cfasync="false" 
              src="https://cdnjs.buymeacoffee.com/1.0.0/widget.prod.min.js" 
              data-id="nightgodtarot" 
              data-description="Support Night God Tarot development!" 
              data-message="感謝您支持夜神塔羅的發展 ✨" 
              data-color="#8b5cf6" 
              data-position="Right" 
              data-x_margin="18" 
              data-y_margin="18">
      </script>
    `
  }

  /**
   * Generate custom support buttons
   */
  generateSupportButtons(): any[] {
    return [
      {
        amount: 99,
        coffees: 1,
        title: '支持開發',
        description: '請我喝一杯咖啡 ☕',
        reward: '解鎖1天月影守護者',
        color: '#8b5cf6',
        icon: '☕'
      },
      {
        amount: 299,
        coffees: 3,
        title: '月影守護者',
        description: '解鎖進階功能 🌙',
        reward: '1個月進階會員',
        color: '#8b5cf6',
        icon: '🌙✨',
        popular: true
      },
      {
        amount: 599,
        coffees: 6,
        title: '深度支持',
        description: '請我吃頓好的 🍕',
        reward: '2個月進階會員 + 獎勵',
        color: '#8b5cf6',
        icon: '🍕'
      },
      {
        amount: 999,
        coffees: 10,
        title: '超級支持者',
        description: '送我一束花 💐',
        reward: '3個月進階會員 + 特殊獎勵',
        color: '#f59e0b',
        icon: '💐'
      }
    ]
  }

  /**
   * Validate webhook signature
   */
  private validateWebhookSignature(data: any): boolean {
    // Buy Me a Coffee webhook validation
    // This would include actual signature validation in production
    return true
  }

  /**
   * Generate supporter thank you message
   */
  generateThankYouMessage(supporter: SupporterProfile): string {
    const messages = {
      coffee: `感謝 ${supporter.name} 的咖啡支持！☕ 您的支持讓夜神塔羅能夠持續為大家服務。`,
      pizza: `感謝 ${supporter.name} 的慷慨支持！🍕 您已經是我們珍貴的支持者！`,
      bouquet: `感謝 ${supporter.name} 的超級支持！💐 您是夜神塔羅最重要的支持者之一！`,
      custom: `感謝 ${supporter.name} 的特別支持！✨ 您的支持對我們意義重大！`
    }

    return messages[supporter.tier] || messages.custom
  }

  /**
   * Schedule reminder for supporters
   */
  async scheduleSupporter Reminder(supporterId: string, days: number): Promise<void> {
    // This would schedule a reminder email/notification
    console.log(`📅 Scheduled reminder for supporter ${supporterId} in ${days} days`)
  }

  /**
   * Export supporter data
   */
  exportSupporterData(): any {
    return {
      supporters: Array.from(this.supporters.values()),
      payments: this.payments,
      stats: this.getSupporterStats(),
      exportDate: new Date().toISOString()
    }
  }

  /**
   * Cleanup resources
   */
  cleanup(): void {
    this.supporters.clear()
    this.payments = []
  }
}

export default BuyMeACoffeeService