/**
 * Subscription Manager
 * Handles subscription lifecycle, auto-renewal, and waiting list management
 */

import { MembershipService } from '../membership/MembershipService'
import { PaymentSystem } from '../payment/PaymentSystem'
import { envManager } from '../../config/env'
import type { 
  User, 
  MembershipTier, 
  TierLevel,
  PaymentPlatform 
} from '../../types/membership'

export interface Subscription {
  id: string
  userId: string
  tierLevel: TierLevel
  platform: PaymentPlatform
  status: 'active' | 'expired' | 'cancelled' | 'pending_renewal' | 'suspended'
  startDate: Date
  endDate: Date
  renewalDate: Date
  autoRenewal: boolean
  paymentMethod: string
  lastPaymentDate?: Date
  nextBillingAmount: number
  renewalAttempts: number
  failureReason?: string
  metadata: {
    originalPurchaseId?: string
    discountApplied?: number
    promotionCode?: string
    renewalCount: number
    lastRenewalSuccess?: Date
    lastRenewalFailure?: Date
  }
}

export interface WaitingListEntry {
  id: string
  userId: string
  email: string
  username: string
  requestedTier: TierLevel
  joinDate: Date
  estimatedWaitTime: number // in days
  position: number
  notificationPreferences: {
    email: boolean
    inApp: boolean
  }
  metadata: {
    referralSource?: string
    specialRequests?: string
    priority: 'normal' | 'high' | 'urgent'
  }
}

export interface CapacityLimits {
  maxActiveUsers: number
  maxMoonShadowUsers: number
  maxNightGodUsers: number
  currentActiveUsers: number
  currentMoonShadowUsers: number
  currentNightGodUsers: number
  waitingListEnabled: boolean
  emergencyMode: boolean
}

export class SubscriptionManager {
  private membershipService: MembershipService
  private paymentSystem: PaymentSystem
  private subscriptions = new Map<string, Subscription>()
  private waitingList = new Map<string, WaitingListEntry>()
  private capacityLimits: CapacityLimits

  constructor() {
    this.membershipService = new MembershipService()
    this.paymentSystem = new PaymentSystem()
    this.capacityLimits = {
      maxActiveUsers: 10000,        // Total system capacity
      maxMoonShadowUsers: 3000,     // Premium tier capacity
      maxNightGodUsers: 500,        // VIP tier capacity
      currentActiveUsers: 0,
      currentMoonShadowUsers: 0,
      currentNightGodUsers: 0,
      waitingListEnabled: false,
      emergencyMode: false
    }
  }

  /**
   * Initialize subscription manager
   */
  async initialize(): Promise<void> {
    console.log('🔄 Initializing Subscription Manager...')
    
    await this.membershipService.initialize()
    await this.paymentSystem.initialize()
    await this.loadExistingSubscriptions()
    await this.loadWaitingList()
    await this.updateCapacityMetrics()
    
    // Start auto-renewal check (every hour)
    setInterval(() => this.processAutoRenewals(), 3600000)
    
    // Start waiting list processing (every 30 minutes)
    setInterval(() => this.processWaitingList(), 1800000)
    
    console.log('✅ Subscription Manager initialized')
    console.log(`📊 Capacity: ${this.capacityLimits.currentActiveUsers}/${this.capacityLimits.maxActiveUsers} users`)
  }

