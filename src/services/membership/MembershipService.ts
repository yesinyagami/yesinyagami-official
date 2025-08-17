/**
 * Membership Service
 * Handles membership tier management, usage tracking, and enforcement
 * Integrates with Monica AI for all tiers since she's available on platform
 */

import { membershipTiers, TierLevel, MembershipTier, MembershipUtils } from './MembershipTiers'
import type { User, UserProgress } from '../../types/tarot'

export interface UserMembership {
  userId: string
  currentTier: TierLevel
  subscriptionId?: string
  platform?: string
  startDate: Date
  endDate?: Date
  autoRenew: boolean
  paymentStatus: 'active' | 'pending' | 'cancelled' | 'expired'
  trialUsed: boolean
  upgradeDate?: Date
  downgrades: number
  metadata: {
    referralCode?: string
    promoCode?: string
    originalPrice?: number
    discountApplied?: number
  }
}

export interface UsageStats {
  userId: string
  date: string // YYYY-MM-DD
  readingsUsed: number
  apiCallsUsed: number
  sessionsStarted: number
  storageUsed: number
  features: {
    monicaCallsBasic: number
    monicaCallsAdvanced: number
    monicaCallsUnlimited: number
    novelChaptersRead: number
    hiddenCardsDrawn: number
    customSpreadsCreated: number
  }
  resetAt: Date
}

export interface MembershipEvent {
  id: string
  userId: string
  type: 'upgrade' | 'downgrade' | 'renewal' | 'cancellation' | 'trial_start' | 'trial_end'
  fromTier?: TierLevel
  toTier: TierLevel
  timestamp: Date
  metadata: Record<string, any>
}

export class MembershipService {
  private static instance: MembershipService
  private memberships: Map<string, UserMembership> = new Map()
  private usageStats: Map<string, UsageStats> = new Map()
  private events: MembershipEvent[] = []

  private constructor() {
    this.startDailyReset()
  }

  static getInstance(): MembershipService {
    if (!MembershipService.instance) {
      MembershipService.instance = new MembershipService()
    }
    return MembershipService.instance
  }

  /**
   * Initialize user membership (new user signup)
   */
  async initializeUserMembership(userId: string, tier: TierLevel = TierLevel.NIGHT_WALKER): Promise<UserMembership> {
    const membership: UserMembership = {
      userId,
      currentTier: tier,
      startDate: new Date(),
      autoRenew: false,
      paymentStatus: tier === TierLevel.NIGHT_WALKER ? 'active' : 'pending',
      trialUsed: false,
      downgrades: 0,
      metadata: {}
    }

    this.memberships.set(userId, membership)
    await this.initializeUsageStats(userId)
    
    // Log membership creation event
    this.logEvent({
      id: this.generateEventId(),
      userId,
      type: 'trial_start',
      toTier: tier,
      timestamp: new Date(),
      metadata: { initialTier: tier }
    })

    console.log(`👤 Initialized membership for user ${userId} with tier ${tier}`)
    return membership
  }

  /**
   * Get user membership
   */
  async getUserMembership(userId: string): Promise<UserMembership | null> {
    let membership = this.memberships.get(userId)
    
    if (!membership) {
      // Initialize with free tier if not found
      membership = await this.initializeUserMembership(userId)
    }

    // Check if membership is expired
    if (membership.endDate && new Date() > membership.endDate) {
      if (membership.autoRenew && membership.paymentStatus === 'active') {
        await this.renewMembership(userId)
      } else {
        await this.expireMembership(userId)
      }
      membership = this.memberships.get(userId)!
    }

    return membership
  }

