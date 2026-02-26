<template>
  <div class="w-full max-w-full overflow-x-hidden">
    <!-- Header com saudação -->
    <div class="mb-8">
      <div class="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 class="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Bem-vindo de volta! 👋
          </h1>
          <p class="text-gray-600 dark:text-gray-400 text-lg">
            Aqui está um resumo do que está acontecendo hoje
          </p>
        </div>
        <div class="flex items-center space-x-3">
          <div class="px-4 py-2 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-lg border border-blue-200 dark:border-blue-700">
            <p class="text-xs text-blue-600 dark:text-blue-400 font-medium uppercase tracking-wide">Hoje</p>
            <p class="text-sm font-semibold text-blue-900 dark:text-blue-300">{{ currentDate }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Cards de Resumo -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 w-full">
      <div class="bg-white dark:bg-brand-navy rounded-xl shadow-sm p-5 sm:p-6 border border-gray-100 dark:border-gray-800 min-w-0 hover:shadow-lg hover:border-blue-200 dark:hover:border-blue-700 transition-all group cursor-pointer">
        <div class="flex items-start justify-between mb-3">
          <div class="flex-1">
            <p class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Total de Imóveis</p>
            <p class="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mt-2">{{ dashboardData.totalImoveis }}</p>
            <div class="flex items-center mt-3 space-x-2">
              <span class="text-xs text-gray-500 dark:text-gray-400">Disponíveis: {{ dashboardData.imoveisDisponiveis }}</span>
            </div>
          </div>
          <div class="p-3.5 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-md group-hover:scale-110 transition-transform">
            <BuildingOfficeIcon class="h-7 w-7 text-white" />
          </div>
        </div>
        <div class="pt-3 border-t border-gray-100 dark:border-gray-800">
          <NuxtLink to="/imoveis/cadastros" class="text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center">
            Ver todos
            <ArrowRightIcon class="h-3 w-3 ml-1" />
          </NuxtLink>
        </div>
      </div>

      <div class="bg-white dark:bg-brand-navy rounded-xl shadow-sm p-5 sm:p-6 border border-gray-100 dark:border-gray-800 hover:shadow-lg hover:border-emerald-200 dark:hover:border-emerald-700 transition-all group cursor-pointer">
        <div class="flex items-start justify-between mb-3">
          <div class="flex-1">
            <p class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Leads Ativos</p>
            <p class="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mt-2">{{ dashboardData.leadsAtivos }}</p>
            <div class="flex items-center mt-3 space-x-2">
              <span class="text-xs text-gray-500 dark:text-gray-400">Novos hoje: {{ dashboardData.leadsNovosHoje }}</span>
            </div>
          </div>
          <div class="p-3.5 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-md group-hover:scale-110 transition-transform">
            <UserPlusIcon class="h-7 w-7 text-white" />
          </div>
        </div>
        <div class="pt-3 border-t border-gray-100 dark:border-gray-800">
          <NuxtLink to="/comercial/crm" class="text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 flex items-center">
            Ver todos
            <ArrowRightIcon class="h-3 w-3 ml-1" />
          </NuxtLink>
        </div>
      </div>

      <div class="bg-white dark:bg-brand-navy rounded-xl shadow-sm p-5 sm:p-6 border border-gray-100 dark:border-gray-800 hover:shadow-lg hover:border-amber-200 dark:hover:border-amber-700 transition-all group cursor-pointer">
        <div class="flex items-start justify-between mb-3">
          <div class="flex-1">
            <p class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Negociações</p>
            <p class="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mt-2">{{ dashboardData.negociacoes }}</p>
            <div class="flex items-center mt-3 space-x-2">
              <span class="text-xs text-gray-500 dark:text-gray-400">Em andamento: {{ dashboardData.negociacoesEmAndamento }}</span>
            </div>
          </div>
          <div class="p-3.5 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl shadow-md group-hover:scale-110 transition-transform">
            <BriefcaseIcon class="h-7 w-7 text-white" />
          </div>
        </div>
        <div class="pt-3 border-t border-gray-100 dark:border-gray-800">
          <NuxtLink to="/comercial/negociacoes" class="text-xs font-medium text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 flex items-center">
            Ver todas
            <ArrowRightIcon class="h-3 w-3 ml-1" />
          </NuxtLink>
        </div>
      </div>

      <div class="bg-white dark:bg-brand-navy rounded-xl shadow-sm p-5 sm:p-6 border border-gray-100 dark:border-gray-800 hover:shadow-lg hover:border-violet-200 dark:hover:border-violet-700 transition-all group cursor-pointer">
        <div class="flex items-start justify-between mb-3">
          <div class="flex-1">
            <p class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Receita Mensal</p>
            <p class="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mt-2">{{ formatCurrency(dashboardData.receitaMensal) }}</p>
            <div class="flex items-center mt-3 space-x-2">
              <span class="text-xs text-gray-500 dark:text-gray-400">Meta: {{ formatCurrency(dashboardData.metaMensal) }} ({{ percentualMeta }}%)</span>
            </div>
          </div>
          <div class="p-3.5 bg-gradient-to-br from-violet-500 to-violet-600 rounded-xl shadow-md group-hover:scale-110 transition-transform">
            <CurrencyDollarIcon class="h-7 w-7 text-white" />
          </div>
        </div>
        <div class="pt-3 border-t border-gray-100 dark:border-gray-800">
          <NuxtLink to="/financeiro" class="text-xs font-medium text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 flex items-center">
            Ver relatório
            <ArrowRightIcon class="h-3 w-3 ml-1" />
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Grid de Conteúdo Principal -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      <!-- Ações Rápidas -->
      <div class="lg:col-span-2 bg-white dark:bg-brand-navy rounded-xl shadow-sm p-5 sm:p-6 border border-gray-100 dark:border-gray-800">
        <div class="flex items-center justify-between mb-5">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white">Ações Rápidas</h2>
          <span class="text-xs text-gray-500 dark:text-gray-400">Acesso rápido</span>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
          <NuxtLink
            to="/imoveis/cadastros"
            class="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 dark:hover:from-blue-900/20 dark:hover:to-blue-800/20 hover:border-blue-300 dark:hover:border-blue-700 transition-all group"
          >
            <div class="flex items-center">
              <div class="p-2.5 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-sm mr-3 group-hover:scale-110 transition-transform">
                <BuildingOfficeIcon class="h-5 w-5 text-white" />
              </div>
              <div>
                <span class="text-gray-900 dark:text-white font-semibold block">Cadastrar Imóvel</span>
                <span class="text-xs text-gray-500 dark:text-gray-400">Novo lançamento</span>
              </div>
            </div>
            <ArrowRightIcon class="h-5 w-5 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
          </NuxtLink>
          <NuxtLink
            to="/comercial/crm"
            class="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gradient-to-r hover:from-emerald-50 hover:to-emerald-100 dark:hover:from-emerald-900/20 dark:hover:to-emerald-800/20 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all group"
          >
            <div class="flex items-center">
              <div class="p-2.5 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg shadow-sm mr-3 group-hover:scale-110 transition-transform">
                <UserPlusIcon class="h-5 w-5 text-white" />
              </div>
              <div>
                <span class="text-gray-900 dark:text-white font-semibold block">Novo Lead</span>
                <span class="text-xs text-gray-500 dark:text-gray-400">Adicionar contato</span>
              </div>
            </div>
            <ArrowRightIcon class="h-5 w-5 text-gray-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors" />
          </NuxtLink>
          <NuxtLink
            to="/comercial/negociacoes"
            class="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gradient-to-r hover:from-amber-50 hover:to-amber-100 dark:hover:from-amber-900/20 dark:hover:to-amber-800/20 hover:border-amber-300 dark:hover:border-amber-700 transition-all group"
          >
            <div class="flex items-center">
              <div class="p-2.5 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg shadow-sm mr-3 group-hover:scale-110 transition-transform">
                <BriefcaseIcon class="h-5 w-5 text-white" />
              </div>
              <div>
                <span class="text-gray-900 dark:text-white font-semibold block">Nova Negociação</span>
                <span class="text-xs text-gray-500 dark:text-gray-400">Iniciar processo</span>
              </div>
            </div>
            <ArrowRightIcon class="h-5 w-5 text-gray-400 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors" />
          </NuxtLink>
          <NuxtLink
            to="/comercial/clientes"
            class="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gradient-to-r hover:from-violet-50 hover:to-violet-100 dark:hover:from-violet-900/20 dark:hover:to-violet-800/20 hover:border-violet-300 dark:hover:border-violet-700 transition-all group"
          >
            <div class="flex items-center">
              <div class="p-2.5 bg-gradient-to-br from-violet-500 to-violet-600 rounded-lg shadow-sm mr-3 group-hover:scale-110 transition-transform">
                <UserIcon class="h-5 w-5 text-white" />
              </div>
              <div>
                <span class="text-gray-900 dark:text-white font-semibold block">Novo Cliente</span>
                <span class="text-xs text-gray-500 dark:text-gray-400">Cadastrar pessoa</span>
              </div>
            </div>
            <ArrowRightIcon class="h-5 w-5 text-gray-400 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors" />
          </NuxtLink>
        </div>
      </div>

      <!-- Atividades Recentes -->
      <div class="bg-white dark:bg-brand-navy rounded-xl shadow-sm p-5 sm:p-6 border border-gray-100 dark:border-gray-800">
        <div class="flex items-center justify-between mb-5">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white">Atividades Recentes</h2>
          <NuxtLink to="#" class="text-xs text-blue-600 dark:text-blue-400 hover:underline">Ver todas</NuxtLink>
        </div>
        <div class="space-y-4">
          <div v-if="activitiesStore.recentActivities.length === 0" class="text-center py-8">
            <div class="p-3 bg-gray-100 dark:bg-gray-800 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
              <BellIcon class="h-8 w-8 text-gray-400 dark:text-gray-500" />
            </div>
            <p class="text-sm text-gray-500 dark:text-gray-400">Nenhuma atividade recente</p>
          </div>
          <div v-else class="space-y-3">
            <div
              v-for="activity in activitiesStore.recentActivities.slice(0, 5)"
              :key="activity.id"
              class="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
              @click="handleActivityClick(activity)"
            >
              <div class="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex-shrink-0">
                <component 
                  :is="getActivityIcon(activity.icon || activity.type)" 
                  class="h-4 w-4 text-white"
                />
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 dark:text-white truncate">{{ activity.title }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ formatTime(activity.timestamp) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  BuildingOfficeIcon,
  UserPlusIcon,
  BriefcaseIcon,
  CurrencyDollarIcon,
  ArrowRightIcon,
  UserIcon
} from '@heroicons/vue/24/solid'
import {
  UserPlusIcon as UserPlusIconOutline,
  CalendarIcon,
  BriefcaseIcon as BriefcaseIconOutline,
  DocumentTextIcon,
  BuildingOfficeIcon as BuildingOfficeIconOutline,
  ReceiptPercentIcon,
  InformationCircleIcon,
  BellIcon
} from '@heroicons/vue/24/outline'
import { useActivitiesStore } from '../stores/activities'