  /**
   * Create new subscription
   */
  async createSubscription(
    userId: string, 
    tierLevel: TierLevel, 
    paymentDetails: any
  ): Promise<{ success: boolean; subscription?: Subscription; waitingList?: WaitingListEntry }> {
    
    // Check capacity limits first
    const capacityCheck = await this.checkCapacity(tierLevel)
    if (!capacityCheck.allowed) {
      console.log(`⏳ Adding user ${userId} to waiting list for ${tierLevel}`)
      const waitingEntry = await this.addToWaitingList(userId, tierLevel, paymentDetails)
      return { success: true, waitingList: waitingEntry }
    }

    try {
      const tier = this.membershipService.getTierConfig(tierLevel)
      const endDate = new Date()
      endDate.setMonth(endDate.getMonth() + 1) // Monthly subscription

      const subscription: Subscription = {
        id: `sub_${Date.now()}_${userId}`,
        userId,
        tierLevel,
        platform: tier.platform!,
        status: 'active',
        startDate: new Date(),
        endDate,
        renewalDate: new Date(endDate.getTime() - 86400000 * 3), // 3 days before
        autoRenewal: true,
        paymentMethod: paymentDetails.method || 'default',
        nextBillingAmount: tier.price,
        renewalAttempts: 0,
        metadata: {
          originalPurchaseId: paymentDetails.purchaseId,
          renewalCount: 0,
          discountApplied: paymentDetails.discount || 0,
          promotionCode: paymentDetails.promoCode
        }
      }

      this.subscriptions.set(subscription.id, subscription)
      await this.membershipService.upgradeMembership(userId, tierLevel)
      await this.updateCapacityMetrics()

      console.log(`✅ Subscription created: ${subscription.id} for user ${userId}`)
      
      return { success: true, subscription }

    } catch (error) {
      console.error(`❌ Failed to create subscription for user ${userId}:`, error)
      return { success: false }
    }
  }

  /**
   * Check capacity limits
   */
  async checkCapacity(tierLevel: TierLevel): Promise<{ allowed: boolean; reason?: string }> {
    await this.updateCapacityMetrics()

    if (this.capacityLimits.emergencyMode) {
      return { allowed: false, reason: 'System in emergency maintenance mode' }
    }

    // Check total capacity
    if (this.capacityLimits.currentActiveUsers >= this.capacityLimits.maxActiveUsers) {
      return { allowed: false, reason: 'Maximum system capacity reached' }
    }

    // Check tier-specific capacity
    switch (tierLevel) {
      case TierLevel.MOON_SHADOW:
        if (this.capacityLimits.currentMoonShadowUsers >= this.capacityLimits.maxMoonShadowUsers) {
          return { allowed: false, reason: 'Moon Shadow tier capacity reached' }
        }
        break
      
      case TierLevel.NIGHT_GOD:
        if (this.capacityLimits.currentNightGodUsers >= this.capacityLimits.maxNightGodUsers) {
          return { allowed: false, reason: 'Night God tier capacity reached' }
        }
        break
    }

    return { allowed: true }
  }

  /**
   * Add user to waiting list
   */
  async addToWaitingList(
    userId: string, 
    tierLevel: TierLevel, 
    paymentDetails: any
  ): Promise<WaitingListEntry> {
    
    const user = await this.membershipService.getUser(userId)
    const position = this.getWaitingListPosition(tierLevel)
    const estimatedWaitTime = this.calculateEstimatedWaitTime(tierLevel, position)

    const waitingEntry: WaitingListEntry = {
      id: `wait_${Date.now()}_${userId}`,
      userId,
      email: user?.email || '',
      username: user?.username || '',
      requestedTier: tierLevel,
      joinDate: new Date(),
      estimatedWaitTime,
      position,
      notificationPreferences: {
        email: true,
        inApp: true
      },
      metadata: {
        referralSource: paymentDetails.referralSource,
        specialRequests: paymentDetails.specialRequests,
        priority: 'normal'
      }
    }

    this.waitingList.set(waitingEntry.id, waitingEntry)
    await this.notifyWaitingListJoin(waitingEntry)

    console.log(`📝 Added ${userId} to waiting list: position ${position}, estimated wait ${estimatedWaitTime} days`)
    
    return waitingEntry
  }

  /**
   * Process auto-renewals
   */
  async processAutoRenewals(): Promise<void> {
    console.log('🔄 Processing subscription auto-renewals...')
    
    const now = new Date()
    const renewalSubscriptions = Array.from(this.subscriptions.values())
      .filter(sub => 
        sub.autoRenewal && 
        sub.status === 'active' && 
        sub.renewalDate <= now
      )

    for (const subscription of renewalSubscriptions) {
      await this.attemptRenewal(subscription)
    }

    console.log(`✅ Processed ${renewalSubscriptions.length} renewal attempts`)
  }

