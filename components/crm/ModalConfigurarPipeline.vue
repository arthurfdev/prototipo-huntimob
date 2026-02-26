<template>
  <CrmModal
    :visible="visible"
    title="Configurar Pipeline"
    width="700px"
    @update:visible="emit('update:visible', $event)"
    @close="onClose"
  >
    <div class="space-y-6">
      <!-- Lista de Colunas -->
      <div>
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-bold text-gray-900 dark:text-white">
            Colunas do Pipeline
          </h3>
          <button
            @click="adicionarColuna"
            class="inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-sm font-semibold text-blue-500 dark:text-blue-400 hover:bg-blue-500/10 transition duration-200"
          >
            <PlusIcon class="h-4 w-4" />
            Nova Coluna
          </button>
        </div>

        <!-- Colunas Arrastáveis -->
        <draggable
          v-model="localColunas"
          :group="{ name: 'colunas-config' }"
          item-key="id"
          :animation="200"
          handle=".drag-handle"
          @change="onReorder"
          class="space-y-2"
        >
          <template #item="{ element, index }">
            <div
              class="flex items-center gap-3 p-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-brand-navy-dark"
            >
              <!-- Handle -->
              <div class="drag-handle cursor-grab active:cursor-grabbing p-1 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300">
                <Bars3Icon class="h-5 w-5" />
              </div>

              <!-- Cor -->
              <div
                class="w-4 h-4 rounded-full flex-shrink-0"
                :style="{ backgroundColor: element.cor }"
              />

              <!-- Nome -->
              <div class="flex-1 min-w-0">
                <h4 class="font-semibold text-gray-900 dark:text-white truncate">
                  {{ element.nome }}
                </h4>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  {{ formatDistribuicao(element.regra_distribuicao) }} • {{ element._count?.cards || 0 }} cards
                </p>
              </div>

              <!-- Ações -->
              <div class="flex items-center gap-1">
                <button
                  @click="editarColuna(element)"
                  class="p-1.5 rounded-lg text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  title="Editar"
                >
                  <PencilIcon class="h-4 w-4" />
                </button>
                <button
                  v-if="(element._count?.cards || 0) === 0"
                  @click="excluirColuna(element)"
                  class="p-1.5 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  title="Excluir"
                >
                  <TrashIcon class="h-4 w-4" />
                </button>
                <span
                  v-else
                  class="p-1.5 text-gray-300 dark:text-gray-600 cursor-not-allowed"
                  title="Mova os cards para excluir"
                >
                  <TrashIcon class="h-4 w-4" />
                </span>
              </div>
            </div>
          </template>
        </draggable>

        <!-- Estado Vazio -->
        <div
          v-if="localColunas.length === 0"
          class="flex flex-col items-center justify-center py-8 text-center border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl"
        >
          <ViewColumnsIcon class="h-12 w-12 text-gray-300 dark:text-gray-600 mb-3" />
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-3">
            Nenhuma coluna configurada
          </p>
          <button
            @click="adicionarColuna"
            class="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white bg-blue-500 hover:bg-blue-600 transition duration-200"
          >
            <PlusIcon class="h-4 w-4" />
            Criar Primeira Coluna
          </button>
        </div>
      </div>

      <!-- Dica -->
      <div class="p-3 rounded-xl border border-blue-500/30 bg-blue-50 dark:bg-blue-900/20">
        <p class="text-sm text-gray-600 dark:text-gray-400">
          <strong class="text-gray-900 dark:text-white">Dica:</strong> Arraste as colunas para reordená-las. A ordem define a sequência do pipeline.
        </p>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-end">
        <button
          @click="onClose"
          class="inline-flex items-center justify-center rounded-xl px-3 py-1.5 text-xs font-semibold text-white bg-blue-500 hover:bg-blue-600 transition duration-200"
        >
          Fechar
        </button>
      </div>
    </template>

    <!-- Modal Editar Coluna -->
    <ModalEditarColuna
      v-model:visible="showEditarColuna"
      :coluna="colunaEditando"
      @submit="onColunaSubmit"
    />

    <!-- Modal Confirmar Exclusão -->
    <CrmModal
      :visible="showConfirmDelete"
      title="Confirmar Exclusão"
      width="400px"
      @update:visible="showConfirmDelete = $event"
    >
      <p class="text-gray-900 dark:text-white">
        Tem certeza que deseja excluir a coluna <strong class="text-gray-900 dark:text-white">"{{ colunaParaExcluir?.nome }}"</strong>?
      </p>

      <template #footer>
        <div class="flex justify-end gap-2">
          <button
            @click="showConfirmDelete = false"
            class="inline-flex items-center justify-center rounded-xl px-3 py-1.5 text-xs font-semibold border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition duration-200"
          >
            Cancelar
          </button>
          <button
            @click="confirmarExclusao"
            class="inline-flex items-center justify-center rounded-xl px-3 py-1.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 transition duration-200"
          >
            Excluir
          </button>
        </div>
      </template>
    </CrmModal>
  </CrmModal>
</template>

<script setup>
import { ref, watch } from 'vue'
import draggable from 'vuedraggable'
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ViewColumnsIcon,
  Bars3Icon
} from '@heroicons/vue/24/outline'
import CrmModal from './CrmModal.vue'
import ModalEditarColuna from './ModalEditarColuna.vue'

const props = defineProps({
  visible: {
    type: Boolean,
    required: true
  },
  colunas: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:visible', 'criar-coluna', 'editar-coluna', 'excluir-coluna', 'reordenar-colunas'])

const localColunas = ref([])
const showEditarColuna = ref(false)
const colunaEditando = ref(null)
const showConfirmDelete = ref(false)
const colunaParaExcluir = ref(null)

watch(() => props.visible, (visible) => {
  if (visible) {
    localColunas.value = [...props.colunas].sort((a, b) => (a.ordem || 0) - (b.ordem || 0))
  }
}, { immediate: true })

watch(() => props.colunas, (newColunas) => {
  localColunas.value = [...newColunas].sort((a, b) => (a.ordem || 0) - (b.ordem || 0))
}, { deep: true })

const formatDistribuicao = (regra) => {
  const descricoes = {
    manual: 'Manual',
    roleta: 'Roleta',
    menor_carga: 'Menor Carga',
    round_robin: 'Round Robin'
  }
  return descricoes[regra] || 'Manual'
}

const adicionarColuna = () => {
  colunaEditando.value = null
  showEditarColuna.value = true
}

const editarColuna = (coluna) => {
  colunaEditando.value = coluna
  showEditarColuna.value = true
}

const onColunaSubmit = (data) => {
  if (colunaEditando.value) {
    emit('editar-coluna', colunaEditando.value.id, data)
  } else {
    emit('criar-coluna', {
      ...data,
      ordem: localColunas.value.length + 1
    })
  }
  showEditarColuna.value = false
  colunaEditando.value = null
}

const excluirColuna = (coluna) => {
  colunaParaExcluir.value = coluna
  showConfirmDelete.value = true
}

const confirmarExclusao = () => {
  if (colunaParaExcluir.value) {
    emit('excluir-coluna', colunaParaExcluir.value)
  }
  showConfirmDelete.value = false
  colunaParaExcluir.value = null
}

const onReorder = () => {
  const novaOrdem = localColunas.value.map((coluna, index) => ({
    id: coluna.id,
    ordem: index + 1
  }))
  emit('reordenar-colunas', novaOrdem)
}

const onClose = () => {
  emit('update:visible', false)
}
</script>
