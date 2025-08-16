/**
 * Night God Tarot Membership Tiers
 * Complete monetization structure with Taiwan-focused pricing
 */

export enum TierLevel {
  NIGHT_WALKER = 'nightWalker',
  MOON_SHADOW = 'moonShadow', 
  NIGHT_GOD = 'nightGod'
}

export enum PaymentPlatform {
  FREE = 'free',
  BUY_ME_A_COFFEE = 'buymeacoffee',
  IPASS_MONEY = 'ipass'
}

export enum Currency {
  TWD = 'TWD',
  USD = 'USD'
}

export interface MembershipFeatures {
  // Reading Limits
  dailyReadings: number | 'unlimited'
  
  // AI Access
  monicaAccess: 'basic' | 'advanced' | 'unlimited-full'
  aiModels: string[]
  
  // Card Access
  cards: string
  availableCards: number
  hiddenCards: number
  
  // Content Access
  novelChapters: number | 'full-access'
  spreads: string[]
  
  // Storage & History
  storage: string
  maxStoredReadings: number | 'unlimited'
  
  // Premium Features
  priority: boolean
  monthlyReport: boolean
  personalMentor: boolean
  weeklyCoaching: boolean
  customAI: boolean
  whiteLabel: boolean
  supporterWall: boolean
  
  // API Limits
  apiCallsPerDay: number | 'unlimited'
  concurrentSessions: number
}

export interface MembershipTier {
  id: TierLevel
  name: string
  displayName: string
  description: string
  price: number
  originalPrice?: number
  currency: Currency
  platform: PaymentPlatform
  billing: 'free' | 'monthly' | 'yearly' | 'lifetime'
  popular: boolean
  color: string
  icon: string
  features: MembershipFeatures
  benefits: string[]
  limitations: string[]
  upgradeIncentives: string[]
}

