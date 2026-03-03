<template>
  <div class="w-full">
    <div class="flex justify-between items-center mb-6 flex-wrap gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Comissões</h1>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Gerencie todas as comissões</p>
      </div>
    </div>

    <!-- Filtros -->
    <div class="glass-card-light dark:glass-card rounded-xl border border-white/10 p-4 sm:p-6 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <!-- Campo de Filtro -->
        <div>
          <label for="filtro-campo" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Filtrar por</label>
          <select
            id="filtro-campo"
            v-model="filters.search_field"
            class="w-full px-4 py-2 glass-card-light dark:glass-card border border-white/10 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500/50"
          >
            <option value="cliente">Cliente</option>
            <option value="produto">Produto</option>
            <option value="colaborador">Colaborador</option>
            <option value="unidade">Unidade</option>
          </select>
        </div>
        
        <!-- Barra de Pesquisa -->
        <div class="md:col-span-2">
          <label for="filtro-search" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Pesquisar</label>
          <input
            id="filtro-search"
            type="text"
            v-model="filters.search"
            class="w-full px-4 py-2 glass-card-light dark:glass-card border border-white/10 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500/50"
            placeholder="Digite para pesquisar..."
          >
        </div>
        
        <!-- Status -->
        <div>
          <label for="filtro-status" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
          <select
            id="filtro-status"
            v-model="filters.status"
            class="w-full px-4 py-2 glass-card-light dark:glass-card border border-white/10 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500/50"
          >
            <option value="">Todos</option>
            <option value="pendente">Pendente</option>
            <option value="pago">Pago</option>
            <option value="recebido">Recebido</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Lista de Comissões -->
    <div class="glass-card-light dark:glass-card rounded-xl border border-white/10 overflow-x-auto">
      <!-- Loading state -->
      <div v-if="loading" class="p-4">
        <div class="animate-pulse space-y-4">
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
        </div>
      </div>

      <!-- Data loaded -->
      <table v-else class="min-w-full divide-y divide-white/10">
        <thead class="bg-white/5 backdrop-blur-sm">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Data</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Cliente</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Produto</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Colaboradores</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Ações</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-white/10">
          <tr v-for="comissao in paginatedComissoes" :key="comissao.id" class="hover:bg-white/5 transition-colors">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
              {{ formatarData(getDataRecebimento(comissao)) }}
            </td>
            <td class="px-6 py-4">
              <div class="text-sm font-medium text-gray-900 dark:text-white">{{ comissao.cliente?.nome }}</div>
            </td>
            <td class="px-6 py-4">
              <div class="text-sm font-medium text-gray-900 dark:text-white">{{ comissao.produto?.nome }}</div>
              <div class="text-sm text-gray-500 dark:text-gray-400">
                {{ comissao.unidade }} - {{ comissao.edificio_torre }}
              </div>
            </td>
            <td class="px-6 py-4">
              <div class="text-sm font-medium text-gray-900 dark:text-white">{{ comissao.corretor?.nome }}</div>
              <div class="text-sm text-gray-500 dark:text-gray-400">
                {{ comissao.gerente?.nome }}
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span :class="getStatusClass(getComissaoStatus(comissao))">
                {{ formatarStatus(getComissaoStatus(comissao)) }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <button
                @click="verDetalhes(comissao)"
                class="icon-glass p-2 rounded-lg hover:bg-white/20 transition-colors"
                title="Detalhar"
              >
                <EyeIcon class="h-4 w-4 text-cyan-500 dark:text-cyan-400 relative z-10 stroke-2" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Paginação -->
      <div class="flex items-center justify-between border-t border-white/10 px-4 py-3 sm:px-6">
        <div class="flex flex-1 justify-between sm:hidden">
          <button
            @click="currentPage--"
            :disabled="currentPage === 1"
            class="relative inline-flex items-center rounded-md glass-card-light dark:glass-card border border-white/10 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-white/10 dark:hover:bg-white/10 disabled:opacity-50"
          >
            Anterior
          </button>
          <button
            @click="currentPage++"
            :disabled="currentPage >= totalPages"
            class="relative ml-3 inline-flex items-center rounded-md glass-card-light dark:glass-card border border-white/10 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-white/10 dark:hover:bg-white/10 disabled:opacity-50"
          >
            Próximo
          </button>
        </div>
        <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p class="text-sm text-gray-700 dark:text-gray-300">
              Mostrando
              <span class="font-medium">{{ startIndex + 1 }}</span>
              até
              <span class="font-medium">{{ endIndex }}</span>
              de
              <span class="font-medium">{{ totalItems }}</span>
              resultados
            </p>
          </div>
          <div>
            <nav class="isolate inline-flex -space-x-px rounded-md" aria-label="Pagination">
              <button
                @click="currentPage--"
                :disabled="currentPage === 1"
                class="relative inline-flex items-center rounded-l-md glass-card-light dark:glass-card border border-white/10 px-2 py-2 text-gray-400 hover:bg-white/10 dark:hover:bg-white/10 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
              >
                Anterior
              </button>
              <button
                v-for="page in displayedPages"
                :key="page"
                @click="currentPage = page"
                :class="[
                  currentPage === page
                    ? 'relative z-10 inline-flex items-center btn-gradient px-4 py-2 text-sm font-semibold text-white focus:z-20'
                    : 'relative inline-flex items-center glass-card-light dark:glass-card border border-white/10 px-4 py-2 text-sm font-semibold text-gray-900 dark:text-white hover:bg-white/10 dark:hover:bg-white/10 focus:z-20 focus:outline-offset-0', 
                ]"
              >
                {{ page }}
              </button>
              <button
                @click="currentPage++"
                :disabled="currentPage >= totalPages"
                class="relative inline-flex items-center rounded-r-md glass-card-light dark:glass-card border border-white/10 px-2 py-2 text-gray-400 hover:bg-white/10 dark:hover:bg-white/10 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
              >
                Próximo
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watch } from 'vue'
import { EyeIcon } from '@heroicons/vue/24/outline'

