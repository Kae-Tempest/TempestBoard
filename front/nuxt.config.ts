// https://nuxt.com/docs/api/configuration/nuxt-config
require('dotenv').config({path: '../.env'});
export default defineNuxtConfig({
    devtools: {enabled: true},
    modules: ['@pinia/nuxt', '@pinia-plugin-persistedstate/nuxt'],
    css: [
        '@fortawesome/fontawesome-svg-core/styles.css',
        'assets/bulma.css',
        'assets/app.scss',
    ],
    build: {
        transpile: ['@fortawesome/vue-fontawesome']
    },
    piniaPersistedstate: {
        cookieOptions: {
            sameSite: 'strict',
        },
        storage: 'localStorage'
    },
    runtimeConfig: {
        public: {
            apiBase: process.env.NUXT_PUBLIC_API_BASE || '',
        }
    }
})
