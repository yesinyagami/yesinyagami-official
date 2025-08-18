// User Profiler - Create detailed user psychological profiles
export class UserProfiler {
  private profiles: Map<string, UserProfile> = new Map()

  // Create initial user profile
  createProfile(userId: string, initialData?: any): UserProfile {
    const profile: UserProfile = {
      userId,
      createdAt: new Date(),
      lastActive: new Date(),
      readingCount: 0,
      preferences: {
        cardTypes: [],
        questionCategories: [],
        readingStyle: 'balanced'
      },
      personality: {
        traits: {},
        patterns: [],
        growth: []
      },
      accuracy: {
        totalFeedback: 0,
        averageRating: 0,
        satisfactionScore: 0
      }
    }

    this.profiles.set(userId, profile)
    return profile
  }

  // Update profile with reading data
  updateProfile(userId: string, readingData: any): UserProfile {
    let profile = this.profiles.get(userId)
    
    if (!profile) {
      profile = this.createProfile(userId)
    }

    // Update reading count and last active
    profile.readingCount++
    profile.lastActive = new Date()

    // Analyze question patterns
    if (readingData.question) {
      this.analyzeQuestionPattern(profile, readingData.question)
    }

    // Track card preferences
    if (readingData.cards) {
      this.trackCardPreferences(profile, readingData.cards)
    }

    this.profiles.set(userId, profile)
    return profile
  }

  // Analyze question patterns
  private analyzeQuestionPattern(profile: UserProfile, question: string) {
    const categories = {
      love: ['love', 'relationship', 'romance', 'partner', 'dating'],
      career: ['career', 'job', 'work', 'money', 'success', 'business'],
      spiritual: ['spiritual', 'purpose', 'meaning', 'growth', 'path'],
      health: ['health', 'wellness', 'healing', 'energy'],
      family: ['family', 'children', 'parents', 'home']
    }

    const questionLower = question.toLowerCase()
    
    for (const [category, keywords] of Object.entries(categories)) {
      if (keywords.some(keyword => questionLower.includes(keyword))) {
        const existing = profile.preferences.questionCategories.find(c => c.category === category)
        if (existing) {
          existing.count++
        } else {
          profile.preferences.questionCategories.push({ category, count: 1 })
        }
        break
      }
    }
  }

  // Track card preferences
  private trackCardPreferences(profile: UserProfile, cards: any[]) {
    cards.forEach(card => {
      const existing = profile.preferences.cardTypes.find(c => c.arcana === card.arcana)
      if (existing) {
        existing.count++
      } else {
        profile.preferences.cardTypes.push({ arcana: card.arcana, count: 1 })
      }
    })
  }

  // Get user profile
  getProfile(userId: string): UserProfile | undefined {
    return this.profiles.get(userId)
  }

  // Update user satisfaction
  updateSatisfaction(userId: string, rating: number, feedback?: string) {
    const profile = this.profiles.get(userId)
    if (!profile) return

    profile.accuracy.totalFeedback++
    profile.accuracy.averageRating = 
      (profile.accuracy.averageRating * (profile.accuracy.totalFeedback - 1) + rating) / 
      profile.accuracy.totalFeedback
    
    profile.accuracy.satisfactionScore = profile.accuracy.averageRating
  }
}

interface UserProfile {
  userId: string
  createdAt: Date
  lastActive: Date
  readingCount: number
  preferences: {
    cardTypes: Array<{ arcana: string; count: number }>
    questionCategories: Array<{ category: string; count: number }>
    readingStyle: string
  }
  personality: {
    traits: any
    patterns: any[]
    growth: any[]
  }
  accuracy: {
    totalFeedback: number
    averageRating: number
    satisfactionScore: number
  }
}

export default UserProfiler