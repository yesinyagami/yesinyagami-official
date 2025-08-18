<!--
  Hidden Admin Portal - Night God Tarot
  Extremely subtle access point for admin authentication
  Triple-click moon icon in bottom-left corner to access
-->

<template>
  <div class="hidden-admin-portal">
    <!-- Ultra-subtle admin trigger - barely visible moon icon -->
    <div 
      class="admin-trigger"
      @click="handleTriggerClick"
      @dblclick="showLoginModal = true"
      title=""
    >
      <!-- Tiny, almost invisible moon icon -->
      <svg 
        width="10" 
        height="10" 
        viewBox="0 0 24 24" 
        fill="none"
        class="moon-icon"
      >
        <path 
          d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" 
          stroke="currentColor" 
          stroke-width="1"
          fill="none"
        />
      </svg>
    </div>
    
    <!-- Admin Login Modal (Hidden by default) -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="showLoginModal" class="admin-modal-overlay" @click.self="closeModal">
          <div class="admin-login-panel">
            <button class="close-btn" @click="closeModal">×</button>
            
            <div class="admin-header">
              <div class="admin-logo">🌙</div>
              <h3>Night God Tarot</h3>
              <p>System Access Portal</p>
            </div>
            
            <form @submit.prevent="handleAdminLogin" class="admin-form">
              <div class="form-group">
                <label>Administrator Email</label>
                <input
                  v-model="credentials.email"
                  type="email"
                  placeholder="admin@nightgodtarot.com"
                  required
                  autocomplete="username"
                  :disabled="isLoading"
                />
              </div>
              
              <div class="form-group">
                <label>Secure Password</label>
                <input
                  v-model="credentials.password"
                  type="password"
                  placeholder="Enter admin password"
                  required
                  autocomplete="current-password"
                  :disabled="isLoading"
                />
              </div>
              
              <div class="form-group">
                <label class="remember-me">
                  <input v-model="rememberMe" type="checkbox" :disabled="isLoading" />
                  <span>Remember this device (30 days)</span>
                </label>
              </div>
              
              <div class="form-group biometric-section">
                <div class="biometric-option">
                  <label class="biometric-label">
                    <input v-model="enableBiometric" type="checkbox" :disabled="isLoading" />
                    <span>🔐 Enable Biometric Authentication</span>
                  </label>
                  <small>Simulate fingerprint/face recognition for enhanced security</small>
                </div>
                
                <div v-if="enableBiometric" class="biometric-scanner">
                  <div class="scanner-animation" :class="{ active: isBiometricScanning }">
                    <div class="scanner-pulse"></div>
                    <div class="scanner-icon">👁️</div>
                  </div>
                  <p class="scanner-text">{{ biometricText }}</p>
                </div>
              </div>
              
              <button type="submit" class="login-btn" :disabled="isLoading || isBiometricScanning">
                <span v-if="isLoading" class="loading-spinner"></span>
                {{ isLoading ? 'Authenticating...' : 'Access Dashboard' }}
              </button>
              
              <div v-if="error" class="error-message">
                <span class="error-icon">⚠️</span>
                {{ error }}
              </div>
              
              <div class="security-notice">
                <small>🔐 All admin access is logged and monitored</small>
              </div>
            </form>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAdminStore } from '@/stores/adminStore'

const router = useRouter()
const adminStore = useAdminStore()

const showLoginModal = ref(false)
const isLoading = ref(false)
const error = ref('')
const clickCount = ref(0)
const rememberMe = ref(false)
const enableBiometric = ref(false)
const isBiometricScanning = ref(false)
const biometricText = ref('Place finger on sensor or look at camera')

const credentials = ref({
  email: '',
  password: ''
})

// Secret access pattern: Triple-click within 2 seconds
function handleTriggerClick() {
  clickCount.value++
  
  if (clickCount.value === 1) {
    setTimeout(() => {
      clickCount.value = 0
    }, 2000)
  }
  
  if (clickCount.value >= 3) {
    showLoginModal.value = true
    clickCount.value = 0
    
    // Pre-fill email from environment variable in development only
    if (!credentials.value.email && import.meta.env.DEV) {
      credentials.value.email = import.meta.env.VITE_SUPER_ADMIN_EMAIL || ''
    }
  }
}

