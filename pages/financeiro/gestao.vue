<template>
  <div class="w-full max-w-full overflow-x-hidden">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Gestão Financeira</h1>
      <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Gerencie receitas, despesas e fluxo de caixa</p>
    </div>

    <!-- Período de Análise -->
    <div class="glass-card-light dark:glass-card rounded-xl shadow-sm p-4 sm:p-5 mb-6">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h3 class="text-sm font-semibold text-gray-900 dark:text-white">Período de Análise</h3>
        <div class="flex gap-3">
          <select
            v-model="selectedMonthNum"
            @change="updatePeriodo"
            class="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-brand-navy-dark text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option v-for="(month, index) in monthNames" :key="index" :value="index + 1">
              {{ month }}
            </option>
          </select>
          <select
            v-model="selectedYear"
            @change="updatePeriodo"
            class="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-brand-navy-dark text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option v-for="year in availableYears" :key="year" :value="year">
              {{ year }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <!-- Cards de Resumo Principal -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      <div class="glass-card-light dark:glass-card rounded-xl shadow-sm p-5">
        <p class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Receita Bruta</p>
        <p class="text-xl font-bold text-gray-900 dark:text-white">{{ formatMoney(totais.receita_bruta) }}</p>
      </div>
      <div class="glass-card-light dark:glass-card rounded-xl shadow-sm p-5">
        <p class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Comissões</p>
        <p class="text-xl font-bold text-red-600 dark:text-red-400">{{ formatMoney(totais.comissoes) }}</p>
      </div>
      <div class="glass-card-light dark:glass-card rounded-xl shadow-sm p-5">
        <p class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Impostos</p>
        <p class="text-xl font-bold text-orange-600 dark:text-orange-400">{{ formatMoney(totais.impostos) }}</p>
      </div>
      <div class="glass-card-light dark:glass-card rounded-xl shadow-sm p-5">
        <p class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Taxas de Cartão</p>
        <p class="text-xl font-bold text-amber-600 dark:text-amber-400">{{ formatMoney(totais.taxas_cartao) }}</p>
      </div>
      <div class="glass-card-light dark:glass-card rounded-xl shadow-sm p-5">
        <p class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Valor Líquido</p>
        <p class="text-xl font-bold text-green-600 dark:text-green-400">{{ formatMoney(totais.valor_liquido) }}</p>
      </div>
    </div>

    <!-- Grid de Cards de Acesso -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Contas a Receber -->
      <div class="glass-card-light dark:glass-card rounded-xl shadow-sm p-5 hover:shadow-md transition-all duration-200 cursor-pointer group">
        <div class="flex items-center justify-between mb-3">
          <div class="icon-glass w-10 h-10 rounded-lg flex items-center justify-center">
            <CurrencyDollarIcon class="w-5 h-5 text-emerald-500 dark:text-emerald-400 relative z-10 stroke-2" />
          </div>
        </div>
        <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-1">Contas a receber</h3>
        <p class="text-lg font-bold text-green-600 dark:text-green-400 mb-1">{{ formatMoney(metricas.contas_receber) }}</p>
        <p class="text-xs text-gray-500 dark:text-gray-400">{{ metricas.contas_receber_pendentes }} pendente{{ metricas.contas_receber_pendentes !== 1 ? 's' : '' }}</p>
      </div>

      <!-- Contas a Pagar -->
      <div class="glass-card-light dark:glass-card rounded-xl shadow-sm p-5 hover:shadow-md transition-all duration-200 cursor-pointer group">
        <div class="flex items-center justify-between mb-3">
          <div class="icon-glass w-10 h-10 rounded-lg flex items-center justify-center">
            <BanknotesIcon class="w-5 h-5 text-red-500 dark:text-red-400 relative z-10 stroke-2" />
          </div>
        </div>
        <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-1">Contas a pagar</h3>
        <p class="text-lg font-bold text-red-600 dark:text-red-400 mb-1">{{ formatMoney(metricas.contas_pagar) }}</p>
        <p class="text-xs text-gray-500 dark:text-gray-400">{{ metricas.contas_pagar_pendentes }} pendente{{ metricas.contas_pagar_pendentes !== 1 ? 's' : '' }} | {{ metricas.contas_pagar_vencidas }} vencida{{ metricas.contas_pagar_vencidas !== 1 ? 's' : '' }}</p>
      </div>

      <!-- Balanço -->
      <div class="glass-card-light dark:glass-card rounded-xl shadow-sm p-5 hover:shadow-md transition-all duration-200 cursor-pointer group">
        <div class="flex items-center justify-between mb-3">
          <div class="icon-glass w-10 h-10 rounded-lg flex items-center justify-center">
            <ChartBarIcon class="w-5 h-5 text-cyan-500 dark:text-cyan-400 relative z-10 stroke-2" />
          </div>
        </div>
        <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-1">Balanço</h3>
        <p class="text-lg font-bold" :class="metricas.balanco >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'">
          {{ formatMoney(metricas.balanco) }}
        </p>
        <p class="text-xs text-gray-500 dark:text-gray-400">{{ metricas.balanco >= 0 ? 'Lucro positivo' : 'Prejuízo' }}</p>
      </div>

      <!-- Categorias e Subcategorias -->
      <div class="glass-card-light dark:glass-card rounded-xl shadow-sm p-5 hover:shadow-md transition-all duration-200 cursor-pointer group">
        <div class="flex items-center justify-between mb-3">
          <div class="icon-glass w-10 h-10 rounded-lg flex items-center justify-center">
            <TagIcon class="w-5 h-5 text-cyan-500 dark:text-cyan-400 relative z-10 stroke-2" />
          </div>
        </div>
        <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-1">Categorias e Subcategorias</h3>
        <p class="text-lg font-bold text-purple-600 dark:text-purple-400 mb-1">{{ metricas.total_categorias }}</p>
        <p class="text-xs text-gray-500 dark:text-gray-400">categorias cadastradas</p>
      </div>

      <!-- Formas de Pagamento -->
      <div class="glass-card-light dark:glass-card rounded-xl shadow-sm p-5 hover:shadow-md transition-all duration-200 cursor-pointer group">
        <div class="flex items-center justify-between mb-3">
          <div class="icon-glass w-10 h-10 rounded-lg flex items-center justify-center">
            <CreditCardIcon class="w-5 h-5 text-cyan-500 dark:text-cyan-400 relative z-10 stroke-2" />
          </div>
        </div>
        <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-1">Formas de Pagamento</h3>
        <p class="text-sm font-medium text-blue-600 dark:text-blue-400 mb-1">Configurar</p>
        <p class="text-xs text-gray-500 dark:text-gray-400">PIX, dinheiro, cartão</p>
      </div>

      <!-- Bandeiras de Cartão -->
      <div class="glass-card-light dark:glass-card rounded-xl shadow-sm p-5 hover:shadow-md transition-all duration-200 cursor-pointer group">
        <div class="flex items-center justify-between mb-3">
          <div class="icon-glass w-10 h-10 rounded-lg flex items-center justify-center">
            <RectangleStackIcon class="w-5 h-5 text-cyan-500 dark:text-cyan-400 relative z-10 stroke-2" />
          </div>
        </div>
        <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-1">Bandeiras de Cartão</h3>
        <p class="text-sm font-medium text-blue-600 dark:text-blue-400 mb-1">Configurar</p>
        <p class="text-xs text-gray-500 dark:text-gray-400">Visa, Mastercard e mais</p>
      </div>

      <!-- Conta de Destino -->
      <div class="glass-card-light dark:glass-card rounded-xl shadow-sm p-5 hover:shadow-md transition-all duration-200 cursor-pointer group">
        <div class="flex items-center justify-between mb-3">
          <div class="icon-glass w-10 h-10 rounded-lg flex items-center justify-center">
            <ArrowRightCircleIcon class="w-5 h-5 text-cyan-500 dark:text-cyan-400 relative z-10 stroke-2" />
          </div>
        </div>
        <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-1">Conta de Destino</h3>
        <p class="text-sm font-medium text-blue-600 dark:text-blue-400 mb-1">Configurar</p>
        <p class="text-xs text-gray-500 dark:text-gray-400">para onde vai o valor recebido</p>
      </div>

      <!-- Bancos (contas) -->
      <div class="glass-card-light dark:glass-card rounded-xl shadow-sm p-5 hover:shadow-md transition-all duration-200 cursor-pointer group">
        <div class="flex items-center justify-between mb-3">
          <div class="icon-glass w-10 h-10 rounded-lg flex items-center justify-center">
            <BuildingOfficeIcon class="w-5 h-5 text-cyan-500 dark:text-cyan-400 relative z-10 stroke-2" />
          </div>
        </div>
        <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-1">Bancos (contas)</h3>
        <p class="text-sm font-medium text-blue-600 dark:text-blue-400 mb-1">Consultar</p>
        <p class="text-xs text-gray-500 dark:text-gray-400">contas onde a imobiliária guarda dinheiro</p>
      </div>

      <!-- Gastos Colaboradores -->
      <div class="glass-card-light dark:glass-card rounded-xl shadow-sm p-5 hover:shadow-md transition-all duration-200 cursor-pointer group">
        <div class="flex items-center justify-between mb-3">
          <div class="icon-glass w-10 h-10 rounded-lg flex items-center justify-center">
            <UserGroupIcon class="w-5 h-5 text-cyan-500 dark:text-cyan-400 relative z-10 stroke-2" />
          </div>
        </div>
        <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-1">Gastos Colaboradores</h3>
        <p class="text-lg font-bold text-red-600 dark:text-red-400 mb-1">{{ formatMoney(metricas.gastos_colaboradores) }}</p>
        <p class="text-xs text-gray-500 dark:text-gray-400">{{ metricas.gastos_colaboradores_pendentes }} pendente{{ metricas.gastos_colaboradores_pendentes !== 1 ? 's' : '' }}</p>
      </div>

      <!-- Planejamentos -->
      <div class="glass-card-light dark:glass-card rounded-xl shadow-sm p-5 hover:shadow-md transition-all duration-200 cursor-pointer group">
        <div class="flex items-center justify-between mb-3">
          <div class="icon-glass w-10 h-10 rounded-lg flex items-center justify-center">
            <ClipboardDocumentCheckIcon class="w-5 h-5 text-cyan-500 dark:text-cyan-400 relative z-10 stroke-2" />
          </div>
        </div>
        <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-1">Planejamentos</h3>
        <p class="text-lg font-bold text-green-600 dark:text-green-400 mb-1">{{ metricas.planejamentos_ativos }}</p>
        <p class="text-xs text-gray-500 dark:text-gray-400">planejamentos ativos</p>
      </div>

      <!-- Histórico de caixas -->
      <div class="glass-card-light dark:glass-card rounded-xl shadow-sm p-5 hover:shadow-md transition-all duration-200 cursor-pointer group">
        <div class="flex items-center justify-between mb-3">
          <div class="icon-glass w-10 h-10 rounded-lg flex items-center justify-center">
            <ClockIcon class="w-5 h-5 text-amber-500 dark:text-amber-400 relative z-10 stroke-2" />
          </div>
        </div>
        <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-1">Histórico de caixas</h3>
        <p class="text-sm font-medium text-amber-600 dark:text-amber-400 mb-1">Consultar</p>
        <p class="text-xs text-gray-500 dark:text-gray-400">fechamentos passados</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { 
  CurrencyDollarIcon,
  BanknotesIcon,
  ChartBarIcon,
  TagIcon,
  CreditCardIcon,
  RectangleStackIcon,
  ArrowRightCircleIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
  ClipboardDocumentCheckIcon,
  ClockIcon
} from '@heroicons/vue/24/outline'

const selectedMonthNum = ref(new Date().getMonth() + 1)
const selectedYear = ref(new Date().getFullYear())

const monthNames = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
]

