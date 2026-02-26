<template>
  <!-- Activity Feed Sidebar - Desktop (dentro do layout) -->
  <div 
    :class="[
      'hidden lg:flex flex-col transition-all duration-300 ease-in-out flex-shrink-0',
      'relative h-screen',
      activitiesStore.isOpen ? 'w-80 xl:w-96' : 'w-0',
      'glass-card border-l border-white/10 shadow-xl',
      !activitiesStore.isOpen ? 'overflow-hidden' : '',
      'overflow-hidden'
    ]"
  >
    <!-- Header -->
    <div v-if="activitiesStore.isOpen" class="flex items-center justify-between h-16 px-4 border-b border-white/10 glass-card flex-shrink-0">
      <div class="flex items-center space-x-3">
        <div class="p-1.5 rounded-lg bg-blue-500/10 dark:bg-blue-500/20">
          <BellIcon class="h-5 w-5 text-blue-500 dark:text-blue-400 stroke-2" />
        </div>
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
          Atividades
        </h2>
        <span 
          v-if="activitiesStore.unreadCount > 0"
          class="px-2.5 py-1 text-xs font-bold text-white bg-gradient-to-r from-red-500 to-red-600 rounded-full shadow-sm"
        >
          {{ activitiesStore.unreadCount }}
        </span>
      </div>
      <div class="flex items-center space-x-2">
        <button
          v-if="activitiesStore.unreadCount > 0"
          @click="markAllAsRead"
          class="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-white/10 transition-colors"
          title="Marcar todas como lidas"
        >
          <CheckIcon class="h-4 w-4 stroke-2" />
        </button>
        <button
          @click="activitiesStore.toggleFeed"
          class="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-white/10 transition-colors"
          title="Fechar"
        >
          <XMarkIcon class="h-5 w-5 stroke-2" />
        </button>
      </div>
    </div>

    <!-- Activities List -->
    <div v-if="activitiesStore.isOpen" class="flex-1 overflow-y-auto">
      <div v-if="activitiesStore.recentActivities.length === 0" class="p-8 text-center">
        <div class="p-4 bg-gray-100 dark:bg-gray-800 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
          <BellIcon class="h-10 w-10 text-gray-400 dark:text-gray-500 stroke-2" />
        </div>
        <p class="text-sm text-gray-500 dark:text-gray-400 font-medium">
          Nenhuma atividade ainda
        </p>
      </div>

      <div v-else class="divide-y divide-gray-200 dark:divide-brand-navy-dark">
        <div
          v-for="activity in activitiesStore.recentActivities"
          :key="activity.id"
          :class="[
            'p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer relative',
            !activity.read ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''
          ]"
          @click="handleActivityClick(activity)"
        >
          <!-- Unread Indicator -->
          <div 
            v-if="!activity.read"
            class="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-blue-600 rounded-r"
          ></div>

          <div class="flex items-start space-x-3">
            <!-- Icon -->
            <div class="icon-glass flex-shrink-0 p-2 rounded-xl">
              <component 
                :is="getActivityIcon(activity.icon || activity.type)" 
                :class="[
                  'h-5 w-5 stroke-2 relative z-10',
                  getActivityIconColor(activity.color)
                ]"
              />
            </div>

            <!-- Content -->
            <div class="flex-1 min-w-0">
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <p class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ activity.title }}
                  </p>
                  <p class="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    {{ activity.message }}
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    {{ formatTime(activity.timestamp) }}
                  </p>
                </div>
                <button
                  @click.stop="removeActivity(activity.id)"
                  class="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Remover"
                >
                  <XMarkIcon class="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div v-if="activitiesStore.isOpen" class="p-4 border-t border-white/10 glass-card flex-shrink-0">
      <button
        @click="clearAll"
        class="w-full px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-white/10 rounded-lg transition-colors border border-white/20 hover:border-white/30"
      >
        Limpar Todas
      </button>
    </div>
  </div>

  <!-- Activity Feed Mobile (usando Teleport para garantir z-index correto) -->
  <Teleport to="body">
    <div 
      v-if="activitiesStore.isOpen"
      :class="[
        'lg:hidden flex flex-col transition-all duration-300 ease-in-out',
        'fixed right-0 top-16 bottom-0',
        'w-72 sm:w-80',
        'glass-card border-l border-white/10 shadow-xl',
        'max-h-[calc(100vh-4rem)] overflow-hidden'
      ]"
      style="z-index: 9999 !important;"
    >
      <!-- Header -->
      <div class="flex items-center justify-between h-16 px-4 border-b border-white/10 glass-card flex-shrink-0">
        <div class="flex items-center space-x-3">
          <div class="icon-glass p-1.5 rounded-lg">
            <BellIcon class="h-5 w-5 text-blue-500 dark:text-blue-400 stroke-2 relative z-10" />
          </div>
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            Atividades
          </h2>
          <span 
            v-if="activitiesStore.unreadCount > 0"
            class="px-2.5 py-1 text-xs font-bold text-white bg-gradient-to-r from-red-500 to-red-600 rounded-full shadow-sm"
          >
            {{ activitiesStore.unreadCount }}
          </span>
        </div>
        <div class="flex items-center space-x-2">
          <button
            v-if="activitiesStore.unreadCount > 0"
            @click="markAllAsRead"
            class="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-white/10 transition-colors"
            title="Marcar todas como lidas"
          >
            <CheckIcon class="h-4 w-4 stroke-2" />
          </button>
          <button
            @click="activitiesStore.toggleFeed"
            class="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-white/10 transition-colors"
            title="Fechar"
          >
            <XMarkIcon class="h-5 w-5 stroke-2" />
          </button>
        </div>
      </div>

      <!-- Activities List -->
      <div class="flex-1 overflow-y-auto">
        <div v-if="activitiesStore.recentActivities.length === 0" class="p-8 text-center">
          <div class="p-4 glass-card rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
            <BellIcon class="h-10 w-10 text-gray-400 dark:text-gray-500 stroke-2" />
          </div>
          <p class="text-sm text-gray-500 dark:text-gray-400 font-medium">
            Nenhuma atividade ainda
          </p>
        </div>

        <div v-else class="divide-y divide-white/10">
          <div
            v-for="activity in activitiesStore.recentActivities"
            :key="activity.id"
            :class="[
              'p-4 hover:bg-white/10 transition-colors cursor-pointer relative',
              !activity.read ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''
            ]"
            @click="handleActivityClick(activity)"
          >
            <!-- Unread Indicator -->
            <div 
              v-if="!activity.read"
              class="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-blue-600 rounded-r"
            ></div>

            <div class="flex items-start space-x-3">
              <!-- Icon -->
              <div 
                :class="[
                  'flex-shrink-0 p-2.5 rounded-xl shadow-sm',
                  getActivityColorClass(activity.color)
                ]"
              >
                <component 
                  :is="getActivityIcon(activity.icon || activity.type)" 
                  class="h-5 w-5"
                />
              </div>

              <!-- Content -->
              <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <p class="text-sm font-medium text-gray-900 dark:text-white">
                      {{ activity.title }}
                    </p>
                    <p class="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      {{ activity.message }}
                    </p>
                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      {{ formatTime(activity.timestamp) }}
                    </p>
                  </div>
                  <button
                    @click.stop="removeActivity(activity.id)"
                    class="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Remover"
                  >
                    <XMarkIcon class="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="p-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-brand-navy flex-shrink-0">
        <button
          @click="clearAll"
          class="w-full px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-white/10 rounded-lg transition-colors border border-white/20 hover:border-white/30"
        >
          Limpar Todas
        </button>
      </div>
    </div>

    <!-- Overlay para mobile quando aberto -->
    <div 
      v-if="activitiesStore.isOpen"
      @click="activitiesStore.setFeedOpen(false)"
      class="lg:hidden fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
      style="z-index: 9998 !important;"
    ></div>
  </Teleport>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useActivitiesStore } from '../stores/activities'
