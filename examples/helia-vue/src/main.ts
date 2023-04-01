import { createApp } from 'vue'
import App from './App.vue'
import HeliaProvider from './plugins/HeliaProvider'

import './assets/main.css'

const app = createApp(App)
app.use(HeliaProvider, {})
app.mount("#app")
