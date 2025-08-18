import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Demo from '../views/Demo.vue'
import AboutView from '../views/AboutView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        title: 'Night God Tarot - Divine AI Wisdom',
        description: 'Experience divine guidance through AI-powered tarot readings'
      }
    },
    {
      path: '/demo',
      name: 'demo',
      component: Demo,
      meta: {
        title: 'Live Demo - Night God Tarot',
        description: 'Try our AI-powered tarot reading system'
      }
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView,
      meta: {
        title: 'About - Night God Tarot',
        description: 'Learn about our divine AI tarot reading system'
      }
    },
    {
      path: '/payment/success',
      name: 'payment-success',
      component: () => import('../views/PaymentSuccess.vue'),
      meta: {
        title: 'Payment Successful - Night God Tarot'
      }
    },
    {
      path: '/payment/cancel',
      name: 'payment-cancel',
      component: () => import('../views/PaymentCancel.vue'),
      meta: {
        title: 'Payment Cancelled - Night God Tarot'
      }
    },
    {
      path: '/admin/dashboard',
      name: 'admin-dashboard',
      component: () => import('../views/admin/AdminDashboard.vue'),
      meta: {
        title: 'Admin Dashboard - Night God Tarot',
        requiresAdmin: true
      }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/NotFound.vue'),
      meta: {
        title: 'Page Not Found - Night God Tarot'
      }
    }
  ]
})

// Navigation guards
router.beforeEach(async (to, from, next) => {
  // Update document title
  if (to.meta.title) {
    document.title = to.meta.title as string
  }
  
  // Update meta description
  if (to.meta.description) {
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', to.meta.description as string)
    }
  }
  
  // Admin authentication check
  if (to.meta.requiresAdmin) {
    try {
      const { useAdminStore } = await import('../stores/adminStore')
      const adminStore = useAdminStore()
      if (!adminStore.isAuthenticated) {
        // Redirect to home page if not authenticated
        next({ name: 'home' })
        return
      }
    } catch (error) {
      console.error('Failed to load admin store:', error)
      next({ name: 'home' })
      return
    }
  }
  
  next()
})

export default router