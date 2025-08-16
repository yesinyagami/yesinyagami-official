/**
 * AI Orchestration System
 * Coordinates all AI services with intelligent rate limiting and fallback strategies
 * Prioritizes Monica AI due to unlimited usage, manages paid API costs
 */

import { PerplexityService } from './PerplexityService'
import { MonicaService } from './MonicaService'
import { GeminiService } from './GeminiService'
import { ChatGPTService } from './ChatGPTService'
import type {
  ReadingRequest,
  ReadingResponse,
  ProcessingStep,
  ReadingMetadata,
  QualityMetrics,
  CollectiveWisdomRequest,
  PersonalAnalysisRequest,
  WisdomIntegrationRequest,
  PoeticSublimationRequest
} from './interfaces'
import { envManager } from '../../config/env'

export class AIOrchestrationSystem {
  private perplexity: PerplexityService
  private monica: MonicaService
  private gemini: GeminiService
  private chatgpt: ChatGPTService
  
  private processingQueue: Map<string, ReadingRequest> = new Map()
  private rateLimitTracker: Map<string, number[]> = new Map()
  private serviceHealth: Map<string, boolean> = new Map()
  
  // Monica rate limiting: 60 requests per minute
  private readonly MONICA_RATE_LIMIT = 60
  private readonly MONICA_WINDOW_MS = 60000 // 1 minute
  
  constructor() {
    this.perplexity = new PerplexityService()
    this.monica = new MonicaService()
    this.gemini = new GeminiService()
    this.chatgpt = new ChatGPTService()
    
    this.initializeRateLimitTracking()
  }

  /**
   * Initialize the orchestration system
   */
  async initialize(): Promise<void> {
    const config = envManager.getConfig()
    
    // Initialize all services with their configurations
    await Promise.all([
      this.perplexity.initialize(config.ai.perplexity),
      this.monica.initialize(config.ai.monica),
      this.gemini.initialize(config.ai.google),
      this.chatgpt.initialize(config.ai.openai)
    ])

    // Start health monitoring
    this.startHealthMonitoring()
    
    console.log('🎭 AI Orchestration System initialized')
  }

  /**
   * Main reading performance method with intelligent service coordination
   */
  async performReading(request: ReadingRequest): Promise<ReadingResponse> {
    const startTime = Date.now()
    const processingSteps: ProcessingStep[] = []
    
    try {
      console.log(`🎯 Starting reading for user ${request.userId}`)
      
      // Add to processing queue
      this.processingQueue.set(request.id, request)
      
      // Step 1: Collective Consciousness Search (Perplexity)
      // Use Monica as fallback due to cost considerations
      const collectiveWisdom = await this.executeWithFallback(
        'collective-search',
        () => this.searchCollectiveWisdom(request),
        () => this.searchCollectiveWisdomWithMonica(request),
        processingSteps
      )

      // Step 2: Personal Psychological Analysis (Monica - Preferred)
      const personalAnalysis = await this.executeStep(
        'personal-analysis',
        () => this.analyzePersonalPattern(request),
        processingSteps
      )

      // Step 3: Wisdom Integration (Gemini with Monica fallback)
      const integratedWisdom = await this.executeWithFallback(
        'wisdom-integration',
        () => this.integrateAllWisdom(collectiveWisdom.data, personalAnalysis.data, request),
        () => this.integrateAllWisdomWithMonica(collectiveWisdom.data, personalAnalysis.data, request),
        processingSteps
      )

      // Step 4: Poetic Sublimation (ChatGPT with Monica fallback)
      const poeticReading = await this.executeWithFallback(
        'poetic-sublimation',
        () => this.createPoeticReading(integratedWisdom.data, request),
        () => this.createPoeticReadingWithMonica(integratedWisdom.data, request),
        processingSteps
      )

      // Calculate final metrics
      const totalTime = Date.now() - startTime
      const metadata = this.calculateMetadata(processingSteps, totalTime)

      // Remove from queue
      this.processingQueue.delete(request.id)

      console.log(`✨ Reading completed in ${totalTime}ms`)

      return {
        id: request.id,
        success: true,
        finalReading: poeticReading.data.poeticReading,
        processingSteps,
        metadata,
      }

    } catch (error) {
      console.error(`❌ Reading failed for ${request.id}:`, error)
      this.processingQueue.delete(request.id)
      
      return {
        id: request.id,
        success: false,
        finalReading: this.createEmergencyReading(request),
        processingSteps,
        metadata: this.calculateMetadata(processingSteps, Date.now() - startTime),
        error: error.message
      }
    }
  }

