/**
 * Night God Tarot Type Definitions
 * Complete type system for the tarot application
 */

// =================== CORE TAROT TYPES ===================

export interface TarotCard {
  id: string
  name: string
  number?: number
  arcana: 'major' | 'minor' | 'hidden'
  suit?: 'wands' | 'cups' | 'swords' | 'pentacles'
  element?: 'fire' | 'water' | 'air' | 'earth'
  image: string
  description: string
  meanings: {
    upright: {
      general: string
      love: string
      career: string
      spiritual: string
    }
    reversed: {
      general: string
      love: string
      career: string
      spiritual: string
    }
  }
  keywords: {
    upright: string[]
    reversed: string[]
  }
  storyConnection?: {
    character: string
    chapter: string
    theme: string
    quote: string
  }
  unlockConditions?: UnlockCondition[]
  rarity?: 'common' | 'rare' | 'epic' | 'legendary' | 'mythic'
}

export interface TarotSpread {
  id: string
  name: string
  description: string
  positions: SpreadPosition[]
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'master'
  category: 'love' | 'career' | 'spiritual' | 'general' | 'special'
  requiredCards?: number
  unlockLevel?: number
  storyConnection?: string
}

export interface SpreadPosition {
  id: string
  name: string
  description: string
  x: number
  y: number
  rotation?: number
  allowReversed?: boolean
}

export interface DrawnCard {
  positionId: string
  cardId: string
  reversed: boolean
  interpretation?: string
  confidence?: number
}

export interface TarotReading {
  id: string
  userId: string
  spreadId: string
  question: string
  cards: DrawnCard[]
  interpretation: string
  aiInterpretations?: AIInterpretation[]
  poeticInterpretation?: string
  timestamp: Date
  isPublic: boolean
  tags: string[]
  mood?: string
  userFeedback?: UserFeedback
  storyElements?: StoryElement[]
}

// =================== AI & MONICA TYPES ===================

export interface MonicaConfig {
  apiKey?: string
  baseUrl?: string
  timeout?: number
  model?: MonicaModel
  personality?: string
}

export type MonicaModel = 
  | 'gpt-4o'
  | 'gpt-4o-mini'
  | 'gpt-4-turbo'
  | 'claude-3-5-sonnet-20240620'
  | 'claude-3-opus-20240229'
  | 'gemini-1.5-pro'
  | 'gemini-1.5-flash'

export interface MonicaResponse {
  success: boolean
  data?: unknown
  error?: string
}

export interface AIInterpretation {
  cardIndex: number
  content: string
  confidence: number
  themes: string[]
  timestamp: Date
  model?: MonicaModel
  metadata?: {
    tokensUsed?: number
    responseTime?: number
    emotionalTone?: string
  }
}

export interface MonicaMemory {
  userId: string
  sessionId: string
  interactions: MemoryEntry[]
  preferences: UserPreferences
  context: ContextData
}

export interface MemoryEntry {
  timestamp: Date
  type: 'question' | 'interpretation' | 'feedback' | 'preference'
  data: unknown
  importance: number // 1-10
}

// =================== USER & PROGRESS TYPES ===================

export interface User {
  id: string
  username: string
  email: string
  avatar?: string
  membershipTier: MembershipTier
  joinDate: Date
  lastActive: Date
  preferences: UserPreferences
  progress: UserProgress
  achievements: Achievement[]
}

export interface UserProgress {
  userId: string
  level: number
  experience: number
  totalReadings: number
  streakDays: number
  favoriteCards: string[]
  unlockedCards: string[]
  unlockedSpreads: string[]
  drawnCards?: string[]
  readingHistory: ReadingHistorySummary[]
  achievements: string[]
  storyProgress: StoryProgress
}

