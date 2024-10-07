import {defineStore} from 'pinia'
import type {User} from "~/types/global";

export const useUserStore = defineStore('user', () => {
    const user = ref<User>()
    const setUser = (newUser: User) => {
        user.value = newUser
    }
    const getUser = () => {
        return user.value
    }
    return {
        user,
        setUser,
        getUser
    }
}, {persist: true})