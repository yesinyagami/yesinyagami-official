<!--
  Night God Tarot - Admin Dashboard
  Comprehensive admin control panel with real-time metrics
  Only accessible by authorized IP: 125.224.130.115
-->

<template>
  <div class="admin-dashboard">
    <!-- Sidebar Navigation -->
    <AdminSidebar :active-tab="activeTab" @switch-tab="activeTab = $event" />
    
    <div class="admin-content">
      <!-- Header -->
      <div class="admin-header">
        <div class="header-left">
          <h1>🌙 Night God Tarot Admin</h1>
          <p>Comprehensive System Management</p>
        </div>
        <div class="header-right">
          <div class="admin-info">
            <span class="admin-role">{{ adminStore.adminData?.role?.toUpperCase() }}</span>
            <span class="admin-email">{{ adminStore.adminData?.email }}</span>
            <span class="admin-ip">IP: {{ currentIP }}</span>
          </div>
          <button @click="logout" class="logout-btn">🔓 Logout</button>
        </div>
      </div>
      
      <!-- Security Alerts Panel -->
      <div v-if="adminStore.securityAlerts.length > 0" class="security-alerts-section">
        <h2>🚨 Security Alerts</h2>
        <div class="alerts-container">
          <div 
            v-for="alert in adminStore.securityAlerts.slice(0, 3)" 
            :key="alert.id"
            :class="['alert-item', alert.type]"
          >
            <div class="alert-icon">
              {{ alert.type === 'error' ? '🔴' : alert.type === 'warning' ? '🟡' : '🔵' }}
            </div>
            <div class="alert-content">
              <p>{{ alert.message }}</p>
              <small>{{ formatTime(alert.timestamp) }} | Severity: {{ alert.severity }}/10</small>
            </div>
          </div>
        </div>
      </div>

      <!-- Real-time Metrics Dashboard -->
      <div class="metrics-section">
        <h2>📊 Live Metrics</h2>
        <div class="metrics-grid">
          <div class="metric-card revenue">
            <div class="metric-icon">💰</div>
            <div class="metric-content">
              <h3>Today's Revenue</h3>
              <p class="metric-value">${{ adminStore.metrics.todayRevenue.toLocaleString() }}</p>
              <span class="metric-change positive">+{{ adminStore.metrics.revenueChange }}%</span>
            </div>
          </div>
          
          <div class="metric-card users">
            <div class="metric-icon">👥</div>
            <div class="metric-content">
              <h3>Active Users</h3>
              <p class="metric-value">{{ adminStore.metrics.activeUsers.toLocaleString() }}</p>
              <span class="metric-change positive">+{{ adminStore.metrics.userChange }}%</span>
            </div>
          </div>
          
          <div class="metric-card readings">
            <div class="metric-icon">🔮</div>
            <div class="metric-content">
              <h3>Readings Today</h3>
              <p class="metric-value">{{ adminStore.metrics.readingsToday }}</p>
              <span class="metric-subtitle">Avg: ${{ adminStore.metrics.avgPrice }}</span>
            </div>
          </div>
          
          <div class="metric-card api-status">
            <div class="metric-icon">🤖</div>
            <div class="metric-content">
              <h3>AI Services</h3>
              <div class="api-status-grid">
                <div class="status-item">
                  <span :class="['status-dot', adminStore.apiStatus.monica]"></span>
                  <span>Monica (∞)</span>
                </div>
                <div class="status-item">
                  <span :class="['status-dot', adminStore.apiStatus.perplexity]"></span>
                  <span>Perplexity</span>
                </div>
                <div class="status-item">
                  <span :class="['status-dot', adminStore.apiStatus.gemini]"></span>
                  <span>Gemini</span>
                </div>
                <div class="status-item">
                  <span :class="['status-dot', adminStore.apiStatus.chatgpt]"></span>
                  <span>ChatGPT</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="metric-card system-health">
            <div class="metric-icon">⚡</div>
            <div class="metric-content">
              <h3>System Health</h3>
              <p class="metric-value">{{ adminStore.metrics.systemHealth.toFixed(1) }}%</p>
              <div class="health-bar">
                <div class="health-fill" :style="{ width: adminStore.metrics.systemHealth + '%' }"></div>
              </div>
            </div>
          </div>
          
          <div class="metric-card security">
            <div class="metric-icon">🛡️</div>
            <div class="metric-content">
              <h3>Security Status</h3>
              <p class="metric-value">{{ adminStore.metrics.securityThreats }}</p>
              <span class="metric-subtitle">Active threats</span>
            </div>
          </div>
          
          <div class="metric-card performance">
            <div class="metric-icon">📈</div>
            <div class="metric-content">
              <h3>AI Performance</h3>
              <p class="metric-value">{{ adminStore.metrics.aiPerformance.toFixed(1) }}%</p>
              <span class="metric-subtitle">Response time: {{ adminStore.metrics.responseTime }}s</span>
            </div>
          </div>
          
          <div class="metric-card predictions">
            <div class="metric-icon">🔮</div>
            <div class="metric-content">
              <h3>Predicted Revenue</h3>
              <p class="metric-value">${{ adminStore.metrics.predictedRevenue.toLocaleString() }}</p>
              <span class="metric-subtitle">Next 30 days</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Management Tabs Content -->
      <div class="management-section">
        <div class="tab-content">
          <!-- User Management -->
          <UserManagement v-if="activeTab === 'users'" />
          
          <!-- Payment Management -->
          <PaymentManagement v-if="activeTab === 'payments'" />
          
          <!-- Reading Analytics -->
          <ReadingAnalytics v-if="activeTab === 'readings'" />
          
          <!-- AI Configuration -->
          <AIConfiguration v-if="activeTab === 'ai'" />
          
          <!-- Content Management -->
          <ContentManagement v-if="activeTab === 'content'" />
          
          <!-- System Settings -->
          <SystemSettings v-if="activeTab === 'system'" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useAdminStore } from '@/stores/adminStore'
