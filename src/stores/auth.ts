import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

const API_BASE = '/api'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref<string | null>(null)
  const isAuthenticated = ref(false)
  const isAdmin = ref(false)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const api = axios.create({
    baseURL: API_BASE,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    }
  })

  // Request interceptor
  api.interceptors.request.use((config) => {
    if (token.value) {
      config.headers.Authorization = `Bearer ${token.value}`
    }
    return config
  })

  // Response interceptor
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        logout()
      }
      return Promise.reject(error)
    }
  )

  const initializeAuth = () => {
    const savedToken = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')
    if (savedToken) {
      token.value = savedToken
      isAuthenticated.value = true
      // Could add token validation here
    }
  }

  const login = async (credentials: { email: string; password: string; rememberMe?: boolean }) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.post('/auth/login', credentials)
      
      if (response.data.token) {
        token.value = response.data.token
        user.value = response.data.user
        isAuthenticated.value = true
        isAdmin.value = response.data.user?.isAdmin || false
        
        // Save token
        if (credentials.rememberMe) {
          localStorage.setItem('auth_token', response.data.token)
        } else {
          sessionStorage.setItem('auth_token', response.data.token)
        }
        
        return true
      }
      
      throw new Error(response.data.error || 'Login failed')
    } catch (err: any) {
      error.value = err.response?.data?.error || err.message || 'Login failed'
      return false
    } finally {
      loading.value = false
    }
  }

  const register = async (credentials: { email: string; password: string }) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.post('/auth/register', credentials)
      
      if (response.data.token) {
        token.value = response.data.token
        user.value = response.data.user
        isAuthenticated.value = true
        sessionStorage.setItem('auth_token', response.data.token)
        return true
      }
      
      throw new Error(response.data.error || 'Registration failed')
    } catch (err: any) {
      error.value = err.response?.data?.error || err.message || 'Registration failed'
      return false
    } finally {
      loading.value = false
    }
  }

  const adminLogin = async (credentials: { email: string; password: string }) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.post('/auth/admin-login', credentials)
      
      if (response.data.token) {
        token.value = response.data.token
        user.value = response.data.user
        isAuthenticated.value = true
        isAdmin.value = true
        sessionStorage.setItem('auth_token', response.data.token)
        return true
      }
      
      throw new Error(response.data.error || 'Admin login failed')
    } catch (err: any) {
      error.value = err.response?.data?.error || err.message || 'Admin login failed'
      return false
    } finally {
      loading.value = false
    }
  }

  const logout = () => {
    token.value = null
    user.value = null
    isAuthenticated.value = false
    isAdmin.value = false
    localStorage.removeItem('auth_token')
    sessionStorage.removeItem('auth_token')
  }

  return {
    user,
    token,
    isAuthenticated,
    isAdmin,
    loading,
    error,
    initializeAuth,
    login,
    register,
    adminLogin,
    logout,
    api
  }
})