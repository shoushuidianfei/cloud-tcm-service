import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { mockUsers } from '@/mock'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('tcm_token') || '')
  const userInfo = ref(JSON.parse(localStorage.getItem('tcm_user') || 'null'))

  const isAuthenticated = computed(() => !!token.value)
  const userRole = computed(() => userInfo.value?.role || '')
  const userName = computed(() => userInfo.value?.name || '')

  function login(loginData) {
    const user = mockUsers.find(u =>
      u.username === loginData.username && u.password === loginData.password
    )

    if (!user) {
      throw new Error('用户名或密码错误')
    }

    token.value = `token_${user.id}_${Date.now()}`
    userInfo.value = {
      id: user.id,
      name: user.name,
      role: user.role,
      avatar: user.avatar
    }

    localStorage.setItem('tcm_token', token.value)
    localStorage.setItem('tcm_user', JSON.stringify(userInfo.value))
  }

  function logout() {
    token.value = ''
    userInfo.value = null
    localStorage.removeItem('tcm_token')
    localStorage.removeItem('tcm_user')
  }

  return {
    token,
    userInfo,
    isAuthenticated,
    userRole,
    userName,
    login,
    logout
  }
})
