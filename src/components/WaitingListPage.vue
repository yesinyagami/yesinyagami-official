<template>
  <div class="waiting-list-page">
    <!-- Header Section -->
    <div class="hero-section">
      <div class="cosmic-background">
        <StarField :density="0.3" />
        <div class="aurora-effect"></div>
      </div>
      
      <div class="hero-content">
        <div class="status-icon">
          <div class="hourglass-icon">
            <div class="sand-top"></div>
            <div class="sand-bottom"></div>
          </div>
        </div>
        
        <h1 class="hero-title">
          ✨ Your Journey Awaits
        </h1>
        
        <p class="hero-subtitle">
          You're on the sacred waiting list for {{ tierDisplayName }}
        </p>
        
        <div class="position-card">
          <div class="position-number">{{ waitingListStatus?.position || 0 }}</div>
          <div class="position-label">Position in Line</div>
        </div>
      </div>
    </div>

    <!-- Status Information -->
    <div class="status-section">
      <div class="status-grid">
        <!-- Estimated Wait Time -->
        <div class="status-card wait-time">
          <div class="card-icon">⏳</div>
          <div class="card-content">
            <h3>Estimated Wait</h3>
            <div class="wait-display">
              <span class="wait-number">{{ estimatedDays }}</span>
              <span class="wait-unit">{{ estimatedDays === 1 ? 'day' : 'days' }}</span>
            </div>
            <p class="wait-note">Based on current capacity and usage patterns</p>
          </div>
        </div>

        <!-- Tier Benefits -->
        <div class="status-card benefits">
          <div class="card-icon">🌟</div>
          <div class="card-content">
            <h3>What You'll Get</h3>
            <ul class="benefits-list">
              <li v-for="benefit in tierBenefits" :key="benefit">
                <span class="benefit-check">✓</span>
                {{ benefit }}
              </li>
            </ul>
          </div>
        </div>

        <!-- Progress Indicator -->
        <div class="status-card progress">
          <div class="card-icon">📊</div>
          <div class="card-content">
            <h3>Current Capacity</h3>
            <div class="capacity-bars">
              <div class="capacity-item">
                <span class="capacity-label">{{ tierDisplayName }} Users</span>
                <div class="capacity-bar">
                  <div class="capacity-fill" :style="{ width: capacityPercentage + '%' }"></div>
                </div>
                <span class="capacity-text">{{ currentUsers }}/{{ maxUsers }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- While You Wait Section -->
    <div class="while-waiting-section">
      <h2 class="section-title">🌙 While You Wait</h2>
      
      <div class="waiting-activities">
        <div class="activity-card">
          <div class="activity-icon">🔮</div>
          <h3>Free Daily Reading</h3>
          <p>Continue your spiritual journey with our free Night Walker tier</p>
          <button class="activity-button" @click="$router.push('/demo')">
            Get Today's Reading
          </button>
        </div>
        
        <div class="activity-card">
          <div class="activity-icon">📚</div>
          <h3>Learn Tarot Wisdom</h3>
          <p>Explore our comprehensive tarot guides and tutorials</p>
          <button class="activity-button" @click="$router.push('/learn')">
            Browse Library
          </button>
        </div>
        
        <div class="activity-card">
          <div class="activity-icon">🎁</div>
          <h3>Special Waiting List Bonus</h3>
          <p>When your spot opens, enjoy 10% off your first month!</p>
          <div class="bonus-badge">10% OFF</div>
        </div>
      </div>
    </div>

    <!-- Notification Preferences -->
    <div class="notifications-section">
      <h2 class="section-title">🔔 Stay Updated</h2>
      
      <div class="notification-card">
        <p class="notification-intro">
          We'll notify you the moment your spot is ready!
        </p>
        
        <div class="notification-options">
          <label class="notification-option">
            <input 
              type="checkbox" 
              v-model="emailNotifications"
              @change="updateNotificationPreferences"
            >
            <span class="checkmark"></span>
            <div class="option-content">
              <strong>Email Notifications</strong>
              <span>Get notified at {{ userEmail }}</span>
            </div>
          </label>
          
          <label class="notification-option">
            <input 
              type="checkbox" 
              v-model="appNotifications"
              @change="updateNotificationPreferences"
            >
            <span class="checkmark"></span>
            <div class="option-content">
              <strong>In-App Notifications</strong>
              <span>Receive updates when you visit the app</span>
            </div>
          </label>
        </div>
      </div>
    </div>

    <!-- FAQ Section -->
    <div class="faq-section">
      <h2 class="section-title">❓ Frequently Asked Questions</h2>
      
      <div class="faq-list">
        <div class="faq-item" v-for="(faq, index) in faqs" :key="index">
          <button 
            class="faq-question" 
            @click="toggleFaq(index)"
            :class="{ active: activeFaq === index }"
          >
            {{ faq.question }}
            <span class="faq-toggle">{{ activeFaq === index ? '−' : '+' }}</span>
          </button>
          
          <div class="faq-answer" v-show="activeFaq === index">
            <p>{{ faq.answer }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer Actions -->
    <div class="footer-actions">
      <button class="secondary-button" @click="$router.push('/')">
        Return to Home
      </button>
      
      <button class="primary-button" @click="refreshStatus">
        <span v-if="!refreshing">🔄 Refresh Status</span>
        <span v-else>⏳ Updating...</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import StarField from './ui/StarField.vue'
import type { WaitingListEntry, CapacityLimits } from '../services/subscription/SubscriptionManager'
import { TierLevel } from '../types/membership'

// Props
interface Props {
  userId: string
  requestedTier: TierLevel
}

const props = defineProps<Props>()

// Reactive data
const waitingListStatus = ref<WaitingListEntry | null>(null)
const capacityStatus = ref<CapacityLimits | null>(null)
const emailNotifications = ref(true)
const appNotifications = ref(true)
const refreshing = ref(false)
const activeFaq = ref<number | null>(null)

// Computed properties
const tierDisplayName = computed(() => {
  switch (props.requestedTier) {
    case TierLevel.MOON_SHADOW: return 'Moon Shadow'
    case TierLevel.NIGHT_GOD: return 'Night God'
    default: return 'Premium'
  }
})

const estimatedDays = computed(() => {
  return waitingListStatus.value?.estimatedWaitTime || 0
})

const userEmail = computed(() => {
  return waitingListStatus.value?.email || 'your-email@example.com'
})

const tierBenefits = computed(() => {
  switch (props.requestedTier) {
    case TierLevel.MOON_SHADOW:
      return [
        'Unlimited AI-powered readings',
        'Advanced personality analysis',
        'Monthly guided meditation sessions',
        'Priority customer support',
        'Export readings as beautiful PDFs'
      ]
    case TierLevel.NIGHT_GOD:
      return [
        'Everything in Moon Shadow',
        'Exclusive VIP readings',
        'One-on-one spiritual mentorship',
        'Early access to new features',
        'Custom meditation soundscapes',
        'Lifetime reading archive'
      ]
    default:
      return ['Premium features and benefits']
  }
})

const currentUsers = computed(() => {
  if (!capacityStatus.value) return 0
  
  switch (props.requestedTier) {
    case TierLevel.MOON_SHADOW:
      return capacityStatus.value.currentMoonShadowUsers
    case TierLevel.NIGHT_GOD:
      return capacityStatus.value.currentNightGodUsers
    default:
      return 0
  }
})

const maxUsers = computed(() => {
  if (!capacityStatus.value) return 1
  
  switch (props.requestedTier) {
    case TierLevel.MOON_SHADOW:
      return capacityStatus.value.maxMoonShadowUsers
    case TierLevel.NIGHT_GOD:
      return capacityStatus.value.maxNightGodUsers
    default:
      return 1
  }
})

const capacityPercentage = computed(() => {
  return Math.round((currentUsers.value / maxUsers.value) * 100)
})

// FAQ data
const faqs = ref([
  {
    question: "Why is there a waiting list?",
    answer: "To ensure the best possible experience for all users, we limit the number of active premium subscriptions. This allows us to maintain high-quality AI responses and personalized service."
  },
  {
    question: "How accurate is the estimated wait time?",
    answer: "Our estimates are based on historical usage patterns and current capacity. While we strive for accuracy, actual wait times may vary depending on user activity and system capacity."
  },
  {
    question: "Will I lose my spot if I don't respond immediately?",
    answer: "You'll have 48 hours to confirm your subscription when your spot becomes available. We'll send multiple notifications to ensure you don't miss your opportunity."
  },
  {
    question: "Can I change my tier while waiting?",
    answer: "Yes! You can upgrade to a higher tier at any time. Downgrades will require rejoining the waiting list for the lower tier."
  },
  {
    question: "What happens to my payment information?",
    answer: "We don't store payment information while you're on the waiting list. You'll complete the payment process when your subscription becomes available."
  }
])

// Methods
const loadWaitingListStatus = async () => {
  try {
    // Simulate API call - replace with actual service call
    waitingListStatus.value = {
      id: `wait_${Date.now()}`,
      userId: props.userId,
      email: 'user@example.com',
      username: 'Seeker',
      requestedTier: props.requestedTier,
      joinDate: new Date(),
      estimatedWaitTime: Math.floor(Math.random() * 14) + 1,
      position: Math.floor(Math.random() * 50) + 1,
      notificationPreferences: {
        email: true,
        inApp: true
      },
      metadata: {
        priority: 'normal'
      }
    }
    
    capacityStatus.value = {
      maxActiveUsers: 10000,
      maxMoonShadowUsers: 3000,
      maxNightGodUsers: 500,
      currentActiveUsers: 8500,
      currentMoonShadowUsers: 2850,
      currentNightGodUsers: 475,
      waitingListEnabled: true,
      emergencyMode: false
    }
    
  } catch (error) {
    console.error('Failed to load waiting list status:', error)
  }
}

const updateNotificationPreferences = async () => {
  try {
    // Update notification preferences via API
    console.log('Updating notification preferences:', {
      email: emailNotifications.value,
      inApp: appNotifications.value
    })
  } catch (error) {
    console.error('Failed to update notification preferences:', error)
  }
}

const refreshStatus = async () => {
  refreshing.value = true
  try {
    await loadWaitingListStatus()
    // Show success feedback
  } catch (error) {
    console.error('Failed to refresh status:', error)
  } finally {
    setTimeout(() => {
      refreshing.value = false
    }, 1000)
  }
}

const toggleFaq = (index: number) => {
  activeFaq.value = activeFaq.value === index ? null : index
}

// Lifecycle
onMounted(() => {
  loadWaitingListStatus()
})
</script>

<style scoped>
.waiting-list-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #0f0728 0%, #1a0942 50%, #0f0728 100%);
  color: white;
  padding: 2rem;
}

/* Hero Section */
.hero-section {
  position: relative;
  text-align: center;
  padding: 4rem 0;
  margin-bottom: 3rem;
}

.cosmic-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  border-radius: 20px;
}

