<template>
  <div class="payment-card">
    <div class="payment-header">
      <div class="payment-icon">☕</div>
      <h3 class="payment-title">Buy Me a Coffee</h3>
      <p class="payment-subtitle">Support with a one-time donation</p>
    </div>
    
    <div class="payment-amounts">
      <button 
        v-for="amount in amounts" 
        :key="amount.value"
        @click="handleDonation(amount)"
        class="amount-btn"
        :class="{ 'amount-btn-popular': amount.popular }"
      >
        <span class="amount-value">${{ amount.value }}</span>
        <span class="amount-label">{{ amount.label }}</span>
        <span v-if="amount.popular" class="popular-badge">Popular</span>
      </button>
    </div>
    
    <div class="payment-benefits">
      <div class="benefit-item">
        <span class="benefit-icon">✨</span>
        <span class="benefit-text">Support mystical development</span>
      </div>
      <div class="benefit-item">
        <span class="benefit-icon">🙏</span>
        <span class="benefit-text">Join our supporters community</span>
      </div>
    </div>
    
    <!-- Custom Amount -->
    <div class="custom-amount">
      <input 
        v-model="customAmount" 
        type="number" 
        placeholder="Custom amount" 
        class="custom-input"
        min="1"
        max="500"
      />
      <button 
        @click="handleCustomDonation" 
        :disabled="!isValidCustomAmount"
        class="custom-btn"
      >
        Donate ${{ customAmount || 0 }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { paymentService, type PaymentResult } from '../../services/paymentService'

const customAmount = ref('')

const amounts = [
  { value: 3, label: 'Coffee', popular: false },
  { value: 7, label: 'Deluxe', popular: true },
  { value: 15, label: 'Supporter', popular: false },
  { value: 30, label: 'Champion', popular: false }
]

const isValidCustomAmount = computed(() => {
  const amount = parseFloat(customAmount.value)
  return amount && amount >= 1 && amount <= 500
})

const buyMeCoffeeUrl = computed(() => {
  return import.meta.env.BUYMEACOFFEE_PROFILE_URL || 'https://buymeacoffee.com/nightgodtarot'
})

async function handleDonation(amount: { value: number; label: string }) {
  try {
    const result: PaymentResult = await paymentService.createCoffeePayment(
      amount.value,
      `Thank you for supporting Night God Tarot! ${amount.label}`
    )
    
    if (result.success && result.redirectUrl) {
      window.location.href = result.redirectUrl
    } else {
      // Fallback to direct Buy Me Coffee URL
      const url = `${buyMeCoffeeUrl.value}?amount=${amount.value}`
      window.open(url, '_blank', 'noopener,noreferrer')
    }
    
    console.log(`Buy Me Coffee donation initiated: $${amount.value}`)
    
  } catch (error) {
    console.error('Donation error:', error)
    // Fallback to direct URL
    const url = `${buyMeCoffeeUrl.value}?amount=${amount.value}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }
}

async function handleCustomDonation() {
  if (!isValidCustomAmount.value) return
  
  const amount = parseFloat(customAmount.value)
  
  try {
    const result: PaymentResult = await paymentService.createCoffeePayment(
      amount,
      'Custom donation to support Night God Tarot'
    )
    
    if (result.success && result.redirectUrl) {
      window.location.href = result.redirectUrl
    } else {
      // Fallback to direct Buy Me Coffee URL
      const url = `${buyMeCoffeeUrl.value}?amount=${amount}`
      window.open(url, '_blank', 'noopener,noreferrer')
    }
    
    console.log(`Buy Me Coffee custom donation initiated: $${amount}`)
    
  } catch (error) {
    console.error('Custom donation error:', error)
    // Fallback to direct URL
    const url = `${buyMeCoffeeUrl.value}?amount=${amount}`
    window.open(url, '_blank', 'noopener,noreferrer')
  } finally {
    customAmount.value = ''
  }
}
</script>

<style scoped>
.payment-card {
  @apply bg-gradient-to-br from-amber-900/20 to-orange-900/20 p-6 rounded-2xl border border-amber-500/30 backdrop-blur-sm max-w-sm mx-auto;
}

.payment-header {
  @apply text-center mb-6;
}

.payment-icon {
  @apply text-4xl mb-3;
}

.payment-title {
  @apply text-xl font-bold text-amber-400 mb-2;
}

.payment-subtitle {
  @apply text-gray-300 text-sm;
}

.payment-amounts {
  @apply grid grid-cols-2 gap-3 mb-6;
}

.amount-btn {
  @apply relative bg-amber-800/30 hover:bg-amber-700/40 border border-amber-600/50 hover:border-amber-500 rounded-lg p-3 transition-all duration-300 flex flex-col items-center transform hover:scale-105;
}

.amount-btn-popular {
  @apply bg-amber-700/40 border-amber-500 ring-2 ring-amber-400/30;
}

.amount-value {
  @apply text-lg font-bold text-amber-300;
}

.amount-label {
  @apply text-xs text-gray-400 mt-1;
}

.popular-badge {
  @apply absolute -top-2 -right-2 bg-amber-500 text-black text-xs px-2 py-1 rounded-full font-bold;
}

.payment-benefits {
  @apply space-y-2 mb-6;
}

.benefit-item {
  @apply flex items-center gap-3 text-sm text-gray-300;
}

.benefit-icon {
  @apply text-amber-400;
}

.custom-amount {
  @apply flex gap-2 border-t border-amber-600/30 pt-4;
}

.custom-input {
  @apply flex-1 bg-amber-900/30 border border-amber-600/50 rounded-lg px-3 py-2 text-amber-300 placeholder-amber-600 focus:outline-none focus:border-amber-500;
}

.custom-btn {
  @apply bg-amber-600 hover:bg-amber-500 disabled:bg-gray-700 disabled:text-gray-500 text-black font-bold px-4 py-2 rounded-lg transition-colors whitespace-nowrap;
}
</style>