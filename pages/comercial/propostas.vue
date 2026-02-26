<template>
  <div class="w-full max-w-full overflow-x-hidden">
    <!-- Header -->
    <div v-if="!showForm" class="flex justify-between items-center mb-6 flex-wrap gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Propostas</h1>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Gerencie propostas de compra e venda</p>
      </div>
      
      <div class="flex items-center gap-3">
        <!-- Botão Nova Proposta -->
        <button 
          @click="showForm = true" 
          class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-sm transition-colors flex items-center gap-2"
        >
          <DocumentPlusIcon class="h-5 w-5" />
          Nova Proposta
        </button>
      </div>
    </div>

    <!-- Filtros -->
    <div v-if="!showForm" class="bg-white dark:bg-brand-navy rounded-xl shadow-sm p-4 sm:p-6 mb-6 border border-gray-100 dark:border-gray-800">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <!-- Tipo de Filtro -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Filtrar por</label>
          <select
            v-model="filters.tipo"
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-brand-navy-dark text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="cliente">Cliente</option>
            <option value="corretor">Corretor</option>
            <option value="produto">Produto</option>
            <option value="gerente">Gerente</option>
          </select>
        </div>

        <!-- Campo de Pesquisa -->
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Pesquisar</label>
          <input
            type="text"
            v-model="filters.busca"
            @input="handleSearch"
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-brand-navy-dark text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            :placeholder="`Buscar por ${filters.tipo}...`"
          >
        </div>

        <!-- Status -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
          <select
            v-model="filters.status"
            @change="handleSearch"
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-brand-navy-dark text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Todos</option>
            <option value="aguardando aprovação">Aguardando Aprovação</option>
            <option value="aguardando pagamento">Aguardando Pagamento</option>
            <option value="aprovada">Aprovada</option>
            <option value="recusada">Reprovada</option>
            <option value="cancelada">Cancelada</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Formulário de Proposta -->
    <FormularioProposta
      v-if="showForm"
      :proposta="propostaSelecionada"
      @cancelar="voltarParaListagem"
      @submit="handleSubmit"
    />

    <!-- Lista de Propostas -->
    <ListaPropostas 
      v-else
      :propostas="propostasFiltradas"
      @edit="editProposta"
      @delete="deleteProposta"
      @status-updated="fetchPropostas"
    />
  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { DocumentPlusIcon } from '@heroicons/vue/24/outline'
import FormularioProposta from '@/components/propostas/FormularioProposta.vue'
import ListaPropostas from '@/components/propostas/ListaPropostas.vue'
import debounce from 'lodash/debounce'

const propostas = ref([])
const loading = ref(true)
const error = ref(null)
const showForm = ref(false)
const propostaSelecionada = ref(null)

// Filtros
const filters = reactive({
  tipo: 'cliente',
  busca: '',
  status: ''
})

// Computed para filtrar propostas
const propostasFiltradas = computed(() => {
  let propostas_filtradas = [...propostas.value]

  // Filtro por status
  if (filters.status) {
    propostas_filtradas = propostas_filtradas.filter(proposta => 
      proposta.status === filters.status
    )
  }

  // Se não há termo de busca, retorna as propostas filtradas por status
  if (!filters.busca) {
    return propostas_filtradas
  }

  const busca = filters.busca.toLowerCase()
  
  // Filtro por tipo e termo de busca
  return propostas_filtradas.filter(proposta => {
    switch (filters.tipo) {
      case 'cliente':
        return proposta.cliente_nome?.toLowerCase().includes(busca)
      case 'corretor':
        return proposta.corretor_nome?.toLowerCase().includes(busca)
      case 'produto':
        return proposta.produto_nome?.toLowerCase().includes(busca)
      case 'gerente':
        return proposta.gerente_nome?.toLowerCase().includes(busca)
      default:
        return true
    }
  })
})

// Função de busca com debounce
const handleSearch = debounce(() => {
  fetchPropostas()
}, 300)

const fetchPropostas = async () => {
  try {
    loading.value = true
    // TODO: Substituir por chamada real à API
    // const response = await api.get('/propostas', { params: filters })
    // propostas.value = response.data
    
    // Mock data
    propostas.value = [
      {
        id: 1,
        cliente_nome: 'João Silva',
        corretor_nome: 'Maria Santos',
        gerente_nome: 'Carlos Oliveira',
        produto_nome: 'Apartamento',
        unidade: '101',
        edificio_torre: 'Torre A',
        status: 'aguardando aprovação',
        vgv: 350000,
        created_at: '2025-01-15',
        updated_at: '2025-01-15'
      }
    ]
  } catch (error) {
    ElMessage.error('Erro ao carregar propostas')
  } finally {
    loading.value = false
  }
}

const handleSubmit = () => {
  showForm.value = false
  fetchPropostas()
}

const editProposta = (proposta) => {
  propostaSelecionada.value = proposta
  showForm.value = true
}

const deleteProposta = async (id) => {
  try {
    // TODO: Substituir por chamada real à API
    // await api.delete(`/propostas/${id}`)
    ElMessage.success('Proposta excluída com sucesso')
    fetchPropostas()
  } catch (error) {
    ElMessage.error('Erro ao excluir proposta')
  }
}

const voltarParaListagem = () => {
  showForm.value = false
  propostaSelecionada.value = null
}

onMounted(() => {
  fetchPropostas()
})
</script>
