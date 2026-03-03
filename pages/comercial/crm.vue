<template>
  <div class="h-[calc(100vh-8rem)] flex flex-col">
    <!-- Conteúdo do Pipeline -->
    <div class="flex-1 min-h-0">
      <CrmKanban
        :colunas="colunas"
        :cards="cards"
        :filtros="filtros"
        :is-loading="isLoading"
        @configurar-pipeline="showConfigurarPipeline = true"
        @novo-card="openNovoCard()"
        @nova-coluna="openNovaColuna"
        @editar-coluna="openEditarColuna"
        @excluir-coluna="handleExcluirColuna"
        @adicionar-card="openNovoCard"
        @card-click="openCardDetalhes"
        @card-acao="handleCardAcao"
        @card-atribuir="openAtribuirResponsavel"
        @card-historico="openCardDetalhes"
        @card-excluir="handleExcluirCard"
        @card-mover="handleMoverCard"
        @colunas-reordenar="handleReordenarColunas"
        @update:filtros="handleFiltrosChange"
      />

      <!-- Modal Configurar Pipeline -->
      <ModalConfigurarPipeline
        v-model:visible="showConfigurarPipeline"
        :colunas="colunas"
        @criar-coluna="handleCriarColuna"
        @editar-coluna="handleEditarColuna"
        @excluir-coluna="handleExcluirColuna"
        @reordenar-colunas="handleReordenarColunas"
      />

      <!-- Modal Editar Coluna (standalone) -->
      <ModalEditarColuna
        v-model:visible="showEditarColuna"
        :coluna="colunaEditando"
        @submit="onColunaSubmit"
      />

      <!-- Modal Novo Card -->
      <ModalNovoCard
        v-model:visible="showNovoCard"
        :colunas="colunas"
        :coluna-inicial="colunaParaNovoCard"
        @submit="handleCriarCard"
      />

      <!-- Modal Detalhes do Card -->
      <ModalCardDetalhes
        v-model:visible="showCardDetalhes"
        :card="cardSelecionado"
        @acao="handleCardAcao"
        @excluir="handleExcluirCard"
        @atribuir="openAtribuirResponsavel"
      />

      <!-- Modal Ação -->
      <ModalAcao
        v-model:visible="showModalAcao"
        :card="cardParaAcao"
        :tipo="tipoAcao"
        @submit="handleExecutarAcao"
      />

      <!-- Modal Lembrete -->
      <ModalLembrete
        v-model:visible="showModalLembrete"
        :card="cardParaAcao"
        @submit="handleCriarLembrete"
      />

      <!-- Modal Atribuir Responsável -->
      <CrmModal
        :visible="showAtribuirResponsavel"
        title="Atribuir Responsável"
        width="400px"
        @update:visible="showAtribuirResponsavel = $event"
      >
        <div v-if="cardParaAtribuir" class="space-y-4">
          <div class="p-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-brand-navy-dark">
            <p class="text-sm font-semibold text-gray-900 dark:text-white">
              {{ cardParaAtribuir.cliente.nome }}
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-400">
              Coluna: {{ cardParaAtribuir.coluna?.nome || 'N/A' }}
            </p>
          </div>

          <div class="space-y-2">
            <span class="block text-[11px] font-bold tracking-[0.06em] uppercase text-gray-500 dark:text-gray-400">
              Novo Responsável
            </span>
            <select
              v-model="novoResponsavel"
              class="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-navy-dark text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Selecione um colaborador</option>
              <option
                v-for="colab in colaboradores"
                :key="colab.id"
                :value="colab.id"
              >
                {{ colab.nome }}
              </option>
            </select>
          </div>
        </div>

        <template #footer>
          <div class="flex justify-between">
            <button
              v-if="cardParaAtribuir?.responsavel"
              @click="handleRemoverResponsavel"
              class="inline-flex items-center justify-center rounded-xl px-3 py-1.5 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition duration-200"
            >
              Remover Responsável
            </button>
            <div class="flex gap-2 ml-auto">
              <button
                @click="showAtribuirResponsavel = false"
                class="inline-flex items-center justify-center rounded-xl px-3 py-1.5 text-xs font-semibold border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition duration-200"
              >
                Cancelar
              </button>
              <button
                @click="handleAtribuirResponsavel"
                :disabled="!novoResponsavel"
                class="inline-flex items-center justify-center rounded-xl px-3 py-1.5 text-xs font-semibold text-white bg-blue-500 hover:bg-blue-600 transition duration-200 disabled:opacity-45 disabled:cursor-not-allowed"
              >
                Atribuir
              </button>
            </div>
          </div>
        </template>
      </CrmModal>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import CrmKanban from '@/components/crm/CrmKanban.vue'