export interface UserPreferences {
  language: 'zh-TW' | 'zh-CN' | 'en' | 'ja'
  theme: 'dark' | 'light' | 'cosmic' | 'mystical'
  aiModel: MonicaModel
  interpretationStyle: 'traditional' | 'modern' | 'poetic' | 'practical'
  audioEnabled: boolean
  effectsLevel: 'minimal' | 'medium' | 'full' | 'maximum'
  autoSave: boolean
  privateMode: boolean
}

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  unlockedAt: Date
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  rewards?: Reward[]
}

export interface Reward {
  type: 'card' | 'spread' | 'theme' | 'feature' | 'credits'
  id: string
  quantity?: number
}

// =================== STORY & NOVEL TYPES ===================

export interface NovelChapter {
  id: string
  title: string
  subtitle?: string
  content: string
  summary: string
  themes: string[]
  characters: string[]
  relatedCards: string[]
  unlockLevel: number
  wordCount: number
  readingTime: number // minutes
  mood: 'mysterious' | 'hopeful' | 'dark' | 'uplifting' | 'contemplative'
}

export interface StoryCharacter {
  id: string
  name: string
  title?: string
  description: string
  backstory: string
  currentRole: string
  personality: string[]
  relatedCards: string[]
  imageUrl?: string
  voiceProfile?: VoiceProfile
  relationships: Relationship[]
}

export interface StoryElement {
  type: 'character' | 'location' | 'concept' | 'artifact'
  id: string
  name: string
  description: string
  relevance: number // 1-10
  cards: string[]
}

export interface StoryProgress {
  chaptersRead: string[]
  charactersUnlocked: string[]
  themesExplored: string[]
  currentChapter?: string
  readingTime: number // total minutes
  favoriteCharacters: string[]
  storyChoices: StoryChoice[]
}

export interface StoryChoice {
  chapterId: string
  choiceId: string
  selectedOption: string
  timestamp: Date
  consequences?: string[]
}

// =================== HIDDEN CARDS & UNLOCK SYSTEM ===================

export interface UnlockCondition {
  type: 'readings_count' | 'specific_cards' | 'streak_days' | 'achievements' | 'story_progress' | 'special_event'
  requirement: unknown
  description: string
}

export interface HiddenCard extends TarotCard {
  arcana: 'hidden'
  unlockConditions: UnlockCondition[]
  unlockHint: string
  specialAbilities?: SpecialAbility[]
  lore: string
  discoveredBy?: string[]
  firstUnlockDate?: Date
}

export interface SpecialAbility {
  id: string
  name: string
  description: string
  effect: AbilityEffect
  cooldown?: number // seconds
  cost?: number // energy/credits
}

export interface AbilityEffect {
  type: 'reveal_future' | 'enhance_intuition' | 'unlock_memory' | 'cosmic_connection'
  magnitude: number
  duration?: number // seconds
  target?: 'self' | 'reading' | 'cards' | 'all'
}

// =================== 3D & VISUAL EFFECTS ===================

export interface VisualEffect {
  id: string
  name: string
  type: '3d' | 'particle' | 'shader' | 'animation'
  intensity: number // 0-1
  duration?: number // seconds
  triggerCondition?: string
  parameters: EffectParameters
}

export interface EffectParameters {
  [key: string]: unknown
  color?: string
  speed?: number
  count?: number
  size?: number
  opacity?: number
}

export interface ParticleSystem {
  active: boolean
  particleCount: number
  emissionRate: number
  lifetime: number
  velocity: Vector3
  gravity: Vector3
  color: Color
  size: number
  texture?: string
}

export interface Vector3 {
  x: number
  y: number
  z: number
}

export interface Color {
  r: number
  g: number
  b: number
  a?: number
}

// =================== AUDIO & ATMOSPHERE ===================

export interface AudioSettings {
  masterVolume: number
  musicVolume: number
  sfxVolume: number
  voiceVolume: number
  ambientVolume: number
  muted: boolean
}

export interface VoiceProfile {
  id: string
  name: string
  gender: 'male' | 'female' | 'neutral'
  age: 'young' | 'adult' | 'elder'
  accent: string
  tone: 'warm' | 'mysterious' | 'authoritative' | 'gentle'
  speed: number // 0.5 - 2.0
}

