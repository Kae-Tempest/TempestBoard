// https://nuxt.com/docs/api/configuration/nuxt-config
require('dotenv').config({path: '../.env'});
import {resolve} from 'path'

export default defineNuxtConfig({
    hooks: {
      "pages:extend"(pages) {
          pages.push({
              name: "My Issue",
              path: "/",
              file: resolve(__dirname, 'pages/myIssue.vue')
          })
      }
    },
    devtools: {enabled: true},
    modules: ['@pinia/nuxt', '@pinia-plugin-persistedstate/nuxt'],
    css: [
        '@fortawesome/fontawesome-svg-core/styles.css',
        'assets/bulma.css',
        'assets/app.scss',
        'assets/dark.scss'
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
    },
    vite: {
      build: {
          rollupOptions: {
              external: ['dayjs']
          }
      }
    }
})
