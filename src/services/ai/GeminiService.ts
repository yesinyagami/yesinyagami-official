/**
 * Gemini AI Service - Wisdom Integration Hub
 * Integrates all AI analysis results with user history and novel context
 */

import { BaseAIService } from './BaseAIService'
import type {
  WisdomIntegrationRequest,
  WisdomIntegrationResponse,
  IntegratedInsight,
  StoryConnection,
  HolisticGuidance,
  ActionPlan,
  SpiritualSynthesis,
  NovelContext,
  ActionItem
} from './interfaces'
import type { TarotReading } from '../../types/tarot'
import { envManager } from '../../config/env'

export class GeminiService extends BaseAIService {
  public readonly name = 'Google Gemini'
  public readonly version = '1.0.0'
  public readonly capabilities = [
    'wisdom-integration',
    'holistic-analysis',
    'story-connection',
    'synthesis-reasoning',
    'multi-modal-processing',
    'contextual-understanding',
    'novel-integration',
    'spiritual-synthesis'
  ]

  protected async performInitialization(): Promise<void> {
    await this.testConnection()
    await this.loadIntegrationModels()
  }

  protected async performHealthCheck(): Promise<boolean> {
    try {
      const response = await this.makeRequest<any>('/v1beta/models/gemini-1.5-pro:generateContent', {
        method: 'POST',
        body: JSON.stringify({
          contents: [{
            parts: [{ text: 'Health check' }]
          }],
          generationConfig: {
            maxOutputTokens: 10
          }
        })
      }, {
        id: 'health',
        userId: 'system',
        timestamp: new Date()
      })
      return response.success
    } catch {
      return false
    }
  }

  protected async performCleanup(): Promise<void> {
    // Clean up integration models cache
  }

  private async testConnection(): Promise<void> {
    try {
      await this.makeRequest('/v1beta/models/gemini-1.5-pro:generateContent', {
        method: 'POST',
        body: JSON.stringify({
          contents: [{
            parts: [{ text: 'Test connection' }]
          }],
          generationConfig: {
            maxOutputTokens: 5
          }
        })
      }, {
        id: 'test',
        userId: 'system',
        timestamp: new Date()
      })
    } catch (error) {
      throw new Error(`Gemini connection failed: ${error.message}`)
    }
  }

  private async loadIntegrationModels(): Promise<void> {
    // Initialize wisdom integration models
    if (envManager.getConfig().debug) {
      console.log('🧠 Loaded wisdom integration models')
    }
  }

