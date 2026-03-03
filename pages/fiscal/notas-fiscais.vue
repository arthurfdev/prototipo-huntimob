<template>
  <div class="w-full max-w-full overflow-x-hidden">
    <!-- Header -->
    <header class="flex flex-col gap-2 md:flex-row md:items-end md:justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          Notas Fiscais
        </h1>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Gerencie e emita notas fiscais eletrônicas
        </p>
      </div>

      <div class="flex flex-wrap items-center gap-3">
        <!-- Ambiente -->
        <div v-if="ambiente" :class="[
          'inline-flex items-center px-3 py-1.5 rounded-full text-[11px] font-bold',
          isProducao
            ? 'bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20'
            : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
        ]">
          <span class="w-2 h-2 rounded-full mr-2" :class="isProducao ? 'bg-green-500' : 'bg-amber-500'"></span>
          {{ isProducao ? 'Produção' : 'Homologação' }}
        </div>

        <!-- Botão de configuração -->
        <NuxtLink
          to="/fiscal/certificado"
          class="inline-flex items-center gap-2 rounded-xl border border-gray-300 dark:border-gray-700 px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 transition duration-200 hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          <Cog6ToothIcon class="h-5 w-5" />
          Configuração
        </NuxtLink>

        <!-- Botão de emitir -->
        <NuxtLink
          to="/fiscal/notas-fiscais/emitir"
          class="btn-gradient inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold"
        >
          <PlusIcon class="h-5 w-5" />
          Emitir Nota
        </NuxtLink>
      </div>
    </header>

    <!-- Filtros -->
    <div class="glass-card-light dark:glass-card rounded-xl shadow p-4 sm:p-6 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <!-- Tipo -->
        <div class="space-y-2">
          <label class="block text-[11px] font-bold tracking-[0.06em] uppercase text-gray-500 dark:text-gray-400">
            Tipo
          </label>
          <select
            v-model="filtros.tipo"
            @change="loadNotas"
            class="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-navy-dark text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todos</option>
            <option value="NFSe">NFS-e</option>
          </select>
        </div>

        <!-- Status -->
        <div class="space-y-2">
          <label class="block text-[11px] font-bold tracking-[0.06em] uppercase text-gray-500 dark:text-gray-400">
            Status
          </label>
          <select
            v-model="filtros.status"
            @change="loadNotas"
            class="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-navy-dark text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todos</option>
            <option value="autorizada">Autorizada</option>
            <option value="processando">Processando</option>
            <option value="rejeitada">Rejeitada</option>
            <option value="cancelada">Cancelada</option>
          </select>
        </div>

        <!-- Limpar filtros -->
        <div class="flex items-end md:col-span-2">
          <button
            @click="limparFiltros"
            class="px-4 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition duration-200"
          >
            Limpar filtros
          </button>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="glass-card-light dark:glass-card rounded-xl shadow p-12 text-center">
      <div class="animate-spin h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
      <p class="text-sm text-gray-500 dark:text-gray-400">Carregando notas...</p>
    </div>

    <!-- Lista vazia -->
    <div
      v-else-if="notas.length === 0"
      class="glass-card-light dark:glass-card rounded-xl shadow p-12 text-center"
    >
      <DocumentTextIcon class="h-16 w-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
      <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2">
        Nenhuma nota fiscal encontrada
      </h3>
      <p class="text-sm text-gray-500 dark:text-gray-400 mb-6">
        Comece emitindo sua primeira nota fiscal
      </p>
      <NuxtLink
        to="/fiscal/notas-fiscais/emitir"
        class="btn-gradient inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold"
      >
        <PlusIcon class="h-5 w-5" />
        Emitir Primeira Nota
      </NuxtLink>
    </div>

    <!-- Lista de notas -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <NotaCard
        v-for="nota in notas"
        :key="nota.id"
        :nota="nota"
        @click="abrirDetalhes"
      />
    </div>

    <!-- Paginação -->
    <div v-if="total > notas.length" class="flex justify-center mt-6">
      <button
        @click="loadMore"
        :disabled="loadingMore"
        class="px-6 py-2 text-sm font-semibold rounded-xl border border-gray-300 dark:border-gray-700 text-blue-500 dark:text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 transition duration-200 disabled:opacity-45 disabled:cursor-not-allowed"
      >
        <span v-if="loadingMore">Carregando...</span>
        <span v-else>Carregar mais</span>
      </button>
    </div>

    <!-- Modal de detalhes -->
    <ModalDetalhes
      v-model="showModal"
      :nota="notaSelecionada"
      :loading="loadingDetalhes"
      @cancelar="confirmarCancelamento"
      @refresh="refreshNota"
    />

    <!-- Modal de confirmação de cancelamento -->
    <Teleport to="body">
      <div
        v-if="showCancelModal"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div class="fixed inset-0 bg-black/50 dark:bg-black/75" @click="showCancelModal = false"></div>
        <div class="relative glass-card-light dark:glass-card rounded-xl max-w-md w-full p-6 shadow-xl">
          <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">
            Cancelar Nota Fiscal
          </h3>
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Esta ação não pode ser desfeita. A nota será cancelada junto à prefeitura/SEFAZ.
          </p>
          <div class="mb-4 space-y-2">
            <label class="block text-[11px] font-bold tracking-[0.06em] uppercase text-gray-500 dark:text-gray-400">
              Justificativa (mínimo 15 caracteres) *
            </label>
            <textarea
              v-model="justificativaCancelamento"
              rows="3"
              placeholder="Informe o motivo do cancelamento..."
              class="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-navy-dark text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
            ></textarea>
          </div>
          <div class="flex justify-end gap-3">
            <button
              @click="showCancelModal = false"
              class="px-4 py-2 text-sm font-semibold rounded-xl border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition duration-200"
            >
              Cancelar
            </button>
            <button
              @click="executarCancelamento"
              :disabled="justificativaCancelamento.length < 15 || cancelando"
              class="px-4 py-2 text-sm font-semibold text-white rounded-xl bg-red-600 hover:bg-red-700 transition duration-200 disabled:opacity-45 disabled:cursor-not-allowed"
            >
              {{ cancelando ? 'Cancelando...' : 'Confirmar Cancelamento' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { PlusIcon, Cog6ToothIcon, DocumentTextIcon } from '@heroicons/vue/24/outline'
import NotaCard from '@/components/fiscal/NotaCard.vue'
import ModalDetalhes from '@/components/fiscal/ModalDetalhes.vue'

const notas = ref([])
const loading = ref(false)
const loadingMore = ref(false)
const loadingDetalhes = ref(false)
const showModal = ref(false)
const showCancelModal = ref(false)
const notaSelecionada = ref(null)
const cancelando = ref(false)
const justificativaCancelamento = ref('')
const ambiente = ref(null)
const total = ref(0)

const filtros = reactive({
  tipo: '',
  status: '',
  limit: 20
})

const isProducao = computed(() => ambiente.value === 1)

async function loadNotas() {
  try {
    loading.value = true
    // TODO: Substituir por chamada real à API
    await new Promise(resolve => setTimeout(resolve, 500))
    notas.value = [
      { 
        id: 1, 
        tipo: 'NFSe', 
        numero: '12345', 
        data_emissao: new Date(), 
        tomador: { razao_social: 'João Silva', cpf: '12345678901' }, 
        valor_total: 1500.00, 
        status: 'autorizada', 
        ambiente: 1 
      },
      { 
        id: 2, 
        tipo: 'NFSe', 
        numero: '12346', 
        data_emissao: new Date(), 
        tomador: { razao_social: 'Maria Santos', cnpj: '12345678000190' }, 
        valor_total: 2500.00, 
        status: 'processando', 
        ambiente: 1 
      },
    ]
    total.value = notas.value.length
  } catch (error) {
    console.error('Erro ao carregar notas:', error)
  } finally {
    loading.value = false
  }
}

async function loadMore() {
  loadingMore.value = true
  try {
    const newLimit = (filtros.limit || 20) + 20
    filtros.limit = newLimit
    await loadNotas()
  } finally {
    loadingMore.value = false
  }
}

function limparFiltros() {
  filtros.tipo = ''
  filtros.status = ''
  loadNotas()
}

async function abrirDetalhes(nota) {
  notaSelecionada.value = nota
  showModal.value = true
  
  // Atualizar status se estiver processando
  if (nota.status === 'processando') {
    await refreshNota(nota)
  }
}

async function refreshNota(nota) {
  loadingDetalhes.value = true
  try {
    // TODO: Substituir por chamada real à API
    await new Promise(resolve => setTimeout(resolve, 1000))
    // Atualizar nota
    const index = notas.value.findIndex(n => n.id === nota.id)
    if (index !== -1) {
      notas.value[index] = { ...notas.value[index], status: 'autorizada' }
    }
    if (notaSelecionada.value?.id === nota.id) {
      notaSelecionada.value = { ...notaSelecionada.value, status: 'autorizada' }
    }
  } catch (error) {
    console.error('Erro ao atualizar nota:', error)
  } finally {
    loadingDetalhes.value = false
  }
}

function confirmarCancelamento(nota) {
  notaSelecionada.value = nota
  justificativaCancelamento.value = ''
  showCancelModal.value = true
}

async function executarCancelamento() {
  if (!notaSelecionada.value || justificativaCancelamento.value.length < 15) return

  cancelando.value = true
  try {
    // TODO: Substituir por chamada real à API
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    showCancelModal.value = false
    showModal.value = false
    await loadNotas()
    alert('Nota cancelada com sucesso')
  } catch (error) {
    console.error('Erro ao cancelar nota:', error)
    alert('Erro ao cancelar nota')
  } finally {
    cancelando.value = false
  }
}

onMounted(async () => {
  // Carregar ambiente
  // TODO: Substituir por chamada real à API
  ambiente.value = 1
  
  // Carregar notas
  await loadNotas()
})
</script>