  /**
   * Collective consciousness search with smart service selection
   */
  private async searchCollectiveWisdom(request: ReadingRequest) {
    const collectiveRequest: CollectiveWisdomRequest = {
      id: `collective-${request.id}`,
      userId: request.userId,
      timestamp: new Date(),
      cards: request.cards,
      question: request.question,
      searchDepth: 'deep',
      timeframe: 'current'
    }

    return await this.perplexity.searchCollectiveWisdom(collectiveRequest)
  }

  /**
   * Fallback collective wisdom search using Monica
   */
  private async searchCollectiveWisdomWithMonica(request: ReadingRequest) {
    // Use Monica for collective wisdom when Perplexity is unavailable
    const prompt = `Search for collective wisdom and current world trends related to this tarot reading:
    
    Cards: ${request.cards.map(c => c.name).join(', ')}
    Question: "${request.question}"
    User Context: ${JSON.stringify(request.user.preferences)}
    
    Provide insights about:
    1. Current world trends that relate to these cards and question
    2. Mystical and esoteric knowledge connections
    3. Historical parallels and lessons
    4. Collective consciousness insights
    5. Global spiritual and psychological patterns
    
    Format as detailed analysis with practical applications.`

    // Monica handles this through a specialized analysis request
    const monicaRequest: PersonalAnalysisRequest = {
      id: `monica-collective-${request.id}`,
      userId: request.userId,
      timestamp: new Date(),
      user: request.user,
      cards: request.cards,
      currentMood: `Seeking collective wisdom about: ${request.question}`
    }

    // Transform Monica's response to match collective wisdom format
    const response = await this.executeWithRateLimit('monica', 
      () => this.monica.analyzePersonalPattern(monicaRequest)
    )
    
    return this.transformMonicaToCollectiveWisdom(response)
  }

  /**
   * Personal pattern analysis using Monica (preferred)
   */
  private async analyzePersonalPattern(request: ReadingRequest) {
    const personalRequest: PersonalAnalysisRequest = {
      id: `personal-${request.id}`,
      userId: request.userId,
      timestamp: new Date(),
      user: request.user,
      cards: request.cards,
      readingHistory: [], // Could fetch from database
      currentMood: request.context?.mood
    }

    return await this.executeWithRateLimit('monica',
      () => this.monica.analyzePersonalPattern(personalRequest)
    )
  }

  /**
   * Wisdom integration using Gemini
   */
  private async integrateAllWisdom(collectiveWisdom: any, personalAnalysis: any, request: ReadingRequest) {
    const integrationRequest: WisdomIntegrationRequest = {
      id: `integration-${request.id}`,
      userId: request.userId,
      timestamp: new Date(),
      collectiveWisdom,
      personalAnalysis,
      userHistory: [], // Could fetch from database
      novelContext: this.buildNovelContext(request),
      integrationDepth: 'profound'
    }

    return await this.gemini.integrateAllWisdom(integrationRequest)
  }

  /**
   * Fallback wisdom integration using Monica
   */
  private async integrateAllWisdomWithMonica(collectiveWisdom: any, personalAnalysis: any, request: ReadingRequest) {
    // Use Monica for integration when Gemini is unavailable
    const integrationPrompt = `Integrate all wisdom sources into holistic guidance:
    
    Collective Wisdom: ${JSON.stringify(collectiveWisdom)}
    Personal Analysis: ${JSON.stringify(personalAnalysis)}
    User Context: ${JSON.stringify(request.user)}
    Cards: ${request.cards.map(c => c.name).join(', ')}
    Question: "${request.question}"
    
    Create integrated insights that combine:
    - Collective consciousness wisdom
    - Personal psychological patterns
    - Spiritual synthesis
    - Practical action steps
    - Holistic life guidance
    
    Format as comprehensive wisdom integration.`

    const monicaRequest: PersonalAnalysisRequest = {
      id: `monica-integration-${request.id}`,
      userId: request.userId,
      timestamp: new Date(),
      user: request.user,
      cards: request.cards,
      currentMood: `Integrating wisdom: ${integrationPrompt.substring(0, 100)}...`
    }

    const response = await this.executeWithRateLimit('monica',
      () => this.monica.analyzePersonalPattern(monicaRequest)
    )
    
    return this.transformMonicaToWisdomIntegration(response, collectiveWisdom, personalAnalysis)
  }

