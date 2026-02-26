<template>
  <div class="w-full max-w-full overflow-x-hidden">
    <div class="flex items-center justify-between mb-6 flex-wrap gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Metas</h1>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Defina e acompanhe metas de vendas</p>
      </div>
      <button
        @click="openModalNovaMeta"
        class="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg transition-all duration-200 flex items-center gap-2 text-sm font-semibold shadow-sm hover:shadow-md"
      >
        <PlusIcon class="w-4 h-4" />
        Nova Meta
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 border-t-transparent"></div>
    </div>

    <!-- Lista de Metas -->
    <div v-else-if="metas.length === 0" class="bg-white dark:bg-brand-navy rounded-xl shadow-sm p-12 border border-gray-100 dark:border-gray-800">
      <div class="text-center">
        <ChartBarIcon class="h-16 w-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Nenhuma meta encontrada</h3>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Crie uma nova meta para começar a acompanhar o desempenho da equipe.
        </p>
      </div>
    </div>

    <div v-else class="space-y-4">
      <div
        v-for="meta in metas"
        :key="meta.id"
        class="bg-white dark:bg-brand-navy rounded-xl shadow-sm p-5 border border-gray-100 dark:border-gray-800 hover:shadow-md transition-all duration-200"
      >
        <div class="flex items-start justify-between gap-4">
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-3 mb-3">
              <div
                :class="[
                  'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0',
                  meta.tipo === 'corretor' 
                    ? 'bg-gradient-to-br from-blue-500 to-indigo-600'
                    : meta.tipo === 'gerente'
                    ? 'bg-gradient-to-br from-purple-500 to-violet-600'
                    : 'bg-gradient-to-br from-green-500 to-emerald-600'
                ]"
              >
                <ChartBarIcon class="w-5 h-5 text-white" />
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 flex-wrap">
                  <h3 class="text-base font-semibold text-gray-900 dark:text-white">{{ meta.nome }}</h3>
                  <span
                    :class="[
                      'px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide rounded-md',
                      meta.tipo === 'corretor' 
                        ? 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-200/50 dark:border-blue-800/30'
                        : meta.tipo === 'gerente'
                        ? 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border border-purple-200/50 dark:border-purple-800/30'
                        : 'bg-green-500/10 text-green-700 dark:text-green-400 border border-green-200/50 dark:border-green-800/30'
                    ]"
                  >
                    {{ meta.tipo === 'corretor' ? 'Corretor' : meta.tipo === 'gerente' ? 'Gerente' : 'Personalizada' }}
                  </span>
                </div>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ meta.descricao }}</p>
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
              <div>
                <p class="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Meta</p>
                <p class="text-sm font-semibold text-gray-900 dark:text-white">{{ meta.valor_meta }}</p>
              </div>
              <div>
                <p class="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Colaboradores</p>
                <p class="text-sm font-medium text-gray-900 dark:text-white">{{ meta.total_colaboradores }} cadastrado{{ meta.total_colaboradores !== 1 ? 's' : '' }}</p>
              </div>
              <div>
                <p class="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Atingiram</p>
                <p class="text-sm font-medium text-green-600 dark:text-green-400">{{ meta.colaboradores_atingiram }} colaborador{{ meta.colaboradores_atingiram !== 1 ? 'es' : '' }}</p>
              </div>
              <div>
                <p class="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Próximos</p>
                <p class="text-sm font-medium text-amber-600 dark:text-amber-400">{{ meta.colaboradores_proximos }} próximo{{ meta.colaboradores_proximos !== 1 ? 's' : '' }}</p>
              </div>
            </div>
          </div>

          <div class="flex items-center gap-2 flex-shrink-0">
            <button
              @click="verProximos(meta)"
              class="px-3 py-2 text-xs font-medium text-amber-600 dark:text-amber-400 bg-amber-50/80 dark:bg-amber-900/20 hover:bg-amber-100 dark:hover:bg-amber-900/30 rounded-lg transition-colors border border-amber-200/50 dark:border-amber-800/30"
            >
              Ver Próximos
            </button>
            <button
              @click="editarMeta(meta)"
              class="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
              title="Editar"
            >
              <PencilIcon class="w-4 h-4" />
            </button>
            <button
              @click="deletarMeta(meta)"
              class="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              title="Excluir"
            >
              <TrashIcon class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Nova Meta -->
    <div
      v-if="showModalNovaMeta"
      class="fixed inset-0 bg-gray-600/50 dark:bg-gray-900/75 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4"
      @click="showModalNovaMeta = false"
    >
      <div
        class="relative bg-white dark:bg-brand-navy rounded-xl shadow-xl border border-gray-200 dark:border-gray-800 w-full max-w-2xl"
        @click.stop
      >
        <div class="p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ metaEditando ? 'Editar Meta' : 'Nova Meta' }}
            </h3>
            <button
              @click="fecharModalNovaMeta"
              class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <XMarkIcon class="w-5 h-5" />
            </button>
          </div>

          <div class="space-y-4">
            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">Nome da Meta</label>
              <input
                v-model="formMeta.nome"
                type="text"
                placeholder="Ex: Meta de Vendas Mensal"
                class="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-brand-navy-dark text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">Tipo</label>
              <select
                v-model="formMeta.tipo"
                class="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-brand-navy-dark text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="corretor">Corretor</option>
                <option value="gerente">Gerente</option>
                <option value="personalizada">Personalizada</option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">Descrição</label>
              <textarea
                v-model="formMeta.descricao"
                rows="3"
                placeholder="Descreva a meta..."
                class="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-brand-navy-dark text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              ></textarea>
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">Valor da Meta</label>
              <input
                v-model="formMeta.valor_meta"
                type="text"
                placeholder="Ex: 3 vendas ou R$ 1.500.000"
                class="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-brand-navy-dark text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div class="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
              <button
                @click="fecharModalNovaMeta"
                class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Cancelar
              </button>
              <button
                @click="salvarMeta"
                :disabled="!formMeta.nome || !formMeta.valor_meta"
                class="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg transition-all duration-200 flex items-center gap-2 text-sm font-semibold shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CheckIcon class="w-4 h-4" />
                {{ metaEditando ? 'Atualizar' : 'Criar' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Ver Próximos -->
    <div
      v-if="showModalProximos"
      class="fixed inset-0 bg-gray-600/50 dark:bg-gray-900/75 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4"
      @click="showModalProximos = false"
    >
      <div
        class="relative bg-white dark:bg-brand-navy rounded-xl shadow-xl border border-gray-200 dark:border-gray-800 w-full max-w-3xl"
        @click.stop
      >
        <div class="p-6">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                Próximos de Bater a Meta
              </h3>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ metaSelecionada?.nome }}</p>
            </div>
            <button
              @click="showModalProximos = false"
              class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <XMarkIcon class="w-5 h-5" />
            </button>
          </div>

          <div v-if="colaboradoresProximos.length === 0" class="text-center py-8">
            <p class="text-sm text-gray-500 dark:text-gray-400">Nenhum colaborador próximo desta meta no momento</p>
          </div>

          <div v-else class="space-y-3">
            <div
              v-for="colaborador in colaboradoresProximos"
              :key="colaborador.id"
              class="bg-gray-50/50 dark:bg-gray-900/30 rounded-lg p-4 border border-gray-200/50 dark:border-gray-800/50"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3 flex-1 min-w-0">
                  <div class="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <UserIcon class="w-5 h-5 text-white" />
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-semibold text-gray-900 dark:text-white truncate">{{ colaborador.nome }}</p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">{{ colaborador.cargo }}</p>
                  </div>
                </div>
                <div class="flex items-center gap-4 ml-4">
                  <div class="text-right">
                    <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Progresso</p>
                    <p class="text-sm font-semibold text-amber-600 dark:text-amber-400">{{ colaborador.progresso }}%</p>
                  </div>
                  <div class="w-24">
                    <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        class="bg-gradient-to-r from-amber-500 to-orange-600 h-2 rounded-full transition-all duration-300"
                        :style="{ width: `${colaborador.progresso}%` }"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="mt-3 pt-3 border-t border-gray-200/50 dark:border-gray-800/50">
                <p class="text-xs text-gray-600 dark:text-gray-400">{{ colaborador.descricao }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  ChartBarIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
  CheckIcon,
  UserIcon
} from '@heroicons/vue/24/outline'

