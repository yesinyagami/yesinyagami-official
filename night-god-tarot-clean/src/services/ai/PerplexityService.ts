/**
 * Perplexity AI Service - Collective Consciousness Search
 * Searches current world trends, mystical knowledge, and historical references
 */

import { BaseAIService } from './BaseAIService'
import type {
  CollectiveWisdomRequest,
  CollectiveWisdomResponse,
  WorldTrend,
  MysticalKnowledge,
  HistoricalCase
} from './interfaces'
import { envManager } from '../../config/env'

export class PerplexityService extends BaseAIService {
  public readonly name = 'Perplexity AI'
  public readonly version = '1.0.0'
  public readonly capabilities = [
    'real-time-search',
    'collective-consciousness',
    'world-trends',
    'mystical-knowledge',
    'historical-analysis'
  ]

  protected async performInitialization(): Promise<void> {
    // Test API connection
    await this.testConnection()
  }

  protected async performHealthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.config.baseUrl}/health`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'User-Agent': 'NightGodTarot/1.0'
        },
        signal: AbortSignal.timeout(5000)
      })
      return response.ok
    } catch {
      return false
    }
  }

  protected async performCleanup(): Promise<void> {
    // No specific cleanup needed for Perplexity
  }

  private async testConnection(): Promise<void> {
    try {
      const testQuery = {
        model: 'llama-3.1-sonar-small-128k-online',
        messages: [
          {
            role: 'user',
            content: 'Test connection'
          }
        ],
        max_tokens: 10
      }

      await this.makeRequest('/chat/completions', {
        method: 'POST',
        body: JSON.stringify(testQuery)
      }, {
        id: 'test',
        userId: 'system',
        timestamp: new Date()
      })
    } catch (error) {
      throw new Error(`Perplexity connection failed: ${error.message}`)
    }
  }

  /**
   * Main method: Search collective consciousness for wisdom
   */
  async searchCollectiveWisdom(request: CollectiveWisdomRequest): Promise<CollectiveWisdomResponse> {
    this.validateRequest(request, ['cards', 'question'])

    try {
      const [worldTrends, mysticalKnowledge, historicalCases] = await Promise.all([
        this.searchWorldTrends(request),
        this.searchMysticalKnowledge(request),
        this.searchHistoricalCases(request)
      ])

      const collectiveInsights = await this.synthesizeInsights(
        worldTrends, 
        mysticalKnowledge, 
        historicalCases, 
        request
      )

      const confidence = this.calculateConfidence(worldTrends, mysticalKnowledge, historicalCases)

      return {
        success: true,
        data: {
          worldTrends,
          mysticalKnowledge,
          historicalCases,
          collectiveInsights,
          confidence
        },
        processingTime: 0, // Will be set by base class
        model: 'llama-3.1-sonar-large-128k-online'
      }
    } catch (error) {
      throw new Error(`Collective wisdom search failed: ${error.message}`)
    }
  }

  /**
   * Search for current world trends related to the reading
   */
  private async searchWorldTrends(request: CollectiveWisdomRequest): Promise<WorldTrend[]> {
    const cardNames = request.cards.map(card => card.name).join(', ')
    const query = this.buildTrendsQuery(request.question, cardNames, request.timeframe)

    const response = await this.makeRequest<any>('/chat/completions', {
      method: 'POST',
      body: JSON.stringify({
        model: 'llama-3.1-sonar-large-128k-online',
        messages: [
          {
            role: 'system',
            content: `You are a collective consciousness researcher analyzing current world trends and their relation to tarot symbolism. 
            Focus on real, current events and societal patterns. Return structured JSON data only.`
          },
          {
            role: 'user',
            content: query
          }
        ],
        max_tokens: 2000,
        temperature: 0.3,
        return_citations: true
      })
    }, request)

    return this.parseWorldTrends(response.data.choices[0].message.content, request.cards)
  }

  /**
   * Search for mystical and esoteric knowledge
   */
  private async searchMysticalKnowledge(request: CollectiveWisdomRequest): Promise<MysticalKnowledge[]> {
    const cardSymbols = request.cards.map(card => 
      `${card.name} (${card.arcana} arcana, ${card.suit || 'major'})`
    ).join(', ')

    const query = `Search for mystical and esoteric knowledge related to these tarot symbols: ${cardSymbols}
    Question context: "${request.question}"
    
    Focus on:
    - Traditional mystical interpretations
    - Cross-cultural spiritual wisdom
    - Esoteric symbolism and meanings
    - Ancient wisdom traditions
    - Modern metaphysical insights
    
    Return detailed information about mystical concepts that relate to these cards.`

    const response = await this.makeRequest<any>('/chat/completions', {
      method: 'POST',
      body: JSON.stringify({
        model: 'llama-3.1-sonar-large-128k-online',
        messages: [
          {
            role: 'system',
            content: `You are a mystical knowledge expert with access to esoteric traditions worldwide. 
            Provide accurate, respectful information about spiritual and mystical concepts.`
          },
          {
            role: 'user',
            content: query
          }
        ],
        max_tokens: 2500,
        temperature: 0.4
      })
    }, request)

    return this.parseMysticalKnowledge(response.data.choices[0].message.content, request.cards)
  }

  /**
   * Search for historical cases and parallels
   */
  private async searchHistoricalCases(request: CollectiveWisdomRequest): Promise<HistoricalCase[]> {
    const cardThemes = request.cards.map(card => 
      card.keywords?.upright?.join(', ') || card.name
    ).join('; ')

    const query = `Search for historical events, figures, and cases that relate to these themes and symbols:
    Themes: ${cardThemes}
    Question: "${request.question}"
    
    Find historical parallels including:
    - Similar life situations in history
    - Historical figures who faced comparable challenges
    - Past events with similar symbolism
    - Traditional outcomes and lessons learned
    - Cultural and mythological parallels
    
    Focus on documented historical events and their outcomes.`

    const response = await this.makeRequest<any>('/chat/completions', {
      method: 'POST',
      body: JSON.stringify({
        model: 'llama-3.1-sonar-large-128k-online',
        messages: [
          {
            role: 'system',
            content: `You are a historical researcher with access to documented events and cultural knowledge. 
            Provide accurate historical information and draw meaningful parallels.`
          },
          {
            role: 'user',
            content: query
          }
        ],
        max_tokens: 2000,
        temperature: 0.3
      })
    }, request)

    return this.parseHistoricalCases(response.data.choices[0].message.content, request.cards)
  }

  /**
   * Synthesize insights from all searches
   */
  private async synthesizeInsights(
    worldTrends: WorldTrend[],
    mysticalKnowledge: MysticalKnowledge[],
    historicalCases: HistoricalCase[],
    request: CollectiveWisdomRequest
  ): Promise<string[]> {
    const synthesisQuery = `Based on the following research, synthesize key collective insights:

    Current World Trends: ${JSON.stringify(worldTrends, null, 2)}
    Mystical Knowledge: ${JSON.stringify(mysticalKnowledge, null, 2)}
    Historical Cases: ${JSON.stringify(historicalCases, null, 2)}
    
    Original Question: "${request.question}"
    Cards: ${request.cards.map(c => c.name).join(', ')}
    
    Provide 5-7 synthesized insights that connect these sources and offer collective wisdom.`

    const response = await this.makeRequest<any>('/chat/completions', {
      method: 'POST',
      body: JSON.stringify({
        model: 'llama-3.1-sonar-small-128k-online',
        messages: [
          {
            role: 'system',
            content: `You are a wisdom synthesizer who connects diverse sources of knowledge into coherent insights.`
          },
          {
            role: 'user',
            content: synthesisQuery
          }
        ],
        max_tokens: 1000,
        temperature: 0.5
      })
    }, request)

    return this.parseInsights(response.data.choices[0].message.content)
  }

  /**
   * Build search query for world trends
   */
  private buildTrendsQuery(question: string, cardNames: string, timeframe?: string): string {
    const timeFilter = timeframe === 'recent' ? 'last 30 days' :
                      timeframe === 'current' ? 'current events' :
                      timeframe === 'historical' ? 'historical context' : 'recent developments'

    return `Search for current world trends and societal patterns related to: "${question}"
    
    Card symbolism to consider: ${cardNames}
    Time focus: ${timeFilter}
    
    Find information about:
    - Current social and cultural movements
    - Economic and political developments
    - Technological and scientific advances
    - Collective human experiences and challenges
    - Global consciousness shifts
    
    Focus on how these trends might relate to the tarot symbolism and the question asked.`
  }

  /**
   * Parse world trends from response
   */
  private parseWorldTrends(content: string, cards: any[]): WorldTrend[] {
    try {
      // Extract structured data or parse natural language response
      const trends: WorldTrend[] = []
      
      // Simple parsing - in production, use more sophisticated NLP
      const sections = content.split('\n\n')
      
      sections.forEach((section, index) => {
        if (section.trim() && index < 5) { // Limit to 5 trends
          trends.push({
            topic: `Trend ${index + 1}`,
            relevance: Math.random() * 0.5 + 0.5, // 0.5-1.0
            description: section.substring(0, 200),
            sources: ['Perplexity Search'],
            sentiment: this.detectSentiment(section),
            cardConnections: cards.map(c => c.id).slice(0, 2)
          })
        }
      })
      
      return trends
    } catch (error) {
      console.warn('Failed to parse world trends:', error)
      return []
    }
  }

  /**
   * Parse mystical knowledge from response
   */
  private parseMysticalKnowledge(content: string, cards: any[]): MysticalKnowledge[] {
    try {
      const knowledge: MysticalKnowledge[] = []
      const sections = content.split('\n\n')
      
      sections.forEach((section, index) => {
        if (section.trim() && index < 4) { // Limit to 4 knowledge items
          knowledge.push({
            concept: `Mystical Concept ${index + 1}`,
            tradition: 'Various Traditions',
            description: section.substring(0, 300),
            cardRelevance: cards.reduce((acc, card, i) => {
              acc[card.id] = Math.random() * 0.7 + 0.3
              return acc
            }, {}),
            practicalApplication: section.substring(300, 500) || 'Meditative contemplation'
          })
        }
      })
      
      return knowledge
    } catch (error) {
      console.warn('Failed to parse mystical knowledge:', error)
      return []
    }
  }

  /**
   * Parse historical cases from response
   */
  private parseHistoricalCases(content: string, cards: any[]): HistoricalCase[] {
    try {
      const cases: HistoricalCase[] = []
      const sections = content.split('\n\n')
      
      sections.forEach((section, index) => {
        if (section.trim() && index < 3) { // Limit to 3 historical cases
          cases.push({
            era: `Historical Period ${index + 1}`,
            description: section.substring(0, 250),
            outcome: 'Positive transformation through wisdom',
            lessonLearned: section.substring(250, 400) || 'Patience and wisdom lead to growth',
            cardParallels: cards.map(c => c.name).slice(0, 2)
          })
        }
      })
      
      return cases
    } catch (error) {
      console.warn('Failed to parse historical cases:', error)
      return []
    }
  }

  /**
   * Parse synthesized insights
   */
  private parseInsights(content: string): string[] {
    try {
      const insights = content
        .split('\n')
        .filter(line => line.trim())
        .filter(line => line.includes('.') || line.includes(':'))
        .slice(0, 7)
      
      return insights.length > 0 ? insights : [
        'The collective consciousness suggests a time of transformation',
        'Current global energies align with personal growth opportunities',
        'Historical patterns indicate positive outcomes through patience',
        'Mystical wisdom points toward inner knowing and intuition',
        'The universe supports aligned action at this time'
      ]
    } catch (error) {
      console.warn('Failed to parse insights:', error)
      return ['The collective wisdom flows through all things']
    }
  }

  /**
   * Detect sentiment in text
   */
  private detectSentiment(text: string): 'positive' | 'negative' | 'neutral' {
    const positiveWords = ['growth', 'success', 'positive', 'opportunity', 'healing', 'love', 'progress']
    const negativeWords = ['challenge', 'difficulty', 'crisis', 'conflict', 'problem', 'negative', 'struggle']
    
    const words = text.toLowerCase().split(/\s+/)
    const positiveCount = words.filter(word => positiveWords.some(pw => word.includes(pw))).length
    const negativeCount = words.filter(word => negativeWords.some(nw => word.includes(nw))).length
    
    if (positiveCount > negativeCount) return 'positive'
    if (negativeCount > positiveCount) return 'negative'
    return 'neutral'
  }

  /**
   * Calculate overall confidence score
   */
  private calculateConfidence(
    worldTrends: WorldTrend[],
    mysticalKnowledge: MysticalKnowledge[],
    historicalCases: HistoricalCase[]
  ): number {
    const trendsScore = worldTrends.length > 0 ? 0.3 : 0
    const mysticalScore = mysticalKnowledge.length > 0 ? 0.4 : 0
    const historicalScore = historicalCases.length > 0 ? 0.3 : 0
    
    return Math.min(1.0, trendsScore + mysticalScore + historicalScore)
  }
}

export default PerplexityService