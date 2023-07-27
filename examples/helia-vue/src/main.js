import { createApp } from 'vue'
import { HeliaProviderPlugin } from './plugins/HeliaProviderPlugin'
import App from '@/App.vue'

import './assets/main.css'

const app = createApp(App)
app.use(HeliaProviderPlugin)
app.mount('#app')
