<!--
  Welcome Guide - Enterprise User Onboarding
  Top-tier UX design for first-time users
-->

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="showWelcome" class="welcome-overlay">
        <div class="welcome-container">
          <div class="welcome-header">
            <div class="welcome-logo">🌙</div>
            <h1>Welcome to Night God Tarot</h1>
            <p>Experience divine guidance through AI-powered wisdom</p>
          </div>
          
          <div class="welcome-steps">
            <div class="step-indicator">
              <div 
                v-for="(step, index) in steps" 
                :key="index"
                :class="['step-dot', { active: currentStep === index, completed: currentStep > index }]"
              ></div>
            </div>
            
            <div class="step-content">
              <Transition name="slide" mode="out-in">
                <div :key="currentStep" class="step-card">
                  <div class="step-icon">{{ steps[currentStep].icon }}</div>
                  <h3>{{ steps[currentStep].title }}</h3>
                  <p>{{ steps[currentStep].description }}</p>
                  
                  <div v-if="currentStep === 0" class="demo-cards">
                    <div class="demo-card" v-for="card in sampleCards" :key="card.name">
                      <img :src="card.image" :alt="card.name" />
                      <span>{{ card.name }}</span>
                    </div>
                  </div>
                  
                  <div v-if="currentStep === 1" class="ai-demo">
                    <div class="ai-models">
                      <div class="ai-model" v-for="model in aiModels" :key="model.name">
                        <div class="model-icon">{{ model.icon }}</div>
                        <div class="model-info">
                          <h4>{{ model.name }}</h4>
                          <p>{{ model.description }}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div v-if="currentStep === 2" class="membership-preview">
                    <div class="tier-card" v-for="tier in membershipTiers" :key="tier.name">
                      <div class="tier-icon">{{ tier.icon }}</div>
                      <h4>{{ tier.name }}</h4>
                      <p class="tier-price">{{ tier.price }}</p>
                      <ul class="tier-features">
                        <li v-for="feature in tier.features.slice(0, 3)" :key="feature">{{ feature }}</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </Transition>
            </div>
          </div>
          
          <div class="welcome-actions">
            <button 
              v-if="currentStep > 0" 
              @click="prevStep" 
              class="btn secondary"
            >
              Previous
            </button>
            
            <button 
              v-if="currentStep < steps.length - 1" 
              @click="nextStep" 
              class="btn primary"
            >
              Next
            </button>
            
            <button 
              v-if="currentStep === steps.length - 1" 
              @click="startExperience" 
              class="btn primary large"
            >
              Start Your Journey
            </button>
          </div>
          
          <div class="welcome-footer">
            <label class="skip-option">
              <input v-model="dontShowAgain" type="checkbox" />
              <span>Don't show this again</span>
            </label>
            
            <button @click="skipWelcome" class="skip-btn">Skip Tour</button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const showWelcome = ref(false)
const currentStep = ref(0)
const dontShowAgain = ref(false)

const steps = [
  {
    icon: '🃏',
    title: 'Choose Your Sacred Cards',
    description: 'Select from 94 mystical tarot cards including 22 Major Arcana, 56 Minor Arcana, and 16 Hidden Oracle cards for personalized readings.'
  },
  {
    icon: '🤖',
    title: 'AI-Powered Wisdom',
    description: 'Experience unlimited Monica AI with access to Claude, GPT, Yi, and Gemini models working together to provide profound insights.'
  },
  {
    icon: '💎',
    title: 'Membership Tiers',
    description: 'Choose your spiritual journey with Free Spirit, Moon Shadow, or Night God membership levels for enhanced features.'
  },
  {
    icon: '✨',
    title: 'Divine Guidance Awaits',
    description: 'Ready to unlock the mysteries of your past, present, and future with cutting-edge AI technology and ancient wisdom.'
  }
]

const sampleCards = [
  { name: 'The Fool', image: '/assets/01_The_Fool.png' },
  { name: 'The Star', image: '/assets/18_The_Star.png' },
  { name: 'The Moon', image: '/assets/19_The_Moon.png' }
]

const aiModels = [
  { 
    name: 'Monica AI', 
    icon: '🌙', 
    description: 'Unlimited access to premium AI models' 
  },
  { 
    name: 'Claude', 
    icon: '🧠', 
    description: 'Advanced reasoning and interpretation' 
  },
  { 
    name: 'GPT-4', 
    icon: '💡', 
    description: 'Creative insights and storytelling' 
  }
]

const membershipTiers = [
  {
    name: 'Free Spirit',
    icon: '🌟',
    price: '$0/month',
    features: ['3 daily readings', 'Basic interpretations', 'Community access']
  },
  {
    name: 'Moon Shadow',
    icon: '🌙',
    price: '$5/month',
    features: ['Unlimited readings', 'Advanced AI insights', 'Hidden Oracle access']
  },
  {
    name: 'Night God',
    icon: '👑',
    price: '$12/month',
    features: ['Personal AI oracle', 'Custom reading styles', 'VIP community']
  }
]

function nextStep() {
  if (currentStep.value < steps.length - 1) {
    currentStep.value++
  }
}

