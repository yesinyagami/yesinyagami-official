/**
 * Admin Store - Secure Admin Authentication & State Management
 * Night God Tarot Admin System
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { secureApi } from '../services/api/secureApi'

interface AdminUser {
  email: string
  role: 'super_admin' | 'admin' | 'moderator'
  permissions: {
    viewAnalytics: boolean
    manageUsers: boolean
    managePayments: boolean
    editContent: boolean
    systemSettings: boolean
    aiConfiguration: boolean
    deleteData: boolean
    emergencyAccess: boolean
    auditLogs: boolean
    systemRestore: boolean
  }
  lastLogin?: Date
  loginCount: number
  securityLevel: 'standard' | 'enhanced' | 'maximum'
  twoFactorEnabled: boolean
  biometricEnabled: boolean
  sessionHistory: Array<{
    timestamp: Date
    ip: string
    userAgent: string
    location?: string
    success: boolean
  }>
}

interface AdminMetrics {
  todayRevenue: number
  revenueChange: number
  activeUsers: number
  userChange: number
  readingsToday: number
  avgPrice: number
  totalUsers: number
  totalReadings: number
  systemHealth: number
  securityThreats: number
  aiPerformance: number
  predictedRevenue: number
  userSatisfaction: number
  conversionRate: number
  errorRate: number
  responseTime: number
}

export const useAdminStore = defineStore('admin', () => {
  // State
  const token = ref<string | null>(localStorage.getItem('admin_token'))
  const adminData = ref<AdminUser | null>(null)
  const metrics = ref<AdminMetrics>({
    todayRevenue: 0,
    revenueChange: 0,
    activeUsers: 0,
    userChange: 0,
    readingsToday: 0,
    avgPrice: 0,
    totalUsers: 0,
    totalReadings: 0,
    systemHealth: 98.7,
    securityThreats: 0,
    aiPerformance: 99.2,
    predictedRevenue: 0,
    userSatisfaction: 94.8,
    conversionRate: 23.4,
    errorRate: 0.03,
    responseTime: 1.2
  })
  const apiStatus = ref({
    monica: 'online',
    perplexity: 'online',
    gemini: 'online',
    chatgpt: 'online'
  })

  // Computed
  const isAuthenticated = computed(() => !!token.value && !!adminData.value)
  const isSuperAdmin = computed(() => adminData.value?.email === SUPER_ADMIN_EMAIL)
  
  // Security Configuration - Use environment variables for production
  const ALLOWED_IPS = import.meta.env.VITE_ADMIN_ALLOWED_IPS?.split(',') || ['127.0.0.1']
  const SUPER_ADMIN_EMAIL = import.meta.env.VITE_SUPER_ADMIN_EMAIL || 'admin@example.com'

  // Get user's IP address
  async function getUserIP(): Promise<string> {
    try {
      const response = await fetch('https://ipinfo.io/ip')
      return await response.text()
    } catch {
      return 'unknown'
    }
  }

  // Actions
  async function login(credentials: { email: string; password: string; rememberMe?: boolean; biometric?: boolean }) {
    try {
      // Use secure backend API for authentication
      const response = await secureApi.adminLogin(credentials)
      
      if (response.success) {
        token.value = response.token
        adminData.value = response.admin
        
        // Load initial metrics from backend
        await loadMetrics()
        
        await addAuditLog('admin_login_success', 'Admin logged in successfully')
        
        return response
      } else {
        throw new Error(response.message || 'Authentication failed')
      }
    } catch (error: any) {
      console.error('Admin login failed:', error)
      await addAuditLog('admin_login_failed', error.message, 'high')
      throw error
    }
  }

  async function loadMetrics() {
    try {
      // Load metrics from secure backend
      const backendMetrics = await secureApi.getAdminMetrics()
      metrics.value = { ...metrics.value, ...backendMetrics }
      
      // Update API status checks
      updateApiStatus()
    } catch (error) {
      console.error('Failed to load metrics:', error)
      // Fall back to previous values on error
    }
  }

  function updateApiStatus() {
    // Simulate real-time API status monitoring
    
    // Monica is always online (unlimited)
    apiStatus.value.monica = 'online'
    
    // Other services have random status for demo
    apiStatus.value.perplexity = Math.random() > 0.1 ? 'online' : 'warning'
    apiStatus.value.gemini = Math.random() > 0.05 ? 'online' : 'warning'
    apiStatus.value.chatgpt = Math.random() > 0.08 ? 'online' : 'warning'
  }

  function logout() {
    addAuditLog('admin_logout', 'Admin logged out').catch(console.error)
    secureApi.logout()
    token.value = null
    adminData.value = null
    stopRealtimeUpdates()
  }

  function setAdminToken(newToken: string) {
    token.value = newToken
  }

  function setAdminData(data: AdminUser) {
    adminData.value = data
  }

  // Auto-restore session
  function restoreSession() {
    const storedToken = localStorage.getItem('admin_token') || sessionStorage.getItem('admin_token')
    const storedData = localStorage.getItem('admin_data') || sessionStorage.getItem('admin_data')
    
    if (storedToken && storedData) {
      try {
        token.value = storedToken
        adminData.value = JSON.parse(storedData)
        loadMetrics()
      } catch (error) {
        console.error('Failed to restore admin session:', error)
        logout()
      }
    }
  }

  // Initialize store
  restoreSession()

  // Advanced Security Features
  const securityAlerts = ref<Array<{
    id: string
    type: 'warning' | 'error' | 'info'
    message: string
    timestamp: Date
    severity: number
  }>>([])

  const auditLog = ref<Array<{
    id: string
    action: string
    user: string
    ip: string
    timestamp: Date
    details: any
    risk: 'low' | 'medium' | 'high'
  }>>([])

  // Biometric simulation
  async function simulateBiometricAuth(): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate biometric authentication with 95% success rate
        const success = Math.random() > 0.05
        if (success) {
          addAuditLog('biometric_auth_success', 'Biometric authentication successful').catch(console.error)
        } else {
          addSecurityAlert('error', 'Biometric authentication failed', 8)
        }
        resolve(success)
      }, 2000)
    })
  }

  // Security monitoring
  function addSecurityAlert(type: 'warning' | 'error' | 'info', message: string, severity: number = 5) {
    securityAlerts.value.unshift({
      id: `alert_${Date.now()}`,
      type,
      message,
      timestamp: new Date(),
      severity
    })
    
    // Keep only last 50 alerts
    if (securityAlerts.value.length > 50) {
      securityAlerts.value = securityAlerts.value.slice(0, 50)
    }
  }

  async function addAuditLog(action: string, details: any, risk: 'low' | 'medium' | 'high' = 'low') {
    const userIP = await getUserIP()
    auditLog.value.unshift({
      id: `audit_${Date.now()}`,
      action,
      user: adminData.value?.email || 'unknown',
      ip: userIP,
      timestamp: new Date(),
      details,
      risk
    })
    
    // Keep only last 100 audit entries
    if (auditLog.value.length > 100) {
      auditLog.value = auditLog.value.slice(0, 100)
    }
  }

  // Advanced threat detection
  function detectSecurityThreats() {
    const threats: Array<{
      type: string
      severity: 'low' | 'medium' | 'high'
      details: string
    }> = []
    
    // Simulate threat detection
    if (Math.random() > 0.95) {
      threats.push({
        type: 'suspicious_login_attempt',
        severity: 'medium',
        details: 'Multiple failed login attempts detected'
      })
    }
    
    if (Math.random() > 0.98) {
      threats.push({
        type: 'unusual_traffic_pattern',
        severity: 'low',
        details: 'Unusual traffic pattern detected'
      })
    }
    
    metrics.value.securityThreats = threats.length
    
    threats.forEach(threat => {
      addSecurityAlert('warning', threat.details, threat.severity === 'high' ? 9 : threat.severity === 'medium' ? 6 : 3)
    })
  }

  // Predictive analytics
  function calculatePredictiveMetrics() {
    // Simulate AI-powered predictions
    const currentRevenue = metrics.value.todayRevenue
    const growthRate = metrics.value.revenueChange / 100
    metrics.value.predictedRevenue = Math.round(currentRevenue * (1 + growthRate) * 30)
    
    // Performance predictions
    metrics.value.aiPerformance = Math.max(95, Math.min(100, 
      metrics.value.aiPerformance + (Math.random() - 0.5) * 2
    ))
    
    metrics.value.systemHealth = Math.max(95, Math.min(100,
      metrics.value.systemHealth + (Math.random() - 0.5) * 1
    ))
  }

  // Start real-time updates if authenticated
  let updateInterval: number | null = null
  let securityInterval: number | null = null
  
  function startRealtimeUpdates() {
    if (updateInterval) clearInterval(updateInterval)
    if (securityInterval) clearInterval(securityInterval)
    
    updateInterval = setInterval(() => {
      if (isAuthenticated.value) {
        loadMetrics()
        calculatePredictiveMetrics()
      }
    }, 15000) // Update every 15 seconds for more responsive feel
    
    securityInterval = setInterval(() => {
      if (isAuthenticated.value) {
        detectSecurityThreats()
        updateApiStatus()
      }
    }, 30000) // Security checks every 30 seconds
  }

  function stopRealtimeUpdates() {
    if (updateInterval) {
      clearInterval(updateInterval)
      updateInterval = null
    }
    if (securityInterval) {
      clearInterval(securityInterval)
      securityInterval = null
    }
  }

  return {
    // State
    token,
    adminData,
    metrics,
    apiStatus,
    securityAlerts,
    auditLog,
    
    // Computed
    isAuthenticated,
    isSuperAdmin,
    
    // Actions
    login,
    logout,
    loadMetrics,
    setAdminToken,
    setAdminData,
    startRealtimeUpdates,
    stopRealtimeUpdates,
    updateApiStatus,
    
    // Advanced Security
    simulateBiometricAuth,
    addSecurityAlert,
    addAuditLog,
    detectSecurityThreats,
    calculatePredictiveMetrics
  }
})