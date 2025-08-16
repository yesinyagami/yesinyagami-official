/**
 * AI Service Interfaces and Types
 * Defines contracts for all AI services in the orchestration system
 */

import type { TarotCard, TarotReading, User } from '../../types/tarot'

// Base interfaces
export interface AIRequest {
  id: string
  userId: string
  timestamp: Date
  context?: any
}

export interface AIResponse {
  success: boolean
  data?: any
  error?: string
  processingTime: number
  tokens?: number
  model?: string
}

export interface AIServiceConfig {
  apiKey: string
  baseUrl: string
  timeout: number
  model?: string
  retries?: number
  rateLimitMs?: number
}

// Perplexity Collective Consciousness Search
export interface CollectiveWisdomRequest extends AIRequest {
  cards: TarotCard[]
  question: string
  searchDepth: 'basic' | 'deep' | 'comprehensive'
  timeframe?: 'recent' | 'current' | 'historical' | 'all'
}

export interface CollectiveWisdomResponse extends AIResponse {
  data: {
    worldTrends: WorldTrend[]
    mysticalKnowledge: MysticalKnowledge[]
    historicalCases: HistoricalCase[]
    collectiveInsights: string[]
    confidence: number
  }
}

export interface WorldTrend {
  topic: string
  relevance: number
  description: string
  sources: string[]
  sentiment: 'positive' | 'negative' | 'neutral'
  cardConnections: string[]
}

export interface MysticalKnowledge {
  concept: string
  tradition: string
  description: string
  cardRelevance: Record<string, number>
  practicalApplication: string
}

export interface HistoricalCase {
  era: string
  description: string
  outcome: string
  lessonLearned: string
  cardParallels: string[]
}

// Monica Personal Psychological Analysis
export interface PersonalAnalysisRequest extends AIRequest {
  user: User
  cards: TarotCard[]
  readingHistory?: TarotReading[]
  currentMood?: string
}

export interface PersonalAnalysisResponse extends AIResponse {
  data: {
    psychologicalProfile: PsychologicalProfile
    emotionalState: EmotionalState
    lifePatterns: LifePattern[]
    personalizedSuggestions: PersonalSuggestion[]
    growthAreas: GrowthArea[]
  }
}

export interface PsychologicalProfile {
  mbtiType?: string
  enneagramType?: number
  dominantTraits: string[]
  cognitivePatterns: string[]
  decisionMakingStyle: string
  stressResponse: string
}

export interface EmotionalState {
  current: string
  stability: number
  predominantEmotions: string[]
  energyLevel: number
  clarity: number
  recommendations: string[]
}

export interface LifePattern {
  pattern: string
  frequency: number
  cardTriggers: string[]
  description: string
  breakingStrategy: string
}

export interface PersonalSuggestion {
  category: 'immediate' | 'short_term' | 'long_term'
  action: string
  reasoning: string
  cardGuidance: string
  difficulty: number
}

export interface GrowthArea {
  area: string
  currentLevel: number
  targetLevel: number
  steps: string[]
  timeline: string
  supportingCards: string[]
}

// Gemini Wisdom Integration Hub
export interface WisdomIntegrationRequest extends AIRequest {
  collectiveWisdom: CollectiveWisdomResponse['data']
  personalAnalysis: PersonalAnalysisResponse['data']
  userHistory: TarotReading[]
  novelContext: NovelContext
  integrationDepth: 'surface' | 'deep' | 'profound'
}

export interface WisdomIntegrationResponse extends AIResponse {
  data: {
    integratedInsights: IntegratedInsight[]
    storyConnections: StoryConnection[]
    holisticGuidance: HolisticGuidance
    actionPlan: ActionPlan
    spiritualSynthesis: SpiritualSynthesis
  }
}

export interface NovelContext {
  currentChapter: string
  characterArcs: CharacterArc[]
  thematicElements: string[]
  symbolism: SymbolicElement[]
}

export interface CharacterArc {
  character: string
  currentState: string
  development: string
  cardResonance: string[]
}

export interface SymbolicElement {
  symbol: string
  meaning: string
  cardConnections: string[]
  personalRelevance: number
}

