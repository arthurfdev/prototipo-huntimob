<template>
  <!-- Activity Feed Sidebar - Desktop (dentro do layout) -->
  <div 
    :class="[
      'hidden lg:flex flex-col transition-all duration-300 ease-in-out flex-shrink-0',
      'relative h-screen',
      activitiesStore.isOpen ? 'w-80 xl:w-96' : 'w-0',
      'bg-white dark:bg-brand-navy border-l border-gray-200 dark:border-brand-navy-dark shadow-xl',
      !activitiesStore.isOpen ? 'overflow-hidden' : '',
      'overflow-hidden'
    ]"
  >
    <!-- Header -->
    <div v-if="activitiesStore.isOpen" class="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-brand-navy flex-shrink-0">
      <div class="flex items-center space-x-3">
        <div class="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
          <BellIcon class="h-5 w-5 text-white" />
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
          class="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-brand-navy transition-colors"
          title="Marcar todas como lidas"
        >
          <CheckIcon class="h-4 w-4" />
        </button>
        <button
          @click="activitiesStore.toggleFeed"
          class="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-brand-navy transition-colors"
          title="Fechar"
        >
          <XMarkIcon class="h-5 w-5" />
        </button>
      </div>
    </div>

    <!-- Activities List -->
    <div v-if="activitiesStore.isOpen" class="flex-1 overflow-y-auto">
      <div v-if="activitiesStore.recentActivities.length === 0" class="p-8 text-center">
        <div class="p-4 bg-gray-100 dark:bg-gray-800 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
          <BellIcon class="h-10 w-10 text-gray-400 dark:text-gray-500" />
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
    <div v-if="activitiesStore.isOpen" class="p-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-brand-navy flex-shrink-0">
      <button
        @click="clearAll"
        class="w-full px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg transition-colors border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
      >
        Limpar Todas
      </button>
    </div>
  </div>

  <!-- Toggle Button (quando fechado) -->
  <button
    v-if="!activitiesStore.isOpen"
    @click="activitiesStore.setFeedOpen(true)"
    class="fixed right-4 bottom-4 p-4 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-full shadow-lg transition-all hover:scale-110 hover:shadow-xl"
    style="z-index: 9999 !important;"
    title="Abrir atividades"
  >
    <BellIcon class="h-6 w-6" />
    <span 
      v-if="activitiesStore.unreadCount > 0"
      class="absolute -top-1 -right-1 flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-bold text-white bg-gradient-to-r from-red-500 to-red-600 rounded-full shadow-md"
    >
      {{ activitiesStore.unreadCount > 9 ? '9+' : activitiesStore.unreadCount }}
    </span>
  </button>

  <!-- Activity Feed Mobile (usando Teleport para garantir z-index correto) -->
  <Teleport to="body">
    <div 
      v-if="activitiesStore.isOpen"
      :class="[
        'lg:hidden flex flex-col transition-all duration-300 ease-in-out',
        'fixed right-0 top-16 bottom-0',
        'w-72 sm:w-80',
        'bg-white dark:bg-brand-navy border-l border-gray-200 dark:border-brand-navy-dark shadow-xl',
        'max-h-[calc(100vh-4rem)] overflow-hidden'
      ]"
      style="z-index: 9999 !important;"
    >
      <!-- Header -->
      <div class="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-brand-navy flex-shrink-0">
        <div class="flex items-center space-x-3">
          <div class="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
            <BellIcon class="h-5 w-5 text-white" />
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
            class="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-brand-navy transition-colors"
            title="Marcar todas como lidas"
          >
            <CheckIcon class="h-4 w-4" />
          </button>
          <button
            @click="activitiesStore.toggleFeed"
            class="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-brand-navy transition-colors"
            title="Fechar"
          >
            <XMarkIcon class="h-5 w-5" />
          </button>
        </div>
      </div>

      <!-- Activities List -->
      <div class="flex-1 overflow-y-auto">
        <div v-if="activitiesStore.recentActivities.length === 0" class="p-8 text-center">
          <div class="p-4 bg-gray-100 dark:bg-gray-800 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
            <BellIcon class="h-10 w-10 text-gray-400 dark:text-gray-500" />
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
          class="w-full px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg transition-colors border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
        >
          Limpar Todas
        </button>
      </div>
    </div>

    <!-- Overlay para mobile quando aberto -->
    <div 
      v-if="activitiesStore.isOpen"
      @click="activitiesStore.setFeedOpen(false)"
      class="lg:hidden fixed inset-0 bg-black bg-opacity-50"
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
    green: 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white',
    blue: 'bg-gradient-to-br from-blue-500 to-blue-600 text-white',
    yellow: 'bg-gradient-to-br from-amber-500 to-amber-600 text-white',
    purple: 'bg-gradient-to-br from-violet-500 to-violet-600 text-white',
    indigo: 'bg-gradient-to-br from-indigo-500 to-indigo-600 text-white',
    red: 'bg-gradient-to-br from-red-500 to-red-600 text-white'
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
