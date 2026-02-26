<template>
  <div class="w-full max-w-full overflow-x-hidden">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Permissões</h1>
      <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Gerencie permissões e acessos por função e por colaborador</p>
    </div>

    <!-- Tabs -->
    <div class="border-b border-gray-200 dark:border-gray-800 mb-6">
      <nav class="-mb-px flex space-x-8">
        <button
          @click="modoVisualizacao = 'funcao'"
          :class="[
            modoVisualizacao === 'funcao'
              ? 'border-blue-500 text-blue-600 dark:text-blue-400 dark:border-blue-400'
              : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300',
            'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors'
          ]"
        >
          Por Função
        </button>
        <button
          @click="modoVisualizacao = 'colaborador'"
          :class="[
            modoVisualizacao === 'funcao'
              ? 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
              : 'border-blue-500 text-blue-600 dark:text-blue-400 dark:border-blue-400',
            'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors'
          ]"
        >
          Por Colaborador
        </button>
      </nav>
    </div>

    <!-- Modo Por Função -->
    <div v-if="modoVisualizacao === 'funcao'" class="space-y-6">
      <div class="bg-white dark:bg-brand-navy rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-800">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Permissões por Função</h2>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Configure as permissões padrão para cada função
            </p>
          </div>
          <button
            @click="salvarPermissoesFuncao"
            :disabled="salvando"
            class="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg transition-all duration-200 flex items-center gap-2 text-sm font-semibold shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <CheckIcon v-if="!salvando" class="w-4 h-4" />
            <div v-else class="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
            {{ salvando ? 'Salvando...' : 'Salvar Alterações' }}
          </button>
        </div>

        <div class="space-y-3">
          <div
            v-for="funcao in funcoes"
            :key="funcao.id"
            class="bg-gray-50/50 dark:bg-gray-900/30 rounded-lg border border-gray-200/50 dark:border-gray-800/50 overflow-hidden"
          >
            <button
              @click="funcoesExpandidas[funcao.id] = !funcoesExpandidas[funcao.id]"
              class="w-full flex items-center justify-between p-4 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-colors"
            >
              <div class="flex items-center gap-3">
                <ChevronRightIcon
                  :class="[
                    'w-5 h-5 text-gray-400 transition-transform duration-200',
                    funcoesExpandidas[funcao.id] ? 'rotate-90' : ''
                  ]"
                />
                <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                  <UserGroupIcon class="w-5 h-5 text-white" />
                </div>
                <div class="text-left">
                  <h3 class="text-base font-semibold text-gray-900 dark:text-white">{{ funcao.nome }}</h3>
                  <p class="text-xs text-gray-500 dark:text-gray-400">{{ funcao.descricao }}</p>
                </div>
              </div>
            </button>

            <div
              v-show="funcoesExpandidas[funcao.id]"
              class="px-4 pb-4 space-y-3 border-t border-gray-200/50 dark:border-gray-800/50 pt-4"
            >
              <div
                v-for="recurso in recursos"
                :key="recurso.id"
                class="bg-white dark:bg-brand-navy-dark rounded-lg p-4 border border-gray-200 dark:border-gray-700"
              >
                <div class="flex items-center justify-between mb-3">
                  <div>
                    <h4 class="text-sm font-semibold text-gray-900 dark:text-white">{{ recurso.nome }}</h4>
                    <p class="text-xs text-gray-500 dark:text-gray-400">{{ recurso.descricao }}</p>
                  </div>
                  <button
                    @click="toggleTodasPermissoesFuncao(funcao.id, recurso.id)"
                    class="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                  >
                    {{ todasPermissoesAtivasFuncao(funcao.id, recurso.id) ? 'Desmarcar todas' : 'Marcar todas' }}
                  </button>
                </div>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <label
                    v-for="acao in acoes"
                    :key="acao.id"
                    class="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <input
                      type="checkbox"
                      :checked="getPermissaoFuncao(funcao.id, recurso.id, acao.id)"
                      @change="togglePermissaoFuncao(funcao.id, recurso.id, acao.id)"
                      class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <span class="text-xs font-medium text-gray-700 dark:text-gray-300">{{ acao.nome }}</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modo Por Colaborador -->
    <div v-if="modoVisualizacao === 'colaborador'" class="space-y-6">
      <div class="bg-white dark:bg-brand-navy rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-800">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Permissões por Colaborador</h2>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Configure permissões individuais para cada colaborador
            </p>
          </div>
          <div class="flex items-center gap-3">
            <input
              v-model="filtroColaborador"
              type="text"
              placeholder="Buscar colaborador..."
              class="px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-brand-navy-dark text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              @click="salvarPermissoesColaborador"
              :disabled="salvando"
              class="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg transition-all duration-200 flex items-center gap-2 text-sm font-semibold shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CheckIcon v-if="!salvando" class="w-4 h-4" />
              <div v-else class="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              {{ salvando ? 'Salvando...' : 'Salvar Alterações' }}
            </button>
          </div>
        </div>

        <div v-if="carregando" class="flex justify-center items-center py-12">
          <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 border-t-transparent"></div>
        </div>

        <div v-else-if="colaboradoresFiltrados.length === 0" class="text-center py-12">
          <UserIcon class="h-16 w-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Nenhum colaborador encontrado</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Tente ajustar o filtro de busca
          </p>
        </div>

        <div v-else class="space-y-3">
          <div
            v-for="colaborador in colaboradoresFiltrados"
            :key="colaborador.id"
            class="bg-gray-50/50 dark:bg-gray-900/30 rounded-lg border border-gray-200/50 dark:border-gray-800/50 overflow-hidden"
          >
            <button
              @click="colaboradoresExpandidos[colaborador.id] = !colaboradoresExpandidos[colaborador.id]"
              class="w-full flex items-center justify-between p-4 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-colors"
            >
              <div class="flex items-center gap-3">
                <ChevronRightIcon
                  :class="[
                    'w-5 h-5 text-gray-400 transition-transform duration-200',
                    colaboradoresExpandidos[colaborador.id] ? 'rotate-90' : ''
                  ]"
                />
                <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                  <span class="text-white font-semibold text-lg">
                    {{ colaborador.nome ? colaborador.nome.charAt(0).toUpperCase() : '?' }}
                  </span>
                </div>
                <div class="text-left">
                  <h3 class="text-base font-semibold text-gray-900 dark:text-white">{{ colaborador.nome }}</h3>
                  <p class="text-xs text-gray-500 dark:text-gray-400">{{ colaborador.email }}</p>
                  <div class="flex items-center gap-2 mt-1">
                    <span class="text-xs px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-md">
                      {{ colaborador.funcao }}
                    </span>
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
                </div>
              </div>
            </button>

            <div
              v-show="colaboradoresExpandidos[colaborador.id]"
              class="px-4 pb-4 space-y-3 border-t border-gray-200/50 dark:border-gray-800/50 pt-4"
            >
              <div
                v-for="recurso in recursos"
                :key="recurso.id"
                class="bg-white dark:bg-brand-navy-dark rounded-lg p-4 border border-gray-200 dark:border-gray-700"
              >
                <div class="flex items-center justify-between mb-3">
                  <div>
                    <h4 class="text-sm font-semibold text-gray-900 dark:text-white">{{ recurso.nome }}</h4>
                    <p class="text-xs text-gray-500 dark:text-gray-400">{{ recurso.descricao }}</p>
                  </div>
                  <button
                    @click="toggleTodasPermissoesColaborador(colaborador.id, recurso.id)"
                    class="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                  >
                    {{ todasPermissoesAtivasColaborador(colaborador.id, recurso.id) ? 'Desmarcar todas' : 'Marcar todas' }}
                  </button>
                </div>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <label
                    v-for="acao in acoes"
                    :key="acao.id"
                    class="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <input
                      type="checkbox"
                      :checked="getPermissaoColaborador(colaborador.id, recurso.id, acao.id)"
                      @change="togglePermissaoColaborador(colaborador.id, recurso.id, acao.id)"
                      class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <span class="text-xs font-medium text-gray-700 dark:text-gray-300">{{ acao.nome }}</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { ElMessage } from 'element-plus'