const loading = ref(false)
const metas = ref([])
const showModalNovaMeta = ref(false)
const showModalProximos = ref(false)
const metaEditando = ref(null)
const metaSelecionada = ref(null)
const colaboradoresProximos = ref([])

const formMeta = ref({
  nome: '',
  tipo: 'personalizada',
  descricao: '',
  valor_meta: ''
})

// Mock data - substituir por chamada à API
const loadMetas = async () => {
  loading.value = true
  try {
    // TODO: Substituir por chamada real à API
    await new Promise(resolve => setTimeout(resolve, 500))
    
    metas.value = [
      {
        id: '1',
        nome: 'Meta Corretor - 3 Vendas',
        tipo: 'corretor',
        descricao: 'Corretores que vendem 3 ou mais imóveis no mês recebem bônus de 10% nas comissões',
        valor_meta: '3 vendas',
        total_colaboradores: 15,
        colaboradores_atingiram: 2,
        colaboradores_proximos: 3
      },
      {
        id: '2',
        nome: 'Meta Gerente - R$ 1.5M VGV',
        tipo: 'gerente',
        descricao: 'Gerentes que batem R$ 1.500.000 de VGV no mês recebem bônus de 10% nas comissões',
        valor_meta: 'R$ 1.500.000 VGV',
        total_colaboradores: 3,
        colaboradores_atingiram: 1,
        colaboradores_proximos: 1
      },
      {
        id: '3',
        nome: 'Meta de Vendas Trimestral',
        tipo: 'personalizada',
        descricao: 'Meta personalizada para vendas no trimestre',
        valor_meta: '10 vendas',
        total_colaboradores: 12,
        colaboradores_atingiram: 4,
        colaboradores_proximos: 2
      }
    ]
  } catch (error) {
    console.error('Erro ao carregar metas:', error)
    ElMessage.error('Erro ao carregar metas')
  } finally {
    loading.value = false
  }
}

