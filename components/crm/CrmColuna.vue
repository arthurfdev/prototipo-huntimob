<template>
  <div
    class="bg-white dark:bg-brand-navy flex flex-col rounded-xl min-w-[300px] max-w-[300px] h-full shadow-sm border border-gray-200 dark:border-gray-800"
  >
    <!-- Header da Coluna -->
    <div
      class="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700"
    >
      <div class="flex items-center gap-2">
        <!-- Handle para arrastar coluna -->
        <div
          v-if="showDragHandle"
          class="coluna-drag-handle cursor-grab active:cursor-grabbing p-1 -ml-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
          title="Arraste para reordenar"
        >
          <Bars2Icon class="h-4 w-4 text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
        </div>
        <div
          class="w-3 h-3 rounded-full flex-shrink-0"
          :style="{ backgroundColor: coluna.cor }"
        />
        <h3 class="font-semibold text-gray-900 dark:text-white text-sm">
          {{ coluna.nome }}
        </h3>
        <span class="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded-full">
          {{ cards.length }}
        </span>
      </div>

      <!-- Menu da Coluna -->
      <div class="relative">
        <button
          @click.stop="showMenu = !showMenu"
          class="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <EllipsisHorizontalIcon class="h-5 w-5" />
        </button>
        
        <div
          v-if="showMenu"
          class="absolute right-0 mt-1 w-40 bg-white dark:bg-brand-navy rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 py-1 z-50"
          @click.stop
        >
          <button
            @click="$emit('editar', coluna); showMenu = false"
            class="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-2"
          >
            <PencilIcon class="h-4 w-4" />
            Editar
          </button>
          <button
            v-if="cards.length === 0"
            @click="$emit('excluir', coluna); showMenu = false"
            class="w-full px-3 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
          >
            <TrashIcon class="h-4 w-4" />
            Excluir
          </button>
          <span
            v-else
            class="block px-3 py-2 text-xs text-gray-400 dark:text-gray-500"
          >
            Mova os cards para excluir
          </span>
        </div>
      </div>
    </div>

    <!-- Lista de Cards (Droppable) -->
    <div class="flex-1 overflow-y-auto p-2 space-y-2 min-h-[200px]">
      <draggable
        v-model="localCards"
        :group="{ name: 'cards', pull: true, put: true }"
        item-key="id"
        :animation="200"
        ghost-class="ghost-card"
        drag-class="dragging-card"
        chosen-class="chosen-card"
        @start="onDragStart"
        @end="onDragEnd"
        @change="onCardChange"
        class="space-y-2 min-h-[100px]"
      >
        <template #item="{ element }">
          <CrmCard
            :card="element"
            :coluna="coluna"
            :is-dragging="draggingCardId === element.id"
            @click="$emit('card-click', element)"
            @acao="(data) => $emit('card-acao', data)"
            @atribuir="(card) => $emit('card-atribuir', card)"
            @historico="(card) => $emit('card-historico', card)"
            @excluir="(card) => $emit('card-excluir', card)"
          />
        </template>
      </draggable>

      <!-- Estado Vazio -->
      <div
        v-if="cards.length === 0"
        class="flex flex-col items-center justify-center py-8 text-center"
      >
        <InboxIcon class="h-10 w-10 text-gray-300 dark:text-gray-600 mb-2" />
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Nenhum card nesta coluna
        </p>
      </div>
    </div>

    <!-- Footer: Adicionar Card -->
    <div class="p-2 border-t border-gray-200 dark:border-gray-700">
      <button
        @click="$emit('adicionar-card', coluna)"
        class="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-colors"
      >
        <PlusIcon class="h-4 w-4" />
        Adicionar Cliente
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import draggable from 'vuedraggable'
import {
  EllipsisHorizontalIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon,
  InboxIcon,
  Bars2Icon
} from '@heroicons/vue/24/outline'
import CrmCard from './CrmCard.vue'

const props = defineProps({
  coluna: {
    type: Object,
    required: true
  },
  cards: {
    type: Array,
    default: () => []
  },
  showDragHandle: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['editar', 'excluir', 'adicionar-card', 'card-click', 'card-acao', 'card-atribuir', 'card-historico', 'card-excluir', 'card-mover'])

const showMenu = ref(false)
const draggingCardId = ref(null)

// Cards locais para drag and drop
const localCards = ref([...props.cards])

// Sincronizar quando props mudam
watch(() => props.cards, (newCards) => {
  localCards.value = [...newCards]
}, { deep: true })

const onDragStart = (evt) => {
  draggingCardId.value = evt.item.__draggable_context?.element?.id || null
}

const onDragEnd = () => {
  draggingCardId.value = null
}

const onCardChange = (evt) => {
  // Quando um card é adicionado a esta coluna
  if (evt.added) {
    const card = evt.added.element
    const novaOrdem = evt.added.newIndex
    emit('card-mover', {
      card,
      colunaDestinoId: props.coluna.id,
      novaOrdem
    })
  }
}

// Fechar menu ao clicar fora
if (typeof window !== 'undefined') {
  window.addEventListener('click', () => {
    showMenu.value = false
  })
}
</script>

<style scoped>
.ghost-card {
  opacity: 0.5;
  background: #e2e8f0;
  border: 2px dashed #94a3b8;
  border-radius: 0.5rem;
}

.dragging-card {
  transform: rotate(3deg);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

.chosen-card {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
</style>