import {
  UserGroupIcon,
  UserIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronRightIcon
} from '@heroicons/vue/24/outline'

const modoVisualizacao = ref('funcao')
const carregando = ref(false)
const salvando = ref(false)
const filtroColaborador = ref('')

// Estados de expansão (apenas funções/colaboradores)
const funcoesExpandidas = ref({})
const colaboradoresExpandidos = ref({})

// Funções disponíveis
const funcoes = ref([
  {
    id: 'gerente',
    nome: 'Gerente',
    descricao: 'Gerente da imobiliária com acesso completo'
  },
  {
    id: 'corretor',
    nome: 'Corretor',
    descricao: 'Corretor de imóveis'
  },
  {
    id: 'coordenador',
    nome: 'Coordenador',
    descricao: 'Coordenador de equipe'
  },
  {
    id: 'assistente',
    nome: 'Assistente',
    descricao: 'Assistente administrativo'
  }
])

// Recursos do sistema
const recursos = ref([
  {
    id: 'imoveis',
    nome: 'Imóveis',
    descricao: 'Gerenciamento de imóveis, lançamentos e captações'
  },
  {
    id: 'clientes',
    nome: 'Clientes',
    descricao: 'Gerenciamento de clientes e leads'
  },
  {
    id: 'crm',
    nome: 'CRM',
    descricao: 'Pipeline e gestão de relacionamento'
  },
  {
    id: 'comercial',
    nome: 'Comercial',
    descricao: 'Vendas, propostas e negociações'
  },
  {
    id: 'financeiro',
    nome: 'Financeiro',
    descricao: 'Comissões, receitas e despesas'
  },
  {
    id: 'fiscal',
    nome: 'Fiscal',
    descricao: 'Notas fiscais e recibos'
  },
  {
    id: 'gestao',
    nome: 'Gestão',
    descricao: 'Colaboradores, metas e relatórios'
  },
  {
    id: 'automacao',
    nome: 'Automação',
    descricao: 'Fluxos, IA e distribuição de leads'
  }
])