import { useRouter } from 'vue-router'
import AdminSidebar from '@/components/admin/AdminSidebar.vue'
import UserManagement from '@/components/admin/UserManagement.vue'
import PaymentManagement from '@/components/admin/PaymentManagement.vue'
import ReadingAnalytics from '@/components/admin/ReadingAnalytics.vue'
import AIConfiguration from '@/components/admin/AIConfiguration.vue'
import ContentManagement from '@/components/admin/ContentManagement.vue'
import SystemSettings from '@/components/admin/SystemSettings.vue'

const router = useRouter()
const adminStore = useAdminStore()

const activeTab = ref('users')
const currentIP = ref('')

onMounted(async () => {
  // Verify admin authentication
  if (!adminStore.isAuthenticated) {
    router.push('/')
    return
  }
  
  // Get current IP for display
  try {
    const response = await fetch('https://ipinfo.io/ip')
    currentIP.value = await response.text()
  } catch {
    currentIP.value = 'Unknown'
  }
  
  // Load initial metrics
  await adminStore.loadMetrics()
  
  // Start real-time updates
  adminStore.startRealtimeUpdates()
  
  // Set page title
  document.title = 'Night God Tarot - Admin Dashboard'
})

onUnmounted(() => {
  // Stop real-time updates when leaving
  adminStore.stopRealtimeUpdates()
})

async function logout() {
  adminStore.logout()
  router.push('/')
}

function formatTime(timestamp: Date): string {
  const now = new Date()
  const diff = now.getTime() - timestamp.getTime()
  const minutes = Math.floor(diff / 60000)
  
  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  
  return timestamp.toLocaleDateString()
}
</script>

<style scoped>
.admin-dashboard {
  display: flex;
  min-height: 100vh;
  background: linear-gradient(135deg, #0f0f1e 0%, #1a1a2e 100%);
  color: #fff;
  font-family: 'Inter', sans-serif;
}

.admin-content {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
}

/* Header */
.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 16px;
  border: 1px solid rgba(107, 70, 193, 0.2);
}

