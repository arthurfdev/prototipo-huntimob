<template>
  <div class="w-full max-w-full overflow-x-hidden">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Balanço Mensal</h1>
      <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Acompanhe entradas, saídas e saldo do período</p>
    </div>

    <!-- Cards de Resumo -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-8 w-full">
      <div 
        v-for="(card, index) in ['Entradas', 'Saídas', 'Saldo']" 
        :key="index" 
        class="glass-card-light dark:glass-card rounded-xl shadow-sm p-5 sm:p-6 border border-white/10 hover:shadow-lg hover:border-emerald-500/50 transition-all"
      >
        <div v-if="loading" class="animate-pulse">
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
          <div class="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        </div>
        <template v-else>
          <div class="flex items-start justify-between mb-3">
            <div class="flex-1">
              <h3 class="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Total de {{ card }}</h3>
              <p class="text-3xl sm:text-4xl font-bold mt-2" :class="getCardColor(card, index)">
                {{ getCardValue(card, index) }}
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">{{ index === 2 ? 'Resultado do período' : 'Mês atual' }}</p>
            </div>
            <div class="icon-glass p-2.5 rounded-xl flex-shrink-0">
              <component :is="getCardIcon(card, index)" class="h-6 w-6 relative z-10 stroke-2" :class="getCardIconColor(card, index)" />
            </div>
          </div>
        </template>
      </div>
    </div>

    <!-- Filtros -->
    <div class="glass-card-light dark:glass-card rounded-xl shadow-sm p-4 sm:p-6 mb-6 border border-white/10">
      <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div class="flex items-center gap-2">
          <label for="mesAtual" class="text-sm font-medium text-gray-700 dark:text-gray-300">Período:</label>
          <select 
            id="mesAtual"
            v-model="mesAtual"
            class="px-4 py-2 glass-card-light dark:glass-card border border-white/10 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500/50"
            @change="buscarDados"
          >
            <option v-for="mes in mesesDisponiveis" :key="mes.valor" :value="mes.valor">
              {{ mes.texto }}
            </option>
          </select>
        </div>
        <button 
          @click="buscarDados" 
          class="btn-gradient px-4 py-2 text-sm font-semibold flex items-center gap-2"
        >
          <ArrowPathIcon class="h-5 w-5 stroke-2" />
          Atualizar
        </button>
      </div>
    </div>

    <!-- Loading state para as tabelas -->
    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div v-for="i in 2" :key="i" class="glass-card-light dark:glass-card rounded-xl shadow-sm animate-pulse border border-white/10">
        <div class="h-16 bg-gray-100 dark:bg-gray-800 rounded-t-xl"></div>
        <div class="p-4">
          <div v-for="j in 4" :key="j" class="h-8 bg-gray-200 dark:bg-gray-700 rounded my-2"></div>
        </div>
      </div>
    </div>

    <!-- Tabelas -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Tabela de Entradas -->
      <div class="glass-card-light dark:glass-card rounded-xl shadow-sm border border-white/10 overflow-hidden">
        <div class="p-4 sm:p-6 border-b border-white/10 bg-emerald-500/10 dark:bg-emerald-500/20">
          <h2 class="text-xl font-semibold text-emerald-700 dark:text-emerald-400">Entradas</h2>
        </div>
        <div class="overflow-auto max-h-[500px]">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
            <thead class="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm sticky top-0">
              <tr>
                <th class="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Data</th>
                <th class="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Descrição</th>
                <th class="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Valor</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-white/10">
              <tr v-for="entrada in entradas" :key="entrada.proposta_id || entrada.id" class="hover:bg-white/10 dark:hover:bg-white/5 transition-colors">
                <td class="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ formatDate(entrada.data) }}</td>
                <td class="px-4 sm:px-6 py-4 text-sm text-gray-900 dark:text-white">{{ entrada.observacao }}</td>
                <td class="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-emerald-600 dark:text-emerald-400">
                  {{ formatCurrency(parseFloat(entrada.valor)) }}
                </td>
              </tr>
              <tr v-if="entradas.length === 0">
                <td colspan="3" class="px-4 sm:px-6 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                  Nenhuma entrada registrada
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Tabela de Saídas -->
      <div class="glass-card-light dark:glass-card rounded-xl shadow-sm border border-white/10 overflow-hidden">
        <div class="p-4 sm:p-6 border-b border-white/10 bg-red-500/10 dark:bg-red-500/20">
          <h2 class="text-xl font-semibold text-red-700 dark:text-red-400">Saídas</h2>
        </div>
        <div class="overflow-auto max-h-[500px]">
          <table class="min-w-full divide-y divide-white/10">
            <thead class="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm sticky top-0">
              <tr>
                <th class="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Data</th>
                <th class="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Descrição</th>
                <th class="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Valor</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-white/10">
              <tr v-for="saida in saidas" :key="saida.id" class="hover:bg-white/10 dark:hover:bg-white/5 transition-colors">
                <td class="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ formatDate(saida.data) }}</td>
                <td class="px-4 sm:px-6 py-4 text-sm text-gray-900 dark:text-white">{{ saida.observacao }}</td>
                <td class="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600 dark:text-red-400">
                  {{ formatCurrency(parseFloat(saida.valor)) }}
                </td>
              </tr>
              <tr v-if="saidas.length === 0">
                <td colspan="3" class="px-4 sm:px-6 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                  Nenhuma saída registrada
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { ArrowPathIcon, ArrowTrendingUpIcon, ArrowTrendingDownIcon, CurrencyDollarIcon } from '@heroicons/vue/24/outline'

