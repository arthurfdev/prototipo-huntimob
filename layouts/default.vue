<template>
  <div class="min-h-screen bg-gray-50 dark:bg-brand-navy-dark transition-colors duration-300 overflow-x-hidden">
    <!-- Header -->
    <Header />
    
    <!-- TopBar Mobile -->
    <TopBar />
    
    <!-- Sidebar -->
    <Sidebar />

    <!-- Main Content with Activity Feed -->
    <div 
      :class="[
        appStore.sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64',
        'transition-all duration-300 flex overflow-x-hidden'
      ]"
      :style="{
        maxWidth: appStore.sidebarCollapsed ? 'calc(100vw - 4rem)' : 'calc(100vw - 16rem)'
      }"
    >
      <!-- Page Content -->
      <main class="h-screen bg-gray-50 dark:bg-brand-navy-dark overflow-y-auto overflow-x-hidden flex-1 min-w-0 transition-all duration-300" style="max-width: 100%;">
        <div class="w-full h-full flex flex-col px-4 sm:px-6 lg:px-8 pt-20 lg:pt-20 pb-6">
          <slot />
        </div>
      </main>

      <!-- Activity Feed -->
      <ActivityFeed />
    </div>

    <!-- Loading Overlay -->
    <div
      v-if="appStore.isLoading"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white dark:bg-brand-navy rounded-lg p-6 flex items-center space-x-3 dark:border dark:border-brand-navy">
        <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 dark:border-brand-gold"></div>
        <span class="text-gray-900 dark:text-white">Carregando...</span>
      </div>
    </div>

    <!-- Notifications -->
    <div class="fixed top-4 right-4 space-y-2 z-40 lg:right-4">
      <div
        v-for="notification in appStore.notifications"
        :key="notification.id"
        class="bg-white dark:bg-brand-navy rounded-lg shadow-lg p-4 border-l-4 max-w-sm transition-all"
        :class="{
          'border-green-500': notification.type === 'success',
          'border-red-500': notification.type === 'error',
          'border-yellow-500': notification.type === 'warning',
          'border-blue-500': notification.type === 'info',
          'cursor-pointer hover:shadow-xl hover:scale-105': notification.clickable || notification.action
        }"
        @click="handleNotificationClick(notification)"
      >
        <div class="flex justify-between items-start">
          <p class="text-gray-900 dark:text-white text-sm">
            {{ notification.message }}
          </p>
          <button
            @click.stop="appStore.removeNotification(notification.id)"
            class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 ml-2"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, watch } from 'vue'
import { useAppStore } from '../stores/app'
import { useActivitiesStore } from '../stores/activities'
import { BellIcon } from '@heroicons/vue/24/outline'
import Header from '../components/Header.vue'
import TopBar from '../components/TopBar.vue'
import Sidebar from '../components/Sidebar.vue'
import ActivityFeed from '../components/ActivityFeed.vue'

const appStore = useAppStore()
const activitiesStore = useActivitiesStore()

const handleNotificationClick = async (notification) => {
  if (notification.action) {
    await notification.action()
    return
  }
}

// Initialize theme and sidebar state on mount
onMounted(() => {
  // Tema
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    appStore.theme = 'dark'
    document.documentElement.classList.add('dark')
  } else {
    appStore.theme = 'light'
    document.documentElement.classList.remove('dark')
  }

  // Estado da sidebar (colapsada/expandida)
  const savedSidebarState = localStorage.getItem('sidebarCollapsed')
  if (savedSidebarState !== null) {
    appStore.sidebarCollapsed = JSON.parse(savedSidebarState)
  }
})
</script>