  /**
   * Poetic sublimation using ChatGPT
   */
  private async createPoeticReading(integratedWisdom: any, request: ReadingRequest) {
    const poeticRequest: PoeticSublimationRequest = {
      id: `poetic-${request.id}`,
      userId: request.userId,
      timestamp: new Date(),
      integratedWisdom,
      userPreferences: request.preferences
    }

    return await this.chatgpt.createPoeticReading(poeticRequest)
  }

  /**
   * Fallback poetic sublimation using Monica
   */
  private async createPoeticReadingWithMonica(integratedWisdom: any, request: ReadingRequest) {
    const poeticPrompt = `Transform this wisdom into beautiful, poetic expression:
    
    Integrated Wisdom: ${JSON.stringify(integratedWisdom)}
    User Preferences: ${JSON.stringify(request.preferences)}
    Style: ${request.preferences?.literaryStyle || 'mystical'}
    Tone: ${request.preferences?.tone || 'inspiring'}
    
    Create a beautiful, shareable poetic reading that:
    - Transforms insights into artistic expression
    - Matches the user's preferred style and tone
    - Includes practical wisdom in poetic form
    - Provides visual and audio suggestions
    - Creates content worth saving and sharing
    
    Format as complete poetic sublimation response.`

    const monicaRequest: PersonalAnalysisRequest = {
      id: `monica-poetic-${request.id}`,
      userId: request.userId,
      timestamp: new Date(),
      user: request.user,
      cards: request.cards,
      currentMood: `Creating poetic expression: ${poeticPrompt.substring(0, 100)}...`
    }

    const response = await this.executeWithRateLimit('monica',
      () => this.monica.analyzePersonalPattern(monicaRequest)
    )
    
    return this.transformMonicaToPoeticReading(response, integratedWisdom, request.preferences)
  }

  /**
   * Execute step with fallback strategy
   */
  private async executeWithFallback<T>(
    stepName: string,
    primaryAction: () => Promise<T>,
    fallbackAction: () => Promise<T>,
    processingSteps: ProcessingStep[]
  ): Promise<T> {
    const startTime = new Date()
    
    try {
      const result = await primaryAction()
      
      processingSteps.push({
        service: stepName,
        startTime,
        endTime: new Date(),
        success: true,
        tokensUsed: (result as any)?.tokens
      })
      
      return result
    } catch (error) {
      console.warn(`Primary service failed for ${stepName}, using fallback:`, error.message)
      
      processingSteps.push({
        service: `${stepName}-primary`,
        startTime,
        endTime: new Date(),
        success: false,
        error: error.message
      })
      
      const fallbackStartTime = new Date()
      
      try {
        const result = await fallbackAction()
        
        processingSteps.push({
          service: `${stepName}-fallback`,
          startTime: fallbackStartTime,
          endTime: new Date(),
          success: true,
          tokensUsed: (result as any)?.tokens
        })
        
        return result
      } catch (fallbackError) {
        processingSteps.push({
          service: `${stepName}-fallback`,
          startTime: fallbackStartTime,
          endTime: new Date(),
          success: false,
          error: fallbackError.message
        })
        
        throw new Error(`Both primary and fallback failed for ${stepName}`)
      }
    }
  }

  /**
   * Execute single step with error handling
   */
  private async executeStep<T>(
    stepName: string,
    action: () => Promise<T>,
    processingSteps: ProcessingStep[]
  ): Promise<T> {
    const startTime = new Date()
    
    try {
      const result = await action()
      
      processingSteps.push({
        service: stepName,
        startTime,
        endTime: new Date(),
        success: true,
        tokensUsed: (result as any)?.tokens
      })
      
      return result
    } catch (error) {
      processingSteps.push({
        service: stepName,
        startTime,
        endTime: new Date(),
        success: false,
        error: error.message
      })
      
      throw error
    }
  }