export interface IntegratedInsight {
  level: 'practical' | 'emotional' | 'spiritual' | 'transcendent'
  insight: string
  confidence: number
  supportingEvidence: string[]
  cardSynergy: string[]
}

export interface StoryConnection {
  novelElement: string
  personalParallel: string
  guidance: string
  symbolism: string
  transformationPotential: number
}

export interface HolisticGuidance {
  overallTheme: string
  coreMessage: string
  practicalSteps: string[]
  spiritualPractices: string[]
  mindsetShifts: string[]
}

export interface ActionPlan {
  immediate: ActionItem[]
  weekly: ActionItem[]
  monthly: ActionItem[]
  longTerm: ActionItem[]
}

export interface ActionItem {
  action: string
  purpose: string
  cardSupport: string
  difficulty: number
  expectedOutcome: string
}

export interface SpiritualSynthesis {
  essentialTruth: string
  universalPrinciples: string[]
  personalMission: string
  soulPurpose: string
  nextEvolutionStep: string
}

// ChatGPT Poetic Sublimation
export interface PoeticSublimationRequest extends AIRequest {
  integratedWisdom: WisdomIntegrationResponse['data']
  userPreferences: UserPreferences
  styleRequests?: StyleRequest[]
}

export interface UserPreferences {
  literaryStyle: 'classical' | 'modern' | 'mystical' | 'practical' | 'poetic'
  length: 'concise' | 'medium' | 'detailed' | 'extensive'
  tone: 'gentle' | 'direct' | 'inspiring' | 'challenging' | 'mysterious'
  includeImagery: boolean
  includeSymbols: boolean
  shareableFormat: boolean
}

export interface StyleRequest {
  aspect: string
  preference: string
  intensity: number
}

export interface PoeticSublimationResponse extends AIResponse {
  data: {
    poeticReading: PoeticReading
    visualElements: VisualElement[]
    shareableContent: ShareableContent
    audioSuggestions: AudioSuggestion[]
  }
}

export interface PoeticReading {
  title: string
  subtitle?: string
  mainText: string
  sections: PoeticSection[]
  closingWisdom: string
  personalAffirmation: string
}

export interface PoeticSection {
  title: string
  content: string
  cardFocus: string[]
  imagery: string[]
  symbolism: string[]
}

export interface VisualElement {
  type: 'background' | 'overlay' | 'accent' | 'typography'
  description: string
  colors: string[]
  style: string
  cardInspiration: string[]
}

export interface ShareableContent {
  shortForm: string
  mediumForm: string
  fullForm: string
  hashtags: string[]
  visualPrompts: string[]
  audioNarration?: string
}

export interface AudioSuggestion {
  voice: string
  pace: string
  emotion: string
  backgroundMusic: string
  effects: string[]
}

// Base AI Service Interface
export interface IAIService {
  name: string
  version: string
  capabilities: string[]
  
  initialize(config: AIServiceConfig): Promise<void>
  isHealthy(): Promise<boolean>
  getUsageStats(): UsageStats
  cleanup(): Promise<void>
}

export interface UsageStats {
  totalRequests: number
  successfulRequests: number
  failedRequests: number
  averageResponseTime: number
  totalTokens: number
  lastRequest: Date
  rateLimitStatus: RateLimitStatus
}

export interface RateLimitStatus {
  remaining: number
  reset: Date
  limit: number
  window: number
}

// Orchestration Types
export interface ReadingRequest {
  id: string
  userId: string
  cards: TarotCard[]
  question: string
  user: User
  preferences: UserPreferences
  context?: any
}

export interface ReadingResponse {
  id: string
  success: boolean
  finalReading: PoeticReading
  processingSteps: ProcessingStep[]
  metadata: ReadingMetadata
  error?: string
}

export interface ProcessingStep {
  service: string
  startTime: Date
  endTime: Date
  success: boolean
  tokensUsed?: number
  error?: string
}

export interface ReadingMetadata {
  totalProcessingTime: number
  totalTokensUsed: number
  servicesUsed: string[]
  confidenceScore: number
  qualityMetrics: QualityMetrics
}

export interface QualityMetrics {
  coherence: number
  personalization: number
  insightfulness: number
  actionability: number
  poeticQuality: number
}

export default {
  // Export all interfaces
}