import ModalConfigurarPipeline from '@/components/crm/ModalConfigurarPipeline.vue'
import ModalEditarColuna from '@/components/crm/ModalEditarColuna.vue'
import ModalNovoCard from '@/components/crm/ModalNovoCard.vue'
import ModalCardDetalhes from '@/components/crm/ModalCardDetalhes.vue'
import ModalAcao from '@/components/crm/ModalAcao.vue'
import ModalLembrete from '@/components/crm/ModalLembrete.vue'
import CrmModal from '@/components/crm/CrmModal.vue'

// Estado
const isLoading = ref(false)
const filtros = reactive({})

// Mock data
const mockColunas = [
  { id: '1', nome: 'Novos Leads', cor: '#3B82F6', ordem: 1, regra_distribuicao: 'manual', manter_associacao_ao_mover: false, acoes_disponiveis: ['whatsapp', 'observacao', 'lembrete'], _count: { cards: 2 } },
  { id: '2', nome: 'Em Negociação', cor: '#60A5FA', ordem: 2, regra_distribuicao: 'roleta', manter_associacao_ao_mover: true, acoes_disponiveis: ['whatsapp', 'observacao'], _count: { cards: 1 } },
  { id: '4', nome: 'Em Visita', cor: '#FB5CF6', ordem: 3, regra_distribuicao: 'manual', manter_associacao_ao_mover: false, acoes_disponiveis: ['whatsapp', 'observacao', 'lembrete'], _count: { cards: 2 } },
  { id: '5', nome: 'Aguardando Aprovação', cor: '#EAB308', ordem: 4, regra_distribuicao: 'manual', manter_associacao_ao_mover: false, acoes_disponiveis: ['whatsapp', 'observacao'], _count: { cards: 3 } },
  { id: '3', nome: 'Finalizado', cor: '#10B981', ordem: 5, regra_distribuicao: 'manual', manter_associacao_ao_mover: false, acoes_disponiveis: ['observacao'], _count: { cards: 2 } },
]