import {
  BellIcon,
  XMarkIcon,
  CheckIcon
} from '@heroicons/vue/24/outline'
import {
  UserPlusIcon,
  CalendarIcon,
  BriefcaseIcon,
  DocumentTextIcon,
  BuildingOfficeIcon,
  ReceiptPercentIcon,
  InformationCircleIcon
} from '@heroicons/vue/24/solid'

const activitiesStore = useActivitiesStore()
const router = useRouter()

const getActivityIcon = (iconName) => {
  const icons = {
    UserPlusIcon,
    CalendarIcon,
    BriefcaseIcon,
    DocumentTextIcon,
    BuildingOfficeIcon,
    ReceiptPercentIcon,
    InformationCircleIcon
  }
  
  // Se não encontrar pelo nome, usar baseado no tipo
  if (icons[iconName]) {
    return icons[iconName]
  }
  
  // Fallback baseado no tipo
  const typeIcons = {
    lead: UserPlusIcon,
    visita: CalendarIcon,
    negociacao: BriefcaseIcon,
    proposta: DocumentTextIcon,
    imovel: BuildingOfficeIcon,
    comissao: ReceiptPercentIcon,
    sistema: InformationCircleIcon
  }
  
  return typeIcons[iconName] || InformationCircleIcon
}

const getActivityColorClass = (color) => {
  const colors = {
    green: 'bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-500 dark:text-emerald-400',
    blue: 'bg-blue-500/10 dark:bg-blue-500/20 text-blue-500 dark:text-blue-400',
    cyan: 'bg-cyan-500/10 dark:bg-cyan-500/20 text-cyan-500 dark:text-cyan-400',
    teal: 'bg-teal-500/10 dark:bg-teal-500/20 text-teal-500 dark:text-teal-400',
    yellow: 'bg-amber-500/10 dark:bg-amber-500/20 text-amber-500 dark:text-amber-400',
    red: 'bg-red-500/10 dark:bg-red-500/20 text-red-500 dark:text-red-400'
  }
  
  return colors[color || 'blue'] || colors.blue
}

