import { defineStore } from 'pinia'

export const useAuthStore = defineStore('authStore', {
  state: () => ({
    token: localStorage.getItem('token'),
    username: localStorage.getItem('username'),
    login: localStorage.getItem('login'),
    password: localStorage.getItem('password'),
    autoLogin: false
  }),
  actions: {
    setToken (token: string) {
      this.token = token
      localStorage.setItem('token', token)
    },
    setUsername (username: string) {
      this.username = username
      localStorage.setItem('username', username)
    },
    setLogin (login: string) {
      this.login = login
      localStorage.setItem('login', login)
    },
    setPassword (password: string) {
      this.password = password
      localStorage.setItem('password', password)
    },
    clearAuth () {
      this.token = null
      this.username = null
      this.login = null
      this.password = null
      localStorage.removeItem('token')
      localStorage.removeItem('username')
      localStorage.removeItem('login')
      localStorage.removeItem('password')
    },
    checkAutoLogin () {
      if (this.token && this.username) {
        this.autoLogin = true
      } else {
        this.autoLogin = false
      }
    }
  },
  getters: {
    isAuthenticated: (state) => !!state.token && !!state.username,
    isAutoLogin: (state) => state.autoLogin
  }
})