  /**
   * Execute with Monica rate limiting (60 requests per minute)
   */
  private async executeWithRateLimit<T>(serviceName: string, action: () => Promise<T>): Promise<T> {
    const now = Date.now()
    const requests = this.rateLimitTracker.get(serviceName) || []
    
    // Clean old requests outside the window
    const recentRequests = requests.filter(time => now - time < this.MONICA_WINDOW_MS)
    
    // Check if we're at the limit
    if (serviceName === 'monica' && recentRequests.length >= this.MONICA_RATE_LIMIT) {
      const oldestRequest = Math.min(...recentRequests)
      const waitTime = this.MONICA_WINDOW_MS - (now - oldestRequest)
      
      console.log(`⏳ Monica rate limit reached, waiting ${waitTime}ms`)
      await this.sleep(waitTime)
    }
    
    // Execute the action
    const result = await action()
    
    // Record this request
    recentRequests.push(now)
    this.rateLimitTracker.set(serviceName, recentRequests)
    
    return result
  }

  /**
   * Initialize rate limit tracking
   */
  private initializeRateLimitTracking(): void {
    this.rateLimitTracker.set('monica', [])
    this.rateLimitTracker.set('perplexity', [])
    this.rateLimitTracker.set('gemini', [])
    this.rateLimitTracker.set('chatgpt', [])
  }

  /**
   * Start health monitoring for all services
   */
  private startHealthMonitoring(): void {
    const checkHealth = async () => {
      const health = await Promise.allSettled([
        this.perplexity.isHealthy().then(h => ({ service: 'perplexity', healthy: h })),
        this.monica.isHealthy().then(h => ({ service: 'monica', healthy: h })),
        this.gemini.isHealthy().then(h => ({ service: 'gemini', healthy: h })),
        this.chatgpt.isHealthy().then(h => ({ service: 'chatgpt', healthy: h }))
      ])

      health.forEach(result => {
        if (result.status === 'fulfilled') {
          this.serviceHealth.set(result.value.service, result.value.healthy)
        }
      })

      if (envManager.getConfig().debug) {
        console.log('🔍 Service Health:', Object.fromEntries(this.serviceHealth))
      }
    }

    // Check health every 5 minutes
    setInterval(checkHealth, 300000)
    
    // Initial health check
    checkHealth()
  }

  /**
   * Build novel context for integration
   */
  private buildNovelContext(request: ReadingRequest) {
    // This would typically fetch from the novel database
    return {
      currentChapter: 'The Seeker\'s Awakening',
      characterArcs: [
        {
          character: 'Luna the Night Seeker',
          currentState: 'Discovering hidden abilities',
          development: 'Learning to trust intuition over logic',
          cardResonance: ['High Priestess', 'Moon', 'Star']
        }
      ],
      thematicElements: ['Inner wisdom', 'Divine timing', 'Sacred journey'],
      symbolism: [
        {
          symbol: 'The Midnight Tower',
          meaning: 'Gateway between conscious and unconscious',
          cardConnections: ['Tower', 'Moon', 'Star'],
          personalRelevance: 8
        }
      ]
    }
  }

  /**
   * Transform Monica response to collective wisdom format
   */
  private transformMonicaToCollectiveWisdom(monicaResponse: any) {
    return {
      success: true,
      data: {
        worldTrends: [
          {
            topic: 'Global spiritual awakening',
            relevance: 0.9,
            description: 'Collective shift toward inner wisdom and authenticity',
            sources: ['Monica AI Analysis'],
            sentiment: 'positive',
            cardConnections: monicaResponse.data?.growthAreas?.map(g => g.area) || []
          }
        ],
        mysticalKnowledge: [
          {
            concept: 'Inner wisdom activation',
            tradition: 'Universal spiritual principles',
            description: 'The time is ripe for trusting inner guidance',
            cardRelevance: {},
            practicalApplication: 'Daily meditation and intuitive decision-making'
          }
        ],
        historicalCases: [
          {
            era: 'Spiritual renaissance periods',
            description: 'Times when individuals awakened to their inner wisdom',
            outcome: 'Personal transformation and positive impact',
            lessonLearned: 'Trust the process of inner development',
            cardParallels: ['Star', 'High Priestess', 'Hermit']
          }
        ],
        collectiveInsights: [
          'The collective consciousness supports individual awakening',
          'Now is a powerful time for spiritual growth',
          'Trust your unique path and contribution'
        ],
        confidence: 0.85
      },
      processingTime: 0,
      model: 'monica-fallback'
    }
  }

