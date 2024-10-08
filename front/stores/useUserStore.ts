import {defineStore} from 'pinia'
import type {User} from "~/types/global";
import type {PersistenceOptions} from 'pinia-plugin-persistedstate'

type PersistOptions = boolean | Partial<PersistenceOptions>

export const useUserStore = defineStore('user', () => {
    // state
    const user = ref<User | null>(null)

    // getters
    const getUser = computed(() => user.value)
    const isAuthenticated = computed(() => !!user.value)

    // actions
    function setUser(newUser: User | null) {
        user.value = newUser
    }

    function clearUser() {
        user.value = null
    }

    return {
        user,
        getUser,
        isAuthenticated,
        setUser,
        clearUser
    }
}, {
    persist: process.client
        ? {
            storage: localStorage,
            paths: ['user']
        } as PersistOptions
        : false
})