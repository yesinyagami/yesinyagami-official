<!--
  System Settings Component (Super Admin Only)
  Critical system configuration and emergency controls
-->

<template>
  <div class="system-settings">
    <div class="section-header">
      <h2>⚙️ System Settings</h2>
      <div class="super-admin-badge">
        <span>🔒 SUPER ADMIN ONLY</span>
      </div>
    </div>
    
    <!-- Security Warning -->
    <div class="security-warning">
      <div class="warning-icon">⚠️</div>
      <div class="warning-content">
        <h3>Critical System Configuration</h3>
        <p>These settings affect core system functionality. Unauthorized changes may disrupt service.</p>
        <p><strong>IP Restriction:</strong> Only {{ authorizedIP }} can access this panel.</p>
      </div>
    </div>
    
    <!-- System Status -->
    <div class="system-status-section">
      <h3>System Status</h3>
      <div class="status-grid">
        <div class="status-card">
          <div class="status-header">
            <span class="status-icon">🖥️</span>
            <span class="status-title">Application</span>
            <span :class="['status-indicator', appStatus]"></span>
          </div>
          <div class="status-details">
            <div class="detail-row">
              <span>Uptime:</span>
              <span>{{ systemUptime }}</span>
            </div>
            <div class="detail-row">
              <span>Version:</span>
              <span>v1.0.0</span>
            </div>
            <div class="detail-row">
              <span>Environment:</span>
              <span>{{ environment }}</span>
            </div>
          </div>
        </div>
        
        <div class="status-card">
          <div class="status-header">
            <span class="status-icon">📊</span>
            <span class="status-title">Database</span>
            <span :class="['status-indicator', dbStatus]"></span>
          </div>
          <div class="status-details">
            <div class="detail-row">
              <span>Users:</span>
              <span>{{ dbStats.users }}</span>
            </div>
            <div class="detail-row">
              <span>Readings:</span>
              <span>{{ dbStats.readings }}</span>
            </div>
            <div class="detail-row">
              <span>Transactions:</span>
              <span>{{ dbStats.transactions }}</span>
            </div>
          </div>
        </div>
        
        <div class="status-card">
          <div class="status-header">
            <span class="status-icon">🔒</span>
            <span class="status-title">Security</span>
            <span :class="['status-indicator', securityStatus]"></span>
          </div>
          <div class="status-details">
            <div class="detail-row">
              <span>Failed Logins:</span>
              <span>{{ securityStats.failedLogins }}</span>
            </div>
            <div class="detail-row">
              <span>Blocked IPs:</span>
              <span>{{ securityStats.blockedIPs }}</span>
            </div>
            <div class="detail-row">
              <span>SSL Status:</span>
              <span class="ssl-status">Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Emergency Controls -->
    <div class="emergency-section">
      <h3>😨 Emergency Controls</h3>
      <div class="emergency-grid">
        <div class="emergency-card critical">
          <div class="emergency-header">
            <span class="emergency-icon">🚑</span>
            <h4>Maintenance Mode</h4>
          </div>
          <p>Enable maintenance mode to block all public access</p>
          <button @click="toggleMaintenanceMode" :class="['emergency-btn', { active: maintenanceMode }]">
            {{ maintenanceMode ? 'Disable' : 'Enable' }} Maintenance
          </button>
        </div>
        
        <div class="emergency-card warning">
          <div class="emergency-header">
            <span class="emergency-icon">📊</span>
            <h4>System Backup</h4>
          </div>
          <p>Create full system backup including database and configurations</p>
          <button @click="createBackup" class="emergency-btn">
            Create Backup
          </button>
        </div>
        
        <div class="emergency-card danger">
          <div class="emergency-header">
            <span class="emergency-icon">🗑️</span>
            <h4>Clear Cache</h4>
          </div>
          <p>Clear all system caches and temporary data</p>
          <button @click="clearSystemCache" class="emergency-btn">
            Clear Cache
          </button>
        </div>
        
        <div class="emergency-card critical">
          <div class="emergency-header">
            <span class="emergency-icon">🔄</span>
            <h4>System Restart</h4>
          </div>
          <p>Restart application services (causes brief downtime)</p>
          <button @click="restartSystem" class="emergency-btn">
            Restart System
          </button>
        </div>
        
        <div class="emergency-card disaster">
          <div class="emergency-header">
            <span class="emergency-icon">🚁</span>
            <h4>Disaster Recovery</h4>
          </div>
          <p>Full system restore from latest backup with rollback capability</p>
          <button @click="initiateDisasterRecovery" class="emergency-btn">
            Disaster Recovery
          </button>
        </div>
        
        <div class="emergency-card advanced">
          <div class="emergency-header">
            <span class="emergency-icon">🔒</span>
            <h4>Lockdown Mode</h4>
          </div>
          <p>Complete system lockdown - emergency only access</p>
          <button @click="enableLockdown" class="emergency-btn">
            Enable Lockdown
          </button>
        </div>
        
        <div class="emergency-card forensics">
          <div class="emergency-header">
            <span class="emergency-icon">🕵️</span>
            <h4>Security Forensics</h4>
          </div>
          <p>Generate detailed security audit and forensic report</p>
          <button @click="generateForensicsReport" class="emergency-btn">
            Generate Report
          </button>
        </div>
        
        <div class="emergency-card ai-override">
          <div class="emergency-header">
            <span class="emergency-icon">🤖</span>
            <h4>AI Override</h4>
          </div>
          <p>Take manual control of all AI services and responses</p>
          <button @click="activateAIOverride" class="emergency-btn">
            AI Override
          </button>
        </div>
      </div>
    </div>
    
    <!-- System Configuration -->
    <div class="config-section">
      <h3>🔧 System Configuration</h3>
      <div class="config-grid">
        <div class="config-group">
          <h4>Performance Settings</h4>
          <div class="setting-item">
            <label>Max Concurrent Users</label>
            <input v-model="config.maxUsers" type="number" class="setting-input" />
          </div>
          <div class="setting-item">
            <label>Request Rate Limit (per minute)</label>
            <input v-model="config.rateLimit" type="number" class="setting-input" />
          </div>
          <div class="setting-item">
            <label>Cache Duration (minutes)</label>
            <input v-model="config.cacheDuration" type="number" class="setting-input" />
          </div>
        </div>
        
        <div class="config-group">
          <h4>Security Settings</h4>
          <div class="setting-item">
            <label>Session Timeout (minutes)</label>
            <input v-model="config.sessionTimeout" type="number" class="setting-input" />
          </div>
          <div class="setting-item">
            <label>Password Policy</label>
            <select v-model="config.passwordPolicy" class="setting-select">
              <option value="basic">Basic (8+ chars)</option>
              <option value="strong">Strong (12+ chars, mixed)</option>
              <option value="enterprise">Enterprise (16+ chars, complex)</option>
            </select>
          </div>
          <div class="setting-item">
            <label class="checkbox-label">
              <input v-model="config.twoFactorRequired" type="checkbox" />
              <span>Require 2FA for Admin</span>
            </label>
          </div>
        </div>
        
        <div class="config-group">
          <h4>Payment Settings</h4>
          <div class="setting-item">
            <label>Default Currency</label>
            <select v-model="config.currency" class="setting-select">
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="TWD">TWD (NT$)</option>
            </select>
          </div>
          <div class="setting-item">
            <label>Payment Timeout (seconds)</label>
            <input v-model="config.paymentTimeout" type="number" class="setting-input" />
          </div>
          <div class="setting-item">
            <label class="checkbox-label">
              <input v-model="config.refundsEnabled" type="checkbox" />
              <span>Enable Refunds</span>
            </label>
          </div>
        </div>
      </div>
      
      <div class="config-actions">
        <button @click="saveConfiguration" class="btn primary">Save Configuration</button>
        <button @click="resetConfiguration" class="btn secondary">Reset to Defaults</button>
        <button @click="exportConfiguration" class="btn secondary">Export Config</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAdminStore } from '@/stores/adminStore'