  /**
   * Attempt subscription renewal
   */
  async attemptRenewal(subscription: Subscription): Promise<boolean> {
    try {
      console.log(`🔄 Attempting renewal for subscription ${subscription.id}`)
      
      subscription.renewalAttempts++
      subscription.status = 'pending_renewal'

      // Attempt payment through the original platform
      const paymentResult = await this.paymentSystem.processRenewalPayment({
        subscriptionId: subscription.id,
        userId: subscription.userId,
        amount: subscription.nextBillingAmount,
        platform: subscription.platform,
        paymentMethod: subscription.paymentMethod
      })

      if (paymentResult.success) {
        // Successful renewal
        const nextMonth = new Date()
        nextMonth.setMonth(nextMonth.getMonth() + 1)
        
        subscription.status = 'active'
        subscription.endDate = nextMonth
        subscription.renewalDate = new Date(nextMonth.getTime() - 86400000 * 3)
        subscription.lastPaymentDate = new Date()
        subscription.renewalAttempts = 0
        subscription.metadata.renewalCount++
        subscription.metadata.lastRenewalSuccess = new Date()

        console.log(`✅ Subscription ${subscription.id} renewed successfully`)
        return true

      } else {
        // Renewal failed
        subscription.failureReason = paymentResult.error
        subscription.metadata.lastRenewalFailure = new Date()

        if (subscription.renewalAttempts >= 3) {
          // Max attempts reached, suspend subscription
          subscription.status = 'suspended'
          await this.membershipService.downgradeMembership(subscription.userId, TierLevel.NIGHT_WALKER)
          await this.notifySubscriptionSuspended(subscription)
          console.log(`❌ Subscription ${subscription.id} suspended after failed renewals`)
        } else {
          // Schedule retry in 24 hours
          subscription.renewalDate = new Date(Date.now() + 86400000)
          console.log(`⚠️ Subscription ${subscription.id} renewal failed, will retry`)
        }
        
        return false
      }

    } catch (error) {
      console.error(`❌ Error renewing subscription ${subscription.id}:`, error)
      subscription.status = 'expired'
      subscription.failureReason = error.message
      return false
    }
  }

  /**
   * Process waiting list
   */
  async processWaitingList(): Promise<void> {
    if (!this.capacityLimits.waitingListEnabled) return

    console.log('📋 Processing waiting list...')
    
    const waitingEntries = Array.from(this.waitingList.values())
      .sort((a, b) => {
        // Priority first, then by join date
        if (a.metadata.priority !== b.metadata.priority) {
          const priorityOrder = { 'urgent': 0, 'high': 1, 'normal': 2 }
          return priorityOrder[a.metadata.priority] - priorityOrder[b.metadata.priority]
        }
        return a.joinDate.getTime() - b.joinDate.getTime()
      })

    for (const entry of waitingEntries) {
      const capacityCheck = await this.checkCapacity(entry.requestedTier)
      
      if (capacityCheck.allowed) {
        await this.promoteFromWaitingList(entry)
      } else {
        break // Stop if capacity is still full
      }
    }
  }

  /**
   * Promote user from waiting list to active subscription
   */
  async promoteFromWaitingList(waitingEntry: WaitingListEntry): Promise<void> {
    try {
      console.log(`🎉 Promoting user ${waitingEntry.userId} from waiting list`)
      
      // Remove from waiting list
      this.waitingList.delete(waitingEntry.id)
      
      // Create subscription
      const result = await this.createSubscription(
        waitingEntry.userId,
        waitingEntry.requestedTier,
        { 
          method: 'waiting_list_promotion',
          discount: 10 // 10% discount for waiting
        }
      )

      if (result.success && result.subscription) {
        await this.notifyWaitingListPromotion(waitingEntry, result.subscription)
      }

    } catch (error) {
      console.error(`❌ Failed to promote user ${waitingEntry.userId} from waiting list:`, error)
    }
  }

  /**
   * Cancel subscription
   */
  async cancelSubscription(subscriptionId: string, reason?: string): Promise<boolean> {
    const subscription = this.subscriptions.get(subscriptionId)
    if (!subscription) return false

    try {
      subscription.status = 'cancelled'
      subscription.autoRenewal = false
      subscription.failureReason = reason

      // Downgrade user to free tier at end of current billing period
      // Don't downgrade immediately to honor paid period
      
      await this.updateCapacityMetrics()
      
      console.log(`✅ Subscription ${subscriptionId} cancelled`)
      return true

    } catch (error) {
      console.error(`❌ Failed to cancel subscription ${subscriptionId}:`, error)
      return false
    }
  }

