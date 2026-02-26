<template>
  <div class="w-full max-w-full overflow-x-hidden">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Distribuição de Leads</h1>
      <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Configure como os leads são distribuídos entre os colaboradores</p>
    </div>

    <!-- Configuração de Distribuição -->
    <div class="bg-white dark:bg-brand-navy rounded-xl shadow-sm p-6 mb-6 border border-gray-100 dark:border-gray-800">
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Método de Distribuição</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          v-for="metodo in metodosDistribuicao"
          :key="metodo.id"
          @click="metodoSelecionado = metodo.id"
          :class="[
            'p-4 rounded-lg border-2 transition-all duration-200 text-left',
            metodoSelecionado === metodo.id
              ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/20 shadow-md'
              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
          ]"
        >
          <div class="flex items-start gap-3">
            <div
              :class="[
                'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0',
                metodoSelecionado === metodo.id
                  ? 'bg-blue-500'
                  : 'bg-gray-100 dark:bg-gray-800'
              ]"
            >
              <component
                :is="metodo.icon"
                :class="[
                  'w-5 h-5',
                  metodoSelecionado === metodo.id ? 'text-white' : 'text-gray-600 dark:text-gray-400'
                ]"
              />
            </div>
            <div class="flex-1 min-w-0">
              <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-1">{{ metodo.nome }}</h3>
              <p class="text-xs text-gray-500 dark:text-gray-400">{{ metodo.descricao }}</p>
            </div>
            <div
              v-if="metodoSelecionado === metodo.id"
              class="flex-shrink-0"
            >
              <CheckCircleIcon class="w-5 h-5 text-blue-500" />
            </div>
          </div>
        </button>
      </div>

      <div class="mt-6 flex justify-end">
        <button
          @click="salvarConfiguracao"
          :disabled="salvando"
          class="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg transition-all duration-200 flex items-center gap-2 text-sm font-semibold shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <CheckIcon v-if="!salvando" class="w-4 h-4" />
          <div v-else class="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
          {{ salvando ? 'Salvando...' : 'Salvar Configuração' }}
        </button>
      </div>
    </div>

    <!-- Lista de Colaboradores -->
    <div class="bg-white dark:bg-brand-navy rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-800">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Colaboradores</h2>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {{ colaboradoresFiltrados.length }} colaborador{{ colaboradoresFiltrados.length !== 1 ? 'es' : '' }} encontrado{{ colaboradoresFiltrados.length !== 1 ? 's' : '' }}
          </p>
        </div>
        <div class="flex items-center gap-3">
          <input
            v-model="filtros.nome"
            type="text"
            placeholder="Buscar colaborador..."
            class="px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-brand-navy-dark text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            @input="handleSearch"
          />
          <select
            v-model="filtros.status"
            class="px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-brand-navy-dark text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            @change="handleSearch"
          >
            <option value="">Todos</option>
            <option value="ativo">Ativo</option>
            <option value="inativo">Inativo</option>
          </select>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="carregando" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 border-t-transparent"></div>
      </div>

      <!-- Empty State -->
      <div v-else-if="colaboradoresFiltrados.length === 0" class="text-center py-12">
        <UsersIcon class="h-16 w-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          {{ colaboradores.length === 0 ? 'Nenhum colaborador encontrado' : 'Nenhum resultado encontrado' }}
        </h3>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          {{ colaboradores.length === 0 ? 'Não há colaboradores cadastrados no sistema' : 'Tente ajustar os filtros para encontrar colaboradores' }}
        </p>
      </div>

      <!-- Lista de Colaboradores -->
      <div v-else class="space-y-3">
        <div
          v-for="colaborador in colaboradoresPaginados"
          :key="colaborador.id"
          class="bg-gray-50/50 dark:bg-gray-900/30 rounded-lg p-4 border border-gray-200/50 dark:border-gray-800/50 hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-200"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4 flex-1 min-w-0">
              <div class="flex items-center gap-3">
                <div
                  v-if="colaborador.ordem"
                  class="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0 text-white font-bold text-sm"
                >
                  {{ colaborador.ordem }}
                </div>
                <div
                  v-else
                  class="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0"
                >
                  <span class="text-gray-400 dark:text-gray-500 text-xs">—</span>
                </div>
                <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span class="text-white font-semibold text-lg">
                    {{ colaborador.nome ? colaborador.nome.charAt(0).toUpperCase() : '?' }}
                  </span>
                </div>
              </div>
              <div class="flex-1 min-w-0">
                <h4 class="text-sm font-semibold text-gray-900 dark:text-white truncate">
                  {{ colaborador.nome || 'Nome não informado' }}
                </h4>
                <p class="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {{ colaborador.user?.email || colaborador.email || 'Email não informado' }}
                </p>
                <div class="flex items-center gap-3 mt-1">
                  <div class="flex items-center gap-2">
                    <div
                      class="w-2 h-2 rounded-full"
                      :class="colaborador.status === 'ativo' ? 'bg-green-500' : 'bg-red-500'"
                    ></div>
                    <span
                      class="text-xs font-medium"
                      :class="colaborador.status === 'ativo' ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'"
                    >
                      {{ colaborador.status === 'ativo' ? 'Ativo' : 'Inativo' }}
                    </span>
                  </div>
                  <span v-if="colaborador.metrica" class="text-xs text-gray-500 dark:text-gray-400">
                    {{ colaborador.metricaLabel }}: {{ colaborador.metrica }}
                  </span>
                </div>
              </div>
            </div>

            <div class="flex items-center gap-4 ml-4">
              <div class="text-right">
                <span class="text-xs font-medium text-gray-700 dark:text-gray-300 block mb-1">Receber leads</span>
                <div class="flex items-center gap-2">
                  <button
                    @click="toggleReceberLead(colaborador)"
                    :disabled="salvandoId === colaborador.id"
                    :class="[
                      'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                      colaborador.receber_lead ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600',
                      salvandoId === colaborador.id ? 'opacity-50 cursor-not-allowed' : ''
                    ]"
                  >
                    <span
                      :class="[
                        'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                        colaborador.receber_lead ? 'translate-x-5' : 'translate-x-0'
                      ]"
                    ></span>
                  </button>
                  <div v-if="salvandoId === colaborador.id" class="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Paginação -->
      <div v-if="totalPaginas > 1" class="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
        <div class="flex items-center justify-between">
          <div class="text-sm text-gray-700 dark:text-gray-300">
            Mostrando <span class="font-medium">{{ (paginaAtual - 1) * itensPorPagina + 1 }}</span> até
            <span class="font-medium">{{ Math.min(paginaAtual * itensPorPagina, colaboradoresFiltrados.length) }}</span> de
            <span class="font-medium">{{ colaboradoresFiltrados.length }}</span> colaboradores
          </div>
          <div class="flex items-center gap-2">
            <button
              @click="paginaAtual--"
              :disabled="paginaAtual === 1"
              class="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Anterior
            </button>
            <button
              @click="paginaAtual++"
              :disabled="paginaAtual >= totalPaginas"
              class="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Próxima
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { debounce } from 'lodash'
import {
  UsersIcon,
  MapPinIcon,
  ChartBarIcon,
  ClockIcon,
  SparklesIcon,
  CheckCircleIcon,
  CheckIcon
} from '@heroicons/vue/24/outline'

