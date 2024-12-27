import { ref } from 'vue'
import { defineStore } from 'pinia'
import { pb } from '@/lib/pocketbase'
import type { User } from '@/lib/models'

export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = ref(pb.authStore.isValid)

  pb.authStore.onChange(() => {
    isAuthenticated.value = pb.authStore.isValid
  })

  async function login() {
    await pb.collection('users').authWithOAuth2({ provider: 'google' })
  }

  async function logout() {
    pb.authStore.clear()
  }

  let user: User | undefined = undefined
  if (pb.authStore.record) {
    user = {
      id: pb.authStore.record.id,
      name: pb.authStore.record.name,
      email: pb.authStore.record.email,
      avatar: pb.authStore.record.avatar,
    }
  }

  return { isAuthenticated, login, logout, user }
})