const comissoes = ref([])
const loading = ref(false)
const error = ref(null)

// Filtros
const filters = reactive({
  search: '',
  search_field: 'cliente',
  status: ''
})

// Paginação
const currentPage = ref(1)
const perPage = 10

// Computed para filtrar os dados
const comissoesFiltradas = computed(() => {
  let resultado = [...comissoes.value]
  
  if (filters.search) {
    const searchLower = filters.search.toLowerCase()
    resultado = resultado.filter(comissao => {
      switch (filters.search_field) {
        case 'cliente':
          return comissao.cliente?.nome?.toLowerCase().includes(searchLower)
        case 'produto':
          return comissao.produto?.nome?.toLowerCase().includes(searchLower)
        case 'colaborador':
          return comissao.corretor?.nome?.toLowerCase().includes(searchLower) ||
                 comissao.gerente?.nome?.toLowerCase().includes(searchLower)
        case 'unidade':
          return comissao.unidade?.toLowerCase().includes(searchLower)
        default:
          return true
      }
    })
  }

  if (filters.status) {
    resultado = resultado.filter(comissao => {
      const status = getComissaoStatus(comissao)
      return status === filters.status
    })
  }

  return resultado
})

// Paginação usando dados filtrados
const totalItems = computed(() => comissoesFiltradas.value.length)
const totalPages = computed(() => Math.ceil(totalItems.value / perPage))
const startIndex = computed(() => (currentPage.value - 1) * perPage)
const endIndex = computed(() => Math.min(startIndex.value + perPage, totalItems.value))

const paginatedComissoes = computed(() => {
  return comissoesFiltradas.value.slice(startIndex.value, endIndex.value)
})

// Gera array de páginas a serem exibidas
const displayedPages = computed(() => {
  const pages = []
  const maxPages = 5
  
  if (totalPages.value <= maxPages) {
    for (let i = 1; i <= totalPages.value; i++) {
      pages.push(i)
    }
  } else {
    let start = Math.max(1, currentPage.value - 2)
    let end = Math.min(totalPages.value, start + maxPages - 1)
    
    if (end === totalPages.value) {
      start = Math.max(1, end - maxPages + 1)
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
  }
  
  return pages
})

// Reset página ao filtrar
watch([() => filters.search, () => filters.search_field, () => filters.status], () => {
  currentPage.value = 1
})

// Formatação
const formatarData = (data) => {
  if (!data) return '-'
  return new Date(data).toLocaleDateString('pt-BR')
}

const getStatusClass = (status) => {
  const classes = {
    'pendente': 'px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400',
    'pago': 'px-2 py-1 text-xs font-medium rounded-full bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400',
    'recebido': 'px-2 py-1 text-xs font-medium rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400',
    'cancelado': 'px-2 py-1 text-xs font-medium rounded-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300'
  }
  return classes[status] || ''
}

const formatarStatus = (status) => {
  const statusMap = {
    'pendente': 'Pendente',
    'pago': 'Pago',
    'recebido': 'Recebido',
    'cancelado': 'Cancelado'
  }
  return statusMap[status] || status
}

const getComissaoStatus = (comissao) => {
  const firstComissao = Object.values(comissao.comissoes || {})[0]
  return firstComissao?.comissao_status || 'pendente'
}

const getDataRecebimento = (comissao) => {
  const firstComissao = Object.values(comissao.comissoes || {})[0]
  return firstComissao?.data_recebimento
}

const verDetalhes = (comissao) => {
  // TODO: Implementar modal ou navegação para detalhes
  console.log('Ver detalhes:', comissao)
}

// Funções
const fetchComissoes = async () => {
  try {
    loading.value = true
    // TODO: Substituir por chamada real à API
    await new Promise(resolve => setTimeout(resolve, 500))
    comissoes.value = [
      { 
        id: 1, 
        cliente: { nome: 'João Silva' }, 
        produto: { nome: 'Apartamento' }, 
        unidade: '101', 
        edificio_torre: 'Torre A',
        corretor: { nome: 'Carlos Mendes' },
        gerente: { nome: 'Ana Costa' },
        comissoes: { 1: { comissao_status: 'pendente', data_recebimento: null } }
      },
      { 
        id: 2, 
        cliente: { nome: 'Maria Santos' }, 
        produto: { nome: 'Casa' }, 
        unidade: '202', 
        edificio_torre: 'Torre B',
        corretor: { nome: 'Roberto Alves' },
        gerente: { nome: 'Ana Costa' },
        comissoes: { 1: { comissao_status: 'pago', data_recebimento: new Date() } }
      },
    ]
  } catch (err) {
    console.error('Erro ao carregar comissões:', err)
    error.value = 'Erro ao carregar comissões.'
  } finally {
    loading.value = false
  }
}

// Inicialização
onMounted(() => {
  fetchComissoes()
})
</script>