// Estados
const colaboradores = ref([])
const carregando = ref(false)
const salvando = ref(false)
const salvandoId = ref(null)
const paginaAtual = ref(1)
const itensPorPagina = ref(10)
const metodoSelecionado = ref('geolocalizacao')

// Filtros
const filtros = ref({
  nome: '',
  status: ''
})

// Métodos de distribuição
const metodosDistribuicao = [
  {
    id: 'geolocalizacao',
    nome: 'Geolocalização',
    descricao: 'Prioriza colaboradores que estão na imobiliária',
    icon: MapPinIcon
  },
  {
    id: 'efetividade',
    nome: 'Efetividade',
    descricao: 'Distribui baseado na taxa de conversão',
    icon: ChartBarIcon
  },
  {
    id: 'tempo',
    nome: 'Tempo',
    descricao: 'Distribui por tempo de resposta',
    icon: ClockIcon
  },
  {
    id: 'aleatoria',
    nome: 'Aleatória',
    descricao: 'Distribuição aleatória entre colaboradores',
    icon: SparklesIcon
  }
]

// Função para ordenar colaboradores baseado no método
const ordenarColaboradores = (colaboradores) => {
  const colaboradoresAtivos = colaboradores.filter(c => 
    c.status === 'ativo' && c.receber_lead === true
  )
  
  const colaboradoresInativos = colaboradores.filter(c => 
    !(c.status === 'ativo' && c.receber_lead === true)
  )

  let ordenados = []

  switch (metodoSelecionado.value) {
    case 'geolocalizacao':
      // Prioriza quem está na imobiliária, depois os outros
      ordenados = [...colaboradoresAtivos].sort((a, b) => {
        const aNaImobiliaria = a.na_imobiliaria ? 1 : 0
        const bNaImobiliaria = b.na_imobiliaria ? 1 : 0
        return bNaImobiliaria - aNaImobiliaria
      })
      break

    case 'efetividade':
      // Ordena por taxa de conversão (maior primeiro)
      ordenados = [...colaboradoresAtivos].sort((a, b) => {
        const taxaA = a.taxa_conversao || 0
        const taxaB = b.taxa_conversao || 0
        return taxaB - taxaA
      })
      break

    case 'tempo':
      // Ordena por tempo médio de resposta (menor primeiro)
      ordenados = [...colaboradoresAtivos].sort((a, b) => {
        const tempoA = a.tempo_resposta_medio || Infinity
        const tempoB = b.tempo_resposta_medio || Infinity
        return tempoA - tempoB
      })
      break

    case 'aleatoria':
      // Ordena aleatoriamente
      ordenados = [...colaboradoresAtivos].sort(() => Math.random() - 0.5)
      break

    default:
      ordenados = [...colaboradoresAtivos]
  }

  // Adiciona ordem numérica e métricas para exibição
  ordenados = ordenados.map((colab, index) => {
    let metrica = null
    let metricaLabel = ''

    switch (metodoSelecionado.value) {
      case 'geolocalizacao':
        metrica = colab.na_imobiliaria ? 'Na imobiliária' : 'Fora'
        metricaLabel = 'Localização'
        break
      case 'efetividade':
        metrica = `${(colab.taxa_conversao || 0).toFixed(1)}%`
        metricaLabel = 'Taxa conversão'
        break
      case 'tempo':
        metrica = colab.tempo_resposta_medio 
          ? `${colab.tempo_resposta_medio}min` 
          : 'N/A'
        metricaLabel = 'Tempo médio'
        break
      case 'aleatoria':
        metrica = null
        metricaLabel = ''
        break
    }

    return {
      ...colab,
      ordem: index + 1,
      metrica,
      metricaLabel
    }
  })

  // Adiciona colaboradores inativos no final (sem ordem)
  colaboradoresInativos.forEach(colab => {
    ordenados.push({
      ...colab,
      ordem: null,
      metrica: null,
      metricaLabel: ''
    })
  })

  return ordenados
}

