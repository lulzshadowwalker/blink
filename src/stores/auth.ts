import { ref } from 'vue'
import { defineStore } from 'pinia'
import { pb } from '@/lib/pocketbase'

export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = ref(pb.authStore.isValid)

  async function login() {
    await pb.collection('users').authWithOAuth2({ provider: 'google' })

    isAuthenticated.value = pb.authStore.isValid
  }

  async function logout() {
    pb.authStore.clear()

    isAuthenticated.value = pb.authStore.isValid
  }

  return { isAuthenticated, login, logout }
})
