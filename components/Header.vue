<template>
  <header 
    :class="[
      'fixed top-0 left-0 h-16 glass-nav transition-all duration-300',
      'lg:right-0',
      activitiesStore.isOpen ? 'lg:right-80 xl:right-96' : ''
    ]"
    style="z-index: 1 !important;"
  >
    <div class="h-full flex items-center justify-between px-4">
      <!-- Logo e Nome -->
      <div class="flex items-center">
        <img 
          src="/images/logos/logo_azul.png" 
          alt="HuntImob Logo" 
          class="h-10 w-auto flex-shrink-0 object-contain"
          @error="handleLogoError"
        />
        <img 
          src="/images/logos/escrito_logo.png" 
          alt="HuntImob" 
          class="h-48 w-auto hidden sm:block object-contain"
          @error="handleEscritoError"
        />
      </div>

      <!-- Ações do usuário (notificações, perfil) -->
      <div class="flex items-center space-x-3">
        <!-- Ícone de Notificações -->
        <button
          @click="activitiesStore.toggleFeed"
          class="relative p-2 text-gray-600 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white hover:bg-white/10 dark:hover:bg-white/10 rounded-lg transition-colors backdrop-blur-sm"
          title="Atividades"
        >
          <BellIcon class="h-5 w-5 stroke-2" />
          <!-- Badge de contador -->
          <span 
            v-if="activitiesStore.unreadCount > 0"
            class="absolute -top-1 -right-1 flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-bold text-white bg-gradient-to-r from-red-500 to-red-600 rounded-full shadow-md"
          >
            {{ activitiesStore.unreadCount > 9 ? '9+' : activitiesStore.unreadCount }}
          </span>
        </button>

        <!-- Foto de Perfil do Usuário -->
        <button
          class="relative flex items-center justify-center w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 transition-all hover:ring-2 hover:ring-emerald-400/50 dark:hover:ring-emerald-400/50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          title="Perfil"
        >
          <img
            v-if="userPhoto"
            :src="userPhoto"
            :alt="userName || 'Usuário'"
            class="w-full h-full object-cover"
            @error="handlePhotoError"
          />
          <span v-else class="text-white font-semibold text-sm">
            {{ userInitials }}
          </span>
        </button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useActivitiesStore } from '../stores/activities'
import { BellIcon } from '@heroicons/vue/24/outline'

// Header sutil com logo e branding
const activitiesStore = useActivitiesStore()

// Dados do usuário (por enquanto mockados - pode ser conectado a uma store de usuário no futuro)
const userPhoto = ref('/images/corretores/corretor_arthur.jpg') // URL da foto do usuário
const userName = ref('Arthur') // Nome do usuário

// Iniciais do usuário para fallback
const userInitials = computed(() => {
  if (!userName.value) return 'U'
  const names = userName.value.trim().split(' ')
  if (names.length >= 2) {
    return (names[0][0] + names[names.length - 1][0]).toUpperCase()
  }
  return userName.value[0].toUpperCase()
})

const handleLogoError = (event) => {
  console.warn('Erro ao carregar logo azul')
  // Fallback pode ser adicionado aqui se necessário
}

const handleEscritoError = (event) => {
  console.warn('Erro ao carregar escrito logo')
  // Fallback pode ser adicionado aqui se necessário
}

const handlePhotoError = (event) => {
  // Se a foto falhar ao carregar, usar as iniciais
  userPhoto.value = null
}
</script>