const mockCards = [
  { 
    id: '1', 
    cliente: { id: '1', nome: 'João Silva', telefone: '11999999999', email: 'joao@email.com', foto_url: null }, 
    coluna: mockColunas[0], 
    coluna_id: '1',
    responsavel: { id: '1', nome: 'Maria Santos', foto_url: null },
    ultimo_movimento_em: new Date().toISOString()
  },
  { 
    id: '2', 
    cliente: { id: '2', nome: 'Pedro Oliveira', telefone: '11888888888', email: 'pedro@email.com', foto_url: null }, 
    coluna: mockColunas[0], 
    coluna_id: '1',
    responsavel: null,
    ultimo_movimento_em: new Date(Date.now() - 3600000).toISOString()
  },
  { 
    id: '3', 
    cliente: { id: '3', nome: 'Ana Costa', telefone: '11777777777', email: 'ana@email.com', foto_url: null }, 
    coluna: mockColunas[1], 
    coluna_id: '2',
    responsavel: { id: '2', nome: 'Carlos Souza', foto_url: null },
    ultimo_movimento_em: new Date(Date.now() - 7200000).toISOString()
  },
  { 
    id: '4', 
    cliente: { id: '4', nome: 'Roberto Mendes', telefone: '11666666666', email: 'roberto@email.com', foto_url: null }, 
    coluna: mockColunas[2], 
    coluna_id: '4',
    responsavel: { id: '1', nome: 'Maria Santos', foto_url: null },
    ultimo_movimento_em: new Date(Date.now() - 1800000).toISOString()
  },
  { 
    id: '5', 
    cliente: { id: '5', nome: 'Fernanda Lima', telefone: '11555555555', email: 'fernanda@email.com', foto_url: null }, 
    coluna: mockColunas[2], 
    coluna_id: '4',
    responsavel: { id: '3', nome: 'Ana Paula', foto_url: null },
    ultimo_movimento_em: new Date(Date.now() - 5400000).toISOString()
  },
  { 
    id: '6', 
    cliente: { id: '6', nome: 'Lucas Almeida', telefone: '11444444444', email: 'lucas@email.com', foto_url: null }, 
    coluna: mockColunas[3], 
    coluna_id: '5',
    responsavel: { id: '1', nome: 'Maria Santos', foto_url: null },
    ultimo_movimento_em: new Date(Date.now() - 10800000).toISOString()
  },
  { 
    id: '7', 
    cliente: { id: '7', nome: 'Juliana Rocha', telefone: '11333333333', email: 'juliana@email.com', foto_url: null }, 
    coluna: mockColunas[3], 
    coluna_id: '5',
    responsavel: { id: '2', nome: 'Carlos Souza', foto_url: null },
    ultimo_movimento_em: new Date(Date.now() - 14400000).toISOString()
  },
  { 
    id: '8', 
    cliente: { id: '8', nome: 'Marcos Pereira', telefone: '11222222222', email: 'marcos@email.com', foto_url: null }, 
    coluna: mockColunas[3], 
    coluna_id: '5',
    responsavel: { id: '3', nome: 'Ana Paula', foto_url: null },
    ultimo_movimento_em: new Date(Date.now() - 18000000).toISOString()
  },
  { 
    id: '9', 
    cliente: { id: '9', nome: 'Patricia Souza', telefone: '11111111111', email: 'patricia@email.com', foto_url: null }, 
    coluna: mockColunas[4], 
    coluna_id: '3',
    responsavel: { id: '1', nome: 'Maria Santos', foto_url: null },
    ultimo_movimento_em: new Date(Date.now() - 86400000).toISOString()
  },
  { 
    id: '10', 
    cliente: { id: '10', nome: 'Ricardo Ferreira', telefone: '11000000000', email: 'ricardo@email.com', foto_url: null }, 
    coluna: mockColunas[4], 
    coluna_id: '3',
    responsavel: { id: '2', nome: 'Carlos Souza', foto_url: null },
    ultimo_movimento_em: new Date(Date.now() - 172800000).toISOString()
  },
]

const mockColaboradores = [
  { id: '1', nome: 'Maria Santos' },
  { id: '2', nome: 'Carlos Souza' },
  { id: '3', nome: 'Ana Paula' },
]

const colunas = ref([...mockColunas])
const cards = ref([...mockCards])
const colaboradores = ref([...mockColaboradores])

// Computed para sempre retornar o card atualizado
const cardSelecionado = computed(() => {
  if (!cardSelecionadoRef.value) return null
  return cards.value.find(c => c.id === cardSelecionadoRef.value?.id) || cardSelecionadoRef.value
})

// Modais
const showConfigurarPipeline = ref(false)
const showEditarColuna = ref(false)
const showNovoCard = ref(false)
const showCardDetalhes = ref(false)
const showModalAcao = ref(false)
const showModalLembrete = ref(false)
const showAtribuirResponsavel = ref(false)

// Estado dos modais
const colunaEditando = ref(null)
const colunaParaNovoCard = ref('')
const cardSelecionadoRef = ref(null)
const cardParaAcao = ref(null)
const tipoAcao = ref(null)
const cardParaAtribuir = ref(null)
const novoResponsavel = ref('')

// Carregar dados iniciais
onMounted(async () => {
  await loadData()
})

const loadData = async () => {
  isLoading.value = true
  try {
    // TODO: Substituir por chamada real à API
    await new Promise(resolve => setTimeout(resolve, 500))
  } catch (error) {
    console.error('Erro ao carregar dados do CRM:', error)
    ElMessage.error('Erro ao carregar dados do CRM')
  } finally {
    isLoading.value = false
  }
}