const adminStore = useAdminStore()

// System status
const authorizedIP = ref('125.224.130.115')
const appStatus = ref('online')
const dbStatus = ref('online')
const securityStatus = ref('online')
const maintenanceMode = ref(false)
const systemUptime = ref('7 days, 14 hours')
const environment = ref('Production')

// Statistics
const dbStats = ref({
  users: 1247,
  readings: 5843,
  transactions: 892
})

const securityStats = ref({
  failedLogins: 3,
  blockedIPs: 0
})

// Configuration
const config = ref({
  maxUsers: 1000,
  rateLimit: 60,
  cacheDuration: 30,
  sessionTimeout: 120,
  passwordPolicy: 'strong',
  twoFactorRequired: true,
  currency: 'USD',
  paymentTimeout: 300,
  refundsEnabled: false
})

// Emergency functions
function toggleMaintenanceMode() {
  if (confirm(`${maintenanceMode.value ? 'Disable' : 'Enable'} maintenance mode?`)) {
    maintenanceMode.value = !maintenanceMode.value
    console.log(`Maintenance mode ${maintenanceMode.value ? 'enabled' : 'disabled'}`)
  }
}

function createBackup() {
  if (confirm('Create full system backup? This may take several minutes.')) {
    console.log('Creating system backup...')
    // Simulate backup process
    setTimeout(() => {
      console.log('Backup completed successfully')
    }, 3000)
  }
}

