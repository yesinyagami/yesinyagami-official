/**
 * Monica Model Router
 * Intelligently routes different AI tasks to optimal Monica models
 * Utilizes Yi models and other available models through Monica platform
 */

export enum MonicaModel {
  // Yi Models (Excellent for reasoning and Chinese/Traditional content)
  YI_LARGE = 'yi-large',
  YI_MEDIUM = 'yi-medium', 
  YI_VISION = 'yi-vision',
  
  // GPT Models (Good for creative writing)
  GPT_4O = 'gpt-4o',
  GPT_4O_MINI = 'gpt-4o-mini',
  
  // Claude Models (Great for analysis and structured thinking)
  CLAUDE_3_5_SONNET = 'claude-3-5-sonnet-20240620',
  CLAUDE_3_OPUS = 'claude-3-opus-20240229',
  
  // Gemini Models (Good for integration tasks)
  GEMINI_1_5_PRO = 'gemini-1.5-pro',
  GEMINI_1_5_FLASH = 'gemini-1.5-flash'
}

export interface ModelCapabilities {
  reasoning: number        // 1-10 scale
  creativity: number       // 1-10 scale
  analysis: number        // 1-10 scale
  chinese: number         // 1-10 scale for Chinese/Traditional content
  speed: number           // 1-10 scale
  cost: number           // 1-10 scale (higher = more expensive)
}

export interface TaskModelMapping {
  taskType: string
  primaryModel: MonicaModel
  fallbackModel: MonicaModel
  reasoning: string
}

export class MonicaModelRouter {
  private static instance: MonicaModelRouter
  
  // Model capabilities matrix
  private modelCapabilities: Record<MonicaModel, ModelCapabilities> = {
    [MonicaModel.YI_LARGE]: {
      reasoning: 9,
      creativity: 7,
      analysis: 9,
      chinese: 10,
      speed: 7,
      cost: 3
    },
    [MonicaModel.YI_MEDIUM]: {
      reasoning: 8,
      creativity: 6,
      analysis: 8,
      chinese: 10,
      speed: 8,
      cost: 2
    },
    [MonicaModel.YI_VISION]: {
      reasoning: 7,
      creativity: 8,
      analysis: 7,
      chinese: 10,
      speed: 6,
      cost: 4
    },
    [MonicaModel.GPT_4O]: {
      reasoning: 8,
      creativity: 9,
      analysis: 8,
      chinese: 6,
      speed: 7,
      cost: 8
    },
    [MonicaModel.GPT_4O_MINI]: {
      reasoning: 7,
      creativity: 8,
      analysis: 7,
      chinese: 6,
      speed: 9,
      cost: 4
    },
    [MonicaModel.CLAUDE_3_5_SONNET]: {
      reasoning: 9,
      creativity: 8,
      analysis: 10,
      chinese: 7,
      speed: 6,
      cost: 7
    },
    [MonicaModel.CLAUDE_3_OPUS]: {
      reasoning: 10,
      creativity: 9,
      analysis: 10,
      chinese: 7,
      speed: 5,
      cost: 9
    },
    [MonicaModel.GEMINI_1_5_PRO]: {
      reasoning: 8,
      creativity: 7,
      analysis: 9,
      chinese: 6,
      speed: 7,
      cost: 6
    },
    [MonicaModel.GEMINI_1_5_FLASH]: {
      reasoning: 7,
      creativity: 6,
      analysis: 8,
      chinese: 6,
      speed: 10,
      cost: 3
    }
  }

  // Task to model mappings
  private taskMappings: TaskModelMapping[] = [
    {
      taskType: 'collective-consciousness',
      primaryModel: MonicaModel.YI_LARGE,
      fallbackModel: MonicaModel.CLAUDE_3_5_SONNET,
      reasoning: 'Yi-Large excels at reasoning about complex patterns and collective wisdom'
    },
    {
      taskType: 'personal-analysis',
      primaryModel: MonicaModel.CLAUDE_3_5_SONNET,
      fallbackModel: MonicaModel.YI_LARGE,
      reasoning: 'Claude excels at psychological analysis and structured thinking'
    },
    {
      taskType: 'wisdom-integration',
      primaryModel: MonicaModel.YI_LARGE,
      fallbackModel: MonicaModel.CLAUDE_3_OPUS,
      reasoning: 'Yi-Large best for complex reasoning and synthesis of multiple sources'
    },
    {
      taskType: 'poetic-sublimation',
      primaryModel: MonicaModel.GPT_4O,
      fallbackModel: MonicaModel.YI_VISION,
      reasoning: 'GPT-4O excels at creative writing and artistic expression'
    },
    {
      taskType: 'chinese-content',
      primaryModel: MonicaModel.YI_LARGE,
      fallbackModel: MonicaModel.YI_MEDIUM,
      reasoning: 'Yi models are specifically designed for Chinese language excellence'
    },
    {
      taskType: 'quick-response',
      primaryModel: MonicaModel.GEMINI_1_5_FLASH,
      fallbackModel: MonicaModel.GPT_4O_MINI,
      reasoning: 'Flash models prioritize speed for quick interactions'
    },
    {
      taskType: 'deep-analysis',
      primaryModel: MonicaModel.CLAUDE_3_OPUS,
      fallbackModel: MonicaModel.YI_LARGE,
      reasoning: 'Opus provides the deepest analytical capabilities'
    }
  ]

