<template>
  <div class="social-proof-container">
    <!-- Live Activity Feed -->
    <div class="live-activity-banner">
      <div class="activity-item">
        <span class="pulse-dot"></span>
        <span class="activity-text">{{ currentActivity.text }}</span>
      </div>
    </div>

    <!-- Recent Reviews Ticker -->
    <div class="reviews-ticker">
      <div class="ticker-content" ref="tickerRef">
        <div v-for="review in reviews" :key="review.id" class="review-item">
          <div class="review-rating">⭐⭐⭐⭐⭐</div>
          <div class="review-text">"{{ review.text }}"</div>
          <div class="review-author">- {{ review.author }}</div>
        </div>
      </div>
    </div>

    <!-- Trust Stats Counter -->
    <div class="trust-stats">
      <div class="stat-item">
        <div class="stat-number">{{ animatedReadingsCount }}</div>
        <div class="stat-label">Readings Delivered</div>
      </div>
      <div class="stat-item">
        <div class="stat-number">{{ animatedSatisfactionRate }}%</div>
        <div class="stat-label">Satisfaction Rate</div>
      </div>
      <div class="stat-item">
        <div class="stat-number">⭐{{ averageRating }}</div>
        <div class="stat-label">Average Rating</div>
      </div>
    </div>

    <!-- Recent Purchases Popup -->
    <transition name="slide-up">
      <div v-if="showPurchaseNotification" class="purchase-notification">
        <div class="notification-content">
          <div class="notification-icon">🔮</div>
          <div class="notification-text">
            <strong>{{ currentPurchase.name }}</strong> just got a {{ currentPurchase.tier }} reading
            <div class="notification-location">{{ currentPurchase.location }}</div>
          </div>
        </div>
      </div>
    </transition>

    <!-- Social Media Proof -->
    <div class="social-media-proof">
      <div class="social-platform">
        <span class="platform-icon">📘</span>
        <span>4.8/5 on Facebook</span>
      </div>
      <div class="social-platform">
        <span class="platform-icon">🐦</span>
        <span>95% Positive on Twitter</span>
      </div>
      <div class="social-platform">
        <span class="platform-icon">⭐</span>
        <span>Trending #1 Tarot AI</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

// Live activity data
const activities = [
  { text: "🔮 Sarah from New York just received her Premium reading" },
  { text: "✨ Michael from London completed his VIP session" },
  { text: "🌟 Emma from Tokyo upgraded to Ultra Divine" },
  { text: "💫 David from Sydney got incredible accuracy with Professional tier" },
  { text: "🎭 Lisa from Paris discovered her soulmate through our Love reading" },
  { text: "🏆 Alex from Berlin found career clarity with our Career spread" },
  { text: "🌙 Maya from Mumbai unlocked spiritual insights with Night God Oracle" }
]

const reviews = [
  { id: 1, text: "Most accurate reading I've ever had! Changed my life.", author: "Jennifer M." },
  { id: 2, text: "The AI is incredible - better than human psychics.", author: "Robert K." },
  { id: 3, text: "Predicted my promotion exactly! Getting Ultra Divine next.", author: "Amanda L." },
  { id: 4, text: "Love guidance was spot-on. Found my soulmate!", author: "Carlos R." },
  { id: 5, text: "Revolutionary technology. The future of tarot is here.", author: "Priya S." },
  { id: 6, text: "Night God Tarot helped me through my darkest time.", author: "Thomas W." }
]

const purchases = [
  { name: "Sarah M.", tier: "Premium", location: "New York, US" },
  { name: "Alex K.", tier: "VIP", location: "London, UK" },
  { name: "Emma L.", tier: "Ultra Divine", location: "Tokyo, JP" },
  { name: "Michael R.", tier: "Professional", location: "Sydney, AU" },
  { name: "Lisa P.", tier: "Premium", location: "Paris, FR" },
  { name: "David C.", tier: "Quick Insight", location: "Berlin, DE" }
]

const currentActivity = ref(activities[0])
const currentPurchase = ref(purchases[0])
const showPurchaseNotification = ref(false)

// Animated counters
const animatedReadingsCount = ref(0)
const animatedSatisfactionRate = ref(0)
const averageRating = ref(4.9)

// Target values
const targetReadingsCount = 52847
const targetSatisfactionRate = 98

let activityInterval: NodeJS.Timeout
let purchaseInterval: NodeJS.Timeout
let counterInterval: NodeJS.Timeout

const startActivityRotation = () => {
  let currentIndex = 0
  activityInterval = setInterval(() => {
    currentIndex = (currentIndex + 1) % activities.length
    currentActivity.value = activities[currentIndex]
  }, 4000)
}

