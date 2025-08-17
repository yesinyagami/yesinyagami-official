/**
 * ChatGPT Service - Poetic Sublimation
 * Transforms wisdom insights into beautiful, shareable poetic expressions
 */

import { BaseAIService } from './BaseAIService'
import type {
  PoeticSublimationRequest,
  PoeticSublimationResponse,
  PoeticReading,
  PoeticSection,
  VisualElement,
  ShareableContent,
  AudioSuggestion,
  UserPreferences
} from './interfaces'
import { envManager } from '../../config/env'

export class ChatGPTService extends BaseAIService {
  public readonly name = 'OpenAI ChatGPT'
  public readonly version = '1.0.0'
  public readonly capabilities = [
    'poetic-sublimation',
    'artistic-expression',
    'literary-styling',
    'visual-design',
    'shareable-content',
    'audio-direction',
    'cultural-adaptation',
    'emotional-resonance'
  ]

  protected async performInitialization(): Promise<void> {
    await this.testConnection()
    await this.loadPoetryModels()
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
    // Clean up poetry models cache
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
      throw new Error(`ChatGPT connection failed: ${error.message}`)
    }
  }

  private async loadPoetryModels(): Promise<void> {
    // Initialize poetic sublimation models
    if (envManager.getConfig().debug) {
      console.log('🎨 Loaded poetic sublimation models')
    }
  }

  /**
   * Main method: Transform wisdom into poetic reading
   */
  async createPoeticReading(request: PoeticSublimationRequest): Promise<PoeticSublimationResponse> {
    this.validateRequest(request, ['integratedWisdom', 'userPreferences'])

    try {
      // Parallel poetic processing
      const [
        poeticReading,
        visualElements,
        shareableContent,
        audioSuggestions
      ] = await Promise.all([
        this.generatePoeticReading(request),
        this.createVisualElements(request),
        this.createShareableContent(request),
        this.generateAudioSuggestions(request)
      ])

      return {
        success: true,
        data: {
          poeticReading,
          visualElements,
          shareableContent,
          audioSuggestions
        },
        processingTime: 0,
        model: 'gpt-4o'
      }
    } catch (error) {
      throw new Error(`Poetic sublimation failed: ${error.message}`)
    }
  }

  /**
   * Generate the main poetic reading
   */
  private async generatePoeticReading(request: PoeticSublimationRequest): Promise<PoeticReading> {
    const poeticPrompt = this.buildPoeticPrompt(request)

    const response = await this.makeRequest<any>('/chat/completions', {
      method: 'POST',
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `You are the Divine Poet, a master of transforming spiritual wisdom into beautiful, 
            moving poetry and prose. You have the gift of taking complex insights and making them accessible 
            through the power of artistic expression and metaphor.

            Your writing style adapts to the user's preferences but always includes:
            - Deep emotional resonance
            - Beautiful imagery and metaphor
            - Practical wisdom woven into poetic language
            - Sacred and mystical elements
            - Personal connection and relevance
            - Hope and inspiration
            - Actionable insights presented artistically

            You create content that people want to save, share, and return to for inspiration.
            Your words heal, inspire, and guide while being genuinely beautiful to read.`
          },
          {
            role: 'user',
            content: poeticPrompt
          }
        ],
        max_tokens: 3500,
        temperature: 0.8,
        response_format: { type: 'json_object' }
      })
    }, request)

    return this.parsePoeticReading(response.data.choices[0].message.content, request.userPreferences)
  }

  /**
   * Create visual design elements
   */
  private async createVisualElements(request: PoeticSublimationRequest): Promise<VisualElement[]> {
    const visualPrompt = this.buildVisualPrompt(request)

    const response = await this.makeRequest<any>('/chat/completions', {
      method: 'POST',
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `You are the Visual Oracle, expert at translating spiritual insights into visual design 
            concepts. You understand color psychology, sacred geometry, and how visual elements can enhance 
            the emotional and spiritual impact of content.

            Create visual elements that:
            - Support and enhance the poetic message
            - Use color psychology for emotional impact
            - Incorporate sacred symbols and geometry when appropriate
            - Are practical for digital sharing and display
            - Align with the user's aesthetic preferences
            - Create atmosphere and mood

            Consider both modern design trends and timeless mystical aesthetics.`
          },
          {
            role: 'user',
            content: visualPrompt
          }
        ],
        max_tokens: 2000,
        temperature: 0.7,
        response_format: { type: 'json_object' }
      })
    }, request)

    return this.parseVisualElements(response.data.choices[0].message.content)
  }

  /**
   * Create shareable content versions
   */
  private async createShareableContent(request: PoeticSublimationRequest): Promise<ShareableContent> {
    const shareablePrompt = this.buildShareablePrompt(request)

    const response = await this.makeRequest<any>('/chat/completions', {
      method: 'POST',
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `You are the Social Media Sage, expert at adapting profound spiritual content for 
            different sharing platforms while maintaining its depth and beauty.

            Create versions optimized for:
            - Quick social media sharing (Instagram, Twitter, TikTok)
            - Longer form sharing (Facebook, LinkedIn)
            - Personal reflection and saving
            - Different audience types (spiritual seekers, general public, personal growth)

            Maintain the essence while adapting length, tone, and format for maximum impact and shareability.
            Include relevant hashtags and visual prompts for each format.`
          },
          {
            role: 'user',
            content: shareablePrompt
          }
        ],
        max_tokens: 2500,
        temperature: 0.6,
        response_format: { type: 'json_object' }
      })
    }, request)

    return this.parseShareableContent(response.data.choices[0].message.content)
  }

  /**
   * Generate audio suggestions
   */
  private async generateAudioSuggestions(request: PoeticSublimationRequest): Promise<AudioSuggestion[]> {
    const audioPrompt = this.buildAudioPrompt(request)

    const response = await this.makeRequest<any>('/chat/completions', {
      method: 'POST',
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `You are the Audio Alchemist, expert at translating written content into audio experiences 
            that enhance the emotional and spiritual impact.

            Consider:
            - Voice characteristics that match the content's energy
            - Pacing and rhythm for maximum impact
            - Background music and soundscapes
            - Sound effects that enhance without overwhelming
            - Different moods and intentions (meditation, inspiration, empowerment)

            Your suggestions should create an immersive audio experience that deepens the connection to the wisdom.`
          },
          {
            role: 'user',
            content: audioPrompt
          }
        ],
        max_tokens: 1500,
        temperature: 0.7,
        response_format: { type: 'json_object' }
      })
    }, request)

    return this.parseAudioSuggestions(response.data.choices[0].message.content)
  }

  /**
   * Build comprehensive poetic prompt
   */
  private buildPoeticPrompt(request: PoeticSublimationRequest): string {
    const wisdom = request.integratedWisdom
    const prefs = request.userPreferences

    return `POETIC TRANSFORMATION MISSION: Transform profound wisdom into beautiful, accessible poetry.

INTEGRATED WISDOM TO TRANSFORM:
Integrated Insights: ${JSON.stringify(wisdom.integratedInsights, null, 2)}
Story Connections: ${JSON.stringify(wisdom.storyConnections, null, 2)}
Holistic Guidance: ${JSON.stringify(wisdom.holisticGuidance, null, 2)}
Action Plan: ${JSON.stringify(wisdom.actionPlan, null, 2)}
Spiritual Synthesis: ${JSON.stringify(wisdom.spiritualSynthesis, null, 2)}

USER PREFERENCES:
Literary Style: ${prefs.literaryStyle}
Length: ${prefs.length}
Tone: ${prefs.tone}
Include Imagery: ${prefs.includeImagery}
Include Symbols: ${prefs.includeSymbols}
Shareable Format: ${prefs.shareableFormat}

STYLE REQUIREMENTS:
${this.getStyleGuidance(prefs.literaryStyle)}

Create a complete poetic reading with:

1. TITLE - Capturing the essence beautifully
2. SUBTITLE - Supporting theme (optional)
3. MAIN TEXT - The core poetic expression of the wisdom
4. SECTIONS - Break into meaningful poetic sections
5. CLOSING WISDOM - A profound concluding thought
6. PERSONAL AFFIRMATION - Something the person can claim as their truth

SECTION STRUCTURE for each section:
- Title of the section
- Poetic content
- Card focus (which cards inspire this section)
- Imagery descriptions
- Symbolic elements woven in

LENGTH GUIDELINES:
- Concise: 150-300 words total
- Medium: 300-600 words total  
- Detailed: 600-1000 words total
- Extensive: 1000+ words total

Return as structured JSON with all required fields.`
  }

  /**
   * Build visual elements prompt
   */
  private buildVisualPrompt(request: PoeticSublimationRequest): string {
    const prefs = request.userPreferences
    const insights = request.integratedWisdom.integratedInsights

    return `VISUAL DESIGN MISSION: Create visual elements that enhance the poetic reading.

CONTENT TO VISUALIZE:
Key Insights: ${insights.map(i => i.insight).join('; ')}
Overall Theme: ${request.integratedWisdom.holisticGuidance.overallTheme}
Core Message: ${request.integratedWisdom.holisticGuidance.coreMessage}

USER STYLE PREFERENCES:
Include Imagery: ${prefs.includeImagery}
Include Symbols: ${prefs.includeSymbols}
Tone: ${prefs.tone}
Literary Style: ${prefs.literaryStyle}

Create visual elements for:

1. BACKGROUND - Overall aesthetic and mood setting
2. OVERLAY - Decorative elements and patterns
3. ACCENT - Highlighting important sections
4. TYPOGRAPHY - Font styles and text presentation

For each element specify:
- Type (background/overlay/accent/typography)
- Description of the visual concept
- Color palette with specific colors
- Style direction (minimalist/ornate/mystical/modern)
- Card inspiration sources
- Emotional intention
- Practical implementation notes

Consider sacred geometry, nature elements, celestial themes, and tarot symbolism.
Return as structured JSON array.`
  }

  /**
   * Build shareable content prompt
   */
  private buildShareablePrompt(request: PoeticSublimationRequest): string {
    const holisticGuidance = request.integratedWisdom.holisticGuidance

    return `SHAREABLE CONTENT MISSION: Adapt the poetic wisdom for various sharing contexts.

CORE WISDOM TO ADAPT:
Overall Theme: "${holisticGuidance.overallTheme}"
Core Message: "${holisticGuidance.coreMessage}"
Essential Truth: "${request.integratedWisdom.spiritualSynthesis.essentialTruth}"

KEY INSIGHTS:
${request.integratedWisdom.integratedInsights.map(i => `- ${i.insight}`).join('\n')}

Create three versions:

1. SHORT FORM (50-150 characters) - Twitter/Instagram story perfect
   - Punchy, memorable
   - Hashtag ready
   - Emotionally impactful
   - Share-worthy wisdom quote

2. MEDIUM FORM (150-500 characters) - Instagram post/Facebook ideal
   - More context and depth
   - Story-like flow
   - Inspirational tone
   - Call to reflection or action

3. FULL FORM (500+ characters) - Blog/LinkedIn/deep sharing
   - Complete wisdom transmission
   - Rich context and meaning
   - Personal connection points
   - Actionable insights included

For each version include:
- Optimized hashtags for spiritual/personal growth communities
- Visual prompts for image creation
- Platform-specific optimization notes
- Audience engagement suggestions

Also create audio narration script for the full form.
Return as structured JSON object.`
  }

  /**
   * Build audio suggestions prompt
   */
  private buildAudioPrompt(request: PoeticSublimationRequest): string {
    const tone = request.userPreferences.tone
    const coreMessage = request.integratedWisdom.holisticGuidance.coreMessage

    return `AUDIO EXPERIENCE MISSION: Design audio elements that enhance the poetic wisdom.

CONTENT TO ENHANCE:
Core Message: "${coreMessage}"
Tone Preference: ${tone}
Literary Style: ${request.userPreferences.literaryStyle}

Spiritual Essence: "${request.integratedWisdom.spiritualSynthesis.essentialTruth}"

Create audio suggestions for different purposes:

1. MEDITATION VERSION - For contemplative listening
   - Voice characteristics (gender, age, accent, tone quality)
   - Pace and rhythm (slow, measured, flowing)
   - Emotional qualities (gentle, profound, nurturing)
   - Background soundscape suggestions
   - Pause and silence recommendations

2. INSPIRATION VERSION - For motivation and empowerment  
   - Voice characteristics for inspiration
   - Dynamic pacing and energy
   - Emotional resonance
   - Uplifting background music
   - Emphasis and delivery notes

3. STORY VERSION - For narrative engagement
   - Storytelling voice qualities
   - Character and drama elements
   - Musical themes and motifs
   - Sound effects for atmosphere
   - Cinematic audio experience

For each version specify:
- Voice profile details
- Pace and rhythm guidance
- Emotional qualities to convey
- Background music style
- Sound effects and atmosphere
- Technical production notes

Return as structured JSON array with detailed audio direction.`
  }

  /**
   * Get style guidance based on literary preference
   */
  private getStyleGuidance(style: string): string {
    const guidance = {
      classical: `Use timeless, elegant language with sophisticated metaphors. 
                 Reference classical literature, mythology, and eternal wisdom traditions. 
                 Employ formal poetic structures while remaining accessible.`,
      
      modern: `Use contemporary language and relatable metaphors from modern life. 
              Include current cultural references while maintaining spiritual depth. 
              Focus on practical wisdom with artistic expression.`,
      
      mystical: `Emphasize mystery, wonder, and transcendent experiences. 
                Use rich symbolic language and archetypal imagery. 
                Create atmosphere of sacred mystery and divine connection.`,
      
      practical: `Ground spiritual insights in everyday application. 
                 Use clear, actionable language with beautiful expression. 
                 Focus on implementable wisdom with artistic beauty.`,
      
      poetic: `Prioritize artistic beauty, rhythm, and metaphor. 
              Use rich imagery, symbolism, and flowing language. 
              Create verses that sing with meaning and beauty.`
    }
    
    return guidance[style] || guidance.mystical
  }

  // Parsing methods
  private parsePoeticReading(content: string, preferences: UserPreferences): PoeticReading {
    try {
      const parsed = JSON.parse(content)
      return {
        title: parsed.title || 'A Message from the Stars',
        subtitle: parsed.subtitle,
        mainText: parsed.mainText || this.createFallbackPoetry(preferences),
        sections: parsed.sections || this.createFallbackSections(),
        closingWisdom: parsed.closingWisdom || 'Trust the journey, for it leads you home to yourself.',
        personalAffirmation: parsed.personalAffirmation || 'I trust my inner wisdom and walk my path with courage.'
      }
    } catch {
      return this.createFallbackReading(preferences)
    }
  }

  private parseVisualElements(content: string): VisualElement[] {
    try {
      const parsed = JSON.parse(content)
      return parsed.elements || [
        {
          type: 'background',
          description: 'Deep midnight blue with subtle star field',
          colors: ['#1a1a2e', '#16213e', '#0f4c75'],
          style: 'mystical cosmic',
          cardInspiration: ['Star', 'Moon', 'High Priestess']
        }
      ]
    } catch {
      return [
        {
          type: 'background',
          description: 'Gentle gradient from deep purple to gold',
          colors: ['#4a148c', '#6a1b9a', '#ab47bc', '#ffd700'],
          style: 'spiritual elegant',
          cardInspiration: ['Star', 'Sun', 'Temperance']
        },
        {
          type: 'accent',
          description: 'Delicate silver constellation patterns',
          colors: ['#e8eaf6', '#c5cae9', '#9fa8da'],
          style: 'mystical minimal',
          cardInspiration: ['Star', 'High Priestess']
        }
      ]
    }
  }

  private parseShareableContent(content: string): ShareableContent {
    try {
      const parsed = JSON.parse(content)
      return {
        shortForm: parsed.shortForm || 'Trust your inner wisdom. The stars have aligned for your awakening. ✨ #TarotWisdom #InnerGuidance',
        mediumForm: parsed.mediumForm || 'The cards have spoken, and their message is clear: you have all the wisdom you need within you. Trust your intuition, take aligned action, and watch your world transform. Your journey of awakening has begun. 🌟 #SpiritualGrowth #TarotGuidance #InnerWisdom',
        fullForm: parsed.fullForm || this.createFallbackFullForm(),
        hashtags: parsed.hashtags || ['#TarotWisdom', '#SpiritualGuidance', '#InnerWisdom', '#PersonalGrowth', '#Awakening'],
        visualPrompts: parsed.visualPrompts || ['Starry night sky', 'Open hands receiving light', 'Path through mystical forest'],
        audioNarration: parsed.audioNarration
      }
    } catch {
      return {
        shortForm: 'Your soul knows the way. Trust the journey. ✨',
        mediumForm: 'The universe has conspired to bring you exactly the guidance you need. Your inner wisdom is awakening, and your path is illuminated with divine light. Trust the process and take the next step.',
        fullForm: 'This reading is a mirror for your soul, reflecting back the wisdom you already carry within. The cards have woven together a message of hope, growth, and transformation. Trust your intuition, embrace your unique gifts, and step boldly into your authentic power.',
        hashtags: ['#TarotWisdom', '#SpiritualJourney', '#InnerGuidance', '#Awakening'],
        visualPrompts: ['Hands holding light', 'Mystical pathway', 'Celestial symbols'],
        audioNarration: 'Listen with your heart as these words of wisdom flow through you, awakening the truth you have always known.'
      }
    }
  }

  private parseAudioSuggestions(content: string): AudioSuggestion[] {
    try {
      const parsed = JSON.parse(content)
      return parsed.suggestions || [
        {
          voice: 'Warm, gentle feminine voice with slight mystical quality',
          pace: 'Slow and contemplative with natural pauses',
          emotion: 'Loving, wise, supportive',
          backgroundMusic: 'Soft ambient soundscape with subtle chimes',
          effects: ['Gentle reverb', 'Soft nature sounds', 'Distant chimes']
        }
      ]
    } catch {
      return [
        {
          voice: 'Warm, nurturing, with wisdom and compassion',
          pace: 'Measured and flowing, like gentle waves',
          emotion: 'Loving guidance and encouragement',
          backgroundMusic: 'Soft instrumental with nature elements',
          effects: ['Gentle ambient reverb', 'Soft crystalline chimes', 'Distant ocean waves']
        }
      ]
    }
  }

  // Fallback content creation methods
  private createFallbackPoetry(preferences: UserPreferences): string {
    const styles = {
      classical: `In the tapestry of stars above,
      Your destiny weaves with threads of love.
      Ancient wisdom calls your name,
      Guiding you through joy and pain.`,
      
      modern: `Your smartphone can't predict your future,
      But your heart already knows the way.
      The universe has been sliding into your DMs,
      Sending signals every single day.`,
      
      mystical: `Beyond the veil of ordinary sight,
      Where shadow dances with the light,
      Your soul remembers what it came to do,
      The ancient magic living within you.`,
      
      practical: `The path ahead is yours to choose,
      With wisdom won and nothing to lose.
      Each step you take with conscious care
      Brings you closer to the truth you bear.`,
      
      poetic: `Like morning dew on petals bright,
      Your dreams take wing in golden light.
      The cards have whispered what they see:
      A soul awakening to be free.`
    }
    
    return styles[preferences.literaryStyle] || styles.mystical
  }

  private createFallbackSections(): PoeticSection[] {
    return [
      {
        title: 'The Current Moment',
        content: 'You stand at the crossroads of becoming, where past wisdom meets future possibility.',
        cardFocus: ['Present moment cards'],
        imagery: ['Crossroads', 'Dawn light', 'Open doorway'],
        symbolism: ['Choice', 'Transition', 'Opportunity']
      },
      {
        title: 'The Path Forward',
        content: 'Trust the stirring in your soul, for it knows the way to your highest good.',
        cardFocus: ['Guidance cards'],
        imagery: ['Winding path', 'Guiding star', 'Open heart'],
        symbolism: ['Journey', 'Trust', 'Inner knowing']
      }
    ]
  }

  private createFallbackReading(preferences: UserPreferences): PoeticReading {
    return {
      title: 'A Message from Your Soul',
      subtitle: 'Wisdom for the Journey Ahead',
      mainText: this.createFallbackPoetry(preferences),
      sections: this.createFallbackSections(),
      closingWisdom: 'Remember: you are exactly where you need to be, learning exactly what your soul came to learn.',
      personalAffirmation: 'I trust my inner wisdom and embrace my unique path with courage and love.'
    }
  }

  private createFallbackFullForm(): string {
    return `This sacred reading holds a mirror to your soul, reflecting the infinite wisdom that resides within you. 

The cards have danced together to weave a message of hope, transformation, and divine timing. You are being called to trust the process of your unfolding, to honor both your light and shadow, and to step boldly into your authentic power.

Your journey is unique and sacred. The challenges you face are not obstacles but opportunities for growth. The dreams you carry are not fantasies but visions of your highest potential waiting to be birthed into reality.

Trust your intuition. It is your direct line to divine wisdom. Take inspired action, even when the path seems unclear. Your soul knows the way, and the universe is conspiring to support your highest good.

You are loved, supported, and guided every step of the way. Remember this truth, especially in moments of doubt. You are exactly where you need to be, becoming exactly who you were meant to be.`
  }
}

export default ChatGPTService