export const membershipTiers: Record<TierLevel, MembershipTier> = {
  // Free Tier - Night Walker (體驗靈性指引)
  [TierLevel.NIGHT_WALKER]: {
    id: TierLevel.NIGHT_WALKER,
    name: 'Night Walker',
    displayName: '夜行者',
    description: '開啟你的靈性之旅，體驗塔羅的神秘力量',
    price: 0,
    currency: Currency.TWD,
    platform: PaymentPlatform.FREE,
    billing: 'free',
    popular: false,
    color: '#6366f1', // Indigo
    icon: '🌙',
    features: {
      dailyReadings: 1,
      monicaAccess: 'basic',
      aiModels: ['monica-basic'],
      cards: 'standard-78',
      availableCards: 78,
      hiddenCards: 0,
      novelChapters: 3,
      spreads: ['three-cards', 'daily-guidance'],
      storage: '10-readings',
      maxStoredReadings: 10,
      priority: false,
      monthlyReport: false,
      personalMentor: false,
      weeklyCoaching: false,
      customAI: false,
      whiteLabel: false,
      supporterWall: false,
      apiCallsPerDay: 10,
      concurrentSessions: 1
    },
    benefits: [
      '每日1次免費占卜',
      '基礎塔羅牌組(78張)',
      '小說前3章節',
      '基礎AI智慧指引',
      '簡單牌陣選擇',
      '10次歷史記錄保存'
    ],
    limitations: [
      '限制每日占卜次數',
      '無法使用隱藏牌',
      '無法訪問完整小說',
      '無優先客服支援',
      '無個人化分析報告'
    ],
    upgradeIncentives: [
      '升級獲得每日10次占卜',
      '解鎖5張神秘隱藏牌',
      '訪問完整小說內容',
      '獲得月度靈性報告'
    ]
  },

  // Premium Tier - Moon Shadow (月影守護者)
  [TierLevel.MOON_SHADOW]: {
    id: TierLevel.MOON_SHADOW,
    name: 'Moon Shadow',
    displayName: '月影守護者',
    description: '深度靈性體驗，解鎖神秘力量與個人成長',
    price: 299,
    originalPrice: 399,
    currency: Currency.TWD,
    platform: PaymentPlatform.BUY_ME_A_COFFEE,
    billing: 'monthly',
    popular: true,
    color: '#8b5cf6', // Purple
    icon: '🌙✨',
    features: {
      dailyReadings: 10,
      monicaAccess: 'advanced',
      aiModels: ['monica-advanced', 'gemini-pro'],
      cards: 'standard-78 + 5-hidden',
      availableCards: 78,
      hiddenCards: 5,
      novelChapters: 15,
      spreads: ['three-cards', 'daily-guidance', 'love-cross', 'career-path', 'spiritual-journey'],
      storage: '100-readings',
      maxStoredReadings: 100,
      priority: true,
      monthlyReport: true,
      personalMentor: false,
      weeklyCoaching: false,
      customAI: false,
      whiteLabel: false,
      supporterWall: true,
      apiCallsPerDay: 100,
      concurrentSessions: 3
    },
    benefits: [
      '每日10次深度占卜',
      '解鎖5張神秘隱藏牌',
      '訪問小說15個章節',
      '進階AI心理分析',
      '所有標準牌陣',
      '100次歷史記錄',
      '月度個人靈性報告',
      '優先客服支援',
      '支持者牆展示'
    ],
    limitations: [
      '每日仍有占卜限制',
      '無法訪問全部隱藏牌',
      '無個人專屬導師',
      '無客製化AI模型'
    ],
    upgradeIncentives: [
      '升級至無限占卜次數',
      '解鎖全部15張隱藏牌',
      '獲得個人專屬靈性導師',
      '專屬AI模型訓練',
      '白標客製化服務'
    ]
  },

  // VIP Tier - Night God (夜神至尊)
  [TierLevel.NIGHT_GOD]: {
    id: TierLevel.NIGHT_GOD,
    name: 'Night God',
    displayName: '夜神至尊',
    description: '終極靈性體驗，成為自己的神諭師',
    price: 899,
    originalPrice: 1299,
    currency: Currency.TWD,
    platform: PaymentPlatform.IPASS_MONEY,
    billing: 'monthly',
    popular: false,
    color: '#f59e0b', // Amber/Gold
    icon: '👑🌟',
    features: {
      dailyReadings: 'unlimited',
      monicaAccess: 'unlimited-full',
      aiModels: ['monica-unlimited', 'gemini-pro', 'gpt-4-turbo', 'perplexity-pro'],
      cards: 'all-including-hidden',
      availableCards: 78,
      hiddenCards: 15,
      novelChapters: 'full-access',
      spreads: ['all-standard', 'custom-creation', 'advanced-spreads'],
      storage: 'unlimited',
      maxStoredReadings: 'unlimited',
      priority: true,
      monthlyReport: true,
      personalMentor: true,
      weeklyCoaching: true,
      customAI: true,
      whiteLabel: true,
      supporterWall: true,
      apiCallsPerDay: 'unlimited',
      concurrentSessions: 10
    },
    benefits: [
      '無限次深度占卜',
      '全部15張神秘隱藏牌',
      '完整小說訪問權限',
      '四重AI協作系統',
      '所有牌陣+自創牌陣',
      '無限歷史記錄存儲',
      '專屬個人靈性導師',
      '每週一對一指導',
      '客製化AI模型訓練',
      '白標品牌客製化',
      '最高優先級支援',
      '專屬VIP社群'
    ],
    limitations: [],
    upgradeIncentives: [
      '已是最高等級會員',
      '享受完整夜神塔羅體驗',
      '成為靈性導師社群一員'
    ]
  }
}

// Helper functions and utilities
export class MembershipUtils {
  /**
   * Get tier by level
   */
  static getTier(level: TierLevel): MembershipTier {
    return membershipTiers[level]
  }

  /**
   * Get all tiers sorted by price
   */
  static getAllTiers(): MembershipTier[] {
    return Object.values(membershipTiers).sort((a, b) => a.price - b.price)
  }

  /**
   * Check if user can access feature
   */
  static canAccessFeature(userTier: TierLevel, feature: keyof MembershipFeatures): boolean {
    const tier = this.getTier(userTier)
    return !!tier.features[feature]
  }

  /**
   * Get feature value for tier
   */
  static getFeatureValue(userTier: TierLevel, feature: keyof MembershipFeatures): any {
    const tier = this.getTier(userTier)
    return tier.features[feature]
  }

