<!--
  Reading Analytics Component
  AI-powered reading performance and insights
-->

<template>
  <div class="reading-analytics">
    <div class="section-header">
      <h2>🔮 Reading Analytics</h2>
      <div class="header-actions">
        <select v-model="selectedPeriod" class="filter-select">
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
        </select>
      </div>
    </div>
    
    <!-- Reading Metrics -->>
    <div class="analytics-grid">
      <div class="metric-card">
        <div class="metric-icon">📊</div>
        <div class="metric-content">
          <h3>Total Readings</h3>
          <p class="metric-value">{{ totalReadings.toLocaleString() }}</p>
          <span class="metric-change positive">+{{ readingGrowth }}%</span>
        </div>
      </div>
      
      <div class="metric-card">
        <div class="metric-icon">⭐</div>
        <div class="metric-content">
          <h3>Avg Rating</h3>
          <p class="metric-value">{{ avgRating }}/5</p>
          <span class="metric-subtitle">{{ totalReviews }} reviews</span>
        </div>
      </div>
      
      <div class="metric-card">
        <div class="metric-icon">🤖</div>
        <div class="metric-content">
          <h3>AI Success Rate</h3>
          <p class="metric-value">{{ aiSuccessRate }}%</p>
          <span class="metric-subtitle">Monica: {{ monicaSuccessRate }}%</span>
        </div>
      </div>
      
      <div class="metric-card">
        <div class="metric-icon">⚡</div>
        <div class="metric-content">
          <h3>Avg Response Time</h3>
          <p class="metric-value">{{ avgResponseTime }}s</p>
          <span class="metric-subtitle">Target: <5s</span>
        </div>
      </div>
    </div>
    
    <!-- Popular Cards -->>
    <div class="popular-cards-section">
      <h3>Most Selected Cards</h3>
      <div class="cards-grid">
        <div v-for="card in popularCards" :key="card.name" class="card-stat">
          <div class="card-name">{{ card.name }}</div>
          <div class="card-count">{{ card.count }} times</div>
          <div class="card-percentage">{{ card.percentage }}%</div>
        </div>
      </div>
    </div>
    
    <!-- Reading Performance -->>
    <div class="performance-section">
      <h3>Performance Metrics</h3>
      <div class="performance-grid">
        <div class="performance-item">
          <span class="performance-label">Monica AI Uptime</span>
          <span class="performance-value success">99.9%</span>
        </div>
        <div class="performance-item">
          <span class="performance-label">Reading Completion Rate</span>
          <span class="performance-value success">{{ completionRate }}%</span>
        </div>
        <div class="performance-item">
          <span class="performance-label">User Satisfaction</span>
          <span class="performance-value success">{{ userSatisfaction }}%</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const selectedPeriod = ref('today')

// Mock analytics data
const totalReadings = ref(1247)
const readingGrowth = ref(18.5)
const avgRating = ref(4.8)
const totalReviews = ref(892)
const aiSuccessRate = ref(98.7)
const monicaSuccessRate = ref(99.9)
const avgResponseTime = ref(2.3)
const completionRate = ref(96.2)
const userSatisfaction = ref(94.5)

const popularCards = ref([
  { name: 'The Fool', count: 156, percentage: 12.5 },
  { name: 'The Star', count: 134, percentage: 10.7 },
  { name: 'The Moon', count: 128, percentage: 10.3 },
  { name: 'The Sun', count: 119, percentage: 9.5 },
  { name: 'Death', count: 98, percentage: 7.9 },
  { name: 'The Tower', count: 87, percentage: 7.0 }
])
</script>

<style scoped>
.reading-analytics {
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

.filter-select {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 0.75rem;
  color: #fff;
}

.analytics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
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

.metric-subtitle {
  color: #a0a0a0;
  font-size: 0.9rem;
}

.popular-cards-section,
.performance-section {
  margin-bottom: 2rem;
}

.popular-cards-section h3,
.performance-section h3 {
  margin: 0 0 1rem 0;
  color: #e0e0e0;
  font-size: 1.25rem;
  font-weight: 500;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.card-stat {
  background: rgba(255, 255, 255, 0.03);
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
}

.card-name {
  color: #e0e0e0;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.card-count {
  color: #667eea;
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
}

.card-percentage {
  color: #a0a0a0;
  font-size: 0.9rem;
}

.performance-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
}

.performance-item {
  background: rgba(255, 255, 255, 0.03);
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.performance-label {
  color: #c0c0c0;
  font-weight: 500;
}

.performance-value {
  font-size: 1.25rem;
  font-weight: 600;
}

.performance-value.success {
  color: #4ade80;
}

@media (max-width: 768px) {
  .analytics-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .cards-grid,
  .performance-grid {
    grid-template-columns: 1fr;
  }
}
</style>