// Ações disponíveis
const acoes = ref([
  { id: 'visualizar', nome: 'Visualizar' },
  { id: 'criar', nome: 'Criar' },
  { id: 'editar', nome: 'Editar' },
  { id: 'excluir', nome: 'Excluir' }
])

// Colaboradores
const colaboradores = ref([])

// Permissões por função: { funcaoId: { recursoId: { acaoId: boolean } } }
const permissoesFuncao = ref({})

// Permissões por colaborador: { colaboradorId: { recursoId: { acaoId: boolean } } }
const permissoesColaborador = ref({})

// Computed
const colaboradoresFiltrados = computed(() => {
  if (!filtroColaborador.value) {
    return colaboradores.value
  }
  const filtro = filtroColaborador.value.toLowerCase()
  return colaboradores.value.filter(c =>
    c.nome?.toLowerCase().includes(filtro) ||
    c.email?.toLowerCase().includes(filtro) ||
    c.funcao?.toLowerCase().includes(filtro)
  )
})

// Funções para permissões por função
const getPermissaoFuncao = (funcaoId, recursoId, acaoId) => {
  return permissoesFuncao.value[funcaoId]?.[recursoId]?.[acaoId] || false
}

const togglePermissaoFuncao = (funcaoId, recursoId, acaoId) => {
  if (!permissoesFuncao.value[funcaoId]) {
    permissoesFuncao.value[funcaoId] = {}
  }
  if (!permissoesFuncao.value[funcaoId][recursoId]) {
    permissoesFuncao.value[funcaoId][recursoId] = {}
  }
  permissoesFuncao.value[funcaoId][recursoId][acaoId] = !getPermissaoFuncao(funcaoId, recursoId, acaoId)
}

const todasPermissoesAtivasFuncao = (funcaoId, recursoId) => {
  return acoes.value.every(acao => getPermissaoFuncao(funcaoId, recursoId, acao.id))
}