  /**
   * Check if user can perform action based on usage
   */
  static canPerformAction(
    userTier: TierLevel, 
    action: 'reading' | 'apiCall', 
    currentUsage: number
  ): boolean {
    const tier = this.getTier(userTier)
    
    switch (action) {
      case 'reading':
        const dailyLimit = tier.features.dailyReadings
        return dailyLimit === 'unlimited' || currentUsage < (dailyLimit as number)
      
      case 'apiCall':
        const apiLimit = tier.features.apiCallsPerDay
        return apiLimit === 'unlimited' || currentUsage < (apiLimit as number)
      
      default:
        return false
    }
  }

  /**
   * Get upgrade recommendations
   */
  static getUpgradeRecommendations(currentTier: TierLevel): MembershipTier[] {
    const current = this.getTier(currentTier)
    return this.getAllTiers().filter(tier => tier.price > current.price)
  }

  /**
   * Calculate savings for yearly billing
   */
  static calculateYearlySavings(tier: MembershipTier): number {
    if (tier.billing === 'free') return 0
    
    const monthlyTotal = tier.price * 12
    const yearlyPrice = tier.price * 10 // 2 months free
    return monthlyTotal - yearlyPrice
  }

  /**
   * Get tier by price and platform
   */
  static getTierByPayment(price: number, platform: PaymentPlatform): MembershipTier | null {
    return this.getAllTiers().find(tier => 
      tier.price === price && tier.platform === platform
    ) || null
  }

  /**
   * Format price with currency
   */
  static formatPrice(price: number, currency: Currency = Currency.TWD): string {
    if (price === 0) return '免費'
    
    switch (currency) {
      case Currency.TWD:
        return `NT$ ${price.toLocaleString()}`
      case Currency.USD:
        return `$ ${price.toLocaleString()}`
      default:
        return `${price.toLocaleString()} ${currency}`
    }
  }

  /**
   * Get platform display name
   */
  static getPlatformDisplayName(platform: PaymentPlatform): string {
    switch (platform) {
      case PaymentPlatform.FREE:
        return '免費體驗'
      case PaymentPlatform.BUY_ME_A_COFFEE:
        return 'Buy Me a Coffee'
      case PaymentPlatform.IPASS_MONEY:
        return 'iPass Money'
      default:
        return platform
    }
  }

  /**
   * Check if tier has specific benefit
   */
  static hasBenefit(tier: TierLevel, benefit: string): boolean {
    const tierData = this.getTier(tier)
    return tierData.benefits.some(b => b.includes(benefit))
  }

  /**
   * Get feature comparison between tiers
   */
  static compareFeatures(tier1: TierLevel, tier2: TierLevel): Record<string, any> {
    const t1 = this.getTier(tier1)
    const t2 = this.getTier(tier2)
    
    const comparison: Record<string, any> = {}
    
    Object.keys(t1.features).forEach(feature => {
      comparison[feature] = {
        [tier1]: t1.features[feature as keyof MembershipFeatures],
        [tier2]: t2.features[feature as keyof MembershipFeatures]
      }
    })
    
    return comparison
  }

  /**
   * Get tier color theme
   */
  static getTierColors(tier: TierLevel): Record<string, string> {
    const tierData = this.getTier(tier)
    const baseColor = tierData.color
    
    return {
      primary: baseColor,
      light: this.lightenColor(baseColor, 20),
      dark: this.darkenColor(baseColor, 20),
      gradient: `linear-gradient(135deg, ${baseColor} 0%, ${this.lightenColor(baseColor, 10)} 100%)`
    }
  }

  /**
   * Lighten a hex color
   */
  private static lightenColor(color: string, percent: number): string {
    const num = parseInt(color.replace("#", ""), 16)
    const amt = Math.round(2.55 * percent)
    const R = (num >> 16) + amt
    const G = (num >> 8 & 0x00FF) + amt
    const B = (num & 0x0000FF) + amt
    return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
      (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
      (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1)
  }

  /**
   * Darken a hex color
   */
  private static darkenColor(color: string, percent: number): string {
    const num = parseInt(color.replace("#", ""), 16)
    const amt = Math.round(2.55 * percent)
    const R = (num >> 16) - amt
    const G = (num >> 8 & 0x00FF) - amt
    const B = (num & 0x0000FF) - amt
    return "#" + (0x1000000 + (R > 255 ? 255 : R < 0 ? 0 : R) * 0x10000 +
      (G > 255 ? 255 : G < 0 ? 0 : G) * 0x100 +
      (B > 255 ? 255 : B < 0 ? 0 : B)).toString(16).slice(1)
  }
}

export default membershipTiers