.aurora-effect {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, 
    rgba(138, 43, 226, 0.1) 0%,
    rgba(75, 0, 130, 0.1) 25%,
    rgba(0, 100, 200, 0.1) 50%,
    rgba(138, 43, 226, 0.1) 75%,
    rgba(75, 0, 130, 0.1) 100%);
  animation: aurora 8s ease-in-out infinite;
}

.hero-content {
  position: relative;
  z-index: 10;
}

.status-icon {
  margin-bottom: 2rem;
}

.hourglass-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto;
  position: relative;
  border: 3px solid #8a2be2;
  border-radius: 10px;
  background: rgba(138, 43, 226, 0.1);
}

.sand-top, .sand-bottom {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  background: linear-gradient(45deg, #ffd700, #ff6b35);
  border-radius: 0 0 20px 20px;
  animation: sandFlow 3s ease-in-out infinite;
}

.sand-top {
  top: 10px;
  height: 25px;
}

.sand-bottom {
  bottom: 10px;
  height: 15px;
  border-radius: 20px 20px 0 0;
}

.hero-title {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1rem;
  background: linear-gradient(45deg, #8a2be2, #4169e1, #00ced1);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero-subtitle {
  font-size: 1.3rem;
  margin-bottom: 2rem;
  opacity: 0.9;
}

.position-card {
  display: inline-block;
  background: rgba(138, 43, 226, 0.2);
  border: 2px solid #8a2be2;
  border-radius: 15px;
  padding: 1.5rem 2rem;
  backdrop-filter: blur(10px);
}

.position-number {
  font-size: 3rem;
  font-weight: 700;
  color: #ffd700;
}

.position-label {
  font-size: 1rem;
  opacity: 0.8;
  margin-top: 0.5rem;
}

/* Status Section */
.status-section {
  margin-bottom: 4rem;
}

.status-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.status-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(138, 43, 226, 0.3);
  border-radius: 15px;
  padding: 2rem;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.status-card:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: #8a2be2;
  transform: translateY(-5px);
}

.card-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.card-content h3 {
  font-size: 1.3rem;
  margin-bottom: 1rem;
  color: #ffd700;
}

.wait-display {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.wait-number {
  font-size: 3rem;
  font-weight: 700;
  color: #00ced1;
}

.wait-unit {
  font-size: 1.2rem;
  opacity: 0.8;
}

.wait-note {
  font-size: 0.9rem;
  opacity: 0.7;
}

.benefits-list {
  list-style: none;
  padding: 0;
}

.benefits-list li {
  display: flex;
  align-items: center;
  margin-bottom: 0.8rem;
  font-size: 0.95rem;
}

.benefit-check {
  color: #00ff7f;
  font-weight: 700;
  margin-right: 0.8rem;
}

.capacity-item {
  margin-bottom: 1rem;
}

.capacity-label {
  font-size: 0.9rem;
  opacity: 0.8;
  display: block;
  margin-bottom: 0.5rem;
}

.capacity-bar {
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.capacity-fill {
  height: 100%;
  background: linear-gradient(90deg, #ff6b35, #ffd700, #00ced1);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.capacity-text {
  font-size: 0.85rem;
  opacity: 0.7;
}

/* While Waiting Section */
.while-waiting-section {
  margin-bottom: 4rem;
}

.section-title {
  font-size: 2rem;
  text-align: center;
  margin-bottom: 2rem;
  color: #ffd700;
}

.waiting-activities {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  max-width: 1000px;
  margin: 0 auto;
}

.activity-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(138, 43, 226, 0.3);
  border-radius: 15px;
  padding: 2rem;
  text-align: center;
  position: relative;
}

.activity-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.activity-card h3 {
  font-size: 1.2rem;
  margin-bottom: 1rem;
  color: #8a2be2;
}

.activity-button {
  background: linear-gradient(45deg, #8a2be2, #4169e1);
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;
}

.activity-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(138, 43, 226, 0.3);
}

.bonus-badge {
  background: linear-gradient(45deg, #ffd700, #ff6b35);
  color: #000;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 700;
  display: inline-block;
  margin-top: 1rem;
}

/* Notifications Section */
.notifications-section {
  margin-bottom: 4rem;
}

.notification-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(138, 43, 226, 0.3);
  border-radius: 15px;
  padding: 2rem;
  max-width: 600px;
  margin: 0 auto;
}

.notification-intro {
  text-align: center;
  margin-bottom: 2rem;
  font-size: 1.1rem;
}

.notification-options {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.notification-option {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 1rem;
  border-radius: 10px;
  transition: background 0.3s ease;
}

.notification-option:hover {
  background: rgba(138, 43, 226, 0.1);
}

.notification-option input[type="checkbox"] {
  display: none;
}

.checkmark {
  width: 20px;
  height: 20px;
  border: 2px solid #8a2be2;
  border-radius: 4px;
  margin-right: 1rem;
  position: relative;
  transition: all 0.3s ease;
}

.notification-option input[type="checkbox"]:checked + .checkmark {
  background: #8a2be2;
}

.notification-option input[type="checkbox"]:checked + .checkmark::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-weight: 700;
}

.option-content {
  display: flex;
  flex-direction: column;
}

.option-content strong {
  color: #ffd700;
  margin-bottom: 0.3rem;
}

.option-content span {
  font-size: 0.9rem;
  opacity: 0.8;
}

/* FAQ Section */
.faq-section {
  margin-bottom: 4rem;
}

.faq-list {
  max-width: 800px;
  margin: 0 auto;
}

.faq-item {
  border: 1px solid rgba(138, 43, 226, 0.3);
  border-radius: 10px;
  margin-bottom: 1rem;
  overflow: hidden;
}

.faq-question {
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  border: none;
  color: white;
  padding: 1.5rem;
  text-align: left;
  font-size: 1.1rem;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background 0.3s ease;
}

.faq-question:hover,
.faq-question.active {
  background: rgba(138, 43, 226, 0.1);
}

.faq-toggle {
  font-size: 1.5rem;
  font-weight: 700;
  color: #8a2be2;
}

.faq-answer {
  background: rgba(255, 255, 255, 0.02);
  padding: 1.5rem;
  border-top: 1px solid rgba(138, 43, 226, 0.2);
}

/* Footer Actions */
.footer-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 3rem;
}

.primary-button,
.secondary-button {
  padding: 1rem 2rem;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
}

.primary-button {
  background: linear-gradient(45deg, #8a2be2, #4169e1);
  color: white;
}

.secondary-button {
  background: transparent;
  color: #8a2be2;
  border: 2px solid #8a2be2;
}

.primary-button:hover,
.secondary-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(138, 43, 226, 0.3);
}

/* Animations */
@keyframes aurora {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.7; }
}

@keyframes sandFlow {
  0%, 100% { height: 25px; }
  50% { height: 15px; }
}

/* Responsive Design */
@media (max-width: 768px) {
  .waiting-list-page {
    padding: 1rem;
  }
  
  .hero-title {
    font-size: 2rem;
  }
  
  .status-grid,
  .waiting-activities {
    grid-template-columns: 1fr;
  }
  
  .footer-actions {
    flex-direction: column;
    align-items: center;
  }
}</style>