// ========== HANDLERS COLUNAS ==========

const openNovaColuna = () => {
  colunaEditando.value = null
  showEditarColuna.value = true
}

const openEditarColuna = (coluna) => {
  colunaEditando.value = coluna
  showEditarColuna.value = true
}

const onColunaSubmit = async (data) => {
  try {
    if (colunaEditando.value) {
      const index = colunas.value.findIndex(c => c.id === colunaEditando.value.id)
      if (index !== -1) {
        colunas.value[index] = { ...colunas.value[index], ...data }
      }
      ElMessage.success('Coluna atualizada com sucesso')
    } else {
      const newId = String(Math.max(...colunas.value.map(c => parseInt(c.id)), 0) + 1)
      colunas.value.push({
        id: newId,
        ...data,
        ordem: colunas.value.length + 1,
        _count: { cards: 0 }
      })
      ElMessage.success('Coluna criada com sucesso')
    }
    showEditarColuna.value = false
  } catch (error) {
    console.error('Erro ao salvar coluna:', error)
    ElMessage.error('Erro ao salvar coluna')
  }
}

const handleCriarColuna = async (data) => {
  try {
    const newId = String(Math.max(...colunas.value.map(c => parseInt(c.id)), 0) + 1)
    colunas.value.push({
      id: newId,
      ...data,
      ordem: colunas.value.length + 1,
      _count: { cards: 0 }
    })
    ElMessage.success('Coluna criada com sucesso')
  } catch (error) {
    console.error('Erro ao criar coluna:', error)
    ElMessage.error('Erro ao criar coluna')
  }
}

const handleEditarColuna = async (id, data) => {
  try {
    const index = colunas.value.findIndex(c => c.id === id)
    if (index !== -1) {
      colunas.value[index] = { ...colunas.value[index], ...data }
    }
    ElMessage.success('Coluna atualizada')
  } catch (error) {
    console.error('Erro ao atualizar coluna:', error)
    ElMessage.error('Erro ao atualizar coluna')
  }
}

const handleExcluirColuna = async (colunaOuId) => {
  const id = typeof colunaOuId === 'string' ? colunaOuId : colunaOuId.id
  try {
    colunas.value = colunas.value.filter(c => c.id !== id)
    // Remover cards da coluna excluída
    cards.value = cards.value.filter(c => c.coluna_id !== id)
    ElMessage.success('Coluna excluída')
  } catch (error) {
    console.error('Erro ao excluir coluna:', error)
    ElMessage.error('Erro ao excluir coluna')
  }
}

const handleReordenarColunas = async (ordem) => {
  try {
    ordem.forEach(({ id, ordem: novaOrdem }) => {
      const coluna = colunas.value.find(c => c.id === id)
      if (coluna) {
        coluna.ordem = novaOrdem
      }
    })
    colunas.value.sort((a, b) => a.ordem - b.ordem)
  } catch (error) {
    console.error('Erro ao reordenar colunas:', error)
    ElMessage.error('Erro ao reordenar colunas')
  }
}

// ========== HANDLERS CARDS ==========

const openNovoCard = (coluna) => {
  colunaParaNovoCard.value = coluna?.id || ''
  showNovoCard.value = true
}

const openCardDetalhes = (card) => {
  cardSelecionadoRef.value = card
  showCardDetalhes.value = true
}

const handleCriarCard = async (data) => {
  try {
    const newId = String(Math.max(...cards.value.map(c => parseInt(c.id)), 0) + 1)
    const coluna = colunas.value.find(c => c.id === data.coluna_id)
    cards.value.push({
      id: newId,
      cliente: { id: data.cliente_id, nome: 'Cliente', telefone: '', email: '', foto_url: null },
      coluna: coluna,
      coluna_id: data.coluna_id,
      responsavel: null,
      ultimo_movimento_em: new Date().toISOString()
    })
    ElMessage.success('Cliente adicionado ao pipeline')
    showNovoCard.value = false
  } catch (error) {
    console.error('Erro ao criar card:', error)
    ElMessage.error('Erro ao adicionar cliente')
  }
}