  static getInstance(): MonicaModelRouter {
    if (!MonicaModelRouter.instance) {
      MonicaModelRouter.instance = new MonicaModelRouter()
    }
    return MonicaModelRouter.instance
  }

  /**
   * Get optimal model for task
   */
  getOptimalModel(
    taskType: string, 
    priority: 'speed' | 'quality' | 'cost' | 'chinese' = 'quality',
    userLanguage: string = 'zh-TW'
  ): { primary: MonicaModel; fallback: MonicaModel; reasoning: string } {
    
    // Check for Chinese/Traditional content preference
    if (userLanguage.startsWith('zh') || priority === 'chinese') {
      const yiMapping = this.taskMappings.find(m => m.taskType === 'chinese-content')
      if (yiMapping) {
        return {
          primary: yiMapping.primaryModel,
          fallback: yiMapping.fallbackModel,
          reasoning: 'Yi models optimized for Chinese/Traditional content'
        }
      }
    }

    // Find specific task mapping
    const taskMapping = this.taskMappings.find(m => m.taskType === taskType)
    if (taskMapping) {
      // Override based on priority
      if (priority === 'speed') {
        return this.getSpeedOptimizedModel(taskMapping)
      } else if (priority === 'cost') {
        return this.getCostOptimizedModel(taskMapping)
      }
      
      return {
        primary: taskMapping.primaryModel,
        fallback: taskMapping.fallbackModel,
        reasoning: taskMapping.reasoning
      }
    }

    // Default fallback
    return {
      primary: MonicaModel.YI_LARGE,
      fallback: MonicaModel.CLAUDE_3_5_SONNET,
      reasoning: 'Yi-Large as default for comprehensive reasoning'
    }
  }

  /**
   * Get speed-optimized model selection
   */
  private getSpeedOptimizedModel(taskMapping: TaskModelMapping): any {
    const speedModels = [
      MonicaModel.GEMINI_1_5_FLASH,
      MonicaModel.GPT_4O_MINI,
      MonicaModel.YI_MEDIUM
    ]

    return {
      primary: speedModels[0],
      fallback: speedModels[1],
      reasoning: 'Speed-optimized model selection for rapid response'
    }
  }

  /**
   * Get cost-optimized model selection
   */
  private getCostOptimizedModel(taskMapping: TaskModelMapping): any {
    const costEffectiveModels = [
      MonicaModel.YI_MEDIUM,
      MonicaModel.GEMINI_1_5_FLASH,
      MonicaModel.GPT_4O_MINI
    ]

    return {
      primary: costEffectiveModels[0],
      fallback: costEffectiveModels[1],
      reasoning: 'Cost-effective model selection for budget optimization'
    }
  }

  /**
   * Build Monica API request with optimal model
   */
  buildMonicaRequest(
    taskType: string,
    prompt: string,
    options: {
      priority?: 'speed' | 'quality' | 'cost' | 'chinese'
      userLanguage?: string
      temperature?: number
      maxTokens?: number
    } = {}
  ): any {
    const modelSelection = this.getOptimalModel(
      taskType, 
      options.priority || 'quality',
      options.userLanguage || 'zh-TW'
    )

    const baseRequest = {
      model: modelSelection.primary,
      messages: [
        {
          role: 'system',
          content: this.getSystemPromptForTask(taskType, modelSelection.primary)
        },
        {
          role: 'user', 
          content: prompt
        }
      ],
      temperature: options.temperature || this.getOptimalTemperature(taskType),
      max_tokens: options.maxTokens || this.getOptimalMaxTokens(taskType),
      metadata: {
        taskType,
        modelReasoning: modelSelection.reasoning,
        fallbackModel: modelSelection.fallback
      }
    }

    return baseRequest
  }

