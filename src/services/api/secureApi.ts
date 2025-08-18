/**
 * Secure API Service - Enterprise Backend Integration
 * Top-tier engineering implementation with security best practices
 */

import axios from 'axios'

class SecureApiService {
  private api: any
  private baseURL: string
  private token: string | null = null

  constructor() {
    this.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'
    
    this.api = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true
    })

    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        if (this.token) {
          config.headers.Authorization = `Bearer ${this.token}`
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    // Response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          this.clearToken()
          // Redirect to login or show auth error
        }
        return Promise.reject(error)
      }
    )

    // Load token from localStorage
    this.loadToken()
  }

  private loadToken(): void {
    const stored = localStorage.getItem('admin_token') || sessionStorage.getItem('admin_token')
    if (stored) {
      this.token = stored
    }
  }

  private saveToken(token: string, remember: boolean = false): void {
    this.token = token
    if (remember) {
      localStorage.setItem('admin_token', token)
    } else {
      sessionStorage.setItem('admin_token', token)
    }
  }

  private clearToken(): void {
    this.token = null
    localStorage.removeItem('admin_token')
    sessionStorage.removeItem('admin_token')
  }

  // Admin Authentication
  async adminLogin(credentials: {
    email: string
    password: string
    rememberMe?: boolean
    biometric?: boolean
  }): Promise<{
    success: boolean
    token: string
    admin: any
    message: string
  }> {
    try {
      const response = await this.api.post('/admin/auth/login', credentials)
      
      if (response.data.success) {
        this.saveToken(response.data.token, credentials.rememberMe)
        return response.data
      }
      
      throw new Error(response.data.message || 'Login failed')
    } catch (error: any) {
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error)
      }
      throw new Error('Network error - please check your connection')
    }
  }

  // Get Admin Metrics
  async getAdminMetrics(): Promise<any> {
    try {
      const response = await this.api.get('/admin/metrics')
      return response.data
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new Error('Authentication required')
      }
      throw new Error('Failed to load metrics')
    }
  }

  // Get Audit Logs
  async getAuditLogs(page: number = 1, limit: number = 50): Promise<{
    logs: any[]
    total: number
    page: number
    pages: number
  }> {
    try {
      const response = await this.api.get('/admin/audit-logs', {
        params: { page, limit }
      })
      return response.data
    } catch (error: any) {
      throw new Error('Failed to load audit logs')
    }
  }

  // Health Check
  async healthCheck(): Promise<{
    status: string
    timestamp: string
    uptime: number
    memory: any
    environment: string
  }> {
    try {
      const response = await this.api.get('/health')
      return response.data
    } catch (error: any) {
      throw new Error('Health check failed')
    }
  }

  // Admin Logout
  logout(): void {
    this.clearToken()
  }

  // Get current token
  getToken(): string | null {
    return this.token
  }

  // Check if authenticated
  isAuthenticated(): boolean {
    return !!this.token
  }

  // IP Validation Check
  async validateIP(): Promise<{ valid: boolean; ip: string; message?: string }> {
    try {
      const ipResponse = await fetch('https://ipinfo.io/ip')
      const ip = await ipResponse.text()
      
      const allowedIPs = import.meta.env.VITE_ADMIN_ALLOWED_IPS?.split(',') || ['127.0.0.1']
      const currentIP = ip.trim()
      const isValid = allowedIPs.includes(currentIP)
      
      return {
        valid: isValid,
        ip: currentIP,
        message: !isValid ? 'Access denied from unauthorized IP' : undefined
      }
    } catch (error) {
      return {
        valid: false,
        ip: 'unknown',
        message: 'Unable to validate IP address'
      }
    }
  }
}

// Export singleton instance
export const secureApi = new SecureApiService()
export default secureApi