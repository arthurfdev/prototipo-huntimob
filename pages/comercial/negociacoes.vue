<template>
  <div class="w-full max-w-full overflow-x-hidden">
    <div class="flex justify-between items-center mb-6 flex-wrap gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Negociações</h1>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Gerencie todas as negociações</p>
      </div>
      
      <button 
        class="btn-gradient px-4 py-2 text-sm font-semibold flex items-center gap-2"
      >
        <PlusIcon class="h-4 w-4 stroke-2" />
        <span>Nova Negociação</span>
      </button>
    </div>
    
    <!-- Filtros -->
    <div class="glass-card-light dark:glass-card rounded-xl border border-white/10 p-4 sm:p-6 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
        <!-- Tipo de Filtro -->
        <div>
          <label for="filtro-tipo" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Filtrar por</label>
          <select
            id="filtro-tipo"
            v-model="filters.tipo"
            class="w-full px-4 py-2 glass-card-light dark:glass-card border border-white/10 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500/50"
          >
            <option value="cliente">Cliente</option>
            <option value="corretor">Corretor</option>
            <option value="produto">Produto</option>
          </select>
        </div>

        <!-- Campo de Pesquisa -->
        <div class="md:col-span-2">
          <label for="filtro-search" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Pesquisar</label>
          <input
            id="filtro-search"
            type="text"
            v-model="filters.busca"
            @input="handleSearch"
            class="w-full px-4 py-2 glass-card-light dark:glass-card border border-white/10 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500/50"
            :placeholder="`Buscar por ${filters.tipo}...`"
          >
        </div>

        <!-- Status -->
        <div>
          <label for="filtro-status" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
          <select
            id="filtro-status"
            v-model="filters.status"
            @change="handleSearch"
            class="w-full px-4 py-2 glass-card-light dark:glass-card border border-white/10 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500/50"
          >
            <option value="">Todos</option>
            <option value="em andamento">Em Andamento</option>
            <option value="concluída">Concluída</option>
            <option value="cancelada">Cancelada</option>
          </select>
        </div>

        <!-- Filtro de período -->
        <div>
          <label for="filtro-mes" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Mês/Ano</label>
          <select 
            id="filtro-mes"
            v-model="filters.mes" 
            @change="handleSearch"
            class="w-full px-4 py-2 glass-card-light dark:glass-card border border-white/10 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500/50"
          >
            <option value="">Todos</option>
            <option v-for="(mes, index) in mesesDisponiveis" 
                    :key="index" 
                    :value="mes.valor">
              {{ mes.texto }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <!-- Tabela de Vendas -->
    <div class="glass-card-light dark:glass-card rounded-xl border border-white/10 overflow-hidden">
      <div v-if="loading" class="p-4">
        <div class="animate-pulse space-y-4">
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
        </div>
      </div>

      <table v-else class="min-w-full divide-y divide-white/10">
        <thead class="glass-card-light dark:glass-card bg-white/5 dark:bg-white/5 backdrop-blur-sm">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Cliente</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Produto</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Corretor</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Observações</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Ações</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-white/10">
          <tr v-for="venda in paginatedVendas" :key="venda.id" class="hover:bg-white/5 dark:hover:bg-white/5 transition-colors">
            <td class="px-6 py-4">
              <div class="text-sm font-medium text-gray-900 dark:text-white">{{ venda.cliente?.nome }}</div>
            </td>
            <td class="px-6 py-4">
              <div class="text-sm font-medium text-gray-900 dark:text-white">{{ venda.produto?.nome }}</div>
              <div class="text-sm text-gray-500 dark:text-gray-400">
                {{ venda.unidade }} - {{ venda.edificio_torre }}
              </div>
            </td>
            <td class="px-6 py-4">
              <div class="text-sm font-medium text-gray-900 dark:text-white">{{ venda.corretor?.nome }}</div>
              <div class="text-sm text-gray-500 dark:text-gray-400">{{ venda.gerente?.nome }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span :class="getStatusClass(venda.status_negociacao)">
                {{ venda.status_negociacao }}
              </span>
              <div v-if="venda.status_negociacao === 'Concluída'" class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {{ formatarData(venda.data_conclusao) }}
              </div>
            </td>
            <td class="px-6 py-4">
              <div class="text-sm text-gray-700 dark:text-gray-300">{{ venda.observacoes || '-' }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex gap-2">
                <button 
                  v-if="venda.status_negociacao !== 'Concluída'"
                  @click="editarVenda(venda)"
                  class="icon-glass p-2 rounded-lg hover:bg-white/20 transition-colors"
                  title="Editar"
                >
                  <PencilIcon class="h-4 w-4 text-cyan-500 dark:text-cyan-400 relative z-10 stroke-2" />
                </button>
                <button 
                  @click="excluirVenda(venda.id)"
                  class="icon-glass p-2 rounded-lg hover:bg-white/20 transition-colors"
                  title="Excluir"
                >
                  <TrashIcon class="h-4 w-4 text-red-500 dark:text-red-400 relative z-10 stroke-2" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Paginação -->
      <div class="glass-card-light dark:glass-card bg-white/5 dark:bg-white/5 backdrop-blur-sm px-4 py-3 border-t border-white/10 sm:px-6">
        <div class="flex items-center justify-between">
          <div class="text-sm text-gray-700 dark:text-gray-300">
            Mostrando <span class="font-medium">{{ startIndex + 1 }}</span> até 
            <span class="font-medium">{{ endIndex }}</span> de 
            <span class="font-medium">{{ totalItems }}</span> resultados
          </div>
          <div class="flex gap-2">
            <button
              @click="currentPage--"
              :disabled="currentPage === 1"
              class="px-3 py-2 glass-card-light dark:glass-card border border-white/10 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-white/10 dark:hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>
            <button
              @click="currentPage++"
              :disabled="currentPage >= totalPages"
              class="px-3 py-2 glass-card-light dark:glass-card border border-white/10 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-white/10 dark:hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Próximo
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { debounce } from 'lodash'
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/vue/24/outline'

const vendas = ref([])
const loading = ref(false)

// Array de meses em português
const mesesDisponiveis = computed(() => {
  const meses = []
  const hoje = new Date()
  
  for (let i = 0; i < 12; i++) {
    const data = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1)
    meses.push({
      valor: data.toISOString().slice(0, 7),
      texto: data.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
    })
  }
  
  return meses
})

// Filtros
const filters = reactive({
  tipo: 'cliente',
  busca: '',
  status: '',
  mes: new Date().toISOString().slice(0, 7)
})

// Paginação
const currentPage = ref(1)
const perPage = 10

// Computed para filtrar vendas
const vendasFiltradas = computed(() => {
  return vendas.value.filter(venda => {
    // Filtro por mês
    if (filters.mes) {
      const dataVenda = new Date(venda.created_at)
      const [anoSelecionado, mesSelecionado] = filters.mes.split('-')
      
      if (dataVenda.getFullYear() !== parseInt(anoSelecionado) || 
          dataVenda.getMonth() !== parseInt(mesSelecionado) - 1) {
        return false
      }
    }

    // Filtro por status
    if (filters.status && venda.status_negociacao.toLowerCase() !== filters.status) {
      return false
    }

    // Se não há termo de busca, retorna true
    if (!filters.busca) {
      return true
    }

    const busca = filters.busca.toLowerCase()
    
    // Filtro por tipo
    switch (filters.tipo) {
      case 'cliente':
        return venda.cliente?.nome?.toLowerCase().includes(busca)
      case 'corretor':
        return venda.corretor?.nome?.toLowerCase().includes(busca)
      case 'produto':
        return venda.produto?.nome?.toLowerCase().includes(busca)
      default:
        return true
    }
  })
})

// Computed properties para paginação
const totalItems = computed(() => vendasFiltradas.value.length)
const totalPages = computed(() => Math.ceil(totalItems.value / perPage))
const startIndex = computed(() => (currentPage.value - 1) * perPage)
const endIndex = computed(() => Math.min(startIndex.value + perPage, totalItems.value))

const paginatedVendas = computed(() => {
  return vendasFiltradas.value.slice(startIndex.value, endIndex.value)
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

// Resetar página ao filtrar
watch([() => filters.busca, () => filters.status, () => filters.mes], () => {
  currentPage.value = 1
})

// Formatação
const getStatusClass = (status) => {
  const classes = {
    'Em andamento': 'px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400',
    'Concluída': 'px-2 py-1 text-xs font-medium rounded-full bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400',
    'Cancelada': 'px-2 py-1 text-xs font-medium rounded-full bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400',
  }
  return classes[status] || 'px-2 py-1 text-xs font-medium rounded-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300'
}

const formatarData = (data) => {
  if (!data) return '-'
  return new Date(data).toLocaleDateString('pt-BR')
}

// Funções de ação
const carregarVendas = async () => {
  try {
    loading.value = true
    // TODO: Substituir por chamada real à API
    await new Promise(resolve => setTimeout(resolve, 500))
    vendas.value = [
      { 
        id: 1, 
        cliente: { nome: 'João Silva' }, 
        produto: { nome: 'Apartamento' }, 
        unidade: '101', 
        edificio_torre: 'Torre A',
        corretor: { nome: 'Carlos Mendes' },
        gerente: { nome: 'Ana Costa' },
        status_negociacao: 'Em andamento',
        observacoes: 'Cliente interessado',
        created_at: new Date(),
        data_conclusao: null
      },
      { 
        id: 2, 
        cliente: { nome: 'Maria Santos' }, 
        produto: { nome: 'Casa' }, 
        unidade: '202', 
        edificio_torre: 'Torre B',
        corretor: { nome: 'Roberto Alves' },
        gerente: { nome: 'Ana Costa' },
        status_negociacao: 'Concluída',
        observacoes: 'Venda finalizada',
        created_at: new Date(),
        data_conclusao: new Date()
      },
    ]
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

const editarVenda = (venda) => {
  if (venda.status_negociacao === 'Concluída') {
    alert('Não é possível editar uma venda concluída')
    return
  }
  // TODO: Implementar edição
  console.log('Editar venda:', venda)
}

const excluirVenda = async (id) => {
  if (!confirm('Tem certeza que deseja excluir esta venda?')) {
    return
  }
  
  try {
    // TODO: Substituir por chamada real à API
    vendas.value = vendas.value.filter(v => v.id !== id)
    alert('Venda excluída com sucesso')
  } catch (error) {
    console.error(error)
    alert('Erro ao excluir venda')
  }
}

// Atualizar handleSearch para resetar página
const handleSearch = debounce(() => {
  currentPage.value = 1
}, 300)

// Inicialização
onMounted(() => {
  carregarVendas()
})
</script>
