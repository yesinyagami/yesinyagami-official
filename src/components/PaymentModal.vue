<template>
  <div>
    <button @click="openModal" class="btn-primary">
      👑 Upgrade to Night God
    </button>

    <!-- Modal -->
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      @click="closeModal"
    >
      <div
        class="glass-card p-8 m-4 max-w-md w-full"
        @click.stop
      >
        <h2 class="text-2xl font-bold text-gradient mb-6">Choose Payment Method</h2>
        
        <div class="space-y-4">
          <BuyMeCoffeeButton class="w-full justify-center" />
          
          <div class="text-center text-gray-400">or</div>
          
          <button class="btn-primary w-full" @click="handleiPassPayment">
            💳 Pay with iPass Money
          </button>
        </div>

        <button
          @click="closeModal"
          class="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          ✕
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import BuyMeCoffeeButton from './payment/BuyMeCoffeeButton.vue'

const isOpen = ref(false)

function openModal() {
  isOpen.value = true
}

function closeModal() {
  isOpen.value = false
}

function handleiPassPayment() {
  console.log('🏦 Redirecting to iPass payment...')
  // Implementation for iPass payment
  closeModal()
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