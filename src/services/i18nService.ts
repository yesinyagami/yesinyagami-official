/**
 * Internationalization Service for Night God Tarot
 * Handles multiple languages and dynamic content loading
 */

import { ref, computed } from 'vue'
import type { Translations } from '../locales/en'

type SupportedLanguage = 'en' | 'zh-TW' | 'zh-CN' | 'ja' | 'hr'

class I18nService {
  private currentLanguage = ref<SupportedLanguage>('en')
  private translations = ref<Record<string, Translations>>({})
  private fallbackLanguage: SupportedLanguage = 'en'

  constructor() {
    // Load initial language from localStorage or browser
    this.loadInitialLanguage()
    this.loadTranslations()
  }

  /**
   * Get current language
   */
  get language() {
    return computed(() => this.currentLanguage.value)
  }

  /**
   * Get current translations
   */
  get t() {
    return computed(() => {
      const lang = this.currentLanguage.value
      return this.translations.value[lang] || this.translations.value[this.fallbackLanguage] || {}
    })
  }

  /**
   * Set current language
   */
  async setLanguage(language: SupportedLanguage) {
    this.currentLanguage.value = language
    
    // Save to localStorage
    localStorage.setItem('night-god-language', language)
    
    // Load translations if not loaded
    if (!this.translations.value[language]) {
      await this.loadLanguageTranslations(language)
    }
    
    // Update document language
    document.documentElement.lang = this.getHtmlLang(language)
  }

  /**
   * Get translation by key path
   */
  translate(keyPath: string, params?: Record<string, any>): string {
    const translations = this.t.value
    const keys = keyPath.split('.')
    
    let value: any = translations
    for (const key of keys) {
      value = value?.[key]
      if (value === undefined) break
    }
    
    if (typeof value !== 'string') {
      console.warn(`Translation missing for key: ${keyPath}`)
      return keyPath
    }
    
    // Replace parameters
    if (params) {
      return this.replaceParams(value, params)
    }
    
    return value
  }

  /**
   * Get available languages
   */
  getAvailableLanguages(): Array<{ code: SupportedLanguage; name: string; flag: string }> {
    return [
      { code: 'en', name: 'English', flag: '🇺🇸' },
      { code: 'zh-TW', name: '繁體中文', flag: '🇹🇼' },
      { code: 'zh-CN', name: '简体中文', flag: '🇨🇳' },
      { code: 'ja', name: '日本語', flag: '🇯🇵' },
      { code: 'hr', name: 'Herlean', flag: '🌙' }
    ]
  }

  /**
   * Load initial language from browser/storage
   */
  private loadInitialLanguage() {
    // Check localStorage first
    const stored = localStorage.getItem('night-god-language') as SupportedLanguage
    if (stored && this.isValidLanguage(stored)) {
      this.currentLanguage.value = stored
      return
    }
    
    // Check browser language
    const browserLang = navigator.language
    const supportedLang = this.detectLanguageFromBrowser(browserLang)
    this.currentLanguage.value = supportedLang
  }

  /**
   * Load all translations
   */
  private async loadTranslations() {
    try {
      // Load English (default)
      const { en } = await import('../locales/en')
      this.translations.value.en = en
      
      // Load current language if different
      const currentLang = this.currentLanguage.value
      if (currentLang !== 'en') {
        await this.loadLanguageTranslations(currentLang)
      }
      
    } catch (error) {
      console.error('Failed to load translations:', error)
    }
  }

  /**
   * Load specific language translations
   */
  private async loadLanguageTranslations(language: SupportedLanguage) {
    try {
      let translations: Translations
      
      switch (language) {
        case 'zh-TW':
          const zhTW = await import('../locales/zh-TW')
          translations = zhTW.zhTW
          break
        case 'zh-CN':
          const zhCN = await import('../locales/zh-CN')
          translations = zhCN.zhCN
          break
        case 'ja':
          const ja = await import('../locales/ja')
          translations = ja.ja
          break
        case 'hr':
          const hr = await import('../locales/hr')
          translations = hr.hr
          break
        default:
          const en = await import('../locales/en')
          translations = en.en
      }
      
      this.translations.value[language] = translations
      
    } catch (error) {
      console.error(`Failed to load ${language} translations:`, error)
      // Use fallback
      if (language !== this.fallbackLanguage) {
        await this.loadLanguageTranslations(this.fallbackLanguage)
      }
    }
  }

  /**
   * Detect language from browser
   */
  private detectLanguageFromBrowser(browserLang: string): SupportedLanguage {
    const langMap: Record<string, SupportedLanguage> = {
      'zh-TW': 'zh-TW',
      'zh-HK': 'zh-TW',
      'zh-MO': 'zh-TW',
      'zh-CN': 'zh-CN',
      'zh': 'zh-CN',
      'ja': 'ja',
      'ja-JP': 'ja',
      'en': 'en',
      'en-US': 'en',
      'en-GB': 'en'
    }
    
    // Check exact match first
    if (langMap[browserLang]) {
      return langMap[browserLang]
    }
    
    // Check language part only
    const langPart = browserLang.split('-')[0]
    if (langMap[langPart]) {
      return langMap[langPart]
    }
    
    return this.fallbackLanguage
  }

  /**
   * Validate language code
   */
  private isValidLanguage(lang: string): lang is SupportedLanguage {
    return ['en', 'zh-TW', 'zh-CN', 'ja', 'hr'].includes(lang)
  }

  /**
   * Replace parameters in translation string
   */
  private replaceParams(text: string, params: Record<string, any>): string {
    return text.replace(/\{(\w+)\}/g, (match, key) => {
      return params[key]?.toString() || match
    })
  }

  /**
   * Get HTML language attribute
   */
  private getHtmlLang(language: SupportedLanguage): string {
    const htmlLangMap: Record<SupportedLanguage, string> = {
      'en': 'en',
      'zh-TW': 'zh-Hant',
      'zh-CN': 'zh-Hans', 
      'ja': 'ja',
      'hr': 'hr'
    }
    
    return htmlLangMap[language] || 'en'
  }
}

// Create and export singleton instance
export const i18nService = new I18nService()

// Export composable for Vue components
export function useI18n() {
  return {
    language: i18nService.language,
    t: i18nService.t,
    translate: (key: string, params?: Record<string, any>) => i18nService.translate(key, params),
    setLanguage: (lang: SupportedLanguage) => i18nService.setLanguage(lang),
    getAvailableLanguages: () => i18nService.getAvailableLanguages()
  }
}