import { createApp } from "vue";
import App from "./App.vue";
import { router } from "./router";
import { createPinia } from "pinia";
import "./style.scss";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

createApp(App).use(createPinia().use(piniaPluginPersistedstate)).use(router).mount("#app");
