<!--
  AI Configuration Component
  Monica AI and other AI service management
-->

<template>
  <div class="ai-configuration">
    <div class="section-header">
      <h2>🤖 AI Configuration</h2>
      <div class="header-actions">
        <button @click="testAllServices" class="test-btn">⚡ Test All Services</button>
      </div>
    </div>
    
    <!-- AI Services Status -->>
    <div class="services-grid">
      <div class="service-card primary">
        <div class="service-header">
          <div class="service-icon">🌙</div>
          <div class="service-info">
            <h3>Monica AI (Primary)</h3>
            <p>Unlimited access to premium models</p>
          </div>
          <div :class="['service-status', monicaStatus]"></div>
        </div>
        
        <div class="service-details">
          <div class="detail-row">
            <span>Status:</span>
            <span class="status-text online">ONLINE - UNLIMITED</span>
          </div>
          <div class="detail-row">
            <span>Models:</span>
            <span>Claude-3.5, GPT-4O, Yi-Large, Gemini-1.5</span>
          </div>
          <div class="detail-row">
            <span>Rate Limit:</span>
            <span>60 requests/minute</span>
          </div>
          <div class="detail-row">
            <span>Uptime:</span>
            <span>99.9%</span>
          </div>
        </div>
        
        <div class="service-actions">
          <button @click="testMonica" class="action-btn test">Test Connection</button>
          <button v-if="adminStore.isSuperAdmin" @click="configureMonica" class="action-btn config">Configure</button>
        </div>
      </div>
      
      <div class="service-card">
        <div class="service-header">
          <div class="service-icon">🔍</div>
          <div class="service-info">
            <h3>Perplexity AI</h3>
            <p>Research and knowledge enhancement</p>
          </div>
          <div :class="['service-status', perplexityStatus]"></div>
        </div>
        
        <div class="service-details">
          <div class="detail-row">
            <span>Status:</span>
            <span :class="['status-text', perplexityStatus]">{{ perplexityStatus.toUpperCase() }}</span>
          </div>
          <div class="detail-row">
            <span>Quota Used:</span>
            <span>{{ perplexityUsage }}/10,000</span>
          </div>
          <div class="detail-row">
            <span>Last Response:</span>
            <span>{{ perplexityLastResponse }}ms</span>
          </div>
        </div>
        
        <div class="service-actions">
          <button @click="testPerplexity" class="action-btn test">Test</button>
        </div>
      </div>
      
      <div class="service-card">
        <div class="service-header">
          <div class="service-icon">🔮</div>
          <div class="service-info">
            <h3>Google Gemini</h3>
            <p>Creative interpretation assistant</p>
          </div>
          <div :class="['service-status', geminiStatus]"></div>
        </div>
        
        <div class="service-details">
          <div class="detail-row">
            <span>Status:</span>
            <span :class="['status-text', geminiStatus]">{{ geminiStatus.toUpperCase() }}</span>
          </div>
          <div class="detail-row">
            <span>Quota Used:</span>
            <span>{{ geminiUsage }}/5,000</span>
          </div>
        </div>
        
        <div class="service-actions">
          <button @click="testGemini" class="action-btn test">Test</button>
        </div>
      </div>
      
      <div class="service-card">
        <div class="service-header">
          <div class="service-icon">🧠</div>
          <div class="service-info">
            <h3>ChatGPT</h3>
            <p>Conversational intelligence</p>
          </div>
          <div :class="['service-status', chatgptStatus]"></div>
        </div>
        
        <div class="service-details">
          <div class="detail-row">
            <span>Status:</span>
            <span :class="['status-text', chatgptStatus]">{{ chatgptStatus.toUpperCase() }}</span>
          </div>
          <div class="detail-row">
            <span>Quota Used:</span>
            <span>{{ chatgptUsage }}/3,000</span>
          </div>
        </div>
        
        <div class="service-actions">
          <button @click="testChatGPT" class="action-btn test">Test</button>
        </div>
      </div>
    </div>
    
    <!-- AI Orchestration Settings -->>
    <div v-if="adminStore.isSuperAdmin" class="orchestration-section">
      <h3>AI Orchestration Settings</h3>
      <div class="settings-grid">
        <div class="setting-card">
          <div class="setting-info">
            <h4>Primary AI Service</h4>
            <p>Main AI service for readings</p>
          </div>
          <select v-model="primaryService" class="setting-select">
            <option value="monica">Monica AI (Recommended)</option>
            <option value="perplexity">Perplexity</option>
            <option value="gemini">Gemini</option>
            <option value="chatgpt">ChatGPT</option>
          </select>
        </div>
        
        <div class="setting-card">
          <div class="setting-info">
            <h4>Fallback Strategy</h4>
            <p>What to do if primary service fails</p>
          </div>
          <select v-model="fallbackStrategy" class="setting-select">
            <option value="auto">Auto-fallback to available service</option>
            <option value="monica-only">Monica AI only</option>
            <option value="mock">Use mock responses</option>
          </select>
        </div>
        
        <div class="setting-card">
          <div class="setting-info">
            <h4>Response Timeout</h4>
            <p>Maximum wait time for AI response</p>
          </div>
          <input v-model="responseTimeout" type="number" class="setting-input" min="5" max="60" /> 
          <span class="setting-unit">seconds</span>
        </div>
        
        <div class="setting-card">
          <div class="setting-info">
            <h4>Quality Threshold</h4>
            <p>Minimum quality score for responses</p>
          </div>
          <input v-model="qualityThreshold" type="range" class="setting-slider" min="0.5" max="1" step="0.1" />
          <span class="setting-value">{{ qualityThreshold }}</span>
        </div>
      </div>
      
      <div class="settings-actions">
        <button @click="saveSettings" class="btn primary">Save Configuration</button>
        <button @click="resetSettings" class="btn secondary">Reset to Defaults</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAdminStore } from '@/stores/adminStore'