async function handleAdminLogin() {
  isLoading.value = true
  error.value = ''
  
  try {
    // First, standard authentication
    await adminStore.login({
      email: credentials.value.email,
      password: credentials.value.password,
      rememberMe: rememberMe.value
    })
    
    // If biometric is enabled, perform biometric authentication
    if (enableBiometric.value) {
      isBiometricScanning.value = true
      biometricText.value = 'Scanning biometric data...'
      
      const biometricSuccess = await adminStore.simulateBiometricAuth()
      
      if (!biometricSuccess) {
        isBiometricScanning.value = false
        biometricText.value = 'Biometric authentication failed'
        throw new Error('Biometric authentication failed. Please try again.')
      }
      
      biometricText.value = 'Biometric authentication successful!'
      setTimeout(() => {
        isBiometricScanning.value = false
      }, 1000)
    }
    
    // Add audit log for successful login
    await adminStore.addAuditLog('admin_login', {
      email: credentials.value.email,
      biometric: enableBiometric.value,
      timestamp: new Date()
    }, 'medium')
    
    // Start real-time updates
    adminStore.startRealtimeUpdates()
    
    // Redirect to admin dashboard
    router.push('/admin/dashboard')
    showLoginModal.value = false
    
    // Clear credentials
    credentials.value = { email: '', password: '' }
    
    // Show success message
    adminStore.addSecurityAlert('info', 'Admin login successful', 2)
    
  } catch (err: any) {
    error.value = err.message || 'Invalid credentials. Access denied.'
    
    // Add audit log for failed login
    await adminStore.addAuditLog('admin_login_failed', {
      email: credentials.value.email,
      error: err.message,
      timestamp: new Date()
    }, 'high')
    
    // Add security alert
    adminStore.addSecurityAlert('error', `Failed login attempt: ${err.message}`, 7)
    
    // Security delay on failed attempts
    setTimeout(() => {
      error.value = ''
      isBiometricScanning.value = false
      biometricText.value = 'Place finger on sensor or look at camera'
    }, 3000)
  } finally {
    isLoading.value = false
  }
}

function closeModal() {
  showLoginModal.value = false
  credentials.value = { email: '', password: '' }
  error.value = ''
  isLoading.value = false
}

// Pre-fill email for demo purposes (only in development)
function quickFillDemo() {
  if (import.meta.env.DEV) {
    credentials.value.email = import.meta.env.VITE_SUPER_ADMIN_EMAIL || ''
    credentials.value.password = import.meta.env.VITE_SUPER_ADMIN_PASSWORD || ''
  }
}

// Keyboard shortcut for emergency access (Ctrl+Shift+A)
document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.shiftKey && e.key === 'A') {
    showLoginModal.value = true
    quickFillDemo()
  }
})
</script>

<style scoped>
/* Ultra-subtle admin trigger */
.admin-trigger {
  position: fixed;
  bottom: 5px;
  left: 5px;
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: default;
  z-index: 999;
  opacity: 0.25;
  transition: opacity 0.3s ease;
  color: #4a4a4a;
}

.admin-trigger:hover {
  opacity: 0.3;
}

.moon-icon {
  pointer-events: none;
  filter: blur(0.5px);
}

/* Admin Modal Overlay */
.admin-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  animation: overlayAppear 0.3s ease;
}

