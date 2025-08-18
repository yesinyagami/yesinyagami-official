import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

import './assets/main.css'

// Import AI services (will initialize on demand)
// import { aiSystem } from './services/ai'

const app = createApp(App)

app.use(createPinia())
app.use(router)

// Initialize AI system on demand
// Application startup - production ready

app.mount('#app')