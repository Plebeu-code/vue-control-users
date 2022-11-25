import { createApp } from 'vue'
import VueTheMask from 'vue-the-mask'
import routes from './routes'
import App from './App.vue'

import '@unocss/reset/tailwind.css'
import './styles/main.css'
import 'uno.css'

const app = createApp(App)
app.use(routes)
app.use(VueTheMask as any)
app.mount('#app')