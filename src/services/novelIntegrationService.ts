/**
 * Novel Integration Service
 * Deep integration between tarot readings and the mystical novel corpus
 */

import { novelCorpus } from '../data/novel-corpus'
import type { TarotCard } from '../types/tarot'

interface NovelContext {
  relevantChapters: any[]
  dominantThemes: string[]
  keySymbols: string[]
  archetypeMatches: string[]
  lifeLessons: string[]
  narrativeElements: string[]
}

class NovelIntegrationService {
  /**
   * Extract contextual wisdom from novel corpus based on cards and question
   */
  extractContextualWisdom(cards: TarotCard[], question: string): NovelContext {
    const cardNames = cards.map(card => card.name.toLowerCase())
    const questionThemes = this.extractQuestionThemes(question)
    
    // Find chapters with strong relevance
    const relevantChapters = this.findRelevantChapters(cardNames, questionThemes)
    
    // Extract aggregated wisdom elements
    const dominantThemes = this.extractDominantThemes(relevantChapters, questionThemes)
    const keySymbols = this.extractKeySymbols(relevantChapters, cardNames)
    const archetypeMatches = this.findArchetypeMatches(relevantChapters, cardNames)
    const lifeLessons = this.extractLifeLessons(relevantChapters)
    const narrativeElements = this.extractNarrativeElements(relevantChapters)
    
    return {
      relevantChapters,
      dominantThemes,
      keySymbols,
      archetypeMatches,
      lifeLessons,
      narrativeElements
    }
  }

  /**
   * Generate enhanced interpretation using novel wisdom
   */
  enhanceInterpretation(cards: TarotCard[], question: string, baseInterpretation: string): {
    enhancedTitle: string
    storyWeavedInterpretation: string
    archetypeGuidance: string
    symbolismDeepDive: string
  } {
    const context = this.extractContextualWisdom(cards, question)
    
    const enhancedTitle = this.generateEnhancedTitle(context, cards)
    const storyWeavedInterpretation = this.weaveStoryElements(baseInterpretation, context)
    const archetypeGuidance = this.generateArchetypeGuidance(context, cards)
    const symbolismDeepDive = this.generateSymbolismAnalysis(context, cards)
    
    return {
      enhancedTitle,
      storyWeavedInterpretation,
      archetypeGuidance,
      symbolismDeepDive
    }
  }

  /**
   * Generate thematic reading prompts for AI systems
   */
  generateEnhancedPrompt(cards: TarotCard[], question: string): string {
    const context = this.extractContextualWisdom(cards, question)
    
    const narrativeContext = context.relevantChapters.map(chapter => 
      `Chapter "${chapter.title}": ${chapter.content.substring(0, 300)}...`
    ).join('\n\n')
    
    return `
As the Night God Tarot oracle, channel the profound wisdom from these narrative contexts:

=== MYSTICAL NARRATIVE WISDOM ===
${narrativeContext}

=== ARCHETYPAL RESONANCE ===
Dominant Themes: ${context.dominantThemes.join(', ')}
Key Symbols: ${context.keySymbols.join(', ')}
Archetype Matches: ${context.archetypeMatches.join(', ')}
Life Lessons: ${context.lifeLessons.join(', ')}

=== READING REQUEST ===
Cards: ${cards.map(c => c.name).join(', ')}
Question: "${question}"

Weave the narrative wisdom, archetypal patterns, and symbolic resonances into a profound tarot reading that bridges ancient storytelling with divine guidance. Let the characters' journeys, symbolic elements, and thematic depths enhance your interpretation of the cards' messages.
    `
  }

