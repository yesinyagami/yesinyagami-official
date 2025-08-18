<!--
  Admin Sidebar Navigation
  Secure navigation for admin dashboard sections
-->

<template>
  <div class="admin-sidebar">
    <div class="sidebar-header">
      <div class="logo">
        <span class="logo-icon">🌙</span>
        <span class="logo-text">Admin</span>
      </div>
      <div class="admin-badge">
        <span v-if="adminStore.isSuperAdmin" class="super-admin">SUPER ADMIN</span>
        <span v-else class="admin">ADMIN</span>
      </div>
    </div>
    
    <nav class="sidebar-nav">
      <div class="nav-section">
        <h3>Management</h3>
        <ul>
          <li>
            <button 
              :class="{ active: activeTab === 'users' }"
              @click="switchTab('users')"
            >
              <span class="nav-icon">👥</span>
              <span>User Management</span>
              <span class="nav-count">{{ userCount }}</span>
            </button>
          </li>
          
          <li>
            <button 
              :class="{ active: activeTab === 'payments' }"
              @click="switchTab('payments')"
            >
              <span class="nav-icon">💳</span>
              <span>Payments</span>
              <span class="nav-count">${{ todayRevenue }}</span>
            </button>
          </li>
          
          <li>
            <button 
              :class="{ active: activeTab === 'readings' }"
              @click="switchTab('readings')"
            >
              <span class="nav-icon">🔮</span>
              <span>Readings</span>
              <span class="nav-count">{{ readingCount }}</span>
            </button>
          </li>
        </ul>
      </div>
      
      <div class="nav-section">
        <h3>Configuration</h3>
        <ul>
          <li>
            <button 
              :class="{ active: activeTab === 'ai' }"
              @click="switchTab('ai')"
            >
              <span class="nav-icon">🤖</span>
              <span>AI Services</span>
              <span :class="['nav-status', monicaStatus]"></span>
            </button>
          </li>
          
          <li>
            <button 
              :class="{ active: activeTab === 'content' }"
              @click="switchTab('content')"
            >
              <span class="nav-icon">📝</span>
              <span>Content</span>
            </button>
          </li>
          
          <li v-if="adminStore.isSuperAdmin">
            <button 
              :class="{ active: activeTab === 'system' }"
              @click="switchTab('system')"
            >
              <span class="nav-icon">⚙️</span>
              <span>System</span>
              <span class="super-only">SUPER</span>
            </button>
          </li>
        </ul>
      </div>
      
      <div class="nav-section">
        <h3>Tools</h3>
        <ul>
          <li>
            <button @click="exportData" class="action-btn">
              <span class="nav-icon">📊</span>
              <span>Export Data</span>
            </button>
          </li>
          
          <li>
            <button @click="viewLogs" class="action-btn">
              <span class="nav-icon">📋</span>
              <span>System Logs</span>
            </button>
          </li>
          
          <li v-if="adminStore.isSuperAdmin">
            <button @click="emergencyMode" class="action-btn emergency">
              <span class="nav-icon">🚨</span>
              <span>Emergency</span>
            </button>
          </li>
        </ul>
      </div>
    </nav>
    
    <div class="sidebar-footer">
      <div class="system-status">
        <div class="status-item">
          <span class="status-label">System</span>
          <span class="status-indicator online"></span>
        </div>
        <div class="status-item">
          <span class="status-label">Security</span>
          <span class="status-indicator online"></span>
        </div>
      </div>
      
      <div class="footer-info">
        <small>Night God Tarot v1.0</small>
        <small>Secure Admin Portal</small>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAdminStore } from '@/stores/adminStore'

const props = defineProps<{
  activeTab: string
}>()

const emit = defineEmits<{
  switchTab: [tab: string]
}>()

const adminStore = useAdminStore()

// Computed values from store
const userCount = computed(() => adminStore.metrics.activeUsers || 0)
const todayRevenue = computed(() => adminStore.metrics.todayRevenue || 0)
const readingCount = computed(() => adminStore.metrics.readingsToday || 0)
const monicaStatus = computed(() => adminStore.apiStatus.monica)

function switchTab(tab: string) {
  emit('switchTab', tab)
}

function exportData() {
  // Export functionality
  const data = {
    metrics: adminStore.metrics,
    timestamp: new Date().toISOString(),
    exportedBy: adminStore.adminData?.email
  }
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `night-god-tarot-export-${new Date().toISOString().split('T')[0]}.json`
  a.click()
  URL.revokeObjectURL(url)
}