const toggleTodasPermissoesFuncao = (funcaoId, recursoId) => {
  const todasAtivas = todasPermissoesAtivasFuncao(funcaoId, recursoId)
  acoes.value.forEach(acao => {
    if (!permissoesFuncao.value[funcaoId]) {
      permissoesFuncao.value[funcaoId] = {}
    }
    if (!permissoesFuncao.value[funcaoId][recursoId]) {
      permissoesFuncao.value[funcaoId][recursoId] = {}
    }
    permissoesFuncao.value[funcaoId][recursoId][acao.id] = !todasAtivas
  })
}

// Funções para permissões por colaborador
const getPermissaoColaborador = (colaboradorId, recursoId, acaoId) => {
  return permissoesColaborador.value[colaboradorId]?.[recursoId]?.[acaoId] || false
}

const togglePermissaoColaborador = (colaboradorId, recursoId, acaoId) => {
  if (!permissoesColaborador.value[colaboradorId]) {
    permissoesColaborador.value[colaboradorId] = {}
  }
  if (!permissoesColaborador.value[colaboradorId][recursoId]) {
    permissoesColaborador.value[colaboradorId][recursoId] = {}
  }
  permissoesColaborador.value[colaboradorId][recursoId][acaoId] = !getPermissaoColaborador(colaboradorId, recursoId, acaoId)
}

const todasPermissoesAtivasColaborador = (colaboradorId, recursoId) => {
  return acoes.value.every(acao => getPermissaoColaborador(colaboradorId, recursoId, acao.id))
}

const toggleTodasPermissoesColaborador = (colaboradorId, recursoId) => {
  const todasAtivas = todasPermissoesAtivasColaborador(colaboradorId, recursoId)
  acoes.value.forEach(acao => {
    if (!permissoesColaborador.value[colaboradorId]) {
      permissoesColaborador.value[colaboradorId] = {}
    }
    if (!permissoesColaborador.value[colaboradorId][recursoId]) {
      permissoesColaborador.value[colaboradorId][recursoId] = {}
    }
    permissoesColaborador.value[colaboradorId][recursoId][acao.id] = !todasAtivas
  })
}

// Carregar dados
const carregarColaboradores = async () => {
  try {
    carregando.value = true
    // TODO: Substituir por chamada real à API
    await new Promise(resolve => setTimeout(resolve, 500))
    colaboradores.value = [
      { id: 1, nome: 'Carlos Mendes', email: 'carlos@email.com', funcao: 'Gerente', status: 'ativo' },
      { id: 2, nome: 'Ana Costa', email: 'ana@email.com', funcao: 'Corretor', status: 'ativo' },
      { id: 3, nome: 'Roberto Alves', email: 'roberto@email.com', funcao: 'Corretor', status: 'ativo' },
      { id: 4, nome: 'Mariana Silva', email: 'mariana@email.com', funcao: 'Coordenador', status: 'ativo' },
      { id: 5, nome: 'Pedro Santos', email: 'pedro@email.com', funcao: 'Assistente', status: 'inativo' },
      { id: 6, nome: 'Juliana Lima', email: 'juliana@email.com', funcao: 'Corretor', status: 'ativo' },
    ]
  } catch (error) {
    console.error('Erro ao carregar colaboradores:', error)
    ElMessage.error('Erro ao carregar colaboradores')
  } finally {
    carregando.value = false
  }
}