function clearSystemCache() {
  if (confirm('Clear all system caches? This may temporarily slow performance.')) {
    console.log('Clearing system cache...')
    // Simulate cache clearing
    setTimeout(() => {
      console.log('Cache cleared successfully')
    }, 1000)
  }
}

function restartSystem() {
  if (confirm('Restart system services? This will cause 2-3 minutes of downtime.')) {
    console.log('Restarting system...')
    adminStore.addAuditLog('system_restart', 'System restart initiated by super admin', 'high')
    // In real implementation, this would trigger a graceful restart
  }
}

function initiateDisasterRecovery() {
  if (confirm('Initiate disaster recovery? This will restore from the latest backup and may cause extended downtime.')) {
    console.log('Initiating disaster recovery protocol...')
    adminStore.addSecurityAlert('warning', 'Disaster recovery protocol initiated', 9)
    adminStore.addAuditLog('disaster_recovery', 'Disaster recovery initiated', 'high')
    
    // Simulate disaster recovery process
    setTimeout(() => {
      console.log('Disaster recovery completed successfully')
      adminStore.addSecurityAlert('info', 'System restored from backup successfully', 3)
    }, 5000)
  }
}

function enableLockdown() {
  if (confirm('Enable system lockdown? This will block ALL user access except emergency admin functions.')) {
    console.log('Enabling system lockdown...')
    adminStore.addSecurityAlert('error', 'SYSTEM LOCKDOWN ACTIVATED - Emergency access only', 10)
    adminStore.addAuditLog('system_lockdown', 'System lockdown activated', 'high')
    
    // Update system status
    maintenanceMode.value = true
    appStatus.value = 'lockdown'
  }
}