  /**
   * Upgrade user membership
   */
  async upgradeMembership(
    userId: string, 
    newTier: TierLevel, 
    subscriptionId: string, 
    platform: string,
    metadata: Record<string, any> = {}
  ): Promise<boolean> {
    const membership = await this.getUserMembership(userId)
    if (!membership) return false

    const currentTierData = MembershipUtils.getTier(membership.currentTier)
    const newTierData = MembershipUtils.getTier(newTier)

    // Validate upgrade (can't downgrade through this method)
    if (newTierData.price <= currentTierData.price && newTier !== TierLevel.NIGHT_WALKER) {
      throw new Error('Use downgradeMembership for downgrades')
    }

    const oldTier = membership.currentTier

    // Update membership
    membership.currentTier = newTier
    membership.subscriptionId = subscriptionId
    membership.platform = platform
    membership.upgradeDate = new Date()
    membership.paymentStatus = 'active'
    membership.autoRenew = true
    membership.metadata = { ...membership.metadata, ...metadata }

    // Set end date based on billing cycle
    if (newTierData.billing === 'monthly') {
      membership.endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
    } else if (newTierData.billing === 'yearly') {
      membership.endDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year
    }

    this.memberships.set(userId, membership)

    // Log upgrade event
    this.logEvent({
      id: this.generateEventId(),
      userId,
      type: 'upgrade',
      fromTier: oldTier,
      toTier: newTier,
      timestamp: new Date(),
      metadata: { subscriptionId, platform, ...metadata }
    })

    console.log(`⬆️ User ${userId} upgraded from ${oldTier} to ${newTier}`)
    return true
  }

  /**
   * Downgrade user membership
   */
  async downgradeMembership(userId: string, newTier: TierLevel, reason: string): Promise<boolean> {
    const membership = await this.getUserMembership(userId)
    if (!membership) return false

    const oldTier = membership.currentTier
    
    // Update membership
    membership.currentTier = newTier
    membership.downgrades += 1
    membership.paymentStatus = newTier === TierLevel.NIGHT_WALKER ? 'active' : 'cancelled'
    membership.autoRenew = false

    this.memberships.set(userId, membership)

    // Log downgrade event
    this.logEvent({
      id: this.generateEventId(),
      userId,
      type: 'downgrade',
      fromTier: oldTier,
      toTier: newTier,
      timestamp: new Date(),
      metadata: { reason }
    })

    console.log(`⬇️ User ${userId} downgraded from ${oldTier} to ${newTier}`)
    return true
  }

  /**
   * Check if user can perform action (reading, API call, etc.)
   */
  async canPerformAction(userId: string, action: string, amount: number = 1): Promise<boolean> {
    const membership = await this.getUserMembership(userId)
    if (!membership) return false

    const tier = MembershipUtils.getTier(membership.currentTier)
    const usage = await this.getUsageStats(userId)

    switch (action) {
      case 'reading':
        const dailyLimit = tier.features.dailyReadings
        if (dailyLimit === 'unlimited') return true
        return (usage.readingsUsed + amount) <= (dailyLimit as number)

      case 'api_call':
        const apiLimit = tier.features.apiCallsPerDay
        if (apiLimit === 'unlimited') return true
        return (usage.apiCallsUsed + amount) <= (apiLimit as number)

      case 'session':
        return usage.sessionsStarted < tier.features.concurrentSessions

      case 'hidden_card':
        return tier.features.hiddenCards > 0

      case 'novel_chapter':
        const chapterLimit = tier.features.novelChapters
        if (chapterLimit === 'full-access') return true
        return usage.features.novelChaptersRead < (chapterLimit as number)

      case 'monica_basic':
        return tier.features.monicaAccess === 'basic' || 
               tier.features.monicaAccess === 'advanced' || 
               tier.features.monicaAccess === 'unlimited-full'

      case 'monica_advanced':
        return tier.features.monicaAccess === 'advanced' || 
               tier.features.monicaAccess === 'unlimited-full'

      case 'monica_unlimited':
        return tier.features.monicaAccess === 'unlimited-full'

      default:
        return false
    }
  }

