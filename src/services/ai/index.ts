// Frontend AI Service - Simplified for browser environment
import type { TarotReading } from '../../types/tarot'

interface ReadingRequest {
  cards: any[]
  question: string
  user: {
    id: string
    preferences?: any
  }
}

interface AISystem {
  initialize(): Promise<void>
  performReading(request: ReadingRequest): Promise<{ finalReading: TarotReading }>
  getSystemStatus(): { connected: boolean; ready: boolean }
}

class FrontendAISystem implements AISystem {
  private initialized = false
  private apiKey: string | null = null

  async initialize(): Promise<void> {
    console.log('🤖 Initializing Monica AI System (Frontend Mode)...')
    
    // Get API key from environment or localStorage
    this.apiKey = import.meta.env.MONICA_API_KEY || localStorage.getItem('monica-api-key')
    
    if (!this.apiKey) {
      console.warn('⚠️  Monica API key not found - using mock responses')
    }
    
    this.initialized = true
    console.log('✅ AI System initialized')
  }

  async performReading(request: ReadingRequest): Promise<{ finalReading: TarotReading }> {
    if (!this.initialized) {
      await this.initialize()
    }

    console.log('🔮 Performing tarot reading...')
    
    // For development/demo mode, return mock reading
    if (import.meta.env.DEVELOPMENT_MODE === 'true' || import.meta.env.MOCK_AI_RESPONSES === 'true') {
      return this.generateMockReading(request)
    }

    // In production, this would make API calls to Monica
    try {
      // This would be the actual Monica API call
      return await this.callMonicaAPI(request)
    } catch (error) {
      console.error('AI API Error:', error)
      // Fallback to mock reading
      return this.generateMockReading(request)
    }
  }

  getSystemStatus() {
    return {
      connected: this.initialized && !!this.apiKey,
      ready: this.initialized
    }
  }

  private async callMonicaAPI(request: ReadingRequest): Promise<{ finalReading: TarotReading }> {
    if (!this.apiKey) {
      throw new Error('No API key available')
    }

    const response = await fetch('https://openapi.monica.im/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        messages: [
          {
            role: 'system',
            content: `You are a mystical tarot reader for Night God Tarot. Provide deep, insightful readings that combine traditional tarot wisdom with modern psychological understanding. Always be supportive, empowering, and spiritually guided.`
          },
          {
            role: 'user',
            content: this.buildReadingPrompt(request)
          }
        ],
        max_tokens: 1500,
        temperature: 0.8
      })
    })

    if (!response.ok) {
      throw new Error(`Monica API Error: ${response.status}`)
    }

    const data = await response.json()
    const aiResponse = data.choices[0].message.content

    return {
      finalReading: this.parseAIResponse(aiResponse, request)
    }
  }

  private buildReadingPrompt(request: ReadingRequest): string {
    const cardNames = request.cards.map(card => card.name).join(', ')
    
    return `
Perform a mystical tarot reading for the following:

Cards drawn: ${cardNames}
Question: ${request.question}
Spread: Three-card reading (Past/Foundation, Present/Challenge, Future/Outcome)

Please provide:
1. A meaningful title for this reading
2. Collective wisdom insights
3. Personal analysis for the seeker
4. Integration of the card meanings
5. Poetic expression of the guidance
6. A comprehensive final message

Focus on empowerment, growth, and spiritual guidance. Be mystical but practical.
    `.trim()
  }

  private parseAIResponse(response: string, request: ReadingRequest): TarotReading {
    // In a real implementation, this would parse the structured AI response
    // For now, create a structured reading from the response
    
    const cardNames = request.cards.map(c => c.name).join(', ')
    
    return {
      id: `reading-${Date.now()}`,
      title: '✨ Divine Guidance Revealed',
      mainText: response,
      cards: request.cards,
      timestamp: new Date(),
      confidence: 0.95,
      tags: ['divine guidance', 'spiritual wisdom', 'personal growth'],
      collectiveWisdom: 'The universe speaks through these sacred cards, revealing cosmic patterns and divine timing.',
      personalAnalysis: 'Your unique energy signature shows readiness for transformation and spiritual growth.',
      wisdomIntegration: 'By integrating ancient wisdom with modern insights, you unlock powerful pathways to your highest potential.',
      poeticSublimation: 'Like stars that dance in the cosmic void, your soul\'s journey unfolds with purpose and divine grace.'
    }
  }

  private generateMockReading(request: ReadingRequest): Promise<{ finalReading: TarotReading }> {
    const cardNames = request.cards.map(card => card.name).join(', ')
    
    const mockReading: TarotReading = {
      id: `reading-${Date.now()}`,
      title: '✨ Divine Guidance Revealed',
      mainText: `
        <p>The cosmic forces have aligned to bring you this sacred message through the cards: <strong>${cardNames}</strong>.</p>
        
        <p>Your question about "<em>${request.question}</em>" has been heard by the universe, and the divine response flows through these ancient symbols of wisdom.</p>
        
        <p>The path ahead requires courage, wisdom, and trust in your inner knowing. Each card speaks to a different aspect of your journey:</p>
        
        <ul>
          <li><strong>Past/Foundation:</strong> The foundations you've built serve you well, providing stability for growth</li>
          <li><strong>Present/Challenge:</strong> Current circumstances offer profound opportunities for personal evolution</li>
          <li><strong>Future/Outcome:</strong> Success and fulfillment await those who trust in divine timing and inner wisdom</li>
        </ul>
        
        <p>Trust in the process, embrace the transformation, and step boldly into your destined future. The divine light within you illuminates the path ahead.</p>
      `,
      cards: request.cards,
      timestamp: new Date(),
      confidence: 0.95,
      tags: ['guidance', 'transformation', 'destiny', 'spiritual growth'],
      collectiveWisdom: 'The collective consciousness speaks through these cards, revealing patterns that connect your personal journey to the greater cosmic flow. Ancient wisdom traditions whisper guidance for navigating modern challenges.',
      personalAnalysis: 'Your personal energy signature resonates with themes of growth, resilience, and authentic self-expression. The cards reflect your inner strength and readiness to embrace positive change in your life.',
      wisdomIntegration: 'By integrating the lessons from your past experiences with present moment awareness, you create a powerful foundation for manifesting your highest potential and deepest aspirations.',
      poeticSublimation: 'Like moonbeams dancing upon still waters, your soul\'s light emerges most brilliantly through life\'s sacred challenges, illuminating pathways previously hidden from view.'
    }

    return Promise.resolve({ finalReading: mockReading })
  }
}

// Export singleton instance
export const aiSystem = new FrontendAISystem()