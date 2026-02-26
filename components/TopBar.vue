<template>
  <div class="lg:hidden fixed top-16 left-0 right-0 h-14 bg-white dark:bg-brand-navy border-b border-gray-200 dark:border-brand-navy-dark z-30 flex items-center px-4">
    <!-- Botão Hambúrguer -->
    <button 
      @click="openMenu" 
      class="p-2 hover:bg-gray-100 dark:hover:bg-brand-navy-dark rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors"
      aria-label="Abrir menu"
    >
      <Bars3Icon class="h-6 w-6 text-gray-600 dark:text-gray-100" />
    </button>
    
    <!-- Título dinâmico -->
    <div class="flex-1 flex items-center justify-center">
      <span class="text-base font-semibold text-gray-900 dark:text-white truncate px-2">
        {{ pageTitle }}
      </span>
    </div>
    
    <!-- Espaço para manter centralização -->
    <div class="w-10"></div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAppStore } from '../stores/app'
import { Bars3Icon } from '@heroicons/vue/24/outline'

const appStore = useAppStore()
const route = useRoute()

// Título da página baseado na rota
const pageTitle = computed(() => {
  const titles = {
    '/': 'Dashboard',
    '/imoveis/cadastros': 'Cadastros',
    '/comercial/crm': 'CRM',
    '/comercial/clientes': 'Clientes',
    '/comercial/negociacoes': 'Negociações'
  }
  return titles[route.path] || 'HuntImob'
})

const openMenu = () => {
  appStore.sidebarOpen = true
}
</script>
