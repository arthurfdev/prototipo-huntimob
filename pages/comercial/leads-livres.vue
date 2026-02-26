<template>
  <div class="w-full max-w-full overflow-x-hidden">
    <div class="flex justify-between items-center mb-6 flex-wrap gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Leads Livres</h1>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Gerencie leads disponíveis para atribuição</p>
      </div>
      
      <button
        @click="carregarLeadsLivres"
        class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-sm transition-colors flex items-center space-x-2"
      >
        <ArrowPathIcon class="h-5 w-5" />
        <span>Atualizar</span>
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-500"></div>
    </div>

    <!-- Lista de Leads Livres -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="lead in leadsLivres"
        :key="lead.id"
        class="bg-white dark:bg-brand-navy p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 hover:shadow-md transition-all cursor-pointer"
        @click="selecionarLead(lead)"
      >
        <div class="flex justify-between items-start mb-4">
          <h3 class="font-semibold text-gray-900 dark:text-white text-lg">{{ lead.nome }}</h3>
          <span class="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 text-xs px-2 py-1 rounded-full font-medium">
            Livre
          </span>
        </div>
        
        <div class="space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <div class="flex items-center">
            <PhoneIcon class="w-4 h-4 mr-2" />
            {{ lead.telefone }}
          </div>
          <div v-if="lead.email" class="flex items-center">
            <EnvelopeIcon class="w-4 h-4 mr-2" />
            {{ lead.email }}
          </div>
          <div v-if="lead.faixa_renda" class="flex items-center">
            <CurrencyDollarIcon class="w-4 h-4 mr-2" />
            {{ lead.faixa_renda }}
          </div>
          <div v-if="lead.objetivo" class="flex items-center">
            <span class="inline-block w-3 h-3 rounded-full mr-2" :class="getObjectiveColor(lead.objetivo)"></span>
            {{ lead.objetivo }}
          </div>
          <div v-if="lead.data_cadastro" class="flex items-center text-gray-500 dark:text-gray-500">
            <CalendarIcon class="w-4 h-4 mr-2" />
            {{ formatarData(lead.data_cadastro) }}
          </div>
        </div>

        <div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            @click.stop="atribuirLead(lead)"
            class="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors text-sm font-medium"
          >
            Atribuir Lead
          </button>
        </div>
      </div>
    </div>

    <!-- Estado vazio -->
    <div v-if="!loading && leadsLivres.length === 0" class="text-center py-12">
      <UserGroupIcon class="mx-auto h-12 w-12 text-gray-400" />
      <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">Nenhum lead livre</h3>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Todos os leads estão atribuídos ou no pipeline.</p>
    </div>

    <!-- Modal de Atribuição -->
    <div
      v-if="showAtribuicaoModal"
      class="fixed inset-0 bg-gray-600/50 dark:bg-gray-900/75 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4"
      @click="closeAtribuicaoModal"
    >
      <div
        class="relative bg-white dark:bg-brand-navy p-6 rounded-xl shadow-xl border border-gray-200 dark:border-gray-800 w-full max-w-md"
        @click.stop
      >
        <div class="mb-4">
          <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">
            Atribuir Lead: {{ leadSelecionado?.nome }}
          </h3>
          
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Colaborador
            </label>
            <select
              v-model="colaboradorSelecionado"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-brand-navy-dark text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Selecione um colaborador</option>
              <option
                v-for="colaborador in colaboradores"
                :key="colaborador.id"
                :value="colaborador.id"
              >
                {{ colaborador.nome }}
              </option>
            </select>
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Coluna do Pipeline
            </label>
            <select
              v-model="colunaSelecionada"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-brand-navy-dark text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Selecione uma coluna</option>
              <option
                v-for="coluna in colunas"
                :key="coluna.id"
                :value="coluna.id"
              >
                {{ coluna.nome }}
              </option>
            </select>
          </div>
          
          <div class="flex justify-end space-x-3">
            <button
              @click="closeAtribuicaoModal"
              class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              Cancelar
            </button>
            <button
              @click="confirmarAtribuicao"
              :disabled="!colaboradorSelecionado || !colunaSelecionada"
              class="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              Atribuir
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { 
  ArrowPathIcon, 
  PhoneIcon, 
  EnvelopeIcon, 
  CurrencyDollarIcon, 
  CalendarIcon,
  UserGroupIcon
} from '@heroicons/vue/24/outline'