const handleMoverCard = async (data) => {
  try {
    const card = cards.value.find(c => c.id === data.cardId)
    if (card) {
      const novaColuna = colunas.value.find(c => c.id === data.colunaDestinoId)
      card.coluna = novaColuna
      card.coluna_id = data.colunaDestinoId
      card.ultimo_movimento_em = new Date().toISOString()
    }
  } catch (error) {
    console.error('Erro ao mover card:', error)
    ElMessage.error('Erro ao mover card')
  }
}

const handleExcluirCard = async (card) => {
  try {
    cards.value = cards.value.filter(c => c.id !== card.id)
    ElMessage.success('Card excluído')
    showCardDetalhes.value = false
  } catch (error) {
    console.error('Erro ao excluir card:', error)
    ElMessage.error('Erro ao excluir card')
  }
}

// ========== HANDLERS AÇÕES ==========

const handleCardAcao = (data) => {
  cardParaAcao.value = data.card
  
  if (data.tipo === 'lembrete') {
    showModalLembrete.value = true
  } else {
    tipoAcao.value = data.tipo
    showModalAcao.value = true
  }
}

const handleExecutarAcao = async (data) => {
  if (!cardParaAcao.value) return

  try {
    ElMessage.success('Ação registrada com sucesso')
    showModalAcao.value = false
  } catch (error) {
    console.error('Erro ao executar ação:', error)
    ElMessage.error('Erro ao executar ação')
  }
}

const handleCriarLembrete = async (data) => {
  if (!cardParaAcao.value) return

  try {
    ElMessage.success('Lembrete agendado')
    showModalLembrete.value = false
  } catch (error) {
    console.error('Erro ao criar lembrete:', error)
    ElMessage.error('Erro ao criar lembrete')
  }
}

// ========== HANDLERS RESPONSÁVEL ==========

const openAtribuirResponsavel = (card) => {
  cardParaAtribuir.value = card
  novoResponsavel.value = card.responsavel?.id || ''
  showAtribuirResponsavel.value = true
}

const handleAtribuirResponsavel = async () => {
  if (!cardParaAtribuir.value || !novoResponsavel.value) return

  try {
    const card = cards.value.find(c => c.id === cardParaAtribuir.value.id)
    if (card) {
      const colaborador = colaboradores.value.find(c => c.id === novoResponsavel.value)
      card.responsavel = colaborador ? { id: colaborador.id, nome: colaborador.nome, foto_url: null } : null
    }
    ElMessage.success('Responsável atribuído')
    showAtribuirResponsavel.value = false
    
    // Atualizar cardSelecionado se o modal de detalhes estiver aberto
    if (cardSelecionadoRef.value && cardSelecionadoRef.value.id === cardParaAtribuir.value.id) {
      cardSelecionadoRef.value = { ...card }
    }
  } catch (error) {
    console.error('Erro ao atribuir responsável:', error)
    ElMessage.error('Erro ao atribuir responsável')
  }
}

const handleRemoverResponsavel = async () => {
  if (!cardParaAtribuir.value) return

  try {
    const card = cards.value.find(c => c.id === cardParaAtribuir.value.id)
    if (card) {
      card.responsavel = null
    }
    ElMessage.success('Responsável removido')
    showAtribuirResponsavel.value = false
    
    // Atualizar cardSelecionado se o modal de detalhes estiver aberto
    if (cardSelecionadoRef.value && cardSelecionadoRef.value.id === cardParaAtribuir.value.id) {
      cardSelecionadoRef.value = { ...card }
    }
  } catch (error) {
    console.error('Erro ao remover responsável:', error)
    ElMessage.error('Erro ao remover responsável')
  }
}

// ========== HANDLERS FILTROS ==========

const handleFiltrosChange = async (novosFiltros) => {
  Object.assign(filtros, novosFiltros)
  
  try {
    // TODO: Aplicar filtros e recarregar cards
    await loadData()
  } catch (error) {
    console.error('Erro ao aplicar filtros:', error)
  }
}
</script>