const carregarPermissoesFuncao = async () => {
  try {
    // TODO: Substituir por chamada real à API
    // const response = await api.get('/permissoes/funcoes')
    // permissoesFuncao.value = response.data
    
    // Mock: Gerente tem todas as permissões
    permissoesFuncao.value = {
      gerente: {
        imoveis: { visualizar: true, criar: true, editar: true, excluir: true },
        clientes: { visualizar: true, criar: true, editar: true, excluir: true },
        crm: { visualizar: true, criar: true, editar: true, excluir: true },
        comercial: { visualizar: true, criar: true, editar: true, excluir: true },
        financeiro: { visualizar: true, criar: true, editar: true, excluir: true },
        fiscal: { visualizar: true, criar: true, editar: true, excluir: true },
        gestao: { visualizar: true, criar: true, editar: true, excluir: true },
        automacao: { visualizar: true, criar: true, editar: true, excluir: true }
      },
      corretor: {
        imoveis: { visualizar: true, criar: false, editar: false, excluir: false },
        clientes: { visualizar: true, criar: true, editar: true, excluir: false },
        crm: { visualizar: true, criar: true, editar: true, excluir: false },
        comercial: { visualizar: true, criar: true, editar: true, excluir: false },
        financeiro: { visualizar: true, criar: false, editar: false, excluir: false },
        fiscal: { visualizar: false, criar: false, editar: false, excluir: false },
        gestao: { visualizar: false, criar: false, editar: false, excluir: false },
        automacao: { visualizar: false, criar: false, editar: false, excluir: false }
      },
      coordenador: {
        imoveis: { visualizar: true, criar: true, editar: true, excluir: false },
        clientes: { visualizar: true, criar: true, editar: true, excluir: false },
        crm: { visualizar: true, criar: true, editar: true, excluir: false },
        comercial: { visualizar: true, criar: true, editar: true, excluir: false },
        financeiro: { visualizar: true, criar: false, editar: false, excluir: false },
        fiscal: { visualizar: true, criar: false, editar: false, excluir: false },
        gestao: { visualizar: true, criar: false, editar: false, excluir: false },
        automacao: { visualizar: true, criar: false, editar: false, excluir: false }
      },
      assistente: {
        imoveis: { visualizar: true, criar: false, editar: false, excluir: false },
        clientes: { visualizar: true, criar: true, editar: false, excluir: false },
        crm: { visualizar: true, criar: false, editar: false, excluir: false },
        comercial: { visualizar: true, criar: false, editar: false, excluir: false },
        financeiro: { visualizar: true, criar: false, editar: false, excluir: false },
        fiscal: { visualizar: true, criar: false, editar: false, excluir: false },
        gestao: { visualizar: false, criar: false, editar: false, excluir: false },
        automacao: { visualizar: false, criar: false, editar: false, excluir: false }
      }
    }
  } catch (error) {
    console.error('Erro ao carregar permissões por função:', error)
  }
}

const carregarPermissoesColaborador = async () => {
  try {
    // TODO: Substituir por chamada real à API
    // const response = await api.get('/permissoes/colaboradores')
    // permissoesColaborador.value = response.data
    
    // Mock: Inicializa permissões vazias (herdam da função)
    colaboradores.value.forEach(colab => {
      if (!permissoesColaborador.value[colab.id]) {
        permissoesColaborador.value[colab.id] = {}
      }
    })
  } catch (error) {
    console.error('Erro ao carregar permissões por colaborador:', error)
  }
}

// Salvar permissões
const salvarPermissoesFuncao = async () => {
  try {
    salvando.value = true
    // TODO: Substituir por chamada real à API
    // await api.put('/permissoes/funcoes', permissoesFuncao.value)
    await new Promise(resolve => setTimeout(resolve, 500))
    ElMessage.success('Permissões por função salvas com sucesso!')
  } catch (error) {
    console.error('Erro ao salvar permissões:', error)
    ElMessage.error('Erro ao salvar permissões')
  } finally {
    salvando.value = false
  }
}

const salvarPermissoesColaborador = async () => {
  try {
    salvando.value = true
    // TODO: Substituir por chamada real à API
    // await api.put('/permissoes/colaboradores', permissoesColaborador.value)
    await new Promise(resolve => setTimeout(resolve, 500))
    ElMessage.success('Permissões por colaborador salvas com sucesso!')
  } catch (error) {
    console.error('Erro ao salvar permissões:', error)
    ElMessage.error('Erro ao salvar permissões')
  } finally {
    salvando.value = false
  }
}

// Watch para recarregar permissões quando mudar de modo
watch(() => modoVisualizacao.value, () => {
  if (modoVisualizacao.value === 'funcao') {
    carregarPermissoesFuncao()
  } else {
    carregarPermissoesColaborador()
  }
})

onMounted(() => {
  carregarColaboradores()
  carregarPermissoesFuncao()
})
</script>