const activitiesStore = useActivitiesStore()
const router = useRouter()

// Dados da empresa próspera
const dashboardData = ref({
  totalImoveis: 247,
  imoveisDisponiveis: 189,
  leadsAtivos: 156,
  leadsNovosHoje: 12,
  negociacoes: 43,
  negociacoesEmAndamento: 28,
  receitaMensal: 2450000,
  metaMensal: 3000000
})

// Formatar valores monetários
const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value)
}

// Calcular percentual da meta
const percentualMeta = computed(() => {
  return Math.round((dashboardData.value.receitaMensal / dashboardData.value.metaMensal) * 100)
})

// Data atual formatada
const currentDate = computed(() => {
  const today = new Date()
  return today.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
})

// Função para obter ícone da atividade
const getActivityIcon = (iconName) => {
  const icons = {
    UserPlusIcon: UserPlusIconOutline,
    CalendarIcon,
    BriefcaseIcon: BriefcaseIconOutline,
    DocumentTextIcon,
    BuildingOfficeIcon: BuildingOfficeIconOutline,
    ReceiptPercentIcon,
    InformationCircleIcon
  }
  
  if (icons[iconName]) {
    return icons[iconName]
  }
  
  const typeIcons = {
    lead: UserPlusIconOutline,
    visita: CalendarIcon,
    negociacao: BriefcaseIconOutline,
    proposta: DocumentTextIcon,
    imovel: BuildingOfficeIconOutline,
    comissao: ReceiptPercentIcon,
    sistema: InformationCircleIcon
  }
  
  return typeIcons[iconName] || InformationCircleIcon
}

