import { createApp } from 'vue'
import App from '@/App.vue'
import { HeliaProviderPlugin } from './plugins/HeliaProviderPlugin'

import './assets/main.css'

const app = createApp(App)
app.use(HeliaProviderPlugin)
app.mount('#app')