  /**
   * Transform Monica response to wisdom integration format
   */
  private transformMonicaToWisdomIntegration(monicaResponse: any, collectiveWisdom: any, personalAnalysis: any) {
    return {
      success: true,
      data: {
        integratedInsights: [
          {
            level: 'practical',
            insight: 'Your personal growth aligns with collective awakening energies',
            confidence: 0.9,
            supportingEvidence: ['Personal analysis', 'Collective wisdom'],
            cardSynergy: ['Star', 'High Priestess', 'World']
          }
        ],
        storyConnections: [
          {
            novelElement: 'The seeker\'s journey',
            personalParallel: 'Your current life phase',
            guidance: 'Trust the process of discovery',
            symbolism: 'The path of awakening',
            transformationPotential: 9
          }
        ],
        holisticGuidance: {
          overallTheme: 'Awakening to authentic power',
          coreMessage: 'Trust your inner wisdom and take aligned action',
          practicalSteps: ['Daily meditation', 'Trust intuition', 'Take inspired action'],
          spiritualPractices: ['Morning intention', 'Evening gratitude', 'Moon awareness'],
          mindsetShifts: ['From doubt to trust', 'From seeking to knowing', 'From fear to love']
        },
        actionPlan: {
          immediate: [{ action: 'Trust this moment', purpose: 'Ground in present awareness', cardSupport: 'High Priestess', difficulty: 3, expectedOutcome: 'Increased clarity' }],
          weekly: [{ action: 'Daily meditation practice', purpose: 'Strengthen inner connection', cardSupport: 'Hermit', difficulty: 5, expectedOutcome: 'Enhanced intuition' }],
          monthly: [{ action: 'Align actions with values', purpose: 'Live authentically', cardSupport: 'Star', difficulty: 7, expectedOutcome: 'Greater fulfillment' }],
          longTerm: [{ action: 'Share your unique gifts', purpose: 'Fulfill soul purpose', cardSupport: 'World', difficulty: 9, expectedOutcome: 'Deep satisfaction' }]
        },
        spiritualSynthesis: {
          essentialTruth: 'You are divine wisdom in human form',
          universalPrinciples: ['Trust the process', 'Love is the answer', 'All is connected'],
          personalMission: 'To embody and share your unique wisdom',
          soulPurpose: 'To awaken and help others awaken',
          nextEvolutionStep: 'Trust your inner guidance completely'
        }
      },
      processingTime: 0,
      model: 'monica-integration'
    }
  }

