// Analytics System - Track Monica Performance & User Behavior
export class AnalyticsSystem {
  private metrics: Map<string, any> = new Map()

  // Track Monica API Performance
  trackMonicaPerformance(requestId: string, duration: number, success: boolean) {
    const metric = {
      timestamp: new Date(),
      duration,
      success,
      requestId
    }
    
    this.metrics.set(`monica_${requestId}`, metric)
    
    // Log performance in development
    if (import.meta.env.DEV) {
      console.log(`🤖 Monica Performance: ${duration}ms - ${success ? '✅' : '❌'}`)
    }
  }

  // Track User Reading Patterns
  trackUserReading(userId: string, cards: any[], question: string) {
    const reading = {
      userId,
      timestamp: new Date(),
      cards: cards.map(c => c.name),
      question,
      cardCount: cards.length
    }
    
    this.metrics.set(`reading_${Date.now()}`, reading)
  }

  // Get Performance Summary
  getPerformanceSummary() {
    const monicaMetrics = Array.from(this.metrics.values())
      .filter(m => m.requestId?.startsWith('monica_'))
    
    const successful = monicaMetrics.filter(m => m.success).length
    const total = monicaMetrics.length
    const avgDuration = monicaMetrics.reduce((sum, m) => sum + m.duration, 0) / total || 0
    
    return {
      successRate: total > 0 ? (successful / total) * 100 : 0,
      averageResponseTime: Math.round(avgDuration),
      totalRequests: total
    }
  }

  // Get User Insights
  getUserInsights(userId: string) {
    const userReadings = Array.from(this.metrics.values())
      .filter(m => m.userId === userId)
    
    return {
      totalReadings: userReadings.length,
      averageCardsPerReading: userReadings.reduce((sum, r) => sum + r.cardCount, 0) / userReadings.length || 0,
      lastReading: userReadings[userReadings.length - 1]?.timestamp
    }
  }
}

export default AnalyticsSystem