<template>
  <div class="w-full max-w-full overflow-x-hidden">
    <!-- Header com saudação -->
    <div class="mb-6">
      <div class="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
            Bem-vindo de volta!
          </h1>
          <p class="text-sm text-gray-600 dark:text-slate-400 mt-1">
            Aqui está um resumo do que está acontecendo hoje.
          </p>
        </div>
        <div class="flex items-center space-x-3">
          <div class="px-4 py-2 glass-card-light dark:glass-card rounded-lg shadow-sm">
            <p class="text-xs text-emerald-600 dark:text-emerald-400 font-medium uppercase tracking-wide">Hoje</p>
            <p class="text-sm font-semibold text-gray-900 dark:text-white">{{ currentDate }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Cards de Resumo -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 w-full">
      <div class="glass-card-light dark:glass-card rounded-xl shadow-sm p-5 sm:p-6 min-w-0 hover:shadow-lg hover:border-emerald-500/50 transition-all group cursor-pointer">
        <div class="flex items-start justify-between mb-3">
          <div class="flex-1">
            <p class="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-1">Total de Imóveis</p>
            <p class="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mt-2">{{ dashboardData.totalImoveis }}</p>
            <div class="flex items-center mt-3 space-x-2">
              <span class="text-xs text-gray-500 dark:text-slate-400">Disponíveis: {{ dashboardData.imoveisDisponiveis }}</span>
            </div>
          </div>
          <div class="icon-glass p-2.5 rounded-xl">
            <BuildingOfficeIcon class="h-6 w-6 text-cyan-500 dark:text-cyan-400 relative z-10" />
          </div>
        </div>
        <div class="pt-3 border-t border-white/10">
          <NuxtLink to="/imoveis/cadastros" class="text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 flex items-center">
            Ver todos
            <ArrowRightIcon class="h-3 w-3 ml-1 stroke-2" />
          </NuxtLink>
        </div>
      </div>

      <div class="glass-card rounded-xl shadow-sm p-5 sm:p-6 hover:shadow-lg hover:border-emerald-500/50 transition-all group cursor-pointer">
        <div class="flex items-start justify-between mb-3">
          <div class="flex-1">
            <p class="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-1">Leads Ativos</p>
            <p class="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mt-2">{{ dashboardData.leadsAtivos }}</p>
            <div class="flex items-center mt-3 space-x-2">
              <span class="text-xs text-gray-500 dark:text-slate-400">Novos hoje: {{ dashboardData.leadsNovosHoje }}</span>
            </div>
          </div>
          <div class="icon-glass p-2.5 rounded-xl">
            <UserPlusIcon class="h-6 w-6 text-emerald-500 dark:text-emerald-400 relative z-10" />
          </div>
        </div>
        <div class="pt-3 border-t border-white/10">
          <NuxtLink to="/comercial/crm" class="text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 flex items-center">
            Ver todos
            <ArrowRightIcon class="h-3 w-3 ml-1 stroke-2" />
          </NuxtLink>
        </div>
      </div>

      <div class="glass-card rounded-xl shadow-sm p-5 sm:p-6 hover:shadow-lg hover:border-cyan-500/50 transition-all group cursor-pointer">
        <div class="flex items-start justify-between mb-3">
          <div class="flex-1">
            <p class="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-1">Negociações</p>
            <p class="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mt-2">{{ dashboardData.negociacoes }}</p>
            <div class="flex items-center mt-3 space-x-2">
              <span class="text-xs text-gray-500 dark:text-slate-400">Em andamento: {{ dashboardData.negociacoesEmAndamento }}</span>
            </div>
          </div>
          <div class="icon-glass p-2.5 rounded-xl">
            <BriefcaseIcon class="h-6 w-6 text-cyan-500 dark:text-cyan-400 relative z-10" />
          </div>
        </div>
        <div class="pt-3 border-t border-white/10">
          <NuxtLink to="/comercial/negociacoes" class="text-xs font-medium text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 flex items-center">
            Ver todas
            <ArrowRightIcon class="h-3 w-3 ml-1 stroke-2" />
          </NuxtLink>
        </div>
      </div>

      <div class="glass-card rounded-xl shadow-sm p-5 sm:p-6 hover:shadow-lg hover:border-emerald-500/50 transition-all group cursor-pointer">
        <div class="flex items-start justify-between mb-3">
          <div class="flex-1">
            <p class="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-1">Receita Mensal</p>
            <p class="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mt-2">{{ formatCurrency(dashboardData.receitaMensal) }}</p>
            <div class="flex items-center mt-3 space-x-2">
              <span class="text-xs text-gray-500 dark:text-slate-400">Meta: {{ formatCurrency(dashboardData.metaMensal) }} ({{ percentualMeta }}%)</span>
            </div>
          </div>
          <div class="icon-glass p-2.5 rounded-xl">
            <CurrencyDollarIcon class="h-6 w-6 text-emerald-500 dark:text-emerald-400 relative z-10" />
          </div>
        </div>
        <div class="pt-3 border-t border-white/10">
          <NuxtLink to="/financeiro" class="text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 flex items-center">
            Ver relatório
            <ArrowRightIcon class="h-3 w-3 ml-1 stroke-2" />
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Grid de Conteúdo Principal -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      <!-- Ações Rápidas -->
      <div class="lg:col-span-2 glass-card-light dark:glass-card rounded-xl shadow-sm p-5 sm:p-6">
        <div class="flex items-center justify-between mb-5">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white">Ações Rápidas</h2>
          <span class="text-xs text-gray-500 dark:text-slate-400">Acesso rápido</span>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
          <NuxtLink
            to="/imoveis/cadastros"
            class="flex items-center justify-between p-4 border border-white/20 rounded-xl glass-card hover:bg-white/10 hover:border-cyan-500/50 transition-all group"
          >
            <div class="flex items-center">
              <div class="icon-glass p-2 rounded-xl mr-3">
                <BuildingOfficeIcon class="h-5 w-5 text-cyan-500 dark:text-cyan-400 stroke-2 relative z-10" />
              </div>
              <div>
                <span class="text-gray-900 dark:text-white font-semibold block">Cadastrar Imóvel</span>
                <span class="text-xs text-gray-500 dark:text-slate-400">Novo lançamento</span>
              </div>
            </div>
            <ArrowRightIcon class="h-4 w-4 text-gray-400 dark:text-slate-400 group-hover:text-cyan-500 dark:group-hover:text-cyan-400 transition-colors stroke-2" />
          </NuxtLink>
          <NuxtLink
            to="/comercial/crm"
            class="flex items-center justify-between p-4 border border-white/20 rounded-xl glass-card hover:bg-white/10 hover:border-emerald-500/50 transition-all group"
          >
            <div class="flex items-center">
              <div class="icon-glass p-2 rounded-xl mr-3">
                <UserPlusIcon class="h-5 w-5 text-emerald-500 dark:text-emerald-400 stroke-2 relative z-10" />
              </div>
              <div>
                <span class="text-gray-900 dark:text-white font-semibold block">Novo Lead</span>
                <span class="text-xs text-gray-500 dark:text-slate-400">Adicionar contato</span>
              </div>
            </div>
            <ArrowRightIcon class="h-5 w-5 text-gray-400 dark:text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors" />
          </NuxtLink>
          <NuxtLink
            to="/comercial/negociacoes"
            class="flex items-center justify-between p-4 border border-white/20 rounded-xl glass-card hover:bg-white/10 hover:border-cyan-500/50 transition-all group"
          >
            <div class="flex items-center">
              <div class="icon-glass p-2 rounded-xl mr-3">
                <BriefcaseIcon class="h-5 w-5 text-cyan-500 dark:text-cyan-400 stroke-2 relative z-10" />
              </div>
              <div>
                <span class="text-gray-900 dark:text-white font-semibold block">Nova Negociação</span>
                <span class="text-xs text-gray-500 dark:text-slate-400">Iniciar processo</span>
              </div>
            </div>
            <ArrowRightIcon class="h-4 w-4 text-gray-400 dark:text-slate-400 group-hover:text-cyan-500 dark:group-hover:text-cyan-400 transition-colors stroke-2" />
          </NuxtLink>
          <NuxtLink
            to="/comercial/clientes"
            class="flex items-center justify-between p-4 border border-white/20 rounded-xl glass-card hover:bg-white/10 hover:border-emerald-500/50 transition-all group"
          >
            <div class="flex items-center">
              <div class="icon-glass p-2 rounded-xl mr-3">
                <UserIcon class="h-5 w-5 text-emerald-500 dark:text-emerald-400 stroke-2 relative z-10" />
              </div>
              <div>
                <span class="text-gray-900 dark:text-white font-semibold block">Novo Cliente</span>
                <span class="text-xs text-gray-500 dark:text-slate-400">Cadastrar pessoa</span>
              </div>
            </div>
            <ArrowRightIcon class="h-5 w-5 text-gray-400 dark:text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors" />
          </NuxtLink>
        </div>
      </div>

      <!-- Atividades Recentes -->
      <div class="glass-card-light dark:glass-card rounded-xl shadow-sm p-5 sm:p-6">
        <div class="flex items-center justify-between mb-5">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white">Atividades Recentes</h2>
          <NuxtLink to="#" class="text-xs text-emerald-600 dark:text-emerald-400 hover:underline">Ver todas</NuxtLink>
        </div>
        <div class="space-y-4">
          <div v-if="activitiesStore.recentActivities.length === 0" class="text-center py-8">
            <div class="p-3 glass-card rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
              <BellIcon class="h-8 w-8 text-gray-400 dark:text-slate-400" />
            </div>
            <p class="text-sm text-gray-500 dark:text-slate-400">Nenhuma atividade recente</p>
          </div>
          <div v-else class="space-y-3">
            <div
              v-for="activity in activitiesStore.recentActivities.slice(0, 5)"
              :key="activity.id"
              class="flex items-start space-x-3 p-3 rounded-lg glass-card hover:bg-white/10 transition-colors cursor-pointer"
              @click="handleActivityClick(activity)"
            >
              <div class="icon-glass p-1.5 rounded-lg flex-shrink-0">
                <component 
                  :is="getActivityIcon(activity.icon || activity.type)" 
                  class="h-4 w-4 text-cyan-500 dark:text-cyan-400 stroke-2 relative z-10"
                />
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 dark:text-white truncate">{{ activity.title }}</p>
                <p class="text-xs text-gray-500 dark:text-slate-400 mt-1">{{ formatTime(activity.timestamp) }}</p>
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
} from '@heroicons/vue/24/outline'
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
