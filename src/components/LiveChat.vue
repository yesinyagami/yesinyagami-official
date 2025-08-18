<template>
  <div class="live-chat-widget">
    <!-- Chat Toggle Button -->
    <button 
      @click="toggleChat" 
      class="chat-toggle-btn"
      :class="{ 'pulse': !isOpen && hasUnreadMessages }"
    >
      <span v-if="!isOpen" class="text-2xl">💬</span>
      <span v-else class="text-xl">✕</span>
      <span v-if="!isOpen && hasUnreadMessages" class="notification-dot"></span>
    </button>

    <!-- Chat Window -->
    <transition name="slide-up">
      <div v-if="isOpen" class="chat-window">
        <!-- Header -->
        <div class="chat-header">
          <div class="flex items-center">
            <div class="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold text-sm mr-2">
              🔮
            </div>
            <div>
              <h3 class="font-semibold text-white">Spiritual Support</h3>
              <p class="text-xs text-green-400">🟢 Online • Instant responses</p>
            </div>
          </div>
          <button @click="isOpen = false" class="text-gray-400 hover:text-white">
            ✕
          </button>
        </div>

        <!-- Messages -->
        <div class="chat-messages" ref="messagesContainer">
          <div v-for="message in messages" :key="message.id" 
               :class="['message', message.sender === 'user' ? 'message-user' : 'message-bot']">
            <div class="message-content">
              <p v-html="message.text"></p>
              <span class="message-time">{{ formatTime(message.timestamp) }}</span>
            </div>
          </div>
          
          <!-- Typing indicator -->
          <div v-if="isTyping" class="message message-bot">
            <div class="message-content">
              <div class="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="quick-actions">
          <button @click="sendQuickMessage('pricing')" class="quick-action-btn">
            💰 Pricing Info
          </button>
          <button @click="sendQuickMessage('reading')" class="quick-action-btn">
            🔮 Start Reading
          </button>
          <button @click="sendQuickMessage('help')" class="quick-action-btn">
            ❓ Need Help
          </button>
        </div>

        <!-- Input -->
        <div class="chat-input">
          <input 
            v-model="currentMessage" 
            @keyup.enter="sendMessage"
            @focus="markAsRead"
            placeholder="Ask about readings, pricing, or anything..."
            class="chat-input-field"
          />
          <button @click="sendMessage" :disabled="!currentMessage.trim()" class="send-btn">
            📤
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, watch } from 'vue'

interface Message {
  id: number
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
}

const isOpen = ref(false)
const hasUnreadMessages = ref(true)
const currentMessage = ref('')
const isTyping = ref(false)
const messagesContainer = ref<HTMLElement>()

const messages = ref<Message[]>([
  {
    id: 1,
    text: '✨ Welcome to Night God Tarot! I\'m here to help you with:<br/>• Reading explanations<br/>• Pricing questions<br/>• Technical support<br/>• Spiritual guidance<br/><br/>What can I assist you with today?',
    sender: 'bot',
    timestamp: new Date()
  }
])

const botResponses = {
  pricing: "💰 <strong>Our Reading Tiers:</strong><br/>• Quick Insight: $10 (3 cards)<br/>• Professional: $50 (5 cards)<br/>• Premium: $100 (7 cards) ⭐ Most Popular<br/>• VIP: $300 (10 cards)<br/>• Ultra Divine: $5,000 (15 cards)<br/><br/>All include AI-powered interpretations! <a href='/demo' class='text-yellow-400 underline'>Start your free reading now! 🔮</a>",
  
  reading: "🔮 <strong>Ready for your reading?</strong><br/>You get <strong>3 FREE minutes</strong> to start! Our AI combines multiple oracle systems for incredibly accurate insights.<br/><br/>Popular topics:<br/>💕 Love & Relationships<br/>💼 Career & Money<br/>🌟 Spiritual Growth<br/><br/><a href='/demo' class='text-yellow-400 underline'>Click here to begin your free reading! ✨</a>",
  
  help: "❓ <strong>I'm here to help!</strong><br/>• <strong>First time?</strong> Start with our free 3-minute reading<br/>• <strong>Payment issues?</strong> All major cards accepted, instant access<br/>• <strong>Reading questions?</strong> Our AI provides detailed interpretations<br/>• <strong>Technical problems?</strong> Refresh the page or try incognito mode<br/><br/>Need human support? Email: support@nightgodtarot.com",
  
  default: "I understand you're interested in our spiritual services! 🌟<br/><br/>Here's what makes us special:<br/>• ⚡ Instant AI-powered readings<br/>• 🔒 100% private and confidential<br/>• 🎯 Incredibly accurate insights<br/>• 💎 Multiple reading tiers<br/><br/>Try our <a href='/demo' class='text-yellow-400 underline'>free 3-minute reading</a> to experience the magic! ✨"
}

let messageId = 1

const toggleChat = () => {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    markAsRead()
    nextTick(() => scrollToBottom())
  }
}

const markAsRead = () => {
  hasUnreadMessages.value = false
}

