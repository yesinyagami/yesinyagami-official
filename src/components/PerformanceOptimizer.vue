<template>
  <div></div>
</template>

<script setup lang="ts">
import { onMounted, nextTick } from 'vue'

// Performance monitoring and optimization
onMounted(() => {
  // Image lazy loading optimization
  const observeImages = () => {
    const images = document.querySelectorAll('img[data-src]')
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement
          img.src = img.dataset.src!
          img.removeAttribute('data-src')
          imageObserver.unobserve(img)
        }
      })
    })
    
    images.forEach(img => imageObserver.observe(img))
  }

  // Progressive component loading
  const loadNonCriticalComponents = () => {
    setTimeout(() => {
      // Load particle system after 1 second
      const particleSystem = document.querySelector('.particle-system')
      if (particleSystem) {
        particleSystem.classList.add('loaded')
      }
    }, 1000)

    setTimeout(() => {
      // Load background effects after 2 seconds
      const starField = document.querySelector('.star-field')
      if (starField) {
        starField.classList.add('loaded')
      }
    }, 2000)
  }

  // Critical path optimization
  const optimizeCriticalPath = () => {
    // Preconnect to external domains
    const preconnectLinks = [
      'https://fonts.googleapis.com',
      'https://api.nightgodtarot.com'
    ]
    
    preconnectLinks.forEach(href => {
      const link = document.createElement('link')
      link.rel = 'preconnect'
      link.href = href
      document.head.appendChild(link)
    })

    // Preload critical resources
    const preloadResources = [
      { href: '/assets/night-god-logo.jpg', as: 'image' },
      { href: '/api/cards/essential', as: 'fetch', crossorigin: 'anonymous' }
    ]
    
    preloadResources.forEach(resource => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.href = resource.href
      link.as = resource.as
      if (resource.crossorigin) link.crossOrigin = resource.crossorigin
      document.head.appendChild(link)
    })
  }

  // Bundle size optimization hints
  const optimizeBundleSize = () => {
    // Mark unused components for tree shaking
    if (typeof window !== 'undefined') {
      window.__UNUSED_COMPONENTS__ = [
        'dev-only-components',
        'debug-utilities'
      ]
    }
  }

  // Memory management
  const setupMemoryManagement = () => {
    // Clear unused data periodically
    setInterval(() => {
      // Clear old readings cache
      const readings = JSON.parse(localStorage.getItem('readings_cache') || '[]')
      const filtered = readings.slice(-10) // Keep only last 10
      localStorage.setItem('readings_cache', JSON.stringify(filtered))
    }, 300000) // Every 5 minutes

    // Handle visibility change for performance
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        // Pause animations when tab is hidden
        const animations = document.querySelectorAll('[class*="animate-"]')
        animations.forEach(el => {
          el.classList.add('paused')
        })
      } else {
        // Resume animations when tab is visible
        const pausedAnimations = document.querySelectorAll('.paused')
        pausedAnimations.forEach(el => {
          el.classList.remove('paused')
        })
      }
    })
  }

  // Core Web Vitals optimization
  const optimizeWebVitals = () => {
    // Largest Contentful Paint optimization
    const criticalImages = document.querySelectorAll('img[priority="high"]')
    criticalImages.forEach(img => {
      img.setAttribute('fetchpriority', 'high')
    })

    // Cumulative Layout Shift prevention
    const aspectRatioImages = document.querySelectorAll('img[width][height]')
    aspectRatioImages.forEach(img => {
      const width = img.getAttribute('width')
      const height = img.getAttribute('height')
      if (width && height) {
        img.style.aspectRatio = `${width} / ${height}`
      }
    })

    // First Input Delay optimization
    nextTick(() => {
      // Defer non-essential JavaScript
      setTimeout(() => {
        // Analytics would be loaded here if available
        console.log('Analytics loading deferred')
      }, 3000)
    })
  }

  // Service Worker for caching
  const registerServiceWorker = () => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').then(registration => {
        console.log('SW registered:', registration)
      }).catch(error => {
        console.log('SW registration failed:', error)
      })
    }
  }

  // Initialize all optimizations
  optimizeCriticalPath()
  observeImages()
  loadNonCriticalComponents()
  optimizeBundleSize()
  setupMemoryManagement()
  optimizeWebVitals()
  registerServiceWorker()

  // Performance monitoring
  if ('PerformanceObserver' in window) {
    // Monitor Core Web Vitals
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.entryType === 'largest-contentful-paint') {
          console.log('LCP:', entry.startTime)
        }
        if (entry.entryType === 'first-input') {
          console.log('FID:', entry.processingStart - entry.startTime)
        }
        if (entry.entryType === 'layout-shift') {
          console.log('CLS:', entry.value)
        }
      })
    })

    observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] })
  }
})
</script>

<style>
/* Performance-related styles */
.paused {
  animation-play-state: paused !important;
}

/* Lazy loading placeholder */
img[data-src] {
  background: linear-gradient(90deg, #f0f0f0 25%, transparent 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading-shimmer 1.5s infinite;
}

@keyframes loading-shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* Progressive loading states */
.particle-system {
  opacity: 0;
  transition: opacity 0.5s ease;
}

.particle-system.loaded {
  opacity: 1;
}

.star-field {
  opacity: 0;
  transition: opacity 1s ease;
}

.star-field.loaded {
  opacity: 1;
}
</style>