.header-left h1 {
  margin: 0 0 0.5rem 0;
  font-size: 2rem;
  font-weight: 600;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.header-left p {
  margin: 0;
  color: #a0a0a0;
  font-size: 1rem;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.admin-info {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.25rem;
  font-size: 0.9rem;
}

.admin-role {
  color: #4ade80;
  font-weight: 600;
  font-size: 0.8rem;
}

.admin-email {
  color: #e0e0e0;
}

.admin-ip {
  color: #a0a0a0;
  font-size: 0.8rem;
}

.logout-btn {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.logout-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(239, 68, 68, 0.3);
}

/* Security Alerts Section */
.security-alerts-section {
  margin-bottom: 2rem;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 16px;
  padding: 1.5rem;
}

.security-alerts-section h2 {
  margin: 0 0 1rem 0;
  color: #f87171;
  font-size: 1.25rem;
  font-weight: 600;
}

.alerts-container {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.alert-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.alert-item.error {
  background: rgba(239, 68, 68, 0.2);
  border: 1px solid rgba(239, 68, 68, 0.4);
}

.alert-item.warning {
  background: rgba(245, 158, 11, 0.2);
  border: 1px solid rgba(245, 158, 11, 0.4);
}

.alert-item.info {
  background: rgba(59, 130, 246, 0.2);
  border: 1px solid rgba(59, 130, 246, 0.4);
}

.alert-icon {
  font-size: 1.2rem;
  flex-shrink: 0;
}

.alert-content p {
  margin: 0 0 0.25rem 0;
  color: #e0e0e0;
  font-weight: 500;
}

.alert-content small {
  color: #a0a0a0;
  font-size: 0.8rem;
}

/* Metrics Section */
.metrics-section {
  margin-bottom: 2rem;
}

.metrics-section h2 {
  margin-bottom: 1.5rem;
  color: #e0e0e0;
  font-size: 1.5rem;
  font-weight: 500;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.metric-card {
  background: rgba(255, 255, 255, 0.05);
  padding: 2rem;
  border-radius: 16px;
  border: 1px solid rgba(107, 70, 193, 0.2);
  display: flex;
  align-items: center;
  gap: 1.5rem;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.metric-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #667eea, #764ba2);
}

.metric-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
  border-color: rgba(107, 70, 193, 0.4);
}

.metric-icon {
  font-size: 2.5rem;
  opacity: 0.8;
}

.metric-content {
  flex: 1;
}

.metric-content h3 {
  margin: 0 0 0.5rem 0;
  color: #c0c0c0;
  font-size: 1rem;
  font-weight: 500;
}

.metric-value {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0.5rem 0;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.metric-change {
  font-size: 0.9rem;
  font-weight: 600;
}

.metric-change.positive {
  color: #4ade80;
}

.metric-change.negative {
  color: #ef4444;
}

.metric-subtitle {
  color: #a0a0a0;
  font-size: 0.9rem;
}

/* API Status */
.api-status-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  margin-top: 1rem;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.status-dot.online {
  background: #4ade80;
  box-shadow: 0 0 8px rgba(74, 222, 128, 0.4);
}

.status-dot.warning {
  background: #f59e0b;
  box-shadow: 0 0 8px rgba(245, 158, 11, 0.4);
}

.status-dot.offline {
  background: #ef4444;
  box-shadow: 0 0 8px rgba(239, 68, 68, 0.4);
}

/* Health Bar */
.health-bar {
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
  margin-top: 0.5rem;
}

.health-fill {
  height: 100%;
  background: linear-gradient(90deg, #ef4444 0%, #f59e0b 50%, #4ade80 100%);
  transition: width 0.5s ease;
  border-radius: 4px;
}

/* Enhanced Metric Cards */
.metric-card.system-health {
  border-color: rgba(74, 222, 128, 0.3);
  background: rgba(74, 222, 128, 0.05);
}

.metric-card.security {
  border-color: rgba(239, 68, 68, 0.3);
  background: rgba(239, 68, 68, 0.05);
}

.metric-card.performance {
  border-color: rgba(59, 130, 246, 0.3);
  background: rgba(59, 130, 246, 0.05);
}

.metric-card.predictions {
  border-color: rgba(168, 85, 247, 0.3);
  background: rgba(168, 85, 247, 0.05);
}

/* Animated metric values */
.metric-value {
  transition: all 0.3s ease;
}

.metric-card:hover .metric-value {
  transform: scale(1.05);
}

/* Management Section */
.management-section {
  background: rgba(255, 255, 255, 0.02);
  border-radius: 16px;
  border: 1px solid rgba(107, 70, 193, 0.1);
  overflow: hidden;
}

.tab-content {
  padding: 2rem;
  min-height: 400px;
}

/* Responsive Design */
@media (max-width: 1200px) {
  .admin-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .header-right {
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .admin-dashboard {
    flex-direction: column;
  }
  
  .admin-content {
    padding: 1rem;
  }
  
  .metrics-grid {
    grid-template-columns: 1fr;
  }
  
  .metric-card {
    padding: 1.5rem;
  }
  
  .metric-value {
    font-size: 2rem;
  }
}

/* Loading States */
.metric-card.loading {
  opacity: 0.6;
}

.metric-card.loading .metric-value {
  background: #333;
  color: transparent;
  border-radius: 4px;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% { background-color: #333; }
  50% { background-color: #444; }
  100% { background-color: #333; }
}
</style>