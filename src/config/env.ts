/**
 * Secure Environment Configuration
 * Handles all environment variables and API key management
 */

export interface AIConfig {
  openai: {
    apiKey: string
    baseUrl?: string
    organization?: string
    timeout?: number
  }
  monica: {
    apiKey: string
    baseUrl?: string
    timeout?: number
  }
  google: {
    apiKey: string
    projectId?: string
    timeout?: number
  }
  perplexity: {
    apiKey: string
    baseUrl?: string
    timeout?: number
  }
}

export interface SecurityConfig {
  encryption: {
    algorithm: string
    keyLength: number
    ivLength: number
  }
  rotation: {
    enabled: boolean
    intervalDays: number
    warningDays: number
  }
  proxy: {
    enabled: boolean
    baseUrl: string
    rateLimit: {
      windowMs: number
      maxRequests: number
    }
  }
}

export interface AppConfig {
  environment: 'development' | 'staging' | 'production'
  debug: boolean
  ai: AIConfig
  security: SecurityConfig
  features: {
    aiOrchestration: boolean
    collectiveWisdom: boolean
    personalAnalysis: boolean
    poeticSublimation: boolean
  }
}

class EnvironmentManager {
  private static instance: EnvironmentManager
  private config: AppConfig | null = null

  private constructor() {}

  static getInstance(): EnvironmentManager {
    if (!EnvironmentManager.instance) {
      EnvironmentManager.instance = new EnvironmentManager()
    }
    return EnvironmentManager.instance
  }

  /**
   * Initialize configuration from environment variables
   * NEVER store actual API keys in code
   */
  initialize(): AppConfig {
    if (this.config) {
      return this.config
    }

    this.config = {
      environment: (process.env.NODE_ENV as any) || 'development',
      debug: process.env.NODE_ENV === 'development',
      
      ai: {
        openai: {
          apiKey: process.env.OPENAI_API_KEY || '',
          baseUrl: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',
          organization: process.env.OPENAI_ORG_ID,
          timeout: parseInt(process.env.OPENAI_TIMEOUT || '30000')
        },
        monica: {
          apiKey: process.env.MONICA_API_KEY || '',
          baseUrl: process.env.MONICA_BASE_URL || 'https://api.monica.im',
          timeout: parseInt(process.env.MONICA_TIMEOUT || '30000')
        },
        google: {
          apiKey: process.env.GOOGLE_API_KEY || '',
          projectId: process.env.GOOGLE_PROJECT_ID,
          timeout: parseInt(process.env.GOOGLE_TIMEOUT || '30000')
        },
        perplexity: {
          apiKey: process.env.PERPLEXITY_API_KEY || '',
          baseUrl: process.env.PERPLEXITY_BASE_URL || 'https://api.perplexity.ai',
          timeout: parseInt(process.env.PERPLEXITY_TIMEOUT || '30000')
        }
      },

      security: {
        encryption: {
          algorithm: 'aes-256-gcm',
          keyLength: 32,
          ivLength: 16
        },
        rotation: {
          enabled: process.env.KEY_ROTATION_ENABLED === 'true',
          intervalDays: parseInt(process.env.KEY_ROTATION_INTERVAL || '30'),
          warningDays: parseInt(process.env.KEY_ROTATION_WARNING || '7')
        },
        proxy: {
          enabled: process.env.AI_PROXY_ENABLED !== 'false',
          baseUrl: process.env.AI_PROXY_URL || '/api/ai-proxy',
          rateLimit: {
            windowMs: parseInt(process.env.RATE_LIMIT_WINDOW || '900000'), // 15 minutes
            maxRequests: parseInt(process.env.RATE_LIMIT_MAX || '100')
          }
        }
      },

      features: {
        aiOrchestration: process.env.FEATURE_AI_ORCHESTRATION !== 'false',
        collectiveWisdom: process.env.FEATURE_COLLECTIVE_WISDOM !== 'false',
        personalAnalysis: process.env.FEATURE_PERSONAL_ANALYSIS !== 'false',
        poeticSublimation: process.env.FEATURE_POETIC_SUBLIMATION !== 'false'
      }
    }

    this.validateConfiguration()
    return this.config
  }

  /**
   * Validate that required configuration is present
   */
  private validateConfiguration(): void {
    if (!this.config) {
      throw new Error('Configuration not initialized')
    }

    const requiredKeys = [
      'ai.openai.apiKey',
      'ai.monica.apiKey', 
      'ai.google.apiKey',
      'ai.perplexity.apiKey'
    ]

    for (const keyPath of requiredKeys) {
      const value = this.getNestedValue(this.config, keyPath)
      if (!value || value === '') {
        console.warn(`Missing required configuration: ${keyPath}`)
        if (this.config.environment === 'production') {
          throw new Error(`Production environment requires: ${keyPath}`)
        }
      }
    }
  }

  /**
   * Get nested configuration value by dot notation
   */
  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj)
  }

  /**
   * Get current configuration
   */
  getConfig(): AppConfig {
    if (!this.config) {
      return this.initialize()
    }
    return this.config
  }

  /**
   * Check if a feature is enabled
   */
  isFeatureEnabled(feature: keyof AppConfig['features']): boolean {
    return this.getConfig().features[feature]
  }

  /**
   * Get AI service configuration
   */
  getAIConfig(service: keyof AIConfig): any {
    return this.getConfig().ai[service]
  }

  /**
   * Get security configuration
   */
  getSecurityConfig(): SecurityConfig {
    return this.getConfig().security
  }

  /**
   * Sanitize configuration for logging (remove sensitive data)
   */
  getSanitizedConfig(): Partial<AppConfig> {
    const config = this.getConfig()
    return {
      environment: config.environment,
      debug: config.debug,
      features: config.features,
      security: {
        ...config.security,
        // Remove sensitive data
        encryption: { algorithm: config.security.encryption.algorithm },
        proxy: { enabled: config.security.proxy.enabled }
      },
      ai: {
        openai: { baseUrl: config.ai.openai.baseUrl },
        monica: { baseUrl: config.ai.monica.baseUrl },
        google: { projectId: config.ai.google.projectId },
        perplexity: { baseUrl: config.ai.perplexity.baseUrl }
      }
    }
  }
}

export const envManager = EnvironmentManager.getInstance()
export default envManager