  /**
   * Record usage for tracking and enforcement
   */
  async recordUsage(userId: string, action: string, amount: number = 1, metadata: Record<string, any> = {}): Promise<void> {
    const usage = await this.getUsageStats(userId)

    switch (action) {
      case 'reading':
        usage.readingsUsed += amount
        break
      case 'api_call':
        usage.apiCallsUsed += amount
        break
      case 'session_start':
        usage.sessionsStarted += amount
        break
      case 'monica_basic':
        usage.features.monicaCallsBasic += amount
        break
      case 'monica_advanced':
        usage.features.monicaCallsAdvanced += amount
        break
      case 'monica_unlimited':
        usage.features.monicaCallsUnlimited += amount
        break
      case 'novel_chapter':
        usage.features.novelChaptersRead += amount
        break
      case 'hidden_card':
        usage.features.hiddenCardsDrawn += amount
        break
      case 'custom_spread':
        usage.features.customSpreadsCreated += amount
        break
    }

    this.usageStats.set(userId, usage)
  }

  /**
   * Get user usage statistics
   */
  async getUsageStats(userId: string): Promise<UsageStats> {
    const today = new Date().toISOString().split('T')[0]
    const key = `${userId}-${today}`
    
    let usage = this.usageStats.get(key)
    
    if (!usage) {
      usage = await this.initializeUsageStats(userId)
    }

    return usage
  }

  /**
   * Initialize daily usage stats
   */
  private async initializeUsageStats(userId: string): Promise<UsageStats> {
    const today = new Date().toISOString().split('T')[0]
    const resetTime = new Date()
    resetTime.setHours(24, 0, 0, 0) // Reset at midnight

    const usage: UsageStats = {
      userId,
      date: today,
      readingsUsed: 0,
      apiCallsUsed: 0,
      sessionsStarted: 0,
      storageUsed: 0,
      features: {
        monicaCallsBasic: 0,
        monicaCallsAdvanced: 0,
        monicaCallsUnlimited: 0,
        novelChaptersRead: 0,
        hiddenCardsDrawn: 0,
        customSpreadsCreated: 0
      },
      resetAt: resetTime
    }

    const key = `${userId}-${today}`
    this.usageStats.set(key, usage)
    return usage
  }

  /**
   * Get membership analytics
   */
  getAnalytics(): any {
    const totalUsers = this.memberships.size
    const tierDistribution = Object.values(TierLevel).reduce((acc, tier) => {
      acc[tier] = Array.from(this.memberships.values()).filter(m => m.currentTier === tier).length
      return acc
    }, {} as Record<TierLevel, number>)

    const activeSubscriptions = Array.from(this.memberships.values()).filter(m => 
      m.paymentStatus === 'active' && m.currentTier !== TierLevel.NIGHT_WALKER
    ).length

    const monthlyRevenue = Array.from(this.memberships.values())
      .filter(m => m.paymentStatus === 'active')
      .reduce((sum, m) => sum + MembershipUtils.getTier(m.currentTier).price, 0)

    return {
      totalUsers,
      tierDistribution,
      activeSubscriptions,
      monthlyRevenue,
      conversionRate: totalUsers > 0 ? (activeSubscriptions / totalUsers) * 100 : 0,
      events: this.events.slice(-50) // Last 50 events
    }
  }

  /**
   * Handle subscription renewal
   */
  async renewMembership(userId: string): Promise<boolean> {
    const membership = await this.getUserMembership(userId)
    if (!membership) return false

    const tier = MembershipUtils.getTier(membership.currentTier)
    
    // Extend membership based on billing cycle
    if (tier.billing === 'monthly') {
      membership.endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    } else if (tier.billing === 'yearly') {
      membership.endDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
    }

    this.memberships.set(userId, membership)

    // Log renewal event
    this.logEvent({
      id: this.generateEventId(),
      userId,
      type: 'renewal',
      toTier: membership.currentTier,
      timestamp: new Date(),
      metadata: { subscriptionId: membership.subscriptionId }
    })

    console.log(`🔄 Renewed membership for user ${userId}`)
    return true
  }