  private findRelevantChapters(cardNames: string[], questionThemes: string[]): any[] {
    return novelCorpus.filter(chapter => {
      // Direct tarot card connections
      const cardScore = this.calculateCardRelevanceScore(chapter, cardNames)
      
      // Thematic alignment
      const themeScore = this.calculateThemeRelevanceScore(chapter, questionThemes)
      
      // Symbolic resonance
      const symbolScore = this.calculateSymbolRelevanceScore(chapter, cardNames)
      
      const totalScore = cardScore + themeScore + symbolScore
      
      return totalScore > 0.3 // Threshold for relevance
    }).sort((a, b) => {
      const scoreA = this.calculateTotalRelevanceScore(a, cardNames, questionThemes)
      const scoreB = this.calculateTotalRelevanceScore(b, cardNames, questionThemes)
      return scoreB - scoreA
    }).slice(0, 3) // Top 3 most relevant chapters
  }

  private calculateCardRelevanceScore(chapter: any, cardNames: string[]): number {
    let score = 0
    
    chapter.tarotConnections.forEach((connection: string) => {
      cardNames.forEach(cardName => {
        if (connection.toLowerCase().includes(cardName)) {
          score += 1.0 // Direct card mention
        }
      })
    })
    
    chapter.archetypes.forEach((archetype: string) => {
      cardNames.forEach(cardName => {
        if (archetype.toLowerCase().includes(cardName)) {
          score += 0.8 // Archetype match
        }
      })
    })
    
    return score / Math.max(cardNames.length, 1)
  }

  private calculateThemeRelevanceScore(chapter: any, questionThemes: string[]): number {
    let score = 0
    
    chapter.themes.forEach((theme: string) => {
      questionThemes.forEach(qTheme => {
        if (theme.toLowerCase().includes(qTheme) || qTheme.includes(theme.toLowerCase())) {
          score += 0.7 // Theme alignment
        }
      })
    })
    
    return score / Math.max(questionThemes.length, 1)
  }

  private calculateSymbolRelevanceScore(chapter: any, cardNames: string[]): number {
    let score = 0
    
    chapter.symbols.forEach((symbol: string) => {
      // Check if symbol relates to card meanings or names
      cardNames.forEach(cardName => {
        if (this.isSymbolicallyRelated(symbol, cardName)) {
          score += 0.5
        }
      })
    })
    
    return score / Math.max(cardNames.length, 1)
  }

  private calculateTotalRelevanceScore(chapter: any, cardNames: string[], questionThemes: string[]): number {
    return this.calculateCardRelevanceScore(chapter, cardNames) +
           this.calculateThemeRelevanceScore(chapter, questionThemes) +
           this.calculateSymbolRelevanceScore(chapter, cardNames)
  }

  private isSymbolicallyRelated(symbol: string, cardName: string): boolean {
    // Define symbolic relationships between novel symbols and tarot cards
    const symbolMappings: Record<string, string[]> = {
      'moonlight': ['moon', 'high priestess', 'hermit'],
      'ancient symbols': ['hierophant', 'hermit', 'magician'],
      'mystical visions': ['star', 'moon', 'high priestess'],
      'divine guidance': ['star', 'hierophant', 'judgement'],
      'sacred light': ['sun', 'star', 'world'],
      'cosmic connection': ['world', 'star', 'wheel of fortune'],
      'inner truth': ['hermit', 'high priestess', 'judgement'],
      'transformation': ['death', 'tower', 'judgement'],
      'spiritual awakening': ['judgement', 'star', 'world']
    }
    
    const relatedCards = symbolMappings[symbol.toLowerCase()] || []
    return relatedCards.some(relatedCard => 
      cardName.toLowerCase().includes(relatedCard) || 
      relatedCard.includes(cardName.toLowerCase())
    )
  }

  private extractQuestionThemes(question: string): string[] {
    const questionLower = question.toLowerCase()
    const themeKeywords = [
      'love', 'relationship', 'career', 'money', 'health', 'spiritual',
      'future', 'past', 'present', 'guidance', 'decision', 'change',
      'growth', 'challenge', 'opportunity', 'fear', 'hope', 'purpose',
      'destiny', 'calling', 'transformation', 'healing', 'wisdom'
    ]
    
    return themeKeywords.filter(keyword => questionLower.includes(keyword))
  }