function prevStep() {
  if (currentStep.value > 0) {
    currentStep.value--
  }
}

function startExperience() {
  if (dontShowAgain.value) {
    localStorage.setItem('welcome_completed', 'true')
  }
  showWelcome.value = false
}

function skipWelcome() {
  if (dontShowAgain.value) {
    localStorage.setItem('welcome_completed', 'true')
  }
  showWelcome.value = false
}

onMounted(() => {
  const hasCompletedWelcome = localStorage.getItem('welcome_completed')
  if (!hasCompletedWelcome) {
    setTimeout(() => {
      showWelcome.value = true
    }, 1000)
  }
})
</script>

<style scoped>
.welcome-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.95);
  backdrop-filter: blur(20px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 2rem;
}

.welcome-container {
  background: linear-gradient(145deg, #1a1a2e 0%, #16213e 100%);
  border-radius: 24px;
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 25px 80px rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(107, 70, 193, 0.3);
}

.welcome-header {
  text-align: center;
  padding: 3rem 2rem 2rem 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.welcome-logo {
  font-size: 4rem;
  margin-bottom: 1rem;
  filter: drop-shadow(0 4px 8px rgba(107, 70, 193, 0.3));
}

.welcome-header h1 {
  margin: 0 0 1rem 0;
  color: #fff;
  font-size: 2.5rem;
  font-weight: 300;
}

.welcome-header p {
  margin: 0;
  color: #a0a0a0;
  font-size: 1.1rem;
}

.welcome-steps {
  padding: 2rem;
}

.step-indicator {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 3rem;
}

.step-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.step-dot.active {
  background: #667eea;
  transform: scale(1.2);
}

.step-dot.completed {
  background: #4ade80;
}

.step-content {
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.step-card {
  text-align: center;
  max-width: 600px;
}

.step-icon {
  font-size: 4rem;
  margin-bottom: 2rem;
}

.step-card h3 {
  margin: 0 0 1rem 0;
  color: #e0e0e0;
  font-size: 1.8rem;
  font-weight: 500;
}

.step-card p {
  margin: 0 0 2rem 0;
  color: #a0a0a0;
  font-size: 1.1rem;
  line-height: 1.6;
}

.demo-cards {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-top: 2rem;
}

.demo-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  opacity: 0.8;
  transition: all 0.3s ease;
}

.demo-card:hover {
  opacity: 1;
  transform: translateY(-4px);
}

.demo-card img {
  width: 60px;
  height: 105px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.demo-card span {
  color: #c0c0c0;
  font-size: 0.9rem;
}

.ai-models {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: 2rem;
}

.ai-model {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.model-icon {
  font-size: 2rem;
}

.model-info h4 {
  margin: 0 0 0.5rem 0;
  color: #e0e0e0;
  font-weight: 600;
}

.model-info p {
  margin: 0;
  color: #a0a0a0;
  font-size: 0.9rem;
}

.membership-preview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 2rem;
}

.tier-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
}

.tier-icon {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.tier-card h4 {
  margin: 0 0 0.5rem 0;
  color: #e0e0e0;
  font-weight: 600;
}

.tier-price {
  margin: 0 0 1rem 0;
  color: #667eea;
  font-weight: 700;
  font-size: 1.1rem;
}

.tier-features {
  list-style: none;
  padding: 0;
  margin: 0;
}

.tier-features li {
  color: #a0a0a0;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.welcome-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  padding: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.btn {
  padding: 0.75rem 2rem;
  border-radius: 10px;
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

.btn.primary.large {
  padding: 1rem 3rem;
  font-size: 1.1rem;
}

.btn.secondary {
  background: rgba(255, 255, 255, 0.1);
  color: #e0e0e0;
}

.btn.secondary:hover {
  background: rgba(255, 255, 255, 0.15);
}

.welcome-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.skip-option {
  display: flex;
  align-items: center;
  color: #a0a0a0;
  font-size: 0.9rem;
  cursor: pointer;
}

.skip-option input {
  margin-right: 0.5rem;
  accent-color: #667eea;
}

.skip-btn {
  background: none;
  border: none;
  color: #a0a0a0;
  cursor: pointer;
  font-size: 0.9rem;
  transition: color 0.3s ease;
}

.skip-btn:hover {
  color: #fff;
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

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.slide-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

/* Responsive */
@media (max-width: 768px) {
  .welcome-container {
    margin: 1rem;
    border-radius: 16px;
  }
  
  .welcome-header {
    padding: 2rem 1rem 1rem 1rem;
  }
  
  .welcome-logo {
    font-size: 3rem;
  }
  
  .welcome-header h1 {
    font-size: 2rem;
  }
  
  .welcome-steps {
    padding: 1rem;
  }
  
  .step-content {
    min-height: 300px;
  }
  
  .demo-cards {
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }
  
  .membership-preview {
    grid-template-columns: 1fr;
  }
  
  .welcome-actions {
    flex-direction: column;
  }
  
  .welcome-footer {
    flex-direction: column;
    gap: 1rem;
  }
}
</style>