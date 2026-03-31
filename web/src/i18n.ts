import { createI18n } from 'vue-i18n'

const messages = {}

const savedLocale = localStorage.getItem('locale') || 'en'

export const i18n = createI18n({
    legacy: false,
    locale: savedLocale,
    fallbackLocale: 'en',
    messages,
})