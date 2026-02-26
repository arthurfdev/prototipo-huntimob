import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    sidebarOpen: false,
    sidebarCollapsed: false,
    theme: 'dark' as 'light' | 'dark',
    isLoading: false,
    notifications: [] as Array<{
      id: string
      message: string
      type: 'success' | 'error' | 'warning' | 'info'
      clickable?: boolean
      action?: () => void
      data?: any
    }>
  }),

  getters: {
    isDarkMode: (state) => state.theme === 'dark'
  },

  actions: {
    toggleSidebar() {
      this.sidebarOpen = !this.sidebarOpen
    },

    toggleSidebarCollapse() {
      this.sidebarCollapsed = !this.sidebarCollapsed
      localStorage.setItem('sidebarCollapsed', JSON.stringify(this.sidebarCollapsed))
    },

    setSidebarOpen(open: boolean) {
      this.sidebarOpen = open
    },

    toggleTheme() {
      this.theme = this.theme === 'dark' ? 'light' : 'dark'
      localStorage.setItem('theme', this.theme)
    },

    setLoading(loading: boolean) {
      this.isLoading = loading
    },

    addNotification(notification: {
      message: string
      type: 'success' | 'error' | 'warning' | 'info'
      clickable?: boolean
      action?: () => void
      data?: any
    }) {
      const id = Date.now().toString() + Math.random().toString(36).substr(2, 9)
      this.notifications.push({ ...notification, id })
      
      // Auto remover após 5 segundos
      setTimeout(() => {
        this.removeNotification(id)
      }, 5000)
    },

    removeNotification(id: string) {
      const index = this.notifications.findIndex(n => n.id === id)
      if (index > -1) {
        this.notifications.splice(index, 1)
      }
    }
  }
})