  /**
   * Get subscription details
   */
  getSubscription(subscriptionId: string): Subscription | null {
    return this.subscriptions.get(subscriptionId) || null
  }

  /**
   * Get user's active subscription
   */
  getUserSubscription(userId: string): Subscription | null {
    return Array.from(this.subscriptions.values())
      .find(sub => sub.userId === userId && sub.status === 'active') || null
  }

  /**
   * Get user's waiting list status
   */
  getUserWaitingListStatus(userId: string): WaitingListEntry | null {
    return Array.from(this.waitingList.values())
      .find(entry => entry.userId === userId) || null
  }

  /**
   * Get system capacity status
   */
  getCapacityStatus(): CapacityLimits & { waitingListCounts: Record<TierLevel, number> } {
    const waitingListCounts = {
      [TierLevel.NIGHT_WALKER]: 0,
      [TierLevel.MOON_SHADOW]: Array.from(this.waitingList.values())
        .filter(e => e.requestedTier === TierLevel.MOON_SHADOW).length,
      [TierLevel.NIGHT_GOD]: Array.from(this.waitingList.values())
        .filter(e => e.requestedTier === TierLevel.NIGHT_GOD).length
    }

    return {
      ...this.capacityLimits,
      waitingListCounts
    }
  }

  // Helper methods
  private async loadExistingSubscriptions(): Promise<void> {
    // In production, load from database
    // For now, initialize empty
    console.log('📁 Loaded existing subscriptions')
  }

  private async loadWaitingList(): Promise<void> {
    // In production, load from database
    console.log('📁 Loaded waiting list entries')
  }

  private async updateCapacityMetrics(): Promise<void> {
    const activeSubscriptions = Array.from(this.subscriptions.values())
      .filter(sub => sub.status === 'active')

    this.capacityLimits.currentActiveUsers = activeSubscriptions.length
    this.capacityLimits.currentMoonShadowUsers = activeSubscriptions
      .filter(sub => sub.tierLevel === TierLevel.MOON_SHADOW).length
    this.capacityLimits.currentNightGodUsers = activeSubscriptions
      .filter(sub => sub.tierLevel === TierLevel.NIGHT_GOD).length

    // Enable waiting list if approaching capacity
    this.capacityLimits.waitingListEnabled = 
      this.capacityLimits.currentActiveUsers > this.capacityLimits.maxActiveUsers * 0.9
  }

  private getWaitingListPosition(tierLevel: TierLevel): number {
    return Array.from(this.waitingList.values())
      .filter(entry => entry.requestedTier === tierLevel).length + 1
  }

  private calculateEstimatedWaitTime(tierLevel: TierLevel, position: number): number {
    // Estimate based on historical data and current capacity
    const averageChurnRate = {
      [TierLevel.MOON_SHADOW]: 0.05, // 5% monthly churn
      [TierLevel.NIGHT_GOD]: 0.03    // 3% monthly churn
    }

    const churnRate = averageChurnRate[tierLevel] || 0.05
    const spotsPerMonth = Math.ceil(this.capacityLimits.maxActiveUsers * churnRate)
    
    return Math.ceil((position / spotsPerMonth) * 30) // Days
  }

  private async notifyWaitingListJoin(entry: WaitingListEntry): Promise<void> {
    // Send welcome to waiting list notification
    console.log(`📧 Notifying user ${entry.userId} about waiting list status`)
  }

  private async notifyWaitingListPromotion(entry: WaitingListEntry, subscription: Subscription): Promise<void> {
    // Send promotion notification
    console.log(`🎉 Notifying user ${entry.userId} about subscription activation`)
  }

  private async notifySubscriptionSuspended(subscription: Subscription): Promise<void> {
    // Send suspension notification
    console.log(`⚠️ Notifying user ${subscription.userId} about subscription suspension`)
  }
}

export default SubscriptionManager