const adminStore = useAdminStore()

// Service statuses
const monicaStatus = ref('online')
const perplexityStatus = ref('online')
const geminiStatus = ref('online')
const chatgptStatus = ref('online')

// Usage stats
const perplexityUsage = ref(2847)
const geminiUsage = ref(1932)
const chatgptUsage = ref(1243)
const perplexityLastResponse = ref(245)

// Settings
const primaryService = ref('monica')
const fallbackStrategy = ref('auto')
const responseTimeout = ref(30)
const qualityThreshold = ref(0.8)

// Methods
function testMonica() {
  console.log('Testing Monica AI connection...')
  // Simulate test
  setTimeout(() => {
    console.log('Monica AI test successful')
  }, 1000)
}

function testPerplexity() {
  console.log('Testing Perplexity AI...')
}

function testGemini() {
  console.log('Testing Google Gemini...')
}

function testChatGPT() {
  console.log('Testing ChatGPT...')
}

function testAllServices() {
  console.log('Testing all AI services...')
  testMonica()
  testPerplexity()
  testGemini()
  testChatGPT()
}

function configureMonica() {
  console.log('Opening Monica AI configuration...')
}

function saveSettings() {
  console.log('Saving AI configuration...')
  console.log({
    primaryService: primaryService.value,
    fallbackStrategy: fallbackStrategy.value,
    responseTimeout: responseTimeout.value,
    qualityThreshold: qualityThreshold.value
  })
}

function resetSettings() {
  if (confirm('Reset all AI settings to defaults?')) {
    primaryService.value = 'monica'
    fallbackStrategy.value = 'auto'
    responseTimeout.value = 30
    qualityThreshold.value = 0.8
  }
}
</script>

<style scoped>
.ai-configuration {
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

.test-btn {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.test-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.service-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  border: 1px solid rgba(107, 70, 193, 0.2);
  padding: 2rem;
  transition: all 0.3s ease;
}

.service-card.primary {
  border-color: rgba(102, 126, 234, 0.4);
  background: rgba(102, 126, 234, 0.1);
}

.service-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
}

.service-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.service-icon {
  font-size: 2rem;
}

.service-info {
  flex: 1;
}

.service-info h3 {
  margin: 0 0 0.25rem 0;
  color: #e0e0e0;
  font-size: 1.25rem;
  font-weight: 600;
}

.service-info p {
  margin: 0;
  color: #a0a0a0;
  font-size: 0.9rem;
}

.service-status {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex-shrink: 0;
}

.service-status.online {
  background: #4ade80;
  box-shadow: 0 0 8px rgba(74, 222, 128, 0.4);
}

.service-status.warning {
  background: #f59e0b;
  box-shadow: 0 0 8px rgba(245, 158, 11, 0.4);
}

.service-status.offline {
  background: #ef4444;
  box-shadow: 0 0 8px rgba(239, 68, 68, 0.4);
}

.service-details {
  margin-bottom: 1.5rem;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.detail-row:last-child {
  border-bottom: none;
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

.status-text.online {
  color: #4ade80;
  font-weight: 600;
}

.status-text.warning {
  color: #f59e0b;
  font-weight: 600;
}

.status-text.offline {
  color: #ef4444;
  font-weight: 600;
}

.service-actions {
  display: flex;
  gap: 0.75rem;
}

.action-btn {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #e0e0e0;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  flex: 1;
}

.action-btn:hover {
  background: rgba(102, 126, 234, 0.2);
  border-color: rgba(102, 126, 234, 0.4);
}

.orchestration-section {
  background: rgba(255, 255, 255, 0.02);
  border-radius: 16px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.orchestration-section h3 {
  margin: 0 0 1.5rem 0;
  color: #e0e0e0;
  font-size: 1.25rem;
  font-weight: 500;
}

.settings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.setting-card {
  background: rgba(255, 255, 255, 0.03);
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.setting-info h4 {
  margin: 0 0 0.5rem 0;
  color: #e0e0e0;
  font-size: 1rem;
  font-weight: 500;
}

.setting-info p {
  margin: 0 0 1rem 0;
  color: #a0a0a0;
  font-size: 0.9rem;
}

.setting-select,
.setting-input {
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 0.75rem;
  color: #fff;
  font-size: 0.9rem;
}

.setting-slider {
  width: 100%;
  margin-bottom: 0.5rem;
}

.setting-unit,
.setting-value {
  color: #a0a0a0;
  font-size: 0.8rem;
}

.settings-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
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
  .services-grid {
    grid-template-columns: 1fr;
  }
  
  .settings-grid {
    grid-template-columns: 1fr;
  }
  
  .settings-actions {
    flex-direction: column;
  }
}
</style>