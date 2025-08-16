/**
 * API Key Security and Rotation Manager
 * Handles encryption, secure storage, and rotation of all AI API keys
 */

import * as crypto from 'crypto'
import { envManager } from '../config/env'

export interface EncryptedKey {
  encryptedValue: string
  iv: string
  tag: string
  version: number
  createdAt: Date
  expiresAt: Date
  rotationWarning: Date
}

export interface KeyRotationEvent {
  keyName: string
  oldKeyId: string
  newKeyId: string
  timestamp: Date
  success: boolean
  reason: string
}

export class KeyManager {
  private static instance: KeyManager
  private encryptionKey: Buffer
  private keyStore: Map<string, EncryptedKey> = new Map()
  private rotationEvents: KeyRotationEvent[] = []
  private rotationTimer: NodeJS.Timeout | null = null

  private constructor() {
    this.initializeEncryption()
    this.startRotationMonitoring()
  }

  static getInstance(): KeyManager {
    if (!KeyManager.instance) {
      KeyManager.instance = new KeyManager()
    }
    return KeyManager.instance
  }

  /**
   * Initialize encryption system
   */
  private initializeEncryption(): void {
    const envKey = process.env.ENCRYPTION_KEY
    if (!envKey || envKey.length !== 32) {
      throw new Error('ENCRYPTION_KEY must be exactly 32 characters')
    }
    
    this.encryptionKey = Buffer.from(envKey, 'utf8')
    
    if (envManager.getConfig().debug) {
      console.log('🔐 Key encryption system initialized')
    }
  }

  /**
   * Encrypt an API key with AES-256-GCM
   */
  private encryptKey(plainKey: string): EncryptedKey {
    const algorithm = 'aes-256-gcm'
    const iv = crypto.randomBytes(16)
    const cipher = crypto.createCipher(algorithm, this.encryptionKey)
    cipher.setAAD(Buffer.from('night-god-tarot-api-key'))

    let encrypted = cipher.update(plainKey, 'utf8', 'hex')
    encrypted += cipher.final('hex')
    const tag = cipher.getAuthTag()

    const config = envManager.getSecurityConfig()
    const now = new Date()
    const expiresAt = new Date(now.getTime() + (config.rotation.intervalDays * 24 * 60 * 60 * 1000))
    const rotationWarning = new Date(expiresAt.getTime() - (config.rotation.warningDays * 24 * 60 * 60 * 1000))

    return {
      encryptedValue: encrypted,
      iv: iv.toString('hex'),
      tag: tag.toString('hex'),
      version: 1,
      createdAt: now,
      expiresAt,
      rotationWarning
    }
  }

  /**
   * Decrypt an API key
   */
  private decryptKey(encryptedKey: EncryptedKey): string {
    try {
      const algorithm = 'aes-256-gcm'
      const decipher = crypto.createDecipher(algorithm, this.encryptionKey)
      decipher.setAAD(Buffer.from('night-god-tarot-api-key'))
      decipher.setAuthTag(Buffer.from(encryptedKey.tag, 'hex'))

      let decrypted = decipher.update(encryptedKey.encryptedValue, 'hex', 'utf8')
      decrypted += decipher.final('utf8')
      
      return decrypted
    } catch (error) {
      throw new Error(`Key decryption failed: ${error.message}`)
    }
  }

  /**
   * Store an API key securely
   */
  async storeKey(keyName: string, plainKey: string): Promise<void> {
    if (!plainKey || plainKey.trim() === '') {
      throw new Error(`Invalid key provided for ${keyName}`)
    }

    const encryptedKey = this.encryptKey(plainKey)
    this.keyStore.set(keyName, encryptedKey)

    // In production, this would store to a secure database
    await this.persistKeyStore()

    if (envManager.getConfig().debug) {
      console.log(`🔑 Stored encrypted key: ${keyName}`)
    }
  }

  /**
   * Retrieve and decrypt an API key
   */
  async getKey(keyName: string): Promise<string> {
    const encryptedKey = this.keyStore.get(keyName)
    if (!encryptedKey) {
      throw new Error(`Key not found: ${keyName}`)
    }

    // Check if key is expired
    if (new Date() > encryptedKey.expiresAt) {
      throw new Error(`Key expired: ${keyName}. Rotation required.`)
    }

    // Check if rotation warning is due
    if (new Date() > encryptedKey.rotationWarning) {
      console.warn(`⚠️ Key rotation warning: ${keyName} expires ${encryptedKey.expiresAt.toISOString()}`)
    }

    return this.decryptKey(encryptedKey)
  }