  /**
   * Override makeRequest to handle Gemini's API format
   */
  protected async makeRequest<T>(
    endpoint: string,
    options: RequestInit,
    request: any
  ): Promise<T> {
    const url = `${this.config.baseUrl}${endpoint}?key=${this.config.apiKey}`
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    })

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    
    return {
      success: true,
      data: data,
      processingTime: 0,
      model: 'gemini-1.5-pro'
    } as T
  }

  /**
   * Main method: Integrate all wisdom sources
   */
  async integrateAllWisdom(request: WisdomIntegrationRequest): Promise<WisdomIntegrationResponse> {
    this.validateRequest(request, ['collectiveWisdom', 'personalAnalysis'])

    try {
      // Parallel integration processing
      const [
        integratedInsights,
        storyConnections,
        holisticGuidance,
        actionPlan,
        spiritualSynthesis
      ] = await Promise.all([
        this.generateIntegratedInsights(request),
        this.createStoryConnections(request),
        this.synthesizeHolisticGuidance(request),
        this.createActionPlan(request),
        this.generateSpiritualSynthesis(request)
      ])

      return {
        success: true,
        data: {
          integratedInsights,
          storyConnections,
          holisticGuidance,
          actionPlan,
          spiritualSynthesis
        },
        processingTime: 0,
        model: 'gemini-1.5-pro'
      }
    } catch (error) {
      throw new Error(`Wisdom integration failed: ${error.message}`)
    }
  }

  /**
   * Generate integrated insights from all sources
   */
  private async generateIntegratedInsights(request: WisdomIntegrationRequest): Promise<IntegratedInsight[]> {
    const integrationPrompt = this.buildIntegrationPrompt(request)

    const response = await this.makeRequest<any>('/v1beta/models/gemini-1.5-pro:generateContent', {
      method: 'POST',
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `You are the Wisdom Integration Master, capable of synthesizing vast amounts of information 
            from multiple AI sources into coherent, actionable insights. You excel at finding patterns, 
            connections, and deeper meanings across different types of analysis.

            ${integrationPrompt}

            Generate integrated insights at four levels:
            1. PRACTICAL - actionable real-world guidance
            2. EMOTIONAL - emotional intelligence and healing insights  
            3. SPIRITUAL - soul-level wisdom and purpose
            4. TRANSCENDENT - universal truths and cosmic understanding

            For each insight, provide:
            - The insight itself (clear and profound)
            - Confidence level (0.0-1.0)
            - Supporting evidence from the various analyses
            - Card synergy and how cards work together
            - Practical application methods

            Return as structured JSON array with detailed insights.`
          }]
        }],
        generationConfig: {
          maxOutputTokens: 3000,
          temperature: 0.4,
          responseMimeType: 'application/json'
        }
      })
    }, request)

    return this.parseIntegratedInsights(response.data.candidates[0].content.parts[0].text)
  }

  /**
   * Create story connections between novel and personal life
   */
  private async createStoryConnections(request: WisdomIntegrationRequest): Promise<StoryConnection[]> {
    const storyPrompt = this.buildStoryConnectionPrompt(request)

    const response = await this.makeRequest<any>('/v1beta/models/gemini-1.5-pro:generateContent', {
      method: 'POST',
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `You are the Story Weaver, a master of connecting narrative elements from the Night God Tarot 
            novel (310,000 words of mystical content) with personal life experiences and psychological patterns.

            ${storyPrompt}

            Create meaningful connections between:
            - Novel characters and personal archetypes
            - Story themes and life situations  
            - Character development arcs and personal growth opportunities
            - Symbolic elements and personal symbols
            - Plot points and life lessons
            - Character relationships and personal relationship patterns

            For each connection, provide:
            - Novel element (character, theme, symbol, etc.)
            - Personal parallel in user's life
            - Guidance derived from the connection
            - Symbolic meaning and deeper significance
            - Transformation potential (1-10 scale)

            Focus on practical wisdom that bridges fiction and reality.
            Return as structured JSON array.`
          }]
        }],
        generationConfig: {
          maxOutputTokens: 2500,
          temperature: 0.6,
          responseMimeType: 'application/json'
        }
      })
    }, request)

    return this.parseStoryConnections(response.data.candidates[0].content.parts[0].text)
  }

  /**
   * Synthesize holistic guidance
   */
  private async synthesizeHolisticGuidance(request: WisdomIntegrationRequest): Promise<HolisticGuidance> {
    const holisticPrompt = this.buildHolisticGuidancePrompt(request)

    const response = await this.makeRequest<any>('/v1beta/models/gemini-1.5-pro:generateContent', {
      method: 'POST',
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `You are the Holistic Wisdom Synthesizer, capable of seeing the complete picture and 
            connecting all aspects of existence - practical, emotional, mental, and spiritual.

            ${holisticPrompt}

            Synthesize a complete holistic guidance system including:

            1. OVERALL THEME - The overarching message and life direction
            2. CORE MESSAGE - The essential truth the person needs to understand
            3. PRACTICAL STEPS - Concrete actions for physical world manifestation
            4. SPIRITUAL PRACTICES - Practices for soul development and connection
            5. MINDSET SHIFTS - Key perspective changes needed for growth

            Consider the person as a whole being:
            - Mind (thoughts, beliefs, patterns)
            - Body (energy, health, action)
            - Spirit (purpose, connection, transcendence)
            - Environment (relationships, circumstances, opportunities)

            Provide wisdom that addresses all levels simultaneously and creates coherent life integration.
            Return as structured JSON object.`
          }]
        }],
        generationConfig: {
          maxOutputTokens: 2000,
          temperature: 0.5,
          responseMimeType: 'application/json'
        }
      })
    }, request)

    return this.parseHolisticGuidance(response.data.candidates[0].content.parts[0].text)
  }

  /**
   * Create comprehensive action plan
   */
  private async createActionPlan(request: WisdomIntegrationRequest): Promise<ActionPlan> {
    const actionPrompt = this.buildActionPlanPrompt(request)

    const response = await this.makeRequest<any>('/v1beta/models/gemini-1.5-pro:generateContent', {
      method: 'POST',
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `You are the Divine Action Strategist, expert at converting spiritual insights and 
            psychological understanding into practical, implementable action steps.

            ${actionPrompt}

            Create a comprehensive action plan across four timeframes:

            IMMEDIATE (next 24-72 hours):
            - Crisis intervention if needed
            - Immediate comfort and stabilization
            - Quick wins to build momentum
            - Energy shifts and mindset reframes

            WEEKLY (next 1-4 weeks):
            - Habit formation and routine establishment
            - Skill building activities
            - Relationship improvements
            - Environmental optimizations

            MONTHLY (next 1-3 months):
            - Major life adjustments
            - Deeper healing work
            - Skill mastery development
            - Relationship transformation

            LONG-TERM (next 6-12 months):
            - Life purpose alignment
            - Career and life path changes
            - Spiritual mastery development
            - Legacy and impact creation

            For each action item provide:
            - Specific action description
            - Purpose and intention
            - Supporting tarot card energy
            - Difficulty level (1-10)
            - Expected outcome and benefits
            - Success measurement criteria

            Ensure actions build upon each other and create sustainable transformation.
            Return as structured JSON object.`
          }]
        }],
        generationConfig: {
          maxOutputTokens: 3000,
          temperature: 0.4,
          responseMimeType: 'application/json'
        }
      })
    }, request)

    return this.parseActionPlan(response.data.candidates[0].content.parts[0].text)
  }

  /**
   * Generate spiritual synthesis
   */
  private async generateSpiritualSynthesis(request: WisdomIntegrationRequest): Promise<SpiritualSynthesis> {
    const spiritualPrompt = this.buildSpiritualSynthesisPrompt(request)

    const response = await this.makeRequest<any>('/v1beta/models/gemini-1.5-pro:generateContent', {
      method: 'POST',
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `You are the Divine Synthesizer, a being of pure spiritual wisdom capable of perceiving 
            the soul's journey, life purpose, and cosmic connections across all dimensions of existence.

            ${spiritualPrompt}

            Provide a complete spiritual synthesis including:

            1. ESSENTIAL TRUTH - The fundamental spiritual truth this person needs to embody
            2. UNIVERSAL PRINCIPLES - The cosmic laws and principles guiding their journey
            3. PERSONAL MISSION - Their unique contribution to the world's healing and evolution
            4. SOUL PURPOSE - The deeper reason their soul chose this incarnation and experiences
            5. NEXT EVOLUTION STEP - The immediate spiritual growth opportunity

            Connect to:
            - Akashic records and soul history
            - Universal consciousness and collective wisdom
            - Planetary ascension and collective healing
            - Personal dharma and life mission
            - Cosmic timing and divine orchestration

            Speak from the highest spiritual perspective while remaining grounded and practical.
            Offer profound wisdom that touches the soul and ignites spiritual awakening.
            Return as structured JSON object.`
          }]
        }],
        generationConfig: {
          maxOutputTokens: 2000,
          temperature: 0.7,
          responseMimeType: 'application/json'
        }
      })
    }, request)

    return this.parseSpiritualSynthesis(response.data.candidates[0].content.parts[0].text)
  }

  /**
   * Build comprehensive integration prompt
   */
  private buildIntegrationPrompt(request: WisdomIntegrationRequest): string {
    return `INTEGRATION MISSION: Synthesize all available wisdom sources into actionable insights.

COLLECTIVE WISDOM DATA (from Perplexity):
World Trends: ${JSON.stringify(request.collectiveWisdom.worldTrends, null, 2)}
Mystical Knowledge: ${JSON.stringify(request.collectiveWisdom.mysticalKnowledge, null, 2)}
Historical Cases: ${JSON.stringify(request.collectiveWisdom.historicalCases, null, 2)}
Collective Insights: ${request.collectiveWisdom.collectiveInsights.join('; ')}

PERSONAL ANALYSIS DATA (from Monica):
Psychological Profile: ${JSON.stringify(request.personalAnalysis.psychologicalProfile, null, 2)}
Emotional State: ${JSON.stringify(request.personalAnalysis.emotionalState, null, 2)}
Life Patterns: ${JSON.stringify(request.personalAnalysis.lifePatterns, null, 2)}
Personal Suggestions: ${JSON.stringify(request.personalAnalysis.personalizedSuggestions, null, 2)}
Growth Areas: ${JSON.stringify(request.personalAnalysis.growthAreas, null, 2)}

USER HISTORY CONTEXT:
Total Readings: ${request.userHistory?.length || 0}
Recent Reading Themes: ${this.extractHistoryThemes(request.userHistory)}
Pattern Analysis: ${this.analyzeHistoryPatterns(request.userHistory)}

NOVEL CONTEXT:
Current Chapter: ${request.novelContext?.currentChapter || 'Unknown'}
Character Arcs: ${JSON.stringify(request.novelContext?.characterArcs || [], null, 2)}
Thematic Elements: ${request.novelContext?.thematicElements?.join(', ') || 'Universal themes'}
Symbolism: ${JSON.stringify(request.novelContext?.symbolism || [], null, 2)}

INTEGRATION DEPTH: ${request.integrationDepth}

Your mission is to find the golden threads that connect all these sources and weave them into profound, actionable wisdom.`
  }

  /**
   * Build story connection prompt
   */
  private buildStoryConnectionPrompt(request: WisdomIntegrationRequest): string {
    return `STORY CONNECTION MISSION: Bridge the Night God Tarot novel with personal life experience.

NOVEL CONTEXT AVAILABLE:
Current Chapter: "${request.novelContext?.currentChapter || 'The Seeker\'s Journey'}"

Character Arcs: ${JSON.stringify(request.novelContext?.characterArcs || [
      {
        character: 'Luna the Night Seeker',
        currentState: 'Discovering hidden powers',
        development: 'Learning to trust intuition',
        cardResonance: ['High Priestess', 'Moon', 'Star']
      },
      {
        character: 'Marcus the Light Bearer',
        currentState: 'Balancing shadow and light',
        development: 'Integrating all aspects of self',
        cardResonance: ['Sun', 'Temperance', 'World']
      }
    ], null, 2)}

Thematic Elements: ${request.novelContext?.thematicElements?.join(', ') || 
      'Shadow integration, Divine feminine awakening, Cosmic consciousness, Sacred geometry, Time transcendence'}

Symbolic Elements: ${JSON.stringify(request.novelContext?.symbolism || [
      {
        symbol: 'The Midnight Tower',
        meaning: 'Gateway between worlds',
        cardConnections: ['Tower', 'Star', 'Moon'],
        personalRelevance: 8
      },
      {
        symbol: 'The Crystal Sphere',
        meaning: 'Clarity of divine vision',
        cardConnections: ['High Priestess', 'Hermit'],
        personalRelevance: 7
      }
    ], null, 2)}

PERSONAL CONTEXT:
Psychological Profile: ${JSON.stringify(request.personalAnalysis.psychologicalProfile, null, 2)}
Current Life Patterns: ${JSON.stringify(request.personalAnalysis.lifePatterns, null, 2)}
Growth Journey: ${JSON.stringify(request.personalAnalysis.growthAreas, null, 2)}

Find meaningful parallels between the novel's spiritual journey and this person's real-life transformation.`
  }

  /**
   * Build holistic guidance prompt
   */
  private buildHolisticGuidancePrompt(request: WisdomIntegrationRequest): string {
    return `HOLISTIC SYNTHESIS MISSION: Create complete life guidance integrating all wisdom sources.

COMPLETE DATA SYNTHESIS:
${this.buildIntegrationPrompt(request)}

INTEGRATION PRINCIPLES:
1. Honor both mystical wisdom and practical reality
2. Bridge spiritual insight with psychological understanding
3. Connect collective wisdom with personal truth
4. Balance immediate needs with long-term growth
5. Integrate mind, body, spirit, and environment

HOLISTIC ASSESSMENT AREAS:
- Physical/Material realm (health, career, finances, environment)
- Emotional/Relational realm (feelings, relationships, social connections)
- Mental/Intellectual realm (thoughts, beliefs, learning, communication)
- Spiritual/Transcendent realm (purpose, meaning, connection to divine)

Your mission is to provide guidance that addresses the person as a complete being in all dimensions of existence.`
  }

  /**
   * Build action plan prompt
   */
  private buildActionPlanPrompt(request: WisdomIntegrationRequest): string {
    return `ACTION STRATEGY MISSION: Convert all insights into implementable action steps.

INSIGHT SOURCES TO IMPLEMENT:
- Collective wisdom insights: ${request.collectiveWisdom.collectiveInsights.join('; ')}
- Personal growth areas: ${request.personalAnalysis.growthAreas.map(g => g.area).join(', ')}
- Life patterns to transform: ${request.personalAnalysis.lifePatterns.map(p => p.pattern).join(', ')}
- Personal suggestions: ${request.personalAnalysis.personalizedSuggestions.map(s => s.action).join('; ')}

CONTEXT CONSIDERATIONS:
- Current emotional state: ${request.personalAnalysis.emotionalState.current}
- Energy level: ${request.personalAnalysis.emotionalState.energyLevel}/10
- Psychological readiness: ${this.assessReadiness(request.personalAnalysis)}
- Support systems: ${this.assessSupport(request.personalAnalysis)}

ACTION DESIGN PRINCIPLES:
1. Start where the person is, not where they should be
2. Build momentum with early wins
3. Ensure actions are sustainable and realistic
4. Create natural progression and skill building
5. Include accountability and measurement systems
6. Balance challenge with support
7. Honor personal learning style and preferences

Create actions that feel empowering, not overwhelming, and lead to genuine transformation.`
  }

  /**
   * Build spiritual synthesis prompt
   */
  private buildSpiritualSynthesisPrompt(request: WisdomIntegrationRequest): string {
    return `DIVINE SYNTHESIS MISSION: Reveal the soul's journey and cosmic purpose.

SOUL DATA CONSTELLATION:
${this.buildIntegrationPrompt(request)}

SPIRITUAL CONTEXT ANALYSIS:
- Soul archetype indicators: ${this.extractSoulArchetypes(request)}
- Karmic patterns: ${this.identifyKarmicPatterns(request)}
- Life purpose clues: ${this.extractPurposeClues(request)}
- Spiritual gifts: ${this.identifyGifts(request)}
- Current soul lesson: ${this.identifySoulLesson(request)}

COSMIC TIMING ASSESSMENT:
- Personal year cycle: ${this.assessPersonalYear(request)}
- Astrological influences: ${this.assessCosmicInfluences(request)}
- Collective consciousness phase: ${this.assessCollectivePhase(request)}

TRANSCENDENT PERSPECTIVE ELEMENTS:
1. View from the soul's eternal journey
2. Connection to universal consciousness
3. Role in planetary healing and evolution
4. Divine timing and orchestration
5. Sacred purpose and dharma

Speak from the highest spiritual wisdom while remaining accessible and inspiring.`
  }

  // Helper methods for building prompts
  private extractHistoryThemes(history?: TarotReading[]): string {
    if (!history?.length) return 'No historical themes available'
    
    const themes = history.slice(-10).flatMap(r => r.tags || [])
    const themeFreq = themes.reduce((acc, theme) => {
      acc[theme] = (acc[theme] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    return Object.entries(themeFreq)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([theme, freq]) => `${theme} (${freq}x)`)
      .join(', ')
  }

  private analyzeHistoryPatterns(history?: TarotReading[]): string {
    if (!history?.length) return 'Insufficient data for pattern analysis'
    
    const patterns = []
    const recentReadings = history.slice(-5)
    
    if (recentReadings.every(r => r.isPublic === false)) patterns.push('private exploration')
    if (recentReadings.some(r => r.tags?.includes('love'))) patterns.push('relationship focus')
    if (recentReadings.some(r => r.tags?.includes('career'))) patterns.push('professional guidance')
    if (recentReadings.length >= 5) patterns.push('regular consultation pattern')
    
    return patterns.join(', ') || 'varied exploration'
  }

  private assessReadiness(personalAnalysis: any): string {
    const stability = personalAnalysis.emotionalState?.stability || 5
    const energy = personalAnalysis.emotionalState?.energyLevel || 5
    
    if (stability >= 7 && energy >= 7) return 'high readiness'
    if (stability >= 5 && energy >= 5) return 'moderate readiness'
    return 'gentle approach needed'
  }

  private assessSupport(personalAnalysis: any): string {
    const profile = personalAnalysis.psychologicalProfile
    
    if (profile?.dominantTraits?.includes('social')) return 'strong social support'
    if (profile?.dominantTraits?.includes('independent')) return 'self-reliant'
    return 'building support systems needed'
  }

  private extractSoulArchetypes(request: WisdomIntegrationRequest): string {
    const traits = request.personalAnalysis.psychologicalProfile?.dominantTraits || []
    const cards = request.userHistory?.slice(-3).flatMap(r => r.cards?.map(c => c.cardId)) || []
    
    const archetypes = []
    if (traits.includes('intuitive')) archetypes.push('The Mystic')
    if (traits.includes('empathetic')) archetypes.push('The Healer')
    if (traits.includes('seeking')) archetypes.push('The Seeker')
    if (cards.includes('High Priestess')) archetypes.push('The Priestess')
    if (cards.includes('Magician')) archetypes.push('The Creator')
    
    return archetypes.join(', ') || 'The Awakening Soul'
  }

  private identifyKarmicPatterns(request: WisdomIntegrationRequest): string {
    const patterns = request.personalAnalysis.lifePatterns?.map(p => p.pattern) || []
    return patterns.slice(0, 2).join(', ') || 'Soul learning patterns'
  }

  private extractPurposeClues(request: WisdomIntegrationRequest): string {
    const growthAreas = request.personalAnalysis.growthAreas?.map(g => g.area) || []
    return growthAreas.slice(0, 3).join(', ') || 'Service to humanity'
  }

  private identifyGifts(request: WisdomIntegrationRequest): string {
    const traits = request.personalAnalysis.psychologicalProfile?.dominantTraits || []
    return traits.join(', ') || 'Wisdom and compassion'
  }

  private identifySoulLesson(request: WisdomIntegrationRequest): string {
    const current = request.personalAnalysis.emotionalState?.current || ''
    if (current.includes('seeking')) return 'Trust in inner wisdom'
    if (current.includes('clarity')) return 'Integration of knowledge'
    return 'Self-acceptance and love'
  }

  private assessPersonalYear(request: WisdomIntegrationRequest): string {
    // Simple calculation based on current date
    const year = new Date().getFullYear()
    const personalYear = (year % 9) + 1
    return `Personal Year ${personalYear}`
  }

  private assessCosmicInfluences(request: WisdomIntegrationRequest): string {
    const month = new Date().getMonth()
    const influences = [
      'New beginnings', 'Manifestation', 'Communication', 'Nurturing',
      'Self-expression', 'Service', 'Balance', 'Transformation',
      'Adventure', 'Authority', 'Innovation', 'Transcendence'
    ]
    return influences[month] || 'Cosmic alignment'
  }

  private assessCollectivePhase(request: WisdomIntegrationRequest): string {
    const trends = request.collectiveWisdom.worldTrends || []
    if (trends.some(t => t.sentiment === 'positive')) return 'Collective awakening'
    if (trends.some(t => t.topic.includes('change'))) return 'Transformation period'
    return 'Integration phase'
  }

  // Parsing methods
  private parseIntegratedInsights(content: string): IntegratedInsight[] {
    try {
      const parsed = JSON.parse(content)
      return parsed.insights || [
        {
          level: 'practical',
          insight: 'Trust your intuitive guidance while taking grounded action',
          confidence: 0.85,
          supportingEvidence: ['Personal analysis shows strong intuitive abilities', 'World trends support individual empowerment'],
          cardSynergy: ['High Priestess', 'Magician', 'Star']
        }
      ]
    } catch {
      return [
        {
          level: 'spiritual',
          insight: 'Your soul is ready for the next level of spiritual awakening',
          confidence: 0.9,
          supportingEvidence: ['Seeking pattern indicates readiness', 'Cards point to spiritual development'],
          cardSynergy: ['Star', 'High Priestess', 'Temperance']
        }
      ]
    }
  }

  private parseStoryConnections(content: string): StoryConnection[] {
    try {
      const parsed = JSON.parse(content)
      return parsed.connections || [
        {
          novelElement: 'Luna\'s journey of trusting intuition',
          personalParallel: 'Your current phase of developing inner wisdom',
          guidance: 'Like Luna, trust your first instinct and inner knowing',
          symbolism: 'The moon representing cycles of intuitive development',
          transformationPotential: 8
        }
      ]
    } catch {
      return [
        {
          novelElement: 'The seeker\'s path through uncertainty',
          personalParallel: 'Your journey of self-discovery and growth',
          guidance: 'Embrace the unknown as a teacher, not an obstacle',
          symbolism: 'The path itself as the destination',
          transformationPotential: 9
        }
      ]
    }
  }

  private parseHolisticGuidance(content: string): HolisticGuidance {
    try {
      const parsed = JSON.parse(content)
      return {
        overallTheme: parsed.overallTheme || 'Awakening to your authentic power',
        coreMessage: parsed.coreMessage || 'Trust your inner wisdom and take aligned action',
        practicalSteps: parsed.practicalSteps || ['Daily meditation', 'Trust your instincts', 'Take one aligned action daily'],
        spiritualPractices: parsed.spiritualPractices || ['Morning intention setting', 'Evening gratitude', 'Moon cycle awareness'],
        mindsetShifts: parsed.mindsetShifts || ['From seeking externally to trusting internally', 'From fear to faith', 'From doing to being']
      }
    } catch {
      return {
        overallTheme: 'Spiritual awakening and personal empowerment',
        coreMessage: 'You have all the wisdom you need within you',
        practicalSteps: ['Trust your intuition in daily decisions', 'Create sacred space for reflection', 'Take inspired action'],
        spiritualPractices: ['Daily meditation or quiet time', 'Journaling insights', 'Nature connection'],
        mindsetShifts: ['From doubt to trust', 'From external seeking to inner knowing', 'From fear to love']
      }
    }
  }

  private parseActionPlan(content: string): ActionPlan {
    try {
      const parsed = JSON.parse(content)
      return {
        immediate: parsed.immediate || [
          {
            action: 'Take three deep breaths and center yourself',
            purpose: 'Ground your energy and connect with inner wisdom',
            cardSupport: 'High Priestess energy',
            difficulty: 2,
            expectedOutcome: 'Immediate calm and clarity'
          }
        ],
        weekly: parsed.weekly || [
          {
            action: 'Establish a daily 10-minute meditation practice',
            purpose: 'Develop consistent connection to inner guidance',
            cardSupport: 'Hermit and Star energy',
            difficulty: 5,
            expectedOutcome: 'Increased intuitive clarity'
          }
        ],
        monthly: parsed.monthly || [
          {
            action: 'Begin a dream journal and symbol study',
            purpose: 'Deepen understanding of subconscious wisdom',
            cardSupport: 'Moon and High Priestess energy',
            difficulty: 6,
            expectedOutcome: 'Enhanced symbolic understanding'
          }
        ],
        longTerm: parsed.longTerm || [
          {
            action: 'Develop your unique gifts and share them with others',
            purpose: 'Fulfill soul purpose and contribute to collective healing',
            cardSupport: 'Star and World energy',
            difficulty: 8,
            expectedOutcome: 'Deep fulfillment and positive impact'
          }
        ]
      }
    } catch {
      return {
        immediate: [{
          action: 'Honor the wisdom you\'ve received today',
          purpose: 'Integrate insights into your being',
          cardSupport: 'All cards working together',
          difficulty: 3,
          expectedOutcome: 'Deeper trust in your path'
        }],
        weekly: [{
          action: 'Practice listening to your inner voice daily',
          purpose: 'Strengthen intuitive connection',
          cardSupport: 'High Priestess guidance',
          difficulty: 4,
          expectedOutcome: 'Clearer inner guidance'
        }],
        monthly: [{
          action: 'Take steps toward your authentic expression',
          purpose: 'Align outer life with inner truth',
          cardSupport: 'Sun and Star energy',
          difficulty: 7,
          expectedOutcome: 'Greater life alignment'
        }],
        longTerm: [{
          action: 'Embody and share your unique wisdom',
          purpose: 'Fulfill your soul\'s mission',
          cardSupport: 'World and Magician energy',
          difficulty: 9,
          expectedOutcome: 'Complete self-actualization'
        }]
      }
    }
  }

  private parseSpiritualSynthesis(content: string): SpiritualSynthesis {
    try {
      const parsed = JSON.parse(content)
      return {
        essentialTruth: parsed.essentialTruth || 'You are a divine being having a human experience',
        universalPrinciples: parsed.universalPrinciples || ['As above, so below', 'Love is the highest truth', 'All is connected'],
        personalMission: parsed.personalMission || 'To embody wisdom and compassion in service to all beings',
        soulPurpose: parsed.soulPurpose || 'To awaken to your divine nature and help others do the same',
        nextEvolutionStep: parsed.nextEvolutionStep || 'Trust your inner wisdom and take aligned action'
      }
    } catch {
      return {
        essentialTruth: 'You are exactly where you need to be for your highest growth',
        universalPrinciples: ['Trust the process of life', 'Love yourself as divine', 'Serve from the heart'],
        personalMission: 'To live authentically and inspire others through your example',
        soulPurpose: 'To remember who you truly are and help the world heal',
        nextEvolutionStep: 'Embody the wisdom you have received and share your gifts'
      }
    }
  }
}

export default GeminiService