const startPurchaseNotifications = () => {
  let currentIndex = 0
  
  const showNotification = () => {
    currentPurchase.value = purchases[currentIndex]
    showPurchaseNotification.value = true
    
    setTimeout(() => {
      showPurchaseNotification.value = false
    }, 4000)
    
    currentIndex = (currentIndex + 1) % purchases.length
  }
  
  // Show first notification after 3 seconds
  setTimeout(showNotification, 3000)
  
  // Then show every 15 seconds
  purchaseInterval = setInterval(showNotification, 15000)
}

const startCounterAnimations = () => {
  const duration = 2000 // 2 seconds
  const steps = 60
  const stepDuration = duration / steps
  
  let currentStep = 0
  
  counterInterval = setInterval(() => {
    currentStep++
    const progress = currentStep / steps
    const easeOutQuart = 1 - Math.pow(1 - progress, 4)
    
    animatedReadingsCount.value = Math.floor(targetReadingsCount * easeOutQuart)
    animatedSatisfactionRate.value = Math.floor(targetSatisfactionRate * easeOutQuart)
    
    if (currentStep >= steps) {
      clearInterval(counterInterval)
      animatedReadingsCount.value = targetReadingsCount
      animatedSatisfactionRate.value = targetSatisfactionRate
    }
  }, stepDuration)
}

onMounted(() => {
  startActivityRotation()
  startPurchaseNotifications()
  startCounterAnimations()
})

onUnmounted(() => {
  if (activityInterval) clearInterval(activityInterval)
  if (purchaseInterval) clearInterval(purchaseInterval)
  if (counterInterval) clearInterval(counterInterval)
})
</script>

<style scoped>
.social-proof-container {
  position: relative;
  z-index: 10;
}

/* Live Activity Banner */
.live-activity-banner {
  position: fixed;
  top: 100px;
  left: 20px;
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(34, 197, 94, 0.3);
  border-radius: 12px;
  padding: 12px 16px;
  z-index: 1000;
  max-width: 300px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.pulse-dot {
  width: 8px;
  height: 8px;
  background: #22c55e;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(34, 197, 94, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(34, 197, 94, 0);
  }
}

.activity-text {
  color: #ffffff;
  font-size: 14px;
  font-weight: 500;
}

/* Reviews Ticker */
.reviews-ticker {
  position: fixed;
  bottom: 20px;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding: 12px 0;
  overflow: hidden;
  z-index: 999;
}

.ticker-content {
  display: flex;
  animation: scroll-left 30s linear infinite;
  gap: 60px;
}

@keyframes scroll-left {
  0% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(-100%);
  }
}

.review-item {
  display: flex;
  align-items: center;
  gap: 12px;
  white-space: nowrap;
  color: #ffffff;
  font-size: 14px;
}

.review-rating {
  color: #fbbf24;
}

.review-text {
  font-style: italic;
}

.review-author {
  color: #9ca3af;
  font-weight: 500;
}

/* Trust Stats */
.trust-stats {
  position: fixed;
  top: 50%;
  right: 20px;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 20px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.stat-item {
  text-align: center;
}

.stat-number {
  color: #fbbf24;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 4px;
}

.stat-label {
  color: #ffffff;
  font-size: 12px;
  opacity: 0.8;
}

/* Purchase Notification */
.purchase-notification {
  position: fixed;
  bottom: 100px;
  right: 20px;
  background: rgba(0, 0, 0, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(147, 51, 234, 0.3);
  border-radius: 12px;
  padding: 16px;
  z-index: 1000;
  max-width: 280px;
  box-shadow: 0 8px 32px rgba(147, 51, 234, 0.2);
}

.notification-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.notification-icon {
  font-size: 24px;
  animation: glow 2s ease-in-out infinite;
}

@keyframes glow {
  0%, 100% {
    text-shadow: 0 0 10px rgba(147, 51, 234, 0.5);
  }
  50% {
    text-shadow: 0 0 20px rgba(147, 51, 234, 0.8);
  }
}

.notification-text {
  color: #ffffff;
  font-size: 14px;
}

.notification-location {
  color: #9ca3af;
  font-size: 12px;
  margin-top: 4px;
}

/* Social Media Proof */
.social-media-proof {
  position: fixed;
  top: 200px;
  left: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: 1000;
}

.social-platform {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 8px 12px;
  color: #ffffff;
  font-size: 12px;
  font-weight: 500;
}

.platform-icon {
  font-size: 16px;
}

/* Transitions */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.5s ease;
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* Mobile Responsiveness */
@media (max-width: 768px) {
  .live-activity-banner,
  .trust-stats,
  .social-media-proof {
    display: none;
  }
  
  .purchase-notification {
    right: 10px;
    bottom: 80px;
    max-width: 260px;
  }
  
  .reviews-ticker {
    font-size: 12px;
  }
}

@media (max-width: 480px) {
  .purchase-notification {
    left: 10px;
    right: 10px;
    max-width: none;
  }
}
</style>