// Computed para filtros e ordenação
const colaboradoresFiltrados = computed(() => {
  let filtrados = colaboradores.value.filter(colaborador => {
    // Filtro por nome
    if (filtros.value.nome) {
      const nome = colaborador.nome?.toLowerCase() || ''
      if (!nome.includes(filtros.value.nome.toLowerCase())) {
        return false
      }
    }

    // Filtro por status
    if (filtros.value.status) {
      if (colaborador.status !== filtros.value.status) {
        return false
      }
    }

    return true
  })

  // Ordena baseado no método selecionado
  return ordenarColaboradores(filtrados)
})

// Computed para paginação
const totalPaginas = computed(() => {
  return Math.ceil(colaboradoresFiltrados.value.length / itensPorPagina.value)
})

const colaboradoresPaginados = computed(() => {
  const inicio = (paginaAtual.value - 1) * itensPorPagina.value
  const fim = inicio + itensPorPagina.value
  return colaboradoresFiltrados.value.slice(inicio, fim)
})

// Funções
const carregarColaboradores = async () => {
  try {
    carregando.value = true
    // TODO: Substituir por chamada real à API
    await new Promise(resolve => setTimeout(resolve, 500))
    colaboradores.value = [
      { 
        id: 1, 
        nome: 'Carlos Mendes', 
        email: 'carlos@email.com', 
        status: 'ativo', 
        receber_lead: true,
        na_imobiliaria: true,
        taxa_conversao: 85.5,
        tempo_resposta_medio: 5
      },
      { 
        id: 2, 
        nome: 'Ana Costa', 
        email: 'ana@email.com', 
        status: 'ativo', 
        receber_lead: true,
        na_imobiliaria: false,
        taxa_conversao: 92.3,
        tempo_resposta_medio: 3
      },
      { 
        id: 3, 
        nome: 'Roberto Alves', 
        email: 'roberto@email.com', 
        status: 'ativo', 
        receber_lead: true,
        na_imobiliaria: true,
        taxa_conversao: 78.2,
        tempo_resposta_medio: 8
      },
      { 
        id: 4, 
        nome: 'Mariana Silva', 
        email: 'mariana@email.com', 
        status: 'ativo', 
        receber_lead: true,
        na_imobiliaria: false,
        taxa_conversao: 88.7,
        tempo_resposta_medio: 4
      },
      { 
        id: 5, 
        nome: 'Pedro Santos', 
        email: 'pedro@email.com', 
        status: 'inativo', 
        receber_lead: false,
        na_imobiliaria: false,
        taxa_conversao: 0,
        tempo_resposta_medio: null
      },
      { 
        id: 6, 
        nome: 'Juliana Lima', 
        email: 'juliana@email.com', 
        status: 'ativo', 
        receber_lead: true,
        na_imobiliaria: true,
        taxa_conversao: 90.1,
        tempo_resposta_medio: 6
      },
      { 
        id: 7, 
        nome: 'Fernando Oliveira', 
        email: 'fernando@email.com', 
        status: 'ativo', 
        receber_lead: false,
        na_imobiliaria: false,
        taxa_conversao: 75.0,
        tempo_resposta_medio: 10
      },
    ].map(colaborador => ({
      ...colaborador,
      receber_lead: colaborador.receber_lead ?? false
    }))
  } catch (error) {
    console.error('Erro ao carregar colaboradores:', error)
    ElMessage.error('Erro ao carregar colaboradores')
  } finally {
    carregando.value = false
  }
}