@keyframes overlayAppear {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Admin Login Panel */
.admin-login-panel {
  background: linear-gradient(145deg, #1a1a2e 0%, #16213e 100%);
  padding: 2.5rem;
  border-radius: 16px;
  width: 90%;
  max-width: 420px;
  box-shadow: 
    0 25px 80px rgba(0, 0, 0, 0.6),
    0 0 0 1px rgba(107, 70, 193, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
  position: relative;
  animation: panelSlideIn 0.4s ease;
}

@keyframes panelSlideIn {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.admin-header {
  text-align: center;
  margin-bottom: 2rem;
}

.admin-logo {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  filter: drop-shadow(0 2px 4px rgba(107, 70, 193, 0.3));
}

.admin-header h3 {
  color: #fff;
  margin: 0 0 0.5rem 0;
  font-weight: 300;
  font-size: 1.5rem;
}

.admin-header p {
  color: #a0a0a0;
  margin: 0;
  font-size: 0.9rem;
}

/* Form Styles */
.admin-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  color: #c0c0c0;
  font-size: 0.9rem;
  font-weight: 500;
}

.form-group input[type="email"],
.form-group input[type="password"] {
  width: 100%;
  padding: 14px 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  color: #fff;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.form-group input:focus {
  outline: none;
  border-color: rgba(107, 70, 193, 0.5);
  background: rgba(255, 255, 255, 0.08);
  box-shadow: 0 0 0 3px rgba(107, 70, 193, 0.1);
}

.form-group input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Remember Me Checkbox */
.remember-me {
  display: flex;
  align-items: center;
  color: #a0a0a0;
  font-size: 0.9rem;
  cursor: pointer;
  user-select: none;
}

.remember-me input {
  margin-right: 10px;
  accent-color: #667eea;
}

/* Login Button */
.login-btn {
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  position: relative;
  overflow: hidden;
}

.login-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}

.login-btn:active:not(:disabled) {
  transform: translateY(0);
}

.login-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* Loading Spinner */
.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid #fff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Error Message */
.error-message {
  color: #ff6b6b;
  text-align: center;
  font-size: 0.9rem;
  padding: 12px;
  background: rgba(255, 107, 107, 0.1);
  border: 1px solid rgba(255, 107, 107, 0.2);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.error-icon {
  font-size: 1rem;
}

/* Security Notice */
.security-notice {
  text-align: center;
  margin-top: 1rem;
}

.security-notice small {
  color: #888;
  font-size: 0.8rem;
}

/* Close Button */
.close-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  background: none;
  border: none;
  color: #aaa;
  font-size: 24px;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.3s ease;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.close-btn:hover {
  opacity: 1;
  background: rgba(255, 255, 255, 0.05);
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Biometric Scanner Styles */
.biometric-section {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 1rem;
  margin-top: 1rem;
}

.biometric-option {
  margin-bottom: 1rem;
}

.biometric-label {
  display: flex;
  align-items: center;
  color: #c0c0c0;
  font-size: 0.9rem;
  cursor: pointer;
  margin-bottom: 0.5rem;
}

.biometric-label input {
  margin-right: 10px;
  accent-color: #667eea;
}

.biometric-label small {
  display: block;
  color: #888;
  font-size: 0.8rem;
  margin-top: 0.25rem;
}

.biometric-scanner {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.5rem;
  background: rgba(102, 126, 234, 0.1);
  border: 1px solid rgba(102, 126, 234, 0.3);
  border-radius: 12px;
  margin-top: 1rem;
}

.scanner-animation {
  position: relative;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
}

.scanner-pulse {
  position: absolute;
  width: 100%;
  height: 100%;
  border: 2px solid #667eea;
  border-radius: 50%;
  opacity: 0.6;
  animation: pulse 2s infinite;
}

.scanner-animation.active .scanner-pulse {
  animation: activePulse 1s infinite;
}

.scanner-icon {
  font-size: 2rem;
  z-index: 1;
  filter: drop-shadow(0 0 10px rgba(102, 126, 234, 0.5));
}

.scanner-text {
  color: #c0c0c0;
  font-size: 0.9rem;
  text-align: center;
  margin: 0;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 0.6;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.3;
  }
  100% {
    transform: scale(1);
    opacity: 0.6;
  }
}

@keyframes activePulse {
  0% {
    transform: scale(1);
    opacity: 1;
    border-color: #4ade80;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.7;
    border-color: #667eea;
  }
  100% {
    transform: scale(1);
    opacity: 1;
    border-color: #4ade80;
  }
}

/* Responsive Design */
@media (max-width: 480px) {
  .admin-login-panel {
    margin: 1rem;
    padding: 2rem;
  }
  
  .admin-header h3 {
    font-size: 1.3rem;
  }
  
  .form-group input {
    padding: 12px 14px;
  }
  
  .login-btn {
    padding: 14px;
  }
  
  .scanner-animation {
    width: 60px;
    height: 60px;
  }
  
  .scanner-icon {
    font-size: 1.5rem;
  }
}
</style>