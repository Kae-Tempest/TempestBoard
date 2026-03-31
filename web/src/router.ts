
import {createRouter, createWebHistory} from 'vue-router'

import NotFound from "./view/NotFound.vue";
import App from './view/App.vue'

const routes = [
    { path: '/:pathMatch(.*)*', name: "NotFound", component: NotFound },
    { path: '/app', component: App}
]

export const router = createRouter({
    history: createWebHistory(),
    routes,
})