const availableYears = computed(() => {
  const currentYear = new Date().getFullYear()
  const years = []
  for (let i = currentYear; i >= currentYear - 5; i--) {
    years.push(i)
  }
  return years
})

// Mock data - substituir por chamada à API
const totais = ref({
  receita_bruta: 117973.05,
  comissoes: 0.00,
  impostos: 1131.79,
  taxas_cartao: 0.00,
  valor_liquido: 116841.26
})

const metricas = ref({
  contas_receber: 117973.05,
  contas_receber_pendentes: 0,
  contas_pagar: 1131.79,
  contas_pagar_pendentes: 0,
  contas_pagar_vencidas: 0,
  balanco: 116841.26,
  total_categorias: 13,
  gastos_colaboradores: 0.00,
  gastos_colaboradores_pendentes: 0,
  planejamentos_ativos: 2
})

const formatMoney = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

const updatePeriodo = async () => {
  // TODO: Substituir por chamada real à API
  console.log('Período alterado:', `${selectedYear.value}-${String(selectedMonthNum.value).padStart(2, '0')}`)
  // await loadData()
}

const loadData = async () => {
  // TODO: Substituir por chamada real à API
  // const periodo = `${selectedYear.value}-${String(selectedMonthNum.value).padStart(2, '0')}`
  // const response = await api.get(`/financeiro/totais?periodo=${periodo}`)
  // totais.value = response.data.totais
  // metricas.value = response.data.metricas
}

onMounted(() => {
  loadData()
})
</script>