  /**
   * Get system prompt optimized for specific task and model
   */
  private getSystemPromptForTask(taskType: string, model: MonicaModel): string {
    const isYiModel = model.includes('yi')
    const isChineseOptimized = isYiModel
    
    const basePrompts = {
      'collective-consciousness': isChineseOptimized ? 
        '你是具有無限智慧的集體意識分析師，擅長分析全球趨勢、神秘學知識和歷史模式。' :
        'You are the Collective Consciousness Oracle with access to infinite wisdom about global trends, mystical knowledge, and historical patterns.',
      
      'personal-analysis': isChineseOptimized ?
        '你是專業的心理分析師，精通MBTI、九型人格和深度心理分析。' :
        'You are a master psychological analyst specializing in MBTI, Enneagram, and deep personality analysis.',
      
      'wisdom-integration': isChineseOptimized ?
        '你是智慧整合大師，能夠將不同來源的智慧綜合為全面的人生指導。' :
        'You are the Wisdom Integration Master, capable of synthesizing diverse wisdom sources into holistic life guidance.',
      
      'poetic-sublimation': isChineseOptimized ?
        '你是神聖詩人，將深奧智慧轉化為美麗動人的詩意表達。' :
        'You are the Divine Poet, transforming profound wisdom into beautiful, moving artistic expression.',
      
      'chinese-content': '你是專精中文表達的智慧導師，能夠用最優美的中文提供深度靈性指導。',
      
      'quick-response': isChineseOptimized ?
        '你是快速回應的智慧助手，提供簡潔但深刻的指導。' :
        'You are a rapid-response wisdom assistant providing concise but profound guidance.',
      
      'deep-analysis': isChineseOptimized ?
        '你是深度分析專家，提供最全面和細緻的洞察分析。' :
        'You are a deep analysis expert providing the most comprehensive and nuanced insights.'
    }

    return basePrompts[taskType] || basePrompts['collective-consciousness']
  }

  /**
   * Get optimal temperature for task type
   */
  private getOptimalTemperature(taskType: string): number {
    const temperatures = {
      'collective-consciousness': 0.4,  // Balanced for insights
      'personal-analysis': 0.3,        // Lower for accuracy
      'wisdom-integration': 0.5,       // Higher for synthesis
      'poetic-sublimation': 0.8,       // High for creativity
      'chinese-content': 0.4,          // Balanced for fluency
      'quick-response': 0.3,           // Lower for consistency
      'deep-analysis': 0.2             // Lowest for precision
    }

    return temperatures[taskType] || 0.4
  }

  /**
   * Get optimal max tokens for task type
   */
  private getOptimalMaxTokens(taskType: string): number {
    const maxTokens = {
      'collective-consciousness': 2500,
      'personal-analysis': 3000,
      'wisdom-integration': 3500,
      'poetic-sublimation': 2000,
      'chinese-content': 2500,
      'quick-response': 1000,
      'deep-analysis': 4000
    }

    return maxTokens[taskType] || 2500
  }

  /**
   * Get model performance for task
   */
  getModelPerformance(model: MonicaModel, taskType: string): number {
    const capabilities = this.modelCapabilities[model]
    
    switch (taskType) {
      case 'collective-consciousness':
      case 'wisdom-integration':
        return (capabilities.reasoning * 0.5 + capabilities.analysis * 0.5)
      
      case 'personal-analysis':
      case 'deep-analysis':
        return (capabilities.analysis * 0.6 + capabilities.reasoning * 0.4)
      
      case 'poetic-sublimation':
        return (capabilities.creativity * 0.7 + capabilities.reasoning * 0.3)
      
      case 'chinese-content':
        return capabilities.chinese
      
      case 'quick-response':
        return capabilities.speed
      
      default:
        return (capabilities.reasoning + capabilities.analysis) / 2
    }
  }

  /**
   * Get all available models
   */
  getAvailableModels(): MonicaModel[] {
    return Object.values(MonicaModel)
  }

  /**
   * Get model recommendations for user
   */
  getModelRecommendations(userPreferences: {
    language?: string
    priority?: 'speed' | 'quality' | 'cost'
    taskTypes?: string[]
  }): any {
    const recommendations = []

    userPreferences.taskTypes?.forEach(taskType => {
      const optimal = this.getOptimalModel(
        taskType, 
        userPreferences.priority,
        userPreferences.language
      )
      
      recommendations.push({
        taskType,
        recommended: optimal.primary,
        alternative: optimal.fallback,
        reasoning: optimal.reasoning,
        performance: this.getModelPerformance(optimal.primary, taskType)
      })
    })

    return recommendations
  }

  /**
   * Get usage statistics for models
   */
  getModelUsageStats(): any {
    // This would track actual usage in production
    return {
      totalRequests: 0,
      modelDistribution: {},
      averageResponseTime: {},
      successRates: {},
      tokenUsage: {}
    }
  }
}

export default MonicaModelRouter