function viewLogs() {
  // Show logs modal or redirect to logs view
  console.log('Viewing system logs...')
}

function emergencyMode() {
  if (confirm('Enable Emergency Mode? This will disable all public access.')) {
    console.log('Emergency mode activated')
    // Implement emergency mode functionality
  }
}
</script>

<style scoped>
.admin-sidebar {
  width: 280px;
  background: linear-gradient(180deg, #1a1a2e 0%, #16213e 100%);
  border-right: 1px solid rgba(107, 70, 193, 0.2);
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow-y: auto;
}

/* Sidebar Header */
.sidebar-header {
  padding: 2rem 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.logo-icon {
  font-size: 1.5rem;
}

.logo-text {
  font-size: 1.25rem;
  font-weight: 600;
  color: #fff;
}

.admin-badge {
  text-align: center;
}

.super-admin {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: #000;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.admin {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: #fff;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.5px;
}

/* Sidebar Navigation */
.sidebar-nav {
  flex: 1;
  padding: 1rem 0;
}

.nav-section {
  margin-bottom: 2rem;
}

.nav-section h3 {
  color: #a0a0a0;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin: 0 0 1rem 1.5rem;
}

.nav-section ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav-section li {
  margin: 0;
}

.nav-section button {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.5rem;
  background: none;
  border: none;
  color: #c0c0c0;
  text-align: left;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.nav-section button:hover {
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
}

.nav-section button.active {
  background: rgba(102, 126, 234, 0.15);
  color: #667eea;
  border-right: 3px solid #667eea;
}

.nav-section button.active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: #667eea;
}

.nav-icon {
  font-size: 1.1rem;
  width: 20px;
  text-align: center;
}

.nav-count {
  margin-left: auto;
  background: rgba(255, 255, 255, 0.1);
  padding: 0.2rem 0.5rem;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 500;
}

.nav-status {
  margin-left: auto;
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.nav-status.online {
  background: #4ade80;
  box-shadow: 0 0 6px rgba(74, 222, 128, 0.4);
}

.nav-status.warning {
  background: #f59e0b;
  box-shadow: 0 0 6px rgba(245, 158, 11, 0.4);
}

.nav-status.offline {
  background: #ef4444;
  box-shadow: 0 0 6px rgba(239, 68, 68, 0.4);
}

.super-only {
  margin-left: auto;
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: #000;
  padding: 0.1rem 0.4rem;
  border-radius: 6px;
  font-size: 0.6rem;
  font-weight: 700;
}

/* Action Buttons */
.action-btn {
  opacity: 0.8;
}

.action-btn:hover {
  opacity: 1;
}

.action-btn.emergency {
  color: #ef4444 !important;
}

.action-btn.emergency:hover {
  background: rgba(239, 68, 68, 0.1) !important;
}

/* Sidebar Footer */
.sidebar-footer {
  padding: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin-top: auto;
}

.system-status {
  margin-bottom: 1rem;
}

.status-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.status-label {
  font-size: 0.8rem;
  color: #a0a0a0;
}

.status-indicator {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.status-indicator.online {
  background: #4ade80;
  box-shadow: 0 0 4px rgba(74, 222, 128, 0.4);
}

.footer-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.footer-info small {
  color: #666;
  font-size: 0.7rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .admin-sidebar {
    width: 100%;
    height: auto;
    border-right: none;
    border-bottom: 1px solid rgba(107, 70, 193, 0.2);
  }
  
  .sidebar-nav {
    display: flex;
    gap: 2rem;
    overflow-x: auto;
    padding: 1rem;
  }
  
  .nav-section {
    flex-shrink: 0;
    margin-bottom: 0;
  }
  
  .nav-section h3 {
    margin-left: 0;
  }
  
  .nav-section button {
    padding: 0.75rem;
    white-space: nowrap;
  }
}

/* Scrollbar Styling */
.admin-sidebar::-webkit-scrollbar {
  width: 4px;
}

.admin-sidebar::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
}

.admin-sidebar::-webkit-scrollbar-thumb {
  background: rgba(102, 126, 234, 0.3);
  border-radius: 2px;
}

.admin-sidebar::-webkit-scrollbar-thumb:hover {
  background: rgba(102, 126, 234, 0.5);
}
</style>