const sendMessage = () => {
  if (!currentMessage.value.trim()) return
  
  // Add user message
  messages.value.push({
    id: ++messageId,
    text: currentMessage.value,
    sender: 'user',
    timestamp: new Date()
  })
  
  const userMsg = currentMessage.value.toLowerCase()
  currentMessage.value = ''
  
  // Simulate bot typing
  isTyping.value = true
  
  setTimeout(() => {
    isTyping.value = false
    
    // Determine response
    let response = botResponses.default
    if (userMsg.includes('price') || userMsg.includes('cost') || userMsg.includes('money')) {
      response = botResponses.pricing
    } else if (userMsg.includes('reading') || userMsg.includes('tarot') || userMsg.includes('card')) {
      response = botResponses.reading
    } else if (userMsg.includes('help') || userMsg.includes('support') || userMsg.includes('problem')) {
      response = botResponses.help
    }
    
    // Add bot response
    messages.value.push({
      id: ++messageId,
      text: response,
      sender: 'bot',
      timestamp: new Date()
    })
    
    nextTick(() => scrollToBottom())
  }, 1000 + Math.random() * 1000)
  
  nextTick(() => scrollToBottom())
}

const sendQuickMessage = (type: string) => {
  const quickMessages = {
    pricing: "What are your pricing options?",
    reading: "I want to start a reading",
    help: "I need help with something"
  }
  
  currentMessage.value = quickMessages[type] || quickMessages.help
  sendMessage()
}

const formatTime = (date: Date) => {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

// Auto-scroll when new messages arrive
watch(messages, () => {
  nextTick(() => scrollToBottom())
}, { deep: true })

// Show notification after delay
onMounted(() => {
  setTimeout(() => {
    if (!isOpen.value) {
      hasUnreadMessages.value = true
    }
  }, 10000) // Show notification after 10 seconds
})
</script>

<style scoped>
.live-chat-widget {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
}

.chat-toggle-btn {
  @apply w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 flex items-center justify-center relative;
}

.chat-toggle-btn:hover {
  transform: scale(1.1);
}

.chat-toggle-btn.pulse {
  animation: pulse-glow 2s infinite;
}

.notification-dot {
  @apply absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white;
  animation: bounce 1s infinite;
}

.chat-window {
  @apply absolute bottom-20 right-0 w-96 h-96 bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden;
  max-width: calc(100vw - 40px);
}

.chat-header {
  @apply flex items-center justify-between p-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white;
}

.chat-messages {
  @apply flex-1 overflow-y-auto p-4 space-y-3;
  scrollbar-width: thin;
  scrollbar-color: #4B5563 #1F2937;
}

.chat-messages::-webkit-scrollbar {
  width: 6px;
}

.chat-messages::-webkit-scrollbar-track {
  background: #1F2937;
}

.chat-messages::-webkit-scrollbar-thumb {
  background: #4B5563;
  border-radius: 3px;
}

.message {
  @apply flex;
}

.message-user {
  @apply justify-end;
}

.message-bot {
  @apply justify-start;
}

.message-content {
  @apply max-w-xs px-3 py-2 rounded-lg;
}

.message-user .message-content {
  @apply bg-gradient-to-r from-purple-500 to-pink-500 text-white;
}

.message-bot .message-content {
  @apply bg-gray-700 text-gray-100;
}

.message-time {
  @apply text-xs opacity-70 block mt-1;
}

.typing-indicator {
  @apply flex space-x-1;
}

.typing-indicator span {
  @apply w-2 h-2 bg-gray-400 rounded-full animate-bounce;
}

.typing-indicator span:nth-child(2) {
  animation-delay: 0.1s;
}

.typing-indicator span:nth-child(3) {
  animation-delay: 0.2s;
}

.quick-actions {
  @apply flex gap-2 p-3 bg-gray-800 border-t border-gray-700 overflow-x-auto;
}

.quick-action-btn {
  @apply bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-sm hover:bg-gray-600 transition-colors whitespace-nowrap;
}

.chat-input {
  @apply flex p-3 bg-gray-800 border-t border-gray-700;
}

.chat-input-field {
  @apply flex-1 bg-gray-700 text-white px-3 py-2 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-400;
}

.send-btn {
  @apply bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-r-lg hover:from-purple-400 hover:to-pink-400 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed;
}

/* Animations */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}

@keyframes pulse-glow {
  0%, 100% {
    box-shadow: 0 0 20px rgba(168, 85, 247, 0.4);
  }
  50% {
    box-shadow: 0 0 30px rgba(168, 85, 247, 0.8);
  }
}

@keyframes bounce {
  0%, 20%, 53%, 80%, 100% {
    transform: translate3d(0,0,0);
  }
  40%, 43% {
    transform: translate3d(0, -8px, 0);
  }
  70% {
    transform: translate3d(0, -4px, 0);
  }
  90% {
    transform: translate3d(0, -2px, 0);
  }
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .chat-window {
    @apply w-80 h-80;
  }
}

@media (max-width: 420px) {
  .chat-window {
    @apply w-72 h-72;
  }
}
</style>