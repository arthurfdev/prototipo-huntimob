<template>
  <CrmModal
    :visible="visible"
    :title="card?.cliente.nome || 'Detalhes do Card'"
    width="600px"
    @update:visible="emit('update:visible', $event)"
    @close="onClose"
  >
    <div v-if="card" class="space-y-6">
      <!-- Info do Cliente -->
      <div class="flex items-start gap-4 p-4 bg-gray-50 dark:bg-brand-navy-dark rounded-lg">
        <div class="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden bg-blue-500">
          <img
            v-if="card.cliente.foto_url"
            :src="card.cliente.foto_url"
            :alt="card.cliente.nome"
            class="w-full h-full object-cover"
          />
          <span v-else class="text-white font-bold text-xl">
            {{ card.cliente.nome.charAt(0).toUpperCase() }}
          </span>
        </div>
        <div class="flex-1 min-w-0">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ card.cliente.nome }}
          </h3>
          <div class="flex items-center gap-4 mt-1">
            <a
              :href="`tel:${card.cliente.telefone}`"
              class="flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              <PhoneIcon class="h-4 w-4" />
              {{ formatPhone(card.cliente.telefone) }}
            </a>
            <span v-if="card.cliente.email" class="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
              <EnvelopeIcon class="h-4 w-4" />
              {{ card.cliente.email }}
            </span>
          </div>
        </div>
      </div>

      <!-- Coluna e Responsável -->
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
            Coluna
          </label>
          <div class="flex items-center gap-2">
            <div
              class="w-3 h-3 rounded-full"
              :style="{ backgroundColor: card.coluna?.cor || '#6B7280' }"
            />
            <span class="text-sm font-medium text-gray-900 dark:text-white">
              {{ card.coluna?.nome || 'N/A' }}
            </span>
          </div>
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
            Responsável
          </label>
          <div v-if="card.responsavel" class="flex items-center justify-between gap-2">
            <div class="flex items-center gap-2 flex-1">
              <div class="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center overflow-hidden">
                <img
                  v-if="card.responsavel.foto_url"
                  :src="card.responsavel.foto_url"
                  :alt="card.responsavel.nome"
                  class="w-full h-full object-cover"
                />
                <span v-else class="text-white font-bold text-xs">
                  {{ card.responsavel.nome.charAt(0).toUpperCase() }}
                </span>
              </div>
              <span class="text-sm font-medium text-gray-900 dark:text-white">
                {{ card.responsavel.nome }}
              </span>
            </div>
            <button
              @click="editarResponsavel"
              class="px-2 py-1 text-xs text-blue-600 dark:text-blue-400 hover:underline"
            >
              Editar
            </button>
          </div>
          <div v-else class="flex items-center justify-between gap-2">
            <span class="text-sm text-gray-400 dark:text-gray-500 italic">
              Sem responsável
            </span>
            <button
              @click="editarResponsavel"
              class="px-2 py-1 text-xs text-blue-600 dark:text-blue-400 hover:underline"
            >
              Atribuir
            </button>
          </div>
        </div>
      </div>

      <!-- Ações Disponíveis -->
      <div>
        <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
          Ações
        </label>
        <CrmAcoes
          :card="card"
          :acoes-disponiveis="card.coluna?.acoes_disponiveis || []"
          :compact="false"
          @acao="(tipo) => $emit('acao', { card, tipo })"
        />
      </div>

      <!-- Histórico -->
      <div>
        <CrmHistorico
          :historico="historico"
          :is-loading="isLoadingHistorico"
        />
      </div>
    </div>

    <template #footer>
      <div class="flex justify-between">
        <div>
          <button
            @click="showConfirmDelete = true"
            class="px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          >
            Excluir Card
          </button>
        </div>
        <button
          @click="onClose"
          class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-brand-navy-dark border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-brand-navy transition-colors"
        >
          Fechar
        </button>
      </div>
    </template>

    <!-- Modal Confirmar Exclusão -->
    <CrmModal
      :visible="showConfirmDelete"
      title="Confirmar Exclusão"
      width="400px"
      @update:visible="showConfirmDelete = $event"
    >
      <p class="text-gray-700 dark:text-gray-300">
        Tem certeza que deseja excluir o card de <strong class="text-gray-900 dark:text-white">"{{ card?.cliente.nome }}"</strong>?
      </p>
      <p class="mt-2 text-sm text-red-600 dark:text-red-400">
        Esta ação não pode ser desfeita.
      </p>

      <template #footer>
        <div class="flex justify-end gap-3">
          <button
            @click="showConfirmDelete = false"
            class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-brand-navy-dark border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-brand-navy transition-colors"
          >
            Cancelar
          </button>
          <button
            @click="confirmarExclusao"
            class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
          >
            Sim, excluir
          </button>
        </div>
      </template>
    </CrmModal>
  </CrmModal>
</template>

<script setup>
import { ref, watch } from 'vue'
import { PhoneIcon, EnvelopeIcon } from '@heroicons/vue/24/outline'
import CrmModal from './CrmModal.vue'
import CrmAcoes from './CrmAcoes.vue'
import CrmHistorico from './CrmHistorico.vue'

const props = defineProps({
  visible: {
    type: Boolean,
    required: true
  },
  card: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:visible', 'acao', 'excluir', 'atribuir'])

// Histórico
const historico = ref([])
const isLoadingHistorico = ref(false)

// Modal de confirmação
const showConfirmDelete = ref(false)

// Carregar histórico quando modal abre
watch(() => props.visible, async (visible) => {
  if (visible && props.card) {
    // Carregar histórico
    isLoadingHistorico.value = true
    try {
      // TODO: Substituir por chamada real à API
      await new Promise(resolve => setTimeout(resolve, 500))
      historico.value = [
        {
          id: '1',
          coluna_origem: null,
          coluna_destino: { nome: props.card.coluna?.nome || 'N/A' },
          criado_em: new Date().toISOString(),
          colaborador_que_moveu: null
        }
      ]
    } catch (error) {
      console.error('Erro ao carregar histórico:', error)
      historico.value = []
    } finally {
      isLoadingHistorico.value = false
    }
  }
})

const formatPhone = (phone) => {
  if (!phone) return ''
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.length === 11) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`
  }
  return phone
}

const confirmarExclusao = () => {
  if (props.card) {
    emit('excluir', props.card)
  }
  showConfirmDelete.value = false
  onClose()
}

const editarResponsavel = () => {
  if (props.card) {
    emit('atribuir', props.card)
  }
}

const onClose = () => {
  emit('update:visible', false)
}
</script>
