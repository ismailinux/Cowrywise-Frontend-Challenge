import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
    state: () => ({
        isPhotoOverlay: false,
        loading: false,
        searching: false,
    }),
    persist: true
})