// Estados
const loading = ref(false)
const leadsLivres = ref([])
const colaboradores = ref([])
const colunas = ref([])
const showAtribuicaoModal = ref(false)
const leadSelecionado = ref(null)
const colaboradorSelecionado = ref('')
const colunaSelecionada = ref('')

// Mock data
const carregarLeadsLivres = async () => {
  try {
    loading.value = true
    // TODO: Substituir por chamada real à API
    await new Promise(resolve => setTimeout(resolve, 500))
    leadsLivres.value = [
      { id: 1, nome: 'João Silva', telefone: '(11) 98765-4321', email: 'joao@email.com', faixa_renda: 'R$ 5.000 - R$ 10.000', objetivo: 'Moradia', data_cadastro: new Date() },
      { id: 2, nome: 'Maria Santos', telefone: '(11) 97654-3210', email: 'maria@email.com', faixa_renda: 'R$ 10.000 - R$ 15.000', objetivo: 'Investimento', data_cadastro: new Date() },
      { id: 3, nome: 'Pedro Oliveira', telefone: '(11) 96543-2109', email: 'pedro@email.com', faixa_renda: 'R$ 3.000 - R$ 5.000', objetivo: 'Moradia', data_cadastro: new Date() },
    ]
  } catch (error) {
    console.error('Erro ao carregar leads livres:', error)
  } finally {
    loading.value = false
  }
}

const carregarColaboradores = async () => {
  try {
    // TODO: Substituir por chamada real à API
    colaboradores.value = [
      { id: 1, nome: 'Carlos Mendes' },
      { id: 2, nome: 'Ana Costa' },
      { id: 3, nome: 'Roberto Alves' },
    ]
  } catch (error) {
    console.error('Erro ao carregar colaboradores:', error)
  }
}

const carregarColunas = async () => {
  try {
    // TODO: Substituir por chamada real à API
    colunas.value = [
      { id: 1, nome: 'Novo', posicao: 1 },
      { id: 2, nome: 'Contato', posicao: 2 },
      { id: 3, nome: 'Qualificado', posicao: 3 },
      { id: 4, nome: 'Proposta', posicao: 4 },
      { id: 5, nome: 'Fechado', posicao: 5 },
    ]
  } catch (error) {
    console.error('Erro ao carregar colunas:', error)
  }
}

const selecionarLead = (lead) => {
  leadSelecionado.value = lead
  showAtribuicaoModal.value = true
}

const atribuirLead = (lead) => {
  leadSelecionado.value = lead
  showAtribuicaoModal.value = true
}

const closeAtribuicaoModal = () => {
  showAtribuicaoModal.value = false
  leadSelecionado.value = null
  colaboradorSelecionado.value = ''
  colunaSelecionada.value = ''
}

const confirmarAtribuicao = async () => {
  try {
    loading.value = true
    
    // TODO: Substituir por chamada real à API
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Remover o lead da lista de leads livres
    leadsLivres.value = leadsLivres.value.filter(
      lead => lead.id !== leadSelecionado.value.id
    )
    
    closeAtribuicaoModal()
    alert('Lead atribuído com sucesso!')
  } catch (error) {
    console.error('Erro ao atribuir lead:', error)
    alert('Erro ao atribuir lead')
  } finally {
    loading.value = false
  }
}

const getObjectiveColor = (objetivo) => {
  return objetivo === 'Moradia' ? 'bg-blue-500' : 'bg-green-500'
}

const formatarData = (data) => {
  if (!data) return ''
  return new Date(data).toLocaleDateString('pt-BR')
}

// Inicialização
onMounted(async () => {
  await Promise.all([
    carregarLeadsLivres(),
    carregarColaboradores(),
    carregarColunas()
  ])
})
</script>