const getActivityIconColor = (color) => {
  const colors = {
    green: 'text-emerald-500 dark:text-emerald-400',
    blue: 'text-blue-500 dark:text-blue-400',
    cyan: 'text-cyan-500 dark:text-cyan-400',
    teal: 'text-teal-500 dark:text-teal-400',
    yellow: 'text-amber-500 dark:text-amber-400',
    red: 'text-red-500 dark:text-red-400'
  }
  
  return colors[color || 'blue'] || colors.blue
}

const formatTime = (date) => {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return 'Agora'
  if (minutes < 60) return `${minutes}min atrás`
  if (hours < 24) return `${hours}h atrás`
  if (days < 7) return `${days}d atrás`
  
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const handleActivityClick = (activity) => {
  activitiesStore.markAsRead(activity.id)
  
  if (activity.link) {
    router.push(activity.link)
  }
}

const markAllAsRead = () => {
  activitiesStore.markAllAsRead()
}

const removeActivity = (id) => {
  activitiesStore.removeActivity(id)
}

const clearAll = () => {
  if (confirm('Tem certeza que deseja limpar todas as atividades?')) {
    activitiesStore.activities = []
    activitiesStore.updateUnreadCount()
  }
}

onMounted(() => {
  // Restaurar estado do feed
  const savedState = localStorage.getItem('activityFeedOpen')
  if (savedState !== null) {
    activitiesStore.isOpen = JSON.parse(savedState)
  }
  
  // Atualizar contador de não lidas
  activitiesStore.updateUnreadCount()
})
</script>
