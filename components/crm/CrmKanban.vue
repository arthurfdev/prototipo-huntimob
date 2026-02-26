<template>
  <div class="flex flex-col h-full">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">CRM Pipeline</h1>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Gerencie seus leads e clientes
        </p>
      </div>

      <div class="flex items-center gap-3">
        <!-- Botão Configurar Pipeline -->
        <button
          @click="$emit('configurar-pipeline')"
          class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-brand-navy-dark border border-gray-300 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          <Cog6ToothIcon class="h-4 w-4" />
          Configurar Pipeline
        </button>

        <!-- Botão Nova Coluna -->
        <button
          @click="$emit('nova-coluna')"
          class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-xl transition-colors shadow-lg hover:shadow-xl"
        >
          <ViewColumnsIcon class="h-4 w-4" />
          Nova Coluna
        </button>

        <!-- Botão Novo Card -->
        <button
          @click="$emit('novo-card')"
          class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-xl transition-colors shadow-lg hover:shadow-xl"
        >
          <PlusIcon class="h-4 w-4" />
          Novo Card
        </button>
      </div>
    </div>

    <!-- Filtros -->
    <div class="mb-4">
      <CrmFiltros
        :filtros="filtros"
        @update:filtros="onFiltrosChange"
      />
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="flex-1 flex items-center justify-center">
      <div class="flex flex-col items-center gap-3">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 border-t-transparent"></div>
        <span class="text-sm text-gray-500 dark:text-gray-400">Carregando pipeline...</span>
      </div>
    </div>

    <!-- Estado Vazio: Nenhuma Coluna -->
    <div
      v-else-if="colunas.length === 0"
      class="flex-1 flex flex-col items-center justify-center py-16"
    >
      <ViewColumnsIcon class="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
        Nenhuma coluna configurada
      </h3>
      <p class="text-sm text-gray-500 dark:text-gray-400 mb-6 text-center max-w-md">
        Crie a primeira coluna do seu pipeline para começar a gerenciar seus leads e clientes.
      </p>
      <button
        @click="$emit('nova-coluna')"
        class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-xl transition-colors shadow-lg hover:shadow-xl"
      >
        <PlusIcon class="h-4 w-4" />
        Adicionar Coluna
      </button>
    </div>

    <!-- Kanban Board -->
    <div
      v-else
      class="flex-1 overflow-x-auto pb-4"
    >
      <div class="flex gap-4 h-full min-h-[500px]">
        <!-- Colunas ordenáveis -->
        <draggable
          v-model="colunasOrdenadas"
          :group="{ name: 'colunas' }"
          item-key="id"
          :animation="200"
          handle=".coluna-drag-handle"
          ghost-class="ghost-coluna"
          drag-class="dragging-coluna"
          chosen-class="chosen-coluna"
          @change="onColunasReorder"
          class="flex gap-4"
        >
          <template #item="{ element }">
            <CrmColuna
              :coluna="element"
              :cards="getCardsByColuna(element.id)"
              :show-drag-handle="true"
              @editar="(coluna) => $emit('editar-coluna', coluna)"
              @excluir="(coluna) => $emit('excluir-coluna', coluna)"
              @adicionar-card="(coluna) => $emit('adicionar-card', coluna)"
              @card-click="(card) => $emit('card-click', card)"
              @card-acao="(data) => $emit('card-acao', data)"
              @card-atribuir="(card) => $emit('card-atribuir', card)"
              @card-historico="(card) => $emit('card-historico', card)"
              @card-excluir="(card) => $emit('card-excluir', card)"
              @card-mover="onCardMover"
            />
          </template>
        </draggable>

        <!-- Botão Adicionar Coluna -->
        <button
          @click="$emit('nova-coluna')"
          class="flex flex-col items-center justify-center min-w-[280px] h-32 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl text-gray-400 dark:text-gray-500 hover:border-blue-500/50 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
        >
          <PlusIcon class="h-8 w-8 mb-2" />
          <span class="text-sm font-medium">Nova Coluna</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import draggable from 'vuedraggable'
import {
  Cog6ToothIcon,
  PlusIcon,
  ViewColumnsIcon
} from '@heroicons/vue/24/outline'
import CrmColuna from './CrmColuna.vue'
import CrmFiltros from './CrmFiltros.vue'

const props = defineProps({
  colunas: {
    type: Array,
    default: () => []
  },
  cards: {
    type: Array,
    default: () => []
  },
  filtros: {
    type: Object,
    default: () => ({})
  },
  isLoading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['configurar-pipeline', 'novo-card', 'nova-coluna', 'editar-coluna', 'excluir-coluna', 'adicionar-card', 'card-click', 'card-acao', 'card-atribuir', 'card-historico', 'card-excluir', 'card-mover', 'colunas-reordenar', 'update:filtros'])

// Colunas ordenadas localmente (para drag and drop)
const colunasOrdenadas = ref([])

watch(() => props.colunas, (newColunas) => {
  colunasOrdenadas.value = [...newColunas].sort((a, b) => (a.ordem || 0) - (b.ordem || 0))
}, { immediate: true, deep: true })

// Obter cards por coluna
const getCardsByColuna = (colunaId) => {
  return props.cards.filter(card => card.coluna?.id === colunaId || card.coluna_id === colunaId)
}

// Quando filtros mudam
const onFiltrosChange = (novosFiltros) => {
  emit('update:filtros', novosFiltros)
}

// Quando card é movido entre colunas
const onCardMover = (data) => {
  emit('card-mover', {
    cardId: data.card.id,
    colunaDestinoId: data.colunaDestinoId
  })
}

// Quando colunas são reordenadas
const onColunasReorder = () => {
  const novaOrdem = colunasOrdenadas.value.map((coluna, index) => ({
    id: coluna.id,
    ordem: index + 1
  }))
  emit('colunas-reordenar', novaOrdem)
}
</script>

<style scoped>
/* Scrollbar horizontal customizada */
::-webkit-scrollbar {
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #3b82f6;
}

.dark ::-webkit-scrollbar-track {
  background: #1e293b;
}

.dark ::-webkit-scrollbar-thumb {
  background: #475569;
}

.dark ::-webkit-scrollbar-thumb:hover {
  background: #3b82f6;
}

/* Estilos de drag and drop para colunas */
.ghost-coluna {
  opacity: 0.4;
  background: #e2e8f0;
  border: 2px dashed #94a3b8;
  border-radius: 0.75rem;
}

.dragging-coluna {
  transform: rotate(2deg);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
}

.chosen-coluna {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}
</style>