const openModalNovaMeta = () => {
  metaEditando.value = null
  formMeta.value = {
    nome: '',
    tipo: 'personalizada',
    descricao: '',
    valor_meta: ''
  }
  showModalNovaMeta.value = true
}

const editarMeta = (meta) => {
  metaEditando.value = meta
  formMeta.value = {
    nome: meta.nome,
    tipo: meta.tipo,
    descricao: meta.descricao,
    valor_meta: meta.valor_meta
  }
  showModalNovaMeta.value = true
}

const fecharModalNovaMeta = () => {
  showModalNovaMeta.value = false
  metaEditando.value = null
  formMeta.value = {
    nome: '',
    tipo: 'personalizada',
    descricao: '',
    valor_meta: ''
  }
}

const salvarMeta = async () => {
  try {
    // TODO: Substituir por chamada real à API
    await new Promise(resolve => setTimeout(resolve, 500))
    
    if (metaEditando.value) {
      // Atualizar
      const index = metas.value.findIndex(m => m.id === metaEditando.value.id)
      if (index !== -1) {
        metas.value[index] = {
          ...metas.value[index],
          ...formMeta.value
        }
      }
      ElMessage.success('Meta atualizada com sucesso!')
    } else {
      // Criar
      const novaMeta = {
        id: String(Date.now()),
        ...formMeta.value,
        total_colaboradores: 0,
        colaboradores_atingiram: 0,
        colaboradores_proximos: 0
      }
      metas.value.push(novaMeta)
      ElMessage.success('Meta criada com sucesso!')
    }
    
    fecharModalNovaMeta()
  } catch (error) {
    console.error('Erro ao salvar meta:', error)
    ElMessage.error('Erro ao salvar meta')
  }
}

const deletarMeta = async (meta) => {
  try {
    await ElMessageBox.confirm(
      `Tem certeza que deseja excluir a meta "${meta.nome}"?`,
      'Confirmar Exclusão',
      {
        confirmButtonText: 'Excluir',
        cancelButtonText: 'Cancelar',
        type: 'warning'
      }
    )
    
    // TODO: Substituir por chamada real à API
    await new Promise(resolve => setTimeout(resolve, 300))
    
    metas.value = metas.value.filter(m => m.id !== meta.id)
    ElMessage.success('Meta excluída com sucesso!')
  } catch (err) {
    if (err !== 'cancel') {
      console.error('Erro ao deletar meta:', err)
      ElMessage.error('Erro ao deletar meta')
    }
  }
}

const verProximos = async (meta) => {
  metaSelecionada.value = meta
  
  // TODO: Substituir por chamada real à API
  await new Promise(resolve => setTimeout(resolve, 300))
  
  // Mock data baseado na meta
  if (meta.tipo === 'corretor') {
    colaboradoresProximos.value = [
      {
        id: 'p1',
        nome: 'Pedro Costa',
        cargo: 'Corretor',
        progresso: 67,
        descricao: '2 de 3 vendas (falta 1 venda)'
      },
      {
        id: 'p2',
        nome: 'Ana Paula',
        cargo: 'Corretor',
        progresso: 80,
        descricao: '2.4 de 3 vendas (falta 0.6 vendas)'
      },
      {
        id: 'p3',
        nome: 'Roberto Silva',
        cargo: 'Corretor',
        progresso: 33,
        descricao: '1 de 3 vendas (faltam 2 vendas)'
      }
    ]
  } else if (meta.tipo === 'gerente') {
    colaboradoresProximos.value = [
      {
        id: 'g1',
        nome: 'Roberto Lima',
        cargo: 'Gerente',
        progresso: 85,
        descricao: 'R$ 1.275.000 de R$ 1.500.000 VGV (falta R$ 225.000)'
      }
    ]
  } else {
    colaboradoresProximos.value = [
      {
        id: 'c1',
        nome: 'Carlos Mendes',
        cargo: 'Corretor',
        progresso: 70,
        descricao: '7 de 10 vendas (faltam 3 vendas)'
      },
      {
        id: 'c2',
        nome: 'Fernanda Alves',
        cargo: 'Corretor',
        progresso: 60,
        descricao: '6 de 10 vendas (faltam 4 vendas)'
      }
    ]
  }
  
  showModalProximos.value = true
}

onMounted(() => {
  loadMetas()
})
</script>