function generateForensicsReport() {
  console.log('Generating security forensics report...')
  adminStore.addAuditLog('forensics_report', 'Security forensics report generated', 'medium')
  
  // Generate comprehensive forensics data
  const forensicsData = {
    timestamp: new Date().toISOString(),
    systemHealth: {
      uptime: systemUptime.value,
      performance: metrics.value.aiPerformance,
      security: securityStats.value
    },
    securityAlerts: adminStore.securityAlerts.slice(0, 20),
    auditLog: adminStore.auditLog.slice(0, 50),
    systemConfiguration: config.value,
    threatAnalysis: {
      activeThreats: metrics.value.securityThreats,
      riskLevel: 'LOW',
      recommendations: [
        'Continue monitoring for unusual activity',
        'Regular security updates recommended',
        'Review access logs weekly'
      ]
    }
  }
  
  // Export forensics report
  const blob = new Blob([JSON.stringify(forensicsData, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `night-god-tarot-forensics-${new Date().toISOString().split('T')[0]}.json`
  a.click()
  URL.revokeObjectURL(url)
  
  adminStore.addSecurityAlert('info', 'Forensics report generated and downloaded', 4)
}

function activateAIOverride() {
  if (confirm('Activate AI override mode? This will disable all automatic AI responses and require manual approval.')) {
    console.log('Activating AI override mode...')
    adminStore.addSecurityAlert('warning', 'AI Override Mode activated - Manual control enabled', 7)
    adminStore.addAuditLog('ai_override', 'AI services placed under manual control', 'high')
    
    // Update API status to manual mode
    apiStatus.value.monica = 'manual'
    apiStatus.value.perplexity = 'manual'
    apiStatus.value.gemini = 'manual'
    apiStatus.value.chatgpt = 'manual'
  }
}

// Configuration functions
function saveConfiguration() {
  console.log('Saving system configuration:', config.value)
  // Save to backend
}

function resetConfiguration() {
  if (confirm('Reset all configuration to defaults?')) {
    config.value = {
      maxUsers: 1000,
      rateLimit: 60,
      cacheDuration: 30,
      sessionTimeout: 120,
      passwordPolicy: 'strong',
      twoFactorRequired: true,
      currency: 'USD',
      paymentTimeout: 300,
      refundsEnabled: false
    }
  }
}

function exportConfiguration() {
  const configData = {
    config: config.value,
    systemInfo: {
      uptime: systemUptime.value,
      environment: environment.value,
      authorizedIP: authorizedIP.value
    },
    exportDate: new Date().toISOString()
  }
  
  const blob = new Blob([JSON.stringify(configData, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `night-god-tarot-config-${new Date().toISOString().split('T')[0]}.json`
  a.click()
  URL.revokeObjectURL(url)
}

onMounted(() => {
  console.log('System Settings loaded - Super Admin access confirmed')
})
</script>

<style scoped>
.system-settings {
  padding: 0;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.section-header h2 {
  margin: 0;
  color: #e0e0e0;
  font-size: 1.5rem;
  font-weight: 500;
}

.super-admin-badge {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: #000;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.security-warning {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.warning-icon {
  font-size: 2rem;
  flex-shrink: 0;
}

.warning-content h3 {
  margin: 0 0 0.5rem 0;
  color: #f87171;
  font-size: 1.1rem;
  font-weight: 600;
}

.warning-content p {
  margin: 0 0 0.5rem 0;
  color: #fca5a5;
  font-size: 0.9rem;
  line-height: 1.5;
}

.system-status-section,
.emergency-section,
.config-section {
  margin-bottom: 2rem;
}

.system-status-section h3,
.emergency-section h3,
.config-section h3 {
  margin: 0 0 1.5rem 0;
  color: #e0e0e0;
  font-size: 1.25rem;
  font-weight: 500;
}

.status-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.status-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 1.5rem;
}

.status-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.status-icon {
  font-size: 1.5rem;
}

.status-title {
  flex: 1;
  color: #e0e0e0;
  font-weight: 600;
}

.status-indicator {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.status-indicator.online {
  background: #4ade80;
  box-shadow: 0 0 8px rgba(74, 222, 128, 0.4);
}

.status-indicator.warning {
  background: #f59e0b;
  box-shadow: 0 0 8px rgba(245, 158, 11, 0.4);
}

.status-indicator.offline {
  background: #ef4444;
  box-shadow: 0 0 8px rgba(239, 68, 68, 0.4);
}

.status-details {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.25rem 0;
}

.detail-row span:first-child {
  color: #a0a0a0;
  font-size: 0.9rem;
}

.detail-row span:last-child {
  color: #e0e0e0;
  font-weight: 500;
  font-size: 0.9rem;
}

.ssl-status {
  color: #4ade80 !important;
}

.emergency-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.emergency-card {
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
}

.emergency-card.critical {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.emergency-card.warning {
  background: rgba(245, 158, 11, 0.1);
  border: 1px solid rgba(245, 158, 11, 0.3);
}

.emergency-card.danger {
  background: rgba(168, 85, 247, 0.1);
  border: 1px solid rgba(168, 85, 247, 0.3);
}

.emergency-card.disaster {
  background: rgba(220, 38, 127, 0.1);
  border: 1px solid rgba(220, 38, 127, 0.3);
}

.emergency-card.advanced {
  background: rgba(15, 23, 42, 0.3);
  border: 1px solid rgba(148, 163, 184, 0.3);
}

.emergency-card.forensics {
  background: rgba(14, 165, 233, 0.1);
  border: 1px solid rgba(14, 165, 233, 0.3);
}

.emergency-card.ai-override {
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.3);
}

.emergency-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.emergency-icon {
  font-size: 2rem;
}

.emergency-header h4 {
  margin: 0;
  color: #e0e0e0;
  font-size: 1.1rem;
  font-weight: 600;
}

.emergency-card p {
  margin: 0 0 1.5rem 0;
  color: #a0a0a0;
  font-size: 0.9rem;
  line-height: 1.5;
}

.emergency-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #e0e0e0;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  width: 100%;
}

.emergency-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.emergency-btn.active {
  background: rgba(239, 68, 68, 0.3);
  border-color: rgba(239, 68, 68, 0.5);
  color: #f87171;
}

.config-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.config-group {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.config-group h4 {
  margin: 0 0 1.5rem 0;
  color: #e0e0e0;
  font-size: 1.1rem;
  font-weight: 600;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 0.5rem;
}

.setting-item {
  margin-bottom: 1.5rem;
}

.setting-item:last-child {
  margin-bottom: 0;
}

.setting-item label {
  display: block;
  color: #c0c0c0;
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.setting-input,
.setting-select {
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 0.75rem;
  color: #fff;
  font-size: 0.9rem;
  box-sizing: border-box;
}

.checkbox-label {
  display: flex !important;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.checkbox-label input {
  width: auto;
  margin: 0;
}

.config-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  flex-wrap: wrap;
}

.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn.primary {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: #fff;
}

.btn.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}

.btn.secondary {
  background: rgba(255, 255, 255, 0.1);
  color: #e0e0e0;
}

.btn.secondary:hover {
  background: rgba(255, 255, 255, 0.15);
}

@media (max-width: 768px) {
  .status-grid,
  .emergency-grid,
  .config-grid {
    grid-template-columns: 1fr;
  }
  
  .config-actions {
    flex-direction: column;
  }
  
  .security-warning {
    flex-direction: column;
    text-align: center;
  }
}
</style>