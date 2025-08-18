<template>
  <div class="fixed top-4 right-4 z-50 space-y-2">
    <transition-group name="notification" tag="div">
      <div
        v-for="notification in notifications"
        :key="notification.id"
        :class="[
          'max-w-sm p-4 rounded-lg shadow-lg backdrop-blur-sm border',
          getNotificationClasses(notification.type)
        ]"
      >
        <div class="flex items-start gap-3">
          <div class="flex-shrink-0">
            <component :is="getIcon(notification.type)" class="w-5 h-5" />
          </div>
          <div class="flex-1">
            <h4 v-if="notification.title" class="font-semibold text-sm mb-1">
              {{ notification.title }}
            </h4>
            <p class="text-sm">{{ notification.message }}</p>
          </div>
          <button
            @click="removeNotification(notification.id)"
            class="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </transition-group>
  </div>
</template>

<script setup lang="ts">
import { ref, h } from 'vue'

interface Notification {
  id: string
  type: 'info' | 'success' | 'warning' | 'error'
  title?: string
  message: string
  timeout?: number
}

const notifications = ref<Notification[]>([])

function addNotification(notification: Omit<Notification, 'id'>) {
  const id = Date.now().toString()
  const newNotification = { ...notification, id }
  
  notifications.value.push(newNotification)
  
  // Auto remove after timeout
  const timeout = notification.timeout || 5000
  setTimeout(() => {
    removeNotification(id)
  }, timeout)
  
  return id
}

function removeNotification(id: string) {
  const index = notifications.value.findIndex(n => n.id === id)
  if (index > -1) {
    notifications.value.splice(index, 1)
  }
}

function getNotificationClasses(type: Notification['type']) {
  const baseClasses = 'bg-black/80 border-white/20 text-white'
  
  switch (type) {
    case 'success':
      return `${baseClasses} border-green-400/30 bg-green-900/20`
    case 'warning':
      return `${baseClasses} border-yellow-400/30 bg-yellow-900/20`
    case 'error':
      return `${baseClasses} border-red-400/30 bg-red-900/20`
    default:
      return `${baseClasses} border-blue-400/30 bg-blue-900/20`
  }
}

function getIcon(type: Notification['type']) {
  switch (type) {
    case 'success':
      return () => h('svg', {
        class: 'w-5 h-5 text-green-400',
        fill: 'currentColor',
        viewBox: '0 0 20 20'
      }, [
        h('path', {
          fillRule: 'evenodd',
          d: 'M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z',
          clipRule: 'evenodd'
        })
      ])
    case 'warning':
      return () => h('svg', {
        class: 'w-5 h-5 text-yellow-400',
        fill: 'currentColor',
        viewBox: '0 0 20 20'
      }, [
        h('path', {
          fillRule: 'evenodd',
          d: 'M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z',
          clipRule: 'evenodd'
        })
      ])
    case 'error':
      return () => h('svg', {
        class: 'w-5 h-5 text-red-400',
        fill: 'currentColor',
        viewBox: '0 0 20 20'
      }, [
        h('path', {
          fillRule: 'evenodd',
          d: 'M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z',
          clipRule: 'evenodd'
        })
      ])
    default:
      return () => h('svg', {
        class: 'w-5 h-5 text-blue-400',
        fill: 'currentColor',
        viewBox: '0 0 20 20'
      }, [
        h('path', {
          fillRule: 'evenodd',
          d: 'M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z',
          clipRule: 'evenodd'
        })
      ])
  }
}

// Global notification system
if (typeof window !== 'undefined') {
  window.notify = (message: string, type?: string) => {
    addNotification({
      message,
      type: type || 'info',
      timeout: 5000
    })
  }
}

// Export for composable use
defineExpose({
  addNotification,
  removeNotification
})
</script>

<style scoped>
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.notification-move {
  transition: transform 0.3s ease;
}
</style>