  /**
   * Initialize all keys from environment
   */
  async initializeKeys(): Promise<void> {
    const keyMappings = {
      'openai': process.env.OPENAI_API_KEY,
      'monica': process.env.MONICA_API_KEY,
      'google': process.env.GOOGLE_API_KEY,
      'perplexity': process.env.PERPLEXITY_API_KEY
    }

    for (const [keyName, keyValue] of Object.entries(keyMappings)) {
      if (keyValue) {
        await this.storeKey(keyName, keyValue)
      } else {
        console.warn(`⚠️ Missing API key in environment: ${keyName.toUpperCase()}_API_KEY`)
      }
    }

    if (envManager.getConfig().debug) {
      console.log(`🔐 Initialized ${Object.keys(keyMappings).length} API keys`)
    }
  }

  /**
   * Rotate an API key
   */
  async rotateKey(keyName: string, newKey: string, reason: string = 'Scheduled rotation'): Promise<void> {
    const oldKey = this.keyStore.get(keyName)
    const oldKeyId = oldKey ? this.generateKeyId(oldKey) : 'unknown'

    try {
      await this.storeKey(keyName, newKey)
      const newKeyId = this.generateKeyId(this.keyStore.get(keyName)!)

      const event: KeyRotationEvent = {
        keyName,
        oldKeyId,
        newKeyId,
        timestamp: new Date(),
        success: true,
        reason
      }

      this.rotationEvents.push(event)
      await this.persistRotationEvents()

      console.log(`🔄 Key rotated successfully: ${keyName}`)
    } catch (error) {
      const event: KeyRotationEvent = {
        keyName,
        oldKeyId,
        newKeyId: 'failed',
        timestamp: new Date(),
        success: false,
        reason: `Rotation failed: ${error.message}`
      }

      this.rotationEvents.push(event)
      await this.persistRotationEvents()

      throw error
    }
  }

  /**
   * Check which keys need rotation
   */
  getKeysNeedingRotation(): string[] {
    const now = new Date()
    const keysNeedingRotation: string[] = []

    for (const [keyName, encryptedKey] of this.keyStore.entries()) {
      if (now > encryptedKey.rotationWarning) {
        keysNeedingRotation.push(keyName)
      }
    }

    return keysNeedingRotation
  }

  /**
   * Force rotation of all keys
   */
  async rotateAllKeys(): Promise<void> {
    const keyNames = Array.from(this.keyStore.keys())
    
    for (const keyName of keyNames) {
      try {
        // In production, this would fetch new keys from a secure source
        const newKey = await this.generateNewKey(keyName)
        await this.rotateKey(keyName, newKey, 'Manual rotation of all keys')
      } catch (error) {
        console.error(`Failed to rotate key ${keyName}:`, error.message)
      }
    }
  }

