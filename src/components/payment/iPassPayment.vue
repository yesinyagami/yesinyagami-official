<template>
  <div class="payment-card">
    <div class="payment-header">
      <div class="payment-icon">💳</div>
      <h3 class="payment-title">iPass Money</h3>
      <p class="payment-subtitle">Secure membership upgrades</p>
    </div>
    
    <div class="membership-tiers">
      <div 
        v-for="tier in membershipTiers" 
        :key="tier.id"
        class="tier-card"
        :class="{ 'tier-popular': tier.popular }"
      >
        <div v-if="tier.popular" class="popular-badge">Most Popular</div>
        
        <div class="tier-header">
          <h4 class="tier-name">{{ tier.name }}</h4>
          <div class="tier-price">
            <span class="currency">$</span>
            <span class="amount">{{ tier.price }}</span>
            <span class="period">/month</span>
          </div>
        </div>
        
        <ul class="tier-features">
          <li v-for="feature in tier.features" :key="feature" class="feature-item">
            <span class="feature-check">✓</span>
            {{ feature }}
          </li>
        </ul>
        
        <button 
          @click="handleUpgrade(tier)"
          class="upgrade-btn"
          :class="tier.popular ? 'upgrade-btn-popular' : 'upgrade-btn-normal'"
          :disabled="isProcessing"
        >
          <span v-if="isProcessing && selectedTier === tier.id" class="spinner"></span>
          {{ isProcessing && selectedTier === tier.id ? 'Processing...' : `Upgrade to ${tier.name}` }}
        </button>
      </div>
    </div>
    
    <!-- Payment Security -->
    <div class="security-info">
      <div class="security-item">
        <span class="security-icon">🔒</span>
        <span class="security-text">256-bit SSL encryption</span>
      </div>
      <div class="security-item">
        <span class="security-icon">💯</span>
        <span class="security-text">100% secure payments</span>
      </div>
      <div class="security-item">
        <span class="security-icon">↩️</span>
        <span class="security-text">30-day money back</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { paymentService, type PaymentResult } from '../../services/paymentService'

interface MembershipTier {
  id: string
  name: string
  price: number
  popular: boolean
  features: string[]
  ipassProductId?: string
}

const isProcessing = ref(false)
const selectedTier = ref<string | null>(null)

const membershipTiers: MembershipTier[] = [
  {
    id: 'moon-shadow',
    name: 'Moon Shadow',
    price: 5,
    popular: true,
    features: [
      'Unlimited readings',
      'Advanced AI interpretations', 
      'Hidden Oracle access',
      'Novel wisdom integration',
      'Priority support'
    ],
    ipassProductId: 'night_god_moon_shadow'
  },
  {
    id: 'night-god',
    name: 'Night God',
    price: 12,
    popular: false,
    features: [
      'Everything in Moon Shadow',
      'Personal AI oracle',
      'Custom reading styles',
      'Export & share readings',
      'VIP community access'
    ],
    ipassProductId: 'night_god_ultimate'
  }
]

async function handleUpgrade(tier: MembershipTier) {
  isProcessing.value = true
  selectedTier.value = tier.id
  
  try {
    console.log(`iPass upgrade initiated: ${tier.name} - $${tier.price}`)
    
    // Use secure payment service
    const result: PaymentResult = await paymentService.createMembershipPayment(tier.id, tier.price)
    
    if (result.success && result.redirectUrl) {
      // Secure redirect to payment page
      window.location.href = result.redirectUrl
    } else if (result.error) {
      // Show user-friendly error message
      showErrorMessage(`Payment failed: ${result.error}`)
    } else {
      // Fallback: direct iPass URL with security measures
      const returnUrl = encodeURIComponent(`${window.location.origin}/payment-success?tier=${tier.id}`)
      const cancelUrl = encodeURIComponent(`${window.location.origin}/payment-cancel`)
      const ipassUrl = `https://payment.ipass.money/pay?product=${tier.ipassProductId}&amount=${tier.price}&currency=USD&return_url=${returnUrl}&cancel_url=${cancelUrl}`
      
      window.open(ipassUrl, '_blank', 'noopener,noreferrer')
    }
    
  } catch (error) {
    console.error('Payment initiation failed:', error)
    showErrorMessage('Network error. Please check your connection and try again.')
  } finally {
    isProcessing.value = false
    selectedTier.value = null
  }
}

function showErrorMessage(message: string) {
  // Create and show a user-friendly error notification
  const notification = document.createElement('div')
  notification.className = 'fixed top-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg z-50 max-w-sm'
  notification.innerHTML = `
    <div class="flex items-center gap-3">
      <span class="text-xl">⚠️</span>
      <div>
        <p class="font-semibold">Payment Error</p>
        <p class="text-sm">${message}</p>
      </div>
      <button onclick="this.parentElement.parentElement.remove()" class="ml-auto text-white hover:text-gray-200">✕</button>
    </div>
  `
  
  document.body.appendChild(notification)
  
  // Auto-remove after 5 seconds
  setTimeout(() => {
    if (notification.parentElement) {
      notification.remove()
    }
  }, 5000)
}
</script>

<style scoped>
.payment-card {
  @apply bg-gradient-to-br from-purple-900/20 to-blue-900/20 p-6 rounded-2xl border border-purple-500/30 backdrop-blur-sm max-w-2xl mx-auto;
}

.payment-header {
  @apply text-center mb-6;
}

.payment-icon {
  @apply text-4xl mb-3;
}

.payment-title {
  @apply text-xl font-bold text-purple-400 mb-2;
}

.payment-subtitle {
  @apply text-gray-300 text-sm;
}

.membership-tiers {
  @apply grid md:grid-cols-2 gap-4 mb-6;
}

.tier-card {
  @apply relative bg-slate-800/50 border border-slate-600/50 rounded-xl p-6 transition-all duration-300 hover:border-purple-500/50;
}

.tier-popular {
  @apply border-purple-500/70 bg-purple-900/20 ring-2 ring-purple-400/30;
}

.popular-badge {
  @apply absolute -top-3 left-1/2 transform -translate-x-1/2 bg-purple-500 text-white text-xs px-4 py-1 rounded-full font-bold;
}

.tier-header {
  @apply text-center mb-4;
}

.tier-name {
  @apply text-lg font-bold text-purple-300 mb-2;
}

.tier-price {
  @apply flex items-baseline justify-center;
}

.currency {
  @apply text-lg text-gray-400;
}

.amount {
  @apply text-3xl font-bold text-purple-400;
}

.period {
  @apply text-sm text-gray-400 ml-1;
}

.tier-features {
  @apply space-y-2 mb-6;
}

.feature-item {
  @apply flex items-center gap-3 text-sm text-gray-300;
}

.feature-check {
  @apply text-purple-400 font-bold;
}

.upgrade-btn {
  @apply w-full py-3 rounded-lg font-bold transition-all duration-300 flex items-center justify-center gap-2;
}

.upgrade-btn-normal {
  @apply bg-slate-700 hover:bg-slate-600 text-white;
}

.upgrade-btn-popular {
  @apply bg-purple-600 hover:bg-purple-500 text-white;
}

.spinner {
  @apply w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin;
}

.security-info {
  @apply grid grid-cols-3 gap-4 pt-6 border-t border-purple-600/30;
}

.security-item {
  @apply flex flex-col items-center gap-2 text-center;
}

.security-icon {
  @apply text-lg;
}

.security-text {
  @apply text-xs text-gray-400;
}

@media (max-width: 768px) {
  .membership-tiers {
    @apply grid-cols-1;
  }
  
  .security-info {
    @apply grid-cols-1 gap-2;
  }
  
  .security-item {
    @apply flex-row justify-center;
  }
}
</style>