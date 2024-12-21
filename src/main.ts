import '@/assets/main.css'
import 'primeicons/primeicons.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { autoAnimatePlugin } from '@formkit/auto-animate/vue'
import PrimeVue from 'primevue/config'

import App from '@/App.vue'
import router from '@/router'
import { Noir } from '@/themes/noir'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(autoAnimatePlugin)
app.use(PrimeVue, {
  theme: {
    preset: Noir,
    options: {
      darkModeSelector: false || 'none',
    },
  },
})

app.mount('#app')