  /**
   * Handle membership expiration
   */
  async expireMembership(userId: string): Promise<void> {
    const membership = await this.getUserMembership(userId)
    if (!membership) return

    const oldTier = membership.currentTier

    // Downgrade to free tier
    membership.currentTier = TierLevel.NIGHT_WALKER
    membership.paymentStatus = 'expired'
    membership.autoRenew = false

    this.memberships.set(userId, membership)

    // Log expiration event
    this.logEvent({
      id: this.generateEventId(),
      userId,
      type: 'downgrade',
      fromTier: oldTier,
      toTier: TierLevel.NIGHT_WALKER,
      timestamp: new Date(),
      metadata: { reason: 'expiration' }
    })

    console.log(`⏰ Membership expired for user ${userId}, downgraded to free tier`)
  }

  /**
   * Cancel subscription
   */
  async cancelSubscription(userId: string, reason: string = 'user_requested'): Promise<boolean> {
    const membership = await this.getUserMembership(userId)
    if (!membership) return false

    membership.autoRenew = false
    membership.paymentStatus = 'cancelled'

    this.memberships.set(userId, membership)

    // Log cancellation event
    this.logEvent({
      id: this.generateEventId(),
      userId,
      type: 'cancellation',
      toTier: membership.currentTier,
      timestamp: new Date(),
      metadata: { reason }
    })

    console.log(`❌ Cancelled subscription for user ${userId}`)
    return true
  }

  /**
   * Get tier recommendations for user
   */
  async getTierRecommendations(userId: string): Promise<any> {
    const membership = await this.getUserMembership(userId)
    const usage = await this.getUsageStats(userId)
    
    if (!membership) return null

    const currentTier = MembershipUtils.getTier(membership.currentTier)
    const recommendations = []

    // Check if user is hitting limits
    if (currentTier.features.dailyReadings !== 'unlimited' && 
        usage.readingsUsed >= (currentTier.features.dailyReadings as number) * 0.8) {
      recommendations.push({
        type: 'upgrade',
        reason: 'approaching_reading_limit',
        suggestedTier: membership.currentTier === TierLevel.NIGHT_WALKER ? 
          TierLevel.MOON_SHADOW : TierLevel.NIGHT_GOD,
        message: '您即將達到每日占卜次數上限，升級以享受更多占卜次數！'
      })
    }

    // Check if user could benefit from Monica unlimited
    if (usage.features.monicaCallsBasic + usage.features.monicaCallsAdvanced > 50 &&
        membership.currentTier !== TierLevel.NIGHT_GOD) {
      recommendations.push({
        type: 'upgrade',
        reason: 'heavy_monica_usage',
        suggestedTier: TierLevel.NIGHT_GOD,
        message: '您經常使用Monica AI，升級至夜神至尊享受無限制訪問！'
      })
    }

    return recommendations
  }

  /**
   * Start daily usage reset timer
   */
  private startDailyReset(): void {
    const now = new Date()
    const tomorrow = new Date(now)
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(0, 0, 0, 0)
    
    const msUntilMidnight = tomorrow.getTime() - now.getTime()

    setTimeout(() => {
      this.resetDailyUsage()
      // Set up daily interval
      setInterval(() => this.resetDailyUsage(), 24 * 60 * 60 * 1000)
    }, msUntilMidnight)
  }

  /**
   * Reset daily usage stats
   */
  private resetDailyUsage(): void {
    console.log('🔄 Resetting daily usage stats')
    
    // Clear old usage stats (keep only last 7 days)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    const cutoffDate = sevenDaysAgo.toISOString().split('T')[0]

    for (const [key, usage] of this.usageStats.entries()) {
      if (usage.date < cutoffDate) {
        this.usageStats.delete(key)
      }
    }
  }

  /**
   * Log membership event
   */
  private logEvent(event: MembershipEvent): void {
    this.events.push(event)
    
    // Keep only last 1000 events
    if (this.events.length > 1000) {
      this.events.splice(0, this.events.length - 1000)
    }
  }

  /**
   * Generate unique event ID
   */
  private generateEventId(): string {
    return `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * Cleanup resources
   */
  cleanup(): void {
    this.memberships.clear()
    this.usageStats.clear()
    this.events = []
  }
}

export default MembershipService