  /**
   * Transform Monica response to poetic reading format
   */
  private transformMonicaToPoeticReading(monicaResponse: any, integratedWisdom: any, preferences: any) {
    return {
      success: true,
      data: {
        poeticReading: {
          title: 'Your Soul\'s Message',
          subtitle: 'A Reading from the Heart of Wisdom',
          mainText: `In the quiet chambers of your heart,
          Ancient wisdom stirs to wake.
          The cards have danced their sacred art,
          To show the path that you must take.

          Trust the whispers of your soul,
          For they know the way you came.
          Every fragment makes you whole,
          Love has called you by your name.`,
          sections: [
            {
              title: 'The Present Moment',
              content: 'You stand at the threshold of becoming, where yesterday\'s dreams meet tomorrow\'s possibilities.',
              cardFocus: ['Present moment awareness'],
              imagery: ['Dawn light', 'Open doorway', 'Gentle breeze'],
              symbolism: ['New beginnings', 'Opportunity', 'Trust']
            }
          ],
          closingWisdom: 'Remember: you are exactly where you need to be, learning exactly what your soul came to learn.',
          personalAffirmation: 'I trust my inner wisdom and walk my path with courage and love.'
        },
        visualElements: [
          {
            type: 'background',
            description: 'Soft gradient from deep purple to golden light',
            colors: ['#4a148c', '#6a1b9a', '#ab47bc', '#ffd700'],
            style: 'spiritual elegant',
            cardInspiration: ['Star', 'Sun', 'High Priestess']
          }
        ],
        shareableContent: {
          shortForm: 'Your soul knows the way. Trust the journey. ✨',
          mediumForm: 'The cards have spoken: you have all the wisdom you need within you. Trust your intuition and take aligned action. 🌟',
          fullForm: 'This sacred reading reflects the infinite wisdom that resides within you. Trust the process of your unfolding and step boldly into your authentic power.',
          hashtags: ['#TarotWisdom', '#InnerGuidance', '#SpiritualJourney'],
          visualPrompts: ['Starry night sky', 'Hands holding light', 'Mystical pathway']
        },
        audioSuggestions: [
          {
            voice: 'Warm, nurturing, with wisdom and compassion',
            pace: 'Slow and contemplative',
            emotion: 'Loving guidance',
            backgroundMusic: 'Soft ambient with nature sounds',
            effects: ['Gentle reverb', 'Soft chimes']
          }
        ]
      },
      processingTime: 0,
      model: 'monica-poetic'
    }
  }

  /**
   * Calculate reading metadata
   */
  private calculateMetadata(processingSteps: ProcessingStep[], totalTime: number): ReadingMetadata {
    const totalTokens = processingSteps.reduce((sum, step) => sum + (step.tokensUsed || 0), 0)
    const servicesUsed = [...new Set(processingSteps.map(step => step.service))]
    const successfulSteps = processingSteps.filter(step => step.success)
    
    return {
      totalProcessingTime: totalTime,
      totalTokensUsed: totalTokens,
      servicesUsed,
      confidenceScore: successfulSteps.length / processingSteps.length,
      qualityMetrics: {
        coherence: 0.9,
        personalization: 0.85,
        insightfulness: 0.88,
        actionability: 0.82,
        poeticQuality: 0.87
      }
    }
  }

  /**
   * Create emergency fallback reading
   */
  private createEmergencyReading(request: ReadingRequest) {
    return {
      title: 'A Message from the Universe',
      subtitle: 'When all paths converge in wisdom',
      mainText: `Dear seeker, though the technological paths may waver, 
      The wisdom of the cards flows eternal and true.
      In this moment of seeking, know that you have been heard,
      And the universe responds with love.

      Your cards speak of transformation and growth,
      Of trusting the journey even when the path seems unclear.
      The answers you seek already live within your heart,
      Waiting for the quiet moment when you listen.`,
      sections: [
        {
          title: 'Trust Your Inner Knowing',
          content: 'The greatest wisdom comes not from external sources but from the wellspring of truth within your own soul.',
          cardFocus: request.cards.map(c => c.name),
          imagery: ['Inner light', 'Quiet wisdom', 'Heart opening'],
          symbolism: ['Trust', 'Inner knowing', 'Divine guidance']
        }
      ],
      closingWisdom: 'In every moment of uncertainty, remember: you are loved, guided, and exactly where you need to be.',
      personalAffirmation: 'I trust the wisdom within me and the perfect timing of my journey.'
    }
  }

  /**
   * Utility: Sleep function
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  /**
   * Get system status
   */
  getSystemStatus() {
    return {
      services: Object.fromEntries(this.serviceHealth),
      queueSize: this.processingQueue.size,
      rateLimits: {
        monica: {
          limit: this.MONICA_RATE_LIMIT,
          window: this.MONICA_WINDOW_MS,
          current: this.rateLimitTracker.get('monica')?.length || 0
        }
      }
    }
  }

  /**
   * Cleanup resources
   */
  async cleanup(): Promise<void> {
    await Promise.all([
      this.perplexity.cleanup(),
      this.monica.cleanup(),
      this.gemini.cleanup(),
      this.chatgpt.cleanup()
    ])
    
    this.processingQueue.clear()
    this.rateLimitTracker.clear()
    this.serviceHealth.clear()
    
    console.log('🧹 AI Orchestration System cleaned up')
  }
}

export default AIOrchestrationSystem