export interface SoundEffect {
  id: string
  name: string
  file: string
  volume: number
  loop: boolean
  fadeIn?: number
  fadeOut?: number
  trigger: string
}

// =================== PAYMENT & MEMBERSHIP ===================

export interface MembershipTier {
  id: string
  name: string
  level: number
  price: number
  currency: 'USD' | 'TWD' | 'CNY'
  billing: 'monthly' | 'yearly' | 'lifetime'
  features: MembershipFeature[]
  limits: MembershipLimits
  color: string
}

export interface MembershipFeature {
  id: string
  name: string
  description: string
  enabled: boolean
  premium: boolean
}

export interface MembershipLimits {
  dailyReadings: number
  aiInterpretations: number
  hiddenCards: number
  storyChapters: number
  customSpreads: number
  exportReadings: number
}

export interface PaymentIntent {
  id: string
  amount: number
  currency: string
  status: 'pending' | 'succeeded' | 'failed' | 'cancelled'
  method: 'buymeacoffee' | 'ipass' | 'stripe' | 'paypal'
  metadata: PaymentMetadata
  createdAt: Date
  completedAt?: Date
}

export interface PaymentMetadata {
  userId: string
  membershipTier: string
  promoCode?: string
  referralCode?: string
  platform: 'web' | 'mobile' | 'desktop'
}

// =================== REAL-TIME & SOCIAL ===================

export interface RealtimeEvent {
  type: string
  data: unknown
  timestamp: Date
  userId?: string
  sessionId?: string
}

export interface SocialFeature {
  id: string
  type: 'share_reading' | 'community_spread' | 'guided_session' | 'discussion'
  enabled: boolean
  requiresMembership: boolean
  settings: SocialSettings
}

export interface SocialSettings {
  allowPublicReadings: boolean
  allowComments: boolean
  allowSharing: boolean
  moderationLevel: 'strict' | 'moderate' | 'relaxed'
}

// =================== API & DATA TYPES ===================

export interface APIResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
  timestamp: Date
  requestId: string
}

export interface PaginatedResponse<T> extends APIResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export interface ContextData {
  currentReading?: TarotReading
  recentCards: string[]
  userMood?: string
  sessionStartTime: Date
  interactionCount: number
  lastQuestionThemes: string[]
}

export interface UserFeedback {
  readingId: string
  accuracy: number // 1-5
  helpfulness: number // 1-5
  clarity: number // 1-5
  overall: number // 1-5
  comments?: string
  timestamp: Date
}

export interface ReadingHistorySummary {
  date: Date
  count: number
  averageAccuracy?: number
  primaryThemes: string[]
  moodTrend: string
}

export interface Relationship {
  targetId: string
  type: 'family' | 'friend' | 'enemy' | 'mentor' | 'student' | 'romantic' | 'rival'
  description: string
  strength: number // 1-10
}

// =================== UTILITY TYPES ===================

export type Theme = 'dark' | 'light' | 'cosmic' | 'mystical'
export type Language = 'zh-TW' | 'zh-CN' | 'en' | 'ja'
export type Platform = 'web' | 'mobile' | 'desktop'
export type Environment = 'development' | 'staging' | 'production'

// =================== VALIDATION SCHEMAS ===================

export interface ValidationRule {
  field: string
  type: 'required' | 'email' | 'minLength' | 'maxLength' | 'pattern' | 'custom'
  value?: unknown
  message: string
  validator?: (value: unknown) => boolean
}

export interface FormValidation {
  rules: ValidationRule[]
  errors: Record<string, string>
  isValid: boolean
}

// =================== REQUEST TYPES ===================

export interface ReadingRequest {
  question: string
  spreadId: string
  userId: string
  cards?: DrawnCard[]
  mood?: string
  context?: ContextData
}

// =================== EXPORT ALL ===================

// Note: Other type modules removed during cleanup