  private extractDominantThemes(chapters: any[], questionThemes: string[]): string[] {
    const allThemes = chapters.flatMap(chapter => chapter.themes)
    const themeFrequency = new Map<string, number>()
    
    allThemes.forEach(theme => {
      themeFrequency.set(theme, (themeFrequency.get(theme) || 0) + 1)
    })
    
    // Add weight to themes that align with question
    questionThemes.forEach(qTheme => {
      themeFrequency.forEach((count, theme) => {
        if (theme.includes(qTheme) || qTheme.includes(theme)) {
          themeFrequency.set(theme, count + 2)
        }
      })
    })
    
    return Array.from(themeFrequency.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(entry => entry[0])
  }

  private extractKeySymbols(chapters: any[], cardNames: string[]): string[] {
    const allSymbols = chapters.flatMap(chapter => chapter.symbols)
    
    // Filter symbols that are relevant to the drawn cards
    return allSymbols.filter(symbol => 
      cardNames.some(cardName => this.isSymbolicallyRelated(symbol, cardName))
    ).slice(0, 6)
  }

  private findArchetypeMatches(chapters: any[], cardNames: string[]): string[] {
    const allArchetypes = chapters.flatMap(chapter => chapter.archetypes)
    
    return allArchetypes.filter(archetype =>
      cardNames.some(cardName => 
        archetype.toLowerCase().includes(cardName) || 
        cardName.includes(archetype.toLowerCase())
      )
    )
  }

  private extractLifeLessons(chapters: any[]): string[] {
    return chapters.flatMap(chapter => chapter.lifeLessons).slice(0, 4)
  }

  private extractNarrativeElements(chapters: any[]): string[] {
    return chapters.map(chapter => 
      `${chapter.title}: ${chapter.content.substring(0, 200)}...`
    )
  }

  private generateEnhancedTitle(context: NovelContext, cards: TarotCard[]): string {
    const primaryTheme = context.dominantThemes[0] || 'divine guidance'
    const chapterTitle = context.relevantChapters[0]?.title || 'Sacred Journey'
    
    return `✨ ${chapterTitle}: ${this.capitalizeWords(primaryTheme)} Revealed`
  }

  private weaveStoryElements(baseInterpretation: string, context: NovelContext): string {
    const storyPrefix = context.relevantChapters.length > 0 
      ? `Drawing from the mystical narrative of "${context.relevantChapters[0].title}", this reading reveals...`
      : ''
    
    const symbolContext = context.keySymbols.length > 0
      ? `The sacred symbols of ${context.keySymbols.slice(0, 3).join(', ')} illuminate your path...`
      : ''
    
    return `${storyPrefix}\n\n${baseInterpretation}\n\n${symbolContext}`
  }

  private generateArchetypeGuidance(context: NovelContext, cards: TarotCard[]): string {
    if (context.archetypeMatches.length === 0) {
      return 'Your journey embodies universal archetypal patterns of growth and wisdom.'
    }
    
    return `Your path resonates with the archetypal energies of ${context.archetypeMatches.join(', ')}, as revealed in the sacred narratives. These archetypal forces guide your transformation and illuminate your soul's purpose.`
  }

  private generateSymbolismAnalysis(context: NovelContext, cards: TarotCard[]): string {
    if (context.keySymbols.length === 0) {
      return 'Divine symbols speak through your cards, revealing hidden wisdom.'
    }
    
    return `The mystical symbols of ${context.keySymbols.join(', ')} weave through your reading like golden threads, connecting the ancient wisdom of the narratives to your personal journey. Each symbol carries profound meaning that deepens your understanding of the cards' messages.`
  }

  private capitalizeWords(str: string): string {
    return str.split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ')
  }
}

export const novelIntegrationService = new NovelIntegrationService()