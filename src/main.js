import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import VueTheMask from "vue-the-mask";



import App from './App.vue'
import router from './router'
import i18n from "./i18n/index"

const app = createApp(App)
app.use(VueTheMask);
app.use(createPinia())
app.use(router)
app.use(i18n);
app.mount('#app')
