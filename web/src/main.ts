import { createApp } from 'vue'
import './style.css'
import Main from './Main.vue'
import {router} from "./router.ts";
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { i18n } from './i18n.ts'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

const app = createApp(Main)
app.use(pinia)
app.use(router)
app.use(i18n)
app.mount('#app')