<template>
  <div class="w-full max-w-full overflow-x-hidden">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Recibos</h1>
      <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Visualize e gerencie os recibos de comissão recebidos</p>
    </div>

    <!-- Filtros -->
    <div class="glass-card-light dark:glass-card rounded-xl shadow-sm p-4 sm:p-6 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">Buscar</label>
          <input
            v-model="filters.search"
            type="text"
            placeholder="Número, descrição..."
            class="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-brand-navy-dark text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">Período</label>
          <select
            v-model="filters.periodo"
            class="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-brand-navy-dark text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Todos</option>
            <option value="hoje">Hoje</option>
            <option value="semana">Esta semana</option>
            <option value="mes">Este mês</option>
            <option value="trimestre">Este trimestre</option>
            <option value="ano">Este ano</option>
          </select>
        </div>
        <div>
          <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">Data Inicial</label>
          <input
            v-model="filters.dataInicial"
            type="date"
            class="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-brand-navy-dark text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">Data Final</label>
          <input
            v-model="filters.dataFinal"
            type="date"
            class="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-brand-navy-dark text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 border-t-transparent"></div>
    </div>

    <!-- Estado Vazio -->
    <div v-else-if="recibosFiltrados.length === 0" class="glass-card-light dark:glass-card rounded-xl shadow-sm p-12">
      <div class="text-center">
        <ReceiptRefundIcon class="h-16 w-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Nenhum recibo encontrado</h3>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Os recibos aparecerão aqui quando você receber comissões pagas.
        </p>
      </div>
    </div>

    <div v-else class="space-y-3">
      <div
        v-for="recibo in recibosPaginados"
        :key="recibo.id"
        class="glass-card-light dark:glass-card rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
      >
        <div class="p-4 sm:p-6">
          <div class="flex items-start justify-between gap-4">
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-3 mb-3">
                <div class="icon-glass w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <ReceiptRefundIcon class="w-5 h-5 text-cyan-500 dark:text-cyan-400 relative z-10 stroke-2" />
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2 flex-wrap">
                    <h3 class="text-sm font-semibold text-gray-900 dark:text-white">
                      Recibo {{ recibo.numero }}
                    </h3>
                    <span class="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide rounded-md bg-green-500/10 text-green-700 dark:text-green-400 border border-green-200/50 dark:border-green-800/30">
                      Recebido
                    </span>
                  </div>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {{ formatDate(recibo.data_pagamento) }}
                  </p>
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                <div>
                  <p class="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Valor</p>
                  <p class="text-base font-bold text-gray-900 dark:text-white">
                    {{ formatMoney(recibo.valor) }}
                  </p>
                </div>
                <div>
                  <p class="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Comissão</p>
                  <p class="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {{ recibo.comissao_nome || '—' }}
                  </p>
                </div>
                <div>
                  <p class="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Descrição</p>
                  <p class="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {{ recibo.descricao || '—' }}
                  </p>
                </div>
                <div>
                  <p class="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Venda</p>
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    {{ recibo.venda_referencia || '—' }}
                  </p>
                </div>
              </div>
            </div>

            <div class="flex items-center gap-2 flex-shrink-0">
              <button
                @click="visualizarRecibo(recibo)"
                class="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                title="Visualizar"
              >
                <EyeIcon class="w-5 h-5" />
              </button>
              <button
                @click="baixarRecibo(recibo)"
                class="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                title="Baixar PDF"
              >
                <ArrowDownTrayIcon class="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Paginação -->
    <div
      v-if="recibosFiltrados.length > 0"
      class="flex items-center justify-between mt-6 pt-4 border-t border-gray-200 dark:border-gray-800"
    >
      <p class="text-xs text-gray-500 dark:text-gray-400 font-medium">
        Mostrando {{ recibosFiltrados.length > 0 ? Math.min((pagina - 1) * itensPorPagina + 1, recibosFiltrados.length) : 0 }} - {{ Math.min(pagina * itensPorPagina, recibosFiltrados.length) }} de {{ recibosFiltrados.length }} recibo{{ recibosFiltrados.length !== 1 ? 's' : '' }}
      </p>
      <div class="flex gap-2">
        <button
          @click="pagina = Math.max(1, pagina - 1)"
          :disabled="pagina <= 1"
          class="px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Anterior
        </button>
        <button
          @click="pagina = Math.min(totalPaginas, pagina + 1)"
          :disabled="pagina >= totalPaginas"
          class="px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Próxima
        </button>
      </div>
    </div>

    <!-- Modal de Visualização -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-gray-600/50 dark:bg-gray-900/75 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4"
      @click="showModal = false"
    >
      <div
        class="relative glass-card-light dark:glass-card rounded-xl shadow-xl w-full max-w-4xl"
        @click.stop
      >
        <div class="p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              Recibo {{ reciboSelecionado?.numero }}
            </h3>
            <button
              @click="showModal = false"
              class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <XMarkIcon class="w-5 h-5" />
            </button>
          </div>

          <div v-if="reciboSelecionado" class="space-y-6">
            <!-- Informações do Recibo -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Número</p>
                <p class="text-sm font-medium text-gray-900 dark:text-white">{{ reciboSelecionado.numero }}</p>
              </div>
              <div>
                <p class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Data de Pagamento</p>
                <p class="text-sm font-medium text-gray-900 dark:text-white">{{ formatDate(reciboSelecionado.data_pagamento) }}</p>
              </div>
              <div>
                <p class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Valor</p>
                <p class="text-lg font-bold text-gray-900 dark:text-white">{{ formatMoney(reciboSelecionado.valor) }}</p>
              </div>
              <div>
                <p class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Status</p>
                <span class="inline-block px-2 py-1 text-[10px] font-bold uppercase tracking-wide rounded-md bg-green-500/10 text-green-700 dark:text-green-400 border border-green-200/50 dark:border-green-800/30">
                  Recebido
                </span>
              </div>
            </div>

            <!-- Descrição -->
            <div>
              <p class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Descrição</p>
              <p class="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{{ reciboSelecionado.descricao || '—' }}</p>
            </div>

            <!-- Informações da Comissão -->
            <div v-if="reciboSelecionado.comissao_nome" class="border-t border-gray-200 dark:border-gray-800 pt-4">
              <p class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">Informações da Comissão</p>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Comissão</p>
                  <p class="text-sm font-medium text-gray-900 dark:text-white">{{ reciboSelecionado.comissao_nome }}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Venda</p>
                  <p class="text-sm font-medium text-gray-900 dark:text-white">{{ reciboSelecionado.venda_referencia || '—' }}</p>
                </div>
              </div>
            </div>

            <!-- Ações -->
            <div class="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
              <button
                @click="baixarRecibo(reciboSelecionado)"
                class="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg transition-all duration-200 flex items-center gap-2 text-sm font-semibold shadow-sm hover:shadow-md"
              >
                <ArrowDownTrayIcon class="w-4 h-4" />
                Baixar PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { 
  ReceiptRefundIcon, 
  EyeIcon, 
  ArrowDownTrayIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline'

const loading = ref(false)
const recibos = ref([])
const showModal = ref(false)
const reciboSelecionado = ref(null)
const pagina = ref(1)
const itensPorPagina = 10

const filters = ref({
  search: '',
  periodo: '',
  dataInicial: '',
  dataFinal: ''
})

// Mock data - substituir por chamada à API
const loadRecibos = async () => {
  loading.value = true
  try {
    // TODO: Substituir por chamada real à API
    await new Promise(resolve => setTimeout(resolve, 500))
    
    recibos.value = [
      {
        id: '1',
        numero: 'REC2025000001',
        valor: 15000.00,
        data_pagamento: '2025-01-15',
        descricao: 'Comissão referente à venda do apartamento Centro - R$ 450.000',
        comissao_nome: 'Comissão Venda #123',
        venda_referencia: 'VND-2025-001',
        pdf_path: '/recibos/rec2025000001.pdf'
      },
      {
        id: '2',
        numero: 'REC2025000002',
        valor: 8500.00,
        data_pagamento: '2025-01-10',
        descricao: 'Comissão referente à venda da casa Jardim Goiás - R$ 350.000',
        comissao_nome: 'Comissão Venda #122',
        venda_referencia: 'VND-2025-002',
        pdf_path: '/recibos/rec2025000002.pdf'
      },
      {
        id: '3',
        numero: 'REC2025000003',
        valor: 12000.00,
        data_pagamento: '2025-01-05',
        descricao: 'Comissão referente à venda do apartamento Setor Bueno - R$ 380.000',
        comissao_nome: 'Comissão Venda #121',
        venda_referencia: 'VND-2025-003',
        pdf_path: '/recibos/rec2025000003.pdf'
      }
    ]
  } catch (error) {
    console.error('Erro ao carregar recibos:', error)
  } finally {
    loading.value = false
  }
}

const recibosFiltrados = computed(() => {
  let filtered = [...recibos.value]

  // Filtro de busca
  if (filters.value.search) {
    const search = filters.value.search.toLowerCase()
    filtered = filtered.filter(r => 
      r.numero.toLowerCase().includes(search) ||
      r.descricao?.toLowerCase().includes(search) ||
      r.comissao_nome?.toLowerCase().includes(search)
    )
  }

  // Filtro de período
  if (filters.value.periodo) {
    const hoje = new Date()
    const dataLimite = new Date()
    
    switch (filters.value.periodo) {
      case 'hoje':
        dataLimite.setHours(0, 0, 0, 0)
        break
      case 'semana':
        dataLimite.setDate(hoje.getDate() - 7)
        break
      case 'mes':
        dataLimite.setMonth(hoje.getMonth() - 1)
        break
      case 'trimestre':
        dataLimite.setMonth(hoje.getMonth() - 3)
        break
      case 'ano':
        dataLimite.setFullYear(hoje.getFullYear() - 1)
        break
    }
    
    filtered = filtered.filter(r => {
      const dataRecibo = new Date(r.data_pagamento)
      return dataRecibo >= dataLimite
    })
  }

  // Filtro de data inicial
  if (filters.value.dataInicial) {
    const dataInicial = new Date(filters.value.dataInicial)
    filtered = filtered.filter(r => new Date(r.data_pagamento) >= dataInicial)
  }

  // Filtro de data final
  if (filters.value.dataFinal) {
    const dataFinal = new Date(filters.value.dataFinal)
    dataFinal.setHours(23, 59, 59, 999)
    filtered = filtered.filter(r => new Date(r.data_pagamento) <= dataFinal)
  }

  // Ordenar por data mais recente
  filtered.sort((a, b) => new Date(b.data_pagamento) - new Date(a.data_pagamento))

  return filtered
})

const totalPaginas = computed(() => {
  return Math.ceil(recibosFiltrados.value.length / itensPorPagina)
})

const recibosPaginados = computed(() => {
  const inicio = (pagina.value - 1) * itensPorPagina
  const fim = inicio + itensPorPagina
  return recibosFiltrados.value.slice(inicio, fim)
})

const formatMoney = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

const formatDate = (dateString) => {
  if (!dateString) return '—'
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  } catch {
    return dateString
  }
}

const visualizarRecibo = (recibo) => {
  reciboSelecionado.value = recibo
  showModal.value = true
}

const baixarRecibo = (recibo) => {
  // TODO: Substituir por chamada real à API para baixar o PDF
  // window.open(recibo.pdf_path, '_blank')
  console.log('Baixar recibo:', recibo.numero)
  alert(`Baixando recibo ${recibo.numero}...`)
}

onMounted(() => {
  loadRecibos()
})
</script>