  /**
   * Get key status information
   */
  getKeyStatus(): Record<string, any> {
    const status: Record<string, any> = {}

    for (const [keyName, encryptedKey] of this.keyStore.entries()) {
      const now = new Date()
      const daysUntilExpiry = Math.ceil((encryptedKey.expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      const daysUntilWarning = Math.ceil((encryptedKey.rotationWarning.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

      status[keyName] = {
        version: encryptedKey.version,
        createdAt: encryptedKey.createdAt,
        expiresAt: encryptedKey.expiresAt,
        daysUntilExpiry,
        daysUntilWarning,
        needsRotation: now > encryptedKey.rotationWarning,
        isExpired: now > encryptedKey.expiresAt
      }
    }

    return status
  }

  /**
   * Get rotation event history
   */
  getRotationHistory(limit: number = 50): KeyRotationEvent[] {
    return this.rotationEvents
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit)
  }

  /**
   * Start automated rotation monitoring
   */
  private startRotationMonitoring(): void {
    if (!envManager.getSecurityConfig().rotation.enabled) {
      console.log('🔄 Key rotation monitoring disabled')
      return
    }

    // Check every hour for keys needing rotation
    this.rotationTimer = setInterval(() => {
      const keysNeedingRotation = this.getKeysNeedingRotation()
      
      if (keysNeedingRotation.length > 0) {
        console.warn(`⚠️ Keys needing rotation: ${keysNeedingRotation.join(', ')}`)
        
        // In production, this would trigger alerts or automated rotation
        this.notifyKeyRotationNeeded(keysNeedingRotation)
      }
    }, 3600000) // 1 hour

    console.log('🔄 Key rotation monitoring started')
  }

  /**
   * Stop rotation monitoring
   */
  stopRotationMonitoring(): void {
    if (this.rotationTimer) {
      clearInterval(this.rotationTimer)
      this.rotationTimer = null
      console.log('🔄 Key rotation monitoring stopped')
    }
  }

  /**
   * Generate unique key identifier
   */
  private generateKeyId(encryptedKey: EncryptedKey): string {
    const data = `${encryptedKey.encryptedValue}${encryptedKey.createdAt.toISOString()}`
    return crypto.createHash('sha256').update(data).digest('hex').substring(0, 8)
  }

  /**
   * Generate new key (placeholder - in production, integrate with key providers)
   */
  private async generateNewKey(keyName: string): Promise<string> {
    // This is a placeholder. In production, you would:
    // 1. Generate new keys through provider APIs
    // 2. Fetch from secure key management service
    // 3. Use hardware security modules
    
    throw new Error(`Automatic key generation not implemented for ${keyName}. Please provide new key manually.`)
  }

  /**
   * Notify about keys needing rotation
   */
  private notifyKeyRotationNeeded(keyNames: string[]): void {
    // In production, this would:
    // 1. Send alerts to administrators
    // 2. Create tickets in monitoring systems
    // 3. Trigger automated rotation workflows
    
    console.warn(`🚨 ALERT: Keys requiring rotation: ${keyNames.join(', ')}`)
  }

  /**
   * Persist key store to secure storage
   */
  private async persistKeyStore(): Promise<void> {
    // In production, this would store to:
    // 1. Encrypted database
    // 2. Hardware security module
    // 3. Cloud key management service
    
    if (envManager.getConfig().debug) {
      console.log('💾 Key store persisted (placeholder)')
    }
  }

  /**
   * Persist rotation events
   */
  private async persistRotationEvents(): Promise<void> {
    // In production, this would store to audit logs
    if (envManager.getConfig().debug) {
      console.log('📝 Rotation events persisted (placeholder)')
    }
  }

  /**
   * Validate key format
   */
  validateKeyFormat(keyName: string, key: string): boolean {
    const patterns = {
      openai: /^sk-[a-zA-Z0-9]{48,}$/,
      monica: /^sk-[a-zA-Z0-9]{48,}$/,
      google: /^[a-zA-Z0-9]{39}$/,
      perplexity: /^pplx-[a-zA-Z0-9]{32,}$/
    }

    const pattern = patterns[keyName as keyof typeof patterns]
    if (!pattern) {
      console.warn(`No validation pattern for key: ${keyName}`)
      return true // Allow unknown key types
    }

    return pattern.test(key)
  }

  /**
   * Test key validity with service
   */
  async testKey(keyName: string, key?: string): Promise<boolean> {
    try {
      const testKey = key || await this.getKey(keyName)
      
      // This would make actual test requests to each service
      // For now, just validate format
      return this.validateKeyFormat(keyName, testKey)
    } catch (error) {
      console.error(`Key test failed for ${keyName}:`, error.message)
      return false
    }
  }

  /**
   * Emergency key invalidation
   */
  async invalidateKey(keyName: string, reason: string): Promise<void> {
    const encryptedKey = this.keyStore.get(keyName)
    if (encryptedKey) {
      // Mark as expired immediately
      encryptedKey.expiresAt = new Date()
      
      const event: KeyRotationEvent = {
        keyName,
        oldKeyId: this.generateKeyId(encryptedKey),
        newKeyId: 'invalidated',
        timestamp: new Date(),
        success: true,
        reason: `Emergency invalidation: ${reason}`
      }

      this.rotationEvents.push(event)
      await this.persistRotationEvents()

      console.warn(`🚨 Key invalidated: ${keyName} - ${reason}`)
    }
  }

  /**
   * Cleanup resources
   */
  async cleanup(): Promise<void> {
    this.stopRotationMonitoring()
    this.keyStore.clear()
    this.rotationEvents = []
    
    // Clear encryption key from memory
    this.encryptionKey.fill(0)
    
    console.log('🧹 Key manager cleaned up')
  }
}

export default KeyManager