const mesAtual = ref(new Date().toISOString().slice(0, 7))

// Função para gerar os últimos 12 meses
const mesesDisponiveis = computed(() => {
  const meses = []
  const hoje = new Date()
  
  for (let i = 0; i < 12; i++) {
    const data = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1)
    const valor = data.toISOString().slice(0, 7)
    const mes = data.toLocaleString('pt-BR', { month: 'long' })
    const ano = data.getFullYear()
    
    meses.push({
      valor: valor,
      texto: `${mes.charAt(0).toUpperCase() + mes.slice(1)} de ${ano}`
    })
  }
  
  return meses
})

const loading = ref(false)
const entradas = ref([])
const saidas = ref([])

const buscarDados = async () => {
  try {
    loading.value = true
    // TODO: Substituir por chamada real à API
    // const response = await api.get(`/balanco-mensal?mes=${mesAtual.value}`)
    // entradas.value = response.data.entradas
    // saidas.value = response.data.saidas
    
    // Mock data para demonstração
    entradas.value = [
      { id: 1, data: '2025-01-15', observacao: 'Venda de apartamento - Unidade 101', valor: 350000 },
      { id: 2, data: '2025-01-20', observacao: 'Comissão recebida', valor: 15000 },
    ]
    saidas.value = [
      { id: 1, data: '2025-01-10', observacao: 'Pagamento de fornecedor', valor: 5000 },
      { id: 2, data: '2025-01-25', observacao: 'Despesas administrativas', valor: 3000 },
    ]
    
    ElMessage({
      message: 'Dados atualizados com sucesso!',
      type: 'success'
    })
  } catch (error) {
    console.error('Erro ao buscar dados do balanço:', error)
    ElMessage({
      message: 'Erro ao carregar dados do balanço mensal',
      type: 'error',
      duration: 5000
    })
  } finally {
    loading.value = false
  }
}

const totalEntradas = computed(() => {
  return entradas.value.reduce((acc, entrada) => acc + parseFloat(entrada.valor), 0)
})

const totalSaidas = computed(() => {
  return saidas.value.reduce((acc, saida) => acc + parseFloat(saida.valor), 0)
})

const saldoMes = computed(() => {
  return totalEntradas.value - totalSaidas.value
})

const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

const formatDate = (date) => {
  if (!date) return ''
  if (date.includes('/')) {
    return date.split(' ')[0]
  }
  return new Date(date).toLocaleDateString('pt-BR')
}

// Funções auxiliares para os cards
const getCardColor = (card, index) => {
  if (index === 0) return 'text-emerald-600 dark:text-emerald-400'
  if (index === 1) return 'text-red-600 dark:text-red-400'
  return saldoMes.value >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
}

const getCardValue = (card, index) => {
  if (index === 0) return formatCurrency(totalEntradas.value)
  if (index === 1) return formatCurrency(totalSaidas.value)
  return formatCurrency(saldoMes.value)
}

const getCardIcon = (card, index) => {
  if (index === 0) return ArrowTrendingUpIcon
  if (index === 1) return ArrowTrendingDownIcon
  return CurrencyDollarIcon
}

const getCardIconColor = (card, index) => {
  if (index === 0) return 'text-emerald-500 dark:text-emerald-400'
  if (index === 1) return 'text-red-500 dark:text-red-400'
  return saldoMes.value >= 0 ? 'text-emerald-500 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'
}

onMounted(() => {
  buscarDados()
})
</script>

<style scoped>
.overflow-auto::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.overflow-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.overflow-auto::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.overflow-auto::-webkit-scrollbar-thumb:hover {
  background: #555;
}

.dark .overflow-auto::-webkit-scrollbar-track {
  background: #1f2937;
}

.dark .overflow-auto::-webkit-scrollbar-thumb {
  background: #4b5563;
}

.dark .overflow-auto::-webkit-scrollbar-thumb:hover {
  background: #6b7280;
}
</style>
