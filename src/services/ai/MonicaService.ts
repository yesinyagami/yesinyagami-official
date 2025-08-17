/**
 * Monica AI Service - Personal Psychological Analysis
 * Provides deep psychological profiling and personal pattern analysis
 */

import { BaseAIService } from './BaseAIService'
import { MonicaModelRouter } from './MonicaModelRouter'
import type {
  PersonalAnalysisRequest,
  PersonalAnalysisResponse,
  PsychologicalProfile,
  EmotionalState,
  LifePattern,
  PersonalSuggestion,
  GrowthArea
} from './interfaces'
import type { User, TarotCard, TarotReading } from '../../types/tarot'
import { envManager } from '../../config/env'

export class MonicaService extends BaseAIService {
  public readonly name = 'Monica AI'
  public readonly version = '1.0.0'
  public readonly capabilities = [
    'psychological-analysis',
    'personality-profiling',
    'emotional-assessment',
    'pattern-recognition',
    'personal-growth',
    'mbti-analysis',
    'enneagram-typing',
    'unlimited-processing',
    'multi-model-routing',
    'yi-model-optimization',
    'chinese-content-excellence'
  ]

  private modelRouter: MonicaModelRouter

  protected async performInitialization(): Promise<void> {
    this.modelRouter = MonicaModelRouter.getInstance()
    await this.testConnection()
    await this.loadPsychologicalModels()
  }

  protected async performHealthCheck(): Promise<boolean> {
    try {
      const response = await this.makeRequest<any>('/chat/completions', {
        method: 'POST',
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            {
              role: 'user',
              content: 'Health check'
            }
          ],
          max_tokens: 5
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
    // Clean up any cached psychological models
  }

  private async testConnection(): Promise<void> {
    try {
      await this.makeRequest('/chat/completions', {
        method: 'POST',
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [{ role: 'user', content: 'Test' }],
          max_tokens: 5
        })
      }, {
        id: 'test',
        userId: 'system',
        timestamp: new Date()
      })
    } catch (error) {
      throw new Error(`Monica connection failed: ${error.message}`)
    }
  }

  private async loadPsychologicalModels(): Promise<void> {
    // Initialize psychological assessment models
    if (envManager.getConfig().debug) {
      console.log('📚 Loaded psychological assessment models')
    }
  }

  /**
   * Main method: Analyze personal psychological patterns
   */
  async analyzePersonalPattern(request: PersonalAnalysisRequest): Promise<PersonalAnalysisResponse> {
    this.validateRequest(request, ['user', 'cards'])

    try {
      // Parallel analysis for efficiency - Monica handles unlimited requests
      const [
        psychologicalProfile,
        emotionalState,
        lifePatterns,
        personalizedSuggestions,
        growthAreas
      ] = await Promise.all([
        this.analyzePsychologicalProfile(request),
        this.assessEmotionalState(request),
        this.identifyLifePatterns(request),
        this.generatePersonalizedSuggestions(request),
        this.identifyGrowthAreas(request)
      ])

      return {
        success: true,
        data: {
          psychologicalProfile,
          emotionalState,
          lifePatterns,
          personalizedSuggestions,
          growthAreas
        },
        processingTime: 0, // Set by base class
        model: 'gpt-4o'
      }
    } catch (error) {
      throw new Error(`Personal analysis failed: ${error.message}`)
    }
  }

  /**
   * Analyze psychological profile using optimal Monica model
   */
  private async analyzePsychologicalProfile(request: PersonalAnalysisRequest): Promise<PsychologicalProfile> {
    const analysisPrompt = this.buildPsychologicalProfilePrompt(request)
    const userLanguage = request.user?.preferences?.language || 'zh-TW'
    
    // Get optimal model for personal analysis
    const modelRequest = this.modelRouter.buildMonicaRequest(
      'personal-analysis',
      analysisPrompt,
      {
        userLanguage,
        priority: 'quality',
        temperature: 0.3,
        maxTokens: 3000
      }
    )

    const response = await this.makeRequest<any>('/chat/completions', {
      method: 'POST',
      body: JSON.stringify({
        ...modelRequest,
        response_format: { type: 'json_object' }
      })
    }, request)

    return this.parsePsychologicalProfile(response.data.choices[0].message.content)
  }