// Formatar tempo
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
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Handler para clicar em atividade
const handleActivityClick = (activity) => {
  activitiesStore.markAsRead(activity.id)
  if (activity.link) {
    router.push(activity.link)
  }
}

// Exemplo de atividades para demonstração
onMounted(() => {
  // Adicionar atividades de exemplo para uma empresa próspera
  const now = new Date()
  
  // Atividades recentes (últimas horas)
  activitiesStore.addImovelActivity({
    imovelName: 'Apartamento Premium - Centro - R$ 850.000',
    tipo: 'atualizado',
    link: '/imoveis/gestao'
  })
  
  setTimeout(() => {
    activitiesStore.addNegociacaoActivity({
      corretorName: 'Maria Santos',
      leadName: 'Roberto Almeida',
      imovelName: 'Casa com Piscina - Jardim América - R$ 1.200.000',
      link: '/comercial/negociacoes'
    })
  }, 500)

  setTimeout(() => {
    activitiesStore.addVisitaActivity({
      corretorName: 'Carlos Oliveira',
      leadName: 'Ana Costa',
      dataVisita: 'Hoje às 14:00',
      link: '/comercial/negociacoes'
    })
  }, 1000)

  setTimeout(() => {
    activitiesStore.addLeadActivity({
      leadName: 'Fernanda Lima',
      corretorName: 'Pedro Souza',
      link: '/comercial/leads-livres'
    })
  }, 1500)

  setTimeout(() => {
    activitiesStore.addImovelActivity({
      imovelName: 'Cobertura Duplex - Zona Sul - R$ 2.500.000',
      tipo: 'cadastrado',
      link: '/imoveis/gestao'
    })
  }, 2000)

  setTimeout(() => {
    activitiesStore.addNegociacaoActivity({
      corretorName: 'Juliana Ferreira',
      leadName: 'Marcos Silva',
      imovelName: 'Apartamento 3 Quartos - R$ 650.000',
      link: '/comercial/negociacoes'
    })
  }, 2500)

  setTimeout(() => {
    activitiesStore.addLeadActivity({
      leadName: 'Patricia Mendes',
      corretorName: 'Ricardo Costa',
      link: '/comercial/leads-livres'
    })
  }, 3000)

  setTimeout(() => {
    activitiesStore.addVisitaActivity({
      corretorName: 'Ana Paula',
      leadName: 'Lucas Martins',
      dataVisita: 'Hoje às 16:30',
      link: '/comercial/negociacoes'
    })
  }, 3500)
})
</script>