const carregarConfiguracao = async () => {
  try {
    // TODO: Substituir por chamada real à API
    // const response = await api.get('/configuracoes/distribuicao-leads')
    // metodoSelecionado.value = response.data.metodo || 'geolocalizacao'
    metodoSelecionado.value = 'geolocalizacao' // Mock
  } catch (error) {
    console.error('Erro ao carregar configuração:', error)
  }
}

const salvarConfiguracao = async () => {
  try {
    salvando.value = true
    // TODO: Substituir por chamada real à API
    // await api.put('/configuracoes/distribuicao-leads', {
    //   metodo: metodoSelecionado.value
    // })
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Reordena os colaboradores baseado no novo método
    // A ordenação já acontece automaticamente no computed, mas forçamos atualização
    const metodoNome = metodosDistribuicao.find(m => m.id === metodoSelecionado.value)?.nome
    ElMessage.success(`Configuração salva! Distribuição por ${metodoNome}. Colaboradores reordenados.`)
  } catch (error) {
    console.error('Erro ao salvar configuração:', error)
    ElMessage.error('Erro ao salvar configuração')
  } finally {
    salvando.value = false
  }
}

const toggleReceberLead = async (colaborador) => {
  try {
    salvandoId.value = colaborador.id
    
    const novoValor = !colaborador.receber_lead
    // TODO: Substituir por chamada real à API
    // await api.put(`/colaboradores/${colaborador.id}`, {
    //   ...colaborador,
    //   receber_lead: novoValor
    // })
    await new Promise(resolve => setTimeout(resolve, 300))
    
    // Atualizar o estado local
    colaborador.receber_lead = novoValor
    
    // A ordenação será atualizada automaticamente pelo computed
    ElMessage.success(
      novoValor
        ? 'Colaborador configurado para receber leads'
        : 'Colaborador não receberá mais leads'
    )
  } catch (error) {
    console.error('Erro ao atualizar colaborador:', error)
    ElMessage.error('Erro ao atualizar configuração')
  } finally {
    salvandoId.value = null
  }
}

// Função de busca com debounce
const handleSearch = debounce(() => {
  paginaAtual.value = 1 // Reset para primeira página ao filtrar
}, 300)

// Carregar dados iniciais
onMounted(() => {
  carregarColaboradores()
  carregarConfiguracao()
})
</script>
