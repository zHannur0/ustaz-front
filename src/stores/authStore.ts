import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null as null | { email: string }
    }),
    actions: {
        async login(email: string) {
            this.user = { email }
        },
        async loginWithGoogle() {
            window.location.href = '/api/login/google'
        }
    }
})