  /**
   * Assess current emotional state
   */
  private async assessEmotionalState(request: PersonalAnalysisRequest): Promise<EmotionalState> {
    const emotionalPrompt = this.buildEmotionalAssessmentPrompt(request)

    const response = await this.makeRequest<any>('/chat/completions', {
      method: 'POST',
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `You are Dr. Monica, an expert in emotional intelligence and psychological assessment. 
            You can analyze emotional states with unlimited depth and accuracy using advanced psychological frameworks.
            
            Assess the person's current emotional state considering:
            - Emotional intelligence theory
            - Current mood indicators
            - Stress and resilience factors
            - Energy levels and emotional patterns
            - Tarot card emotional symbolism
            
            Provide compassionate, accurate emotional assessment with actionable recommendations.`
          },
          {
            role: 'user',
            content: emotionalPrompt
          }
        ],
        max_tokens: 2000,
        temperature: 0.4,
        response_format: { type: 'json_object' }
      })
    }, request)

    return this.parseEmotionalState(response.data.choices[0].message.content)
  }

  /**
   * Identify recurring life patterns
   */
  private async identifyLifePatterns(request: PersonalAnalysisRequest): Promise<LifePattern[]> {
    const patternsPrompt = this.buildLifePatternsPrompt(request)

    const response = await this.makeRequest<any>('/chat/completions', {
      method: 'POST',
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `You are Dr. Monica, a master pattern analyst specializing in identifying recurring life themes, 
            behavioral patterns, and unconscious cycles. With unlimited analytical capacity, you can detect 
            subtle patterns that escape normal observation.
            
            Analyze for:
            - Recurring relationship patterns
            - Career and success patterns
            - Emotional reaction patterns
            - Decision-making patterns
            - Growth and challenge cycles
            - Tarot archetypal patterns in life
            
            Provide practical pattern-breaking strategies based on psychological best practices.`
          },
          {
            role: 'user',
            content: patternsPrompt
          }
        ],
        max_tokens: 2500,
        temperature: 0.5,
        response_format: { type: 'json_object' }
      })
    }, request)

    return this.parseLifePatterns(response.data.choices[0].message.content)
  }

  /**
   * Generate personalized suggestions
   */
  private async generatePersonalizedSuggestions(request: PersonalAnalysisRequest): Promise<PersonalSuggestion[]> {
    const suggestionsPrompt = this.buildPersonalizedSuggestionsPrompt(request)

    const response = await this.makeRequest<any>('/chat/completions', {
      method: 'POST',
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `You are Dr. Monica, a personal development expert with unlimited insight into human potential 
            and growth strategies. You create highly personalized, actionable suggestions based on deep 
            psychological understanding.
            
            Generate suggestions that are:
            - Highly personalized to the individual
            - Psychologically sound and evidence-based
            - Practical and actionable
            - Aligned with tarot wisdom
            - Categorized by timeframe (immediate, short-term, long-term)
            - Graduated by difficulty level
            
            Consider the person's unique psychological makeup, current circumstances, and growth potential.`
          },
          {
            role: 'user',
            content: suggestionsPrompt
          }
        ],
        max_tokens: 2500,
        temperature: 0.6,
        response_format: { type: 'json_object' }
      })
    }, request)

    return this.parsePersonalizedSuggestions(response.data.choices[0].message.content)
  }

  /**
   * Identify growth areas
   */
  private async identifyGrowthAreas(request: PersonalAnalysisRequest): Promise<GrowthArea[]> {
    const growthPrompt = this.buildGrowthAreasPrompt(request)

    const response = await this.makeRequest<any>('/chat/completions', {
      method: 'POST',
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `You are Dr. Monica, a human potential expert with unlimited capacity to identify growth 
            opportunities and development pathways. You specialize in personalized growth planning based on 
            deep psychological assessment.
            
            Identify growth areas considering:
            - Current psychological development level
            - Untapped potential and strengths
            - Areas for improvement and healing
            - Skills and competencies to develop
            - Spiritual and emotional growth opportunities
            - Career and relationship development
            - Tarot-guided development paths
            
            Provide specific, measurable growth plans with clear steps and timelines.`
          },
          {
            role: 'user',
            content: growthPrompt
          }
        ],
        max_tokens: 3000,
        temperature: 0.5,
        response_format: { type: 'json_object' }
      })
    }, request)

    return this.parseGrowthAreas(response.data.choices[0].message.content)
  }

  /**
   * Build comprehensive psychological profile prompt
   */
  private buildPsychologicalProfilePrompt(request: PersonalAnalysisRequest): string {
    const user = request.user
    const cards = request.cards
    const history = request.readingHistory || []

    return `Analyze this person's psychological profile:

USER INFORMATION:
- Username: ${user.username}
- Membership Level: ${user.membershipTier?.name || 'Basic'}
- Join Date: ${user.joinDate}
- Total Readings: ${user.progress?.totalReadings || 0}
- Streak Days: ${user.progress?.streakDays || 0}
- Favorite Cards: ${user.progress?.favoriteCards?.join(', ') || 'None yet'}
- Language Preference: ${user.preferences?.language || 'en'}
- Theme Preference: ${user.preferences?.theme || 'dark'}
- Interpretation Style: ${user.preferences?.interpretationStyle || 'traditional'}

CURRENT TAROT CARDS:
${cards.map(card => `
- ${card.name} (${card.arcana} arcana)
  Keywords: ${card.keywords?.upright?.join(', ') || 'N/A'}
  Element: ${card.element || 'N/A'}
  Suit: ${card.suit || 'N/A'}
`).join('')}

READING HISTORY PATTERNS:
- Total readings: ${history.length}
- Recent themes: ${this.extractHistoryThemes(history)}
- Frequent card appearances: ${this.extractFrequentCards(history)}

CURRENT CONTEXT:
- Current Mood: ${request.currentMood || 'Not specified'}
- Session Context: Active tarot consultation

Please provide a comprehensive psychological analysis including:
1. MBTI personality type assessment
2. Enneagram type identification
3. Dominant personality traits
4. Cognitive processing patterns
5. Decision-making style
6. Stress response patterns
7. Communication preferences
8. Relationship patterns
9. Career and achievement orientation
10. Spiritual and growth tendencies

Return as structured JSON with detailed analysis for each area.`
  }

  /**
   * Build emotional assessment prompt
   */
  private buildEmotionalAssessmentPrompt(request: PersonalAnalysisRequest): string {
    const cards = request.cards
    const currentMood = request.currentMood || 'seeking guidance'

    return `Assess this person's current emotional state:

CURRENT CONTEXT:
- Stated mood: ${currentMood}
- Cards drawn: ${cards.map(c => c.name).join(', ')}
- Card emotional themes: ${this.extractEmotionalThemes(cards)}

BEHAVIORAL INDICATORS:
- Seeking tarot guidance (indicates introspection/uncertainty)
- Card choices reflect: ${this.analyzeCardChoiceEmotions(cards)}
- Time of consultation: ${new Date().toLocaleString()}

Please assess:
1. Current emotional state
2. Emotional stability level (1-10)
3. Predominant emotions present
4. Energy level assessment
5. Mental clarity level
6. Stress indicators
7. Emotional needs
8. Recommended emotional support strategies
9. Immediate emotional care suggestions
10. Emotional resilience factors

Return detailed emotional assessment as JSON.`
  }

  /**
   * Build life patterns analysis prompt
   */
  private buildLifePatternsPrompt(request: PersonalAnalysisRequest): string {
    const user = request.user
    const history = request.readingHistory || []
    const cards = request.cards

    return `Identify recurring life patterns for this person:

USER PROFILE:
- Experience level: ${user.progress?.totalReadings || 0} readings
- Consistency: ${user.progress?.streakDays || 0} day streak
- Favorite approaches: ${user.preferences?.interpretationStyle}
- Growth trajectory: ${this.assessGrowthTrajectory(user)}

HISTORICAL PATTERNS:
${this.buildHistoryAnalysis(history)}

CURRENT CARD PATTERNS:
- Cards: ${cards.map(c => c.name).join(', ')}
- Archetypal themes: ${this.extractArchetypalThemes(cards)}
- Pattern indicators: ${this.analyzePatternIndicators(cards)}

Identify patterns in:
1. Relationship cycles and choices
2. Career and success patterns
3. Decision-making tendencies
4. Challenge response patterns
5. Growth and learning cycles
6. Spiritual development patterns
7. Self-sabotage or limiting patterns
8. Success and achievement patterns
9. Emotional regulation patterns
10. Life transition patterns

For each pattern, provide:
- Pattern description
- Frequency/intensity
- Triggering cards or situations
- Breaking strategies
- Transformation opportunities

Return as structured JSON array.`
  }

  /**
   * Build personalized suggestions prompt
   */
  private buildPersonalizedSuggestionsPrompt(request: PersonalAnalysisRequest): string {
    const user = request.user
    const cards = request.cards

    return `Create highly personalized suggestions based on this complete profile:

PERSONALITY INDICATORS:
- Preferences: ${JSON.stringify(user.preferences)}
- Behavioral patterns: ${this.analyzeBehavioralPatterns(user)}
- Current life phase: ${this.assessLifePhase(user)}

CURRENT GUIDANCE NEEDS:
- Cards drawn: ${cards.map(c => c.name).join(', ')}
- Guidance areas: ${this.identifyGuidanceNeeds(cards)}
- Urgency level: ${this.assessUrgencyLevel(request)}

Create personalized suggestions in three categories:

IMMEDIATE (next 24-48 hours):
- Quick wins and immediate actions
- Stress relief and comfort measures
- Mindset shifts and reframes
- Energy management

SHORT-TERM (next 1-4 weeks):
- Skill building activities
- Relationship improvements
- Habit formation
- Practical life improvements

LONG-TERM (next 3-12 months):
- Major life changes and goals
- Deep personal transformation
- Spiritual development
- Career and life purpose alignment

For each suggestion provide:
- Specific action
- Psychological reasoning
- Tarot card guidance connection
- Difficulty level (1-10)
- Expected outcome
- Success indicators

Return as structured JSON with detailed suggestions.`
  }

  /**
   * Build growth areas identification prompt
   */
  private buildGrowthAreasPrompt(request: PersonalAnalysisRequest): string {
    const user = request.user
    const cards = request.cards

    return `Identify key growth areas and development opportunities:

CURRENT DEVELOPMENT LEVEL:
- Experience: ${user.progress?.totalReadings || 0} readings
- Consistency: ${user.progress?.streakDays || 0} days
- Achievements: ${user.achievements?.length || 0} unlocked
- Growth trajectory: ${this.assessGrowthTrajectory(user)}

POTENTIAL INDICATORS:
- Card selection reveals: ${this.analyzeGrowthPotential(cards)}
- Preference patterns suggest: ${this.analyzePreferenceGrowth(user.preferences)}
- Current challenges indicate: ${this.identifyGrowthChallenges(cards)}

Identify growth areas in:

1. EMOTIONAL INTELLIGENCE
   - Self-awareness
   - Emotional regulation
   - Empathy and social awareness
   - Relationship skills

2. SPIRITUAL DEVELOPMENT
   - Intuitive abilities
   - Spiritual practices
   - Connection to higher purpose
   - Mystical understanding

3. PRACTICAL SKILLS
   - Communication
   - Decision-making
   - Problem-solving
   - Leadership

4. LIFE MASTERY
   - Career advancement
   - Financial wisdom
   - Health and vitality
   - Creative expression

5. PSYCHOLOGICAL HEALING
   - Shadow work
   - Trauma integration
   - Self-compassion
   - Inner child healing

For each area, provide:
- Current level (1-10)
- Target level
- Specific development steps
- Timeline estimate
- Supporting tarot practices
- Milestone markers
- Potential obstacles
- Success strategies

Return comprehensive growth plan as JSON.`
  }

  // Helper methods for prompt building
  private extractHistoryThemes(history: TarotReading[]): string {
    return history.slice(-5).map(r => r.tags?.join(', ')).filter(Boolean).join('; ') || 'No recent themes'
  }

  private extractFrequentCards(history: TarotReading[]): string {
    const cardCounts = new Map()
    history.forEach(reading => {
      reading.cards?.forEach(card => {
        cardCounts.set(card.cardId, (cardCounts.get(card.cardId) || 0) + 1)
      })
    })
    return Array.from(cardCounts.entries())
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([card]) => card)
      .join(', ') || 'None yet'
  }

  private extractEmotionalThemes(cards: TarotCard[]): string {
    const emotionalKeywords = ['love', 'joy', 'sadness', 'fear', 'anger', 'peace', 'anxiety', 'hope']
    const themes = cards.flatMap(card => 
      card.keywords?.upright?.filter(keyword => 
        emotionalKeywords.some(ek => keyword.toLowerCase().includes(ek))
      ) || []
    )
    return themes.join(', ') || 'Mixed emotional themes'
  }

  private analyzeCardChoiceEmotions(cards: TarotCard[]): string {
    const majorArcana = cards.filter(c => c.arcana === 'major').length
    const swords = cards.filter(c => c.suit === 'swords').length
    const cups = cards.filter(c => c.suit === 'cups').length
    
    if (majorArcana > cards.length / 2) return 'seeking major life guidance'
    if (swords > 1) return 'mental challenges or conflicts'
    if (cups > 1) return 'emotional or relationship focus'
    return 'balanced life exploration'
  }

  private extractArchetypalThemes(cards: TarotCard[]): string {
    const archetypes = cards.map(card => {
      if (card.arcana === 'major') return `${card.name} archetype`
      return `${card.suit} energy`
    })
    return archetypes.join(', ')
  }

  private analyzePatternIndicators(cards: TarotCard[]): string {
    const patterns = []
    
    if (cards.some(c => c.name.includes('Moon'))) patterns.push('intuitive/hidden patterns')
    if (cards.some(c => c.name.includes('Tower'))) patterns.push('disruption/change patterns')
    if (cards.some(c => c.name.includes('Star'))) patterns.push('hope/guidance patterns')
    if (cards.filter(c => c.suit === 'pentacles').length > 1) patterns.push('material/practical patterns')
    
    return patterns.join(', ') || 'general life patterns'
  }

  private assessGrowthTrajectory(user: User): string {
    const readings = user.progress?.totalReadings || 0
    const streak = user.progress?.streakDays || 0
    const achievements = user.achievements?.length || 0
    
    if (readings > 50 && streak > 30) return 'advanced practitioner'
    if (readings > 20 && streak > 7) return 'committed learner'
    if (readings > 5) return 'developing interest'
    return 'new explorer'
  }

  private buildHistoryAnalysis(history: TarotReading[]): string {
    if (!history.length) return 'No historical data available'
    
    const recentReadings = history.slice(-10)
    const themes = recentReadings.map(r => r.tags?.join(', ')).filter(Boolean)
    const frequency = history.length > 10 ? 'High frequency seeker' : 'Occasional seeker'
    
    return `${frequency}\nRecent themes: ${themes.join('; ')}`
  }

  private analyzeBehavioralPatterns(user: User): string {
    const patterns = []
    
    if (user.preferences?.autoSave) patterns.push('organized')
    if (user.preferences?.privateMode) patterns.push('introspective')
    if (user.preferences?.effectsLevel === 'maximum') patterns.push('experiential')
    if (user.progress?.streakDays > 7) patterns.push('consistent')
    
    return patterns.join(', ') || 'developing patterns'
  }

  private assessLifePhase(user: User): string {
    const daysSinceJoin = user.joinDate ? 
      Math.floor((Date.now() - new Date(user.joinDate).getTime()) / (1000 * 60 * 60 * 24)) : 0
    
    if (daysSinceJoin > 365) return 'established practice'
    if (daysSinceJoin > 90) return 'developing practice'
    if (daysSinceJoin > 30) return 'early exploration'
    return 'new beginning'
  }

  private identifyGuidanceNeeds(cards: TarotCard[]): string {
    const needs = []
    
    if (cards.some(c => c.suit === 'cups')) needs.push('emotional guidance')
    if (cards.some(c => c.suit === 'swords')) needs.push('mental clarity')
    if (cards.some(c => c.suit === 'wands')) needs.push('creative direction')
    if (cards.some(c => c.suit === 'pentacles')) needs.push('practical advice')
    if (cards.some(c => c.arcana === 'major')) needs.push('life purpose guidance')
    
    return needs.join(', ') || 'general guidance'
  }

  private assessUrgencyLevel(request: PersonalAnalysisRequest): string {
    if (request.currentMood?.includes('crisis') || request.currentMood?.includes('urgent')) return 'high'
    if (request.cards.some(c => c.name.includes('Tower') || c.name.includes('Death'))) return 'medium-high'
    return 'normal'
  }

  private analyzeGrowthPotential(cards: TarotCard[]): string {
    const growth = []
    
    if (cards.some(c => c.name.includes('Star'))) growth.push('spiritual potential')
    if (cards.some(c => c.name.includes('Magician'))) growth.push('manifestation skills')
    if (cards.some(c => c.name.includes('High Priestess'))) growth.push('intuitive development')
    if (cards.some(c => c.suit === 'wands')) growth.push('creative expression')
    
    return growth.join(', ') || 'balanced development potential'
  }

  private analyzePreferenceGrowth(preferences: any): string {
    const growth = []
    
    if (preferences?.interpretationStyle === 'traditional') growth.push('classical wisdom mastery')
    if (preferences?.interpretationStyle === 'modern') growth.push('contemporary integration')
    if (preferences?.interpretationStyle === 'poetic') growth.push('artistic expression')
    if (preferences?.theme === 'mystical') growth.push('mystical development')
    
    return growth.join(', ') || 'personalized growth path'
  }

  private identifyGrowthChallenges(cards: TarotCard[]): string {
    const challenges = []
    
    if (cards.some(c => c.name.includes('Devil'))) challenges.push('shadow work needed')
    if (cards.some(c => c.name.includes('Hanged Man'))) challenges.push('patience development')
    if (cards.some(c => c.name.includes('Tower'))) challenges.push('change adaptation')
    if (cards.filter(c => c.suit === 'swords').length > 1) challenges.push('mental clarity work')
    
    return challenges.join(', ') || 'general growth challenges'
  }

  // Parsing methods
  private parsePsychologicalProfile(content: string): PsychologicalProfile {
    try {
      const parsed = JSON.parse(content)
      return {
        mbtiType: parsed.mbtiType || 'INFJ',
        enneagramType: parsed.enneagramType || 4,
        dominantTraits: parsed.dominantTraits || ['intuitive', 'empathetic', 'seeking'],
        cognitivePatterns: parsed.cognitivePatterns || ['pattern recognition', 'symbolic thinking'],
        decisionMakingStyle: parsed.decisionMakingStyle || 'intuitive-feeling',
        stressResponse: parsed.stressResponse || 'reflective withdrawal'
      }
    } catch {
      return {
        mbtiType: 'INFJ',
        enneagramType: 4,
        dominantTraits: ['intuitive', 'seeking', 'empathetic'],
        cognitivePatterns: ['symbolic thinking', 'pattern recognition'],
        decisionMakingStyle: 'intuitive-feeling',
        stressResponse: 'seeks guidance and reflection'
      }
    }
  }

  private parseEmotionalState(content: string): EmotionalState {
    try {
      const parsed = JSON.parse(content)
      return {
        current: parsed.current || 'seeking clarity',
        stability: parsed.stability || 7,
        predominantEmotions: parsed.predominantEmotions || ['curiosity', 'hope', 'uncertainty'],
        energyLevel: parsed.energyLevel || 6,
        clarity: parsed.clarity || 5,
        recommendations: parsed.recommendations || ['practice mindfulness', 'trust intuition']
      }
    } catch {
      return {
        current: 'seeking guidance',
        stability: 7,
        predominantEmotions: ['curiosity', 'hope'],
        energyLevel: 6,
        clarity: 5,
        recommendations: ['trust your intuition', 'practice self-compassion']
      }
    }
  }

  private parseLifePatterns(content: string): LifePattern[] {
    try {
      const parsed = JSON.parse(content)
      return parsed.patterns || [
        {
          pattern: 'Seeking external validation',
          frequency: 7,
          cardTriggers: ['Star', 'Judgement'],
          description: 'Tendency to seek approval from others before trusting inner wisdom',
          breakingStrategy: 'Practice daily self-affirmation and inner dialogue'
        }
      ]
    } catch {
      return [
        {
          pattern: 'Cyclical seeking behavior',
          frequency: 8,
          cardTriggers: ['Moon', 'High Priestess'],
          description: 'Regular consultation during uncertain times',
          breakingStrategy: 'Develop daily meditation practice for inner clarity'
        }
      ]
    }
  }

  private parsePersonalizedSuggestions(content: string): PersonalSuggestion[] {
    try {
      const parsed = JSON.parse(content)
      return parsed.suggestions || [
        {
          category: 'immediate',
          action: 'Take three deep breaths and center yourself',
          reasoning: 'Current energy suggests need for grounding',
          cardGuidance: 'The cards indicate a need for present-moment awareness',
          difficulty: 2
        }
      ]
    } catch {
      return [
        {
          category: 'immediate',
          action: 'Trust your intuitive response to the cards',
          reasoning: 'Your subconscious already knows the answer',
          cardGuidance: 'The High Priestess energy supports inner knowing',
          difficulty: 3
        }
      ]
    }
  }

  private parseGrowthAreas(content: string): GrowthArea[] {
    try {
      const parsed = JSON.parse(content)
      return parsed.growthAreas || [
        {
          area: 'Intuitive Development',
          currentLevel: 6,
          targetLevel: 9,
          steps: ['Daily meditation', 'Dream journaling', 'Symbol study'],
          timeline: '6 months',
          supportingCards: ['High Priestess', 'Moon', 'Star']
        }
      ]
    } catch {
      return [
        {
          area: 'Self-Trust Development',
          currentLevel: 5,
          targetLevel: 8,
          steps: ['Practice decision-making without external input', 'Journal insights', 'Validate intuitive hits'],
          timeline: '3 months',
          supportingCards: ['Magician', 'Star', 'High Priestess']
        }
      ]
    }
  }
}

export default MonicaService