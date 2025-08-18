<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-16">
    <div class="container mx-auto px-4">
      <div class="max-w-2xl mx-auto text-center">
        <div class="glass-card p-12">
          <div class="text-6xl mb-6">✨</div>
          <h1 class="text-4xl font-display font-bold text-gradient mb-6">
            Payment Successful!
          </h1>
          <p class="text-xl text-gray-300 mb-8">
            Thank you for supporting Night God Tarot. Your divine journey has been enhanced!
          </p>
          
          <div class="bg-green-900/20 border border-green-400/30 rounded-lg p-6 mb-8">
            <h2 class="text-lg font-semibold text-green-400 mb-2">Your Benefits Include:</h2>
            <ul class="text-gray-300 space-y-2">
              <li>🔮 Unlimited AI-powered readings</li>
              <li>📚 Deep novel content integration</li>
              <li>🎭 Advanced personality analysis</li>
              <li>🌟 Priority customer support</li>
            </ul>
          </div>

          <div class="flex gap-4 justify-center">
            <router-link to="/demo" class="btn-primary">
              🔮 Start Reading
            </router-link>
            <router-link to="/" class="btn-secondary">
              🏠 Home
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { paymentService, type PaymentIntent } from '../services/paymentService'

const route = useRoute()
const paymentDetails = ref<PaymentIntent | null>(null)
const isLoading = ref(true)
const error = ref<string | null>(null)

onMounted(async () => {
  console.log('✅ Payment success page loaded')
  await verifyPayment()
})

async function verifyPayment() {
  try {
    const paymentId = route.query.payment_id as string
    const signature = route.query.signature as string

    if (paymentId) {
      // Verify payment with secure service
      const result = await paymentService.verifyPayment(paymentId)
      
      if (result.success && result.paymentIntent) {
        paymentDetails.value = result.paymentIntent
        
        // Handle payment success
        await paymentService.handlePaymentSuccess(paymentId, signature)
        
        // Show success notification
        if (window.notify) {
          window.notify({
            type: 'success',
            title: 'Payment Verified!',
            message: 'Your membership has been activated.',
            timeout: 5000
          })
        }
      } else {
        error.value = result.error || 'Payment verification failed'
      }
    }
  } catch (err) {
    console.error('Payment verification error:', err)
    error.value = 'Unable to verify payment'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.text-gradient {
  background: linear-gradient(135deg, #ffd700, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
</style>