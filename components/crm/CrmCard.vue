<template>
  <div
    :class="[
      'glass-card-light dark:glass-card rounded-xl p-3 cursor-pointer transition duration-200 shadow-sm',
      'hover:shadow-md hover:-translate-y-0.5',
      isDragging ? 'opacity-50 rotate-2 scale-105' : ''
    ]"
    :style="{ borderLeftColor: coluna?.cor || '#6B7280', borderLeftWidth: '3px' }"
    @click="$emit('click', card)"
  >
    <!-- Header: Cliente -->
    <div class="flex items-start justify-between gap-2 mb-2">
      <div class="flex items-center gap-2 min-w-0 flex-1">
        <div class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden bg-blue-500">
          <img
            v-if="card.cliente.foto_url"
            :src="card.cliente.foto_url"
            :alt="card.cliente.nome"
            class="w-full h-full object-cover"
          />
          <span v-else class="text-white font-bold text-xs">
            {{ clienteInicial }}
          </span>
        </div>
        <div class="min-w-0 flex-1">
          <h4 class="text-sm font-medium text-gray-900 dark:text-white truncate">
            {{ card.cliente.nome }}
          </h4>
          <p class="text-xs text-gray-500 dark:text-gray-400 truncate">
            {{ formatPhone(card.cliente.telefone) }}
          </p>
        </div>
      </div>

      <!-- Menu de Ações Rápidas -->
      <div class="flex-shrink-0 relative">
        <button
          @click.stop="showMenu = !showMenu"
          class="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <EllipsisVerticalIcon class="h-4 w-4" />
        </button>
        
        <!-- Dropdown Menu -->
        <div
          v-if="showMenu"
          class="absolute right-0 mt-1 w-40 glass-card-light dark:glass-card rounded-xl shadow-lg py-1 z-50"
          @click.stop
        >
          <button
            @click="$emit('atribuir', card); showMenu = false"
            class="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-2"
          >
            <UserPlusIcon class="h-4 w-4" />
            Atribuir
          </button>
          <button
            @click="$emit('historico', card); showMenu = false"
            class="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-2"
          >
            <ClockIcon class="h-4 w-4" />
            Histórico
          </button>
          <button
            @click="$emit('excluir', card); showMenu = false"
            class="w-full px-3 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
          >
            <TrashIcon class="h-4 w-4" />
            Excluir
          </button>
        </div>
      </div>
    </div>

    <!-- Responsável -->
    <div v-if="card.responsavel" class="flex items-center gap-1.5 mb-2">
      <div class="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center overflow-hidden">
        <img
          v-if="card.responsavel.foto_url"
          :src="card.responsavel.foto_url"
          :alt="card.responsavel.nome"
          class="w-full h-full object-cover"
        />
        <span v-else class="text-white font-bold text-[10px]">
          {{ card.responsavel.nome.charAt(0).toUpperCase() }}
        </span>
      </div>
      <span class="text-xs text-gray-500 dark:text-gray-400 truncate">
        {{ card.responsavel.nome }}
      </span>
    </div>
    <div v-else class="flex items-center gap-1.5 mb-2">
      <div class="w-5 h-5 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
        <UserIcon class="h-3 w-3 text-gray-400 dark:text-gray-500" />
      </div>
      <span class="text-xs text-gray-400 dark:text-gray-500 italic">
        Sem responsável
      </span>
    </div>

    <!-- Footer: Ações e Data -->
    <div class="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
      <!-- Ações Disponíveis -->
      <div class="flex items-center gap-1">
        <CrmAcoes
          :card="card"
          :acoes-disponiveis="coluna?.acoes_disponiveis || []"
          :compact="true"
          @acao="(tipo) => $emit('acao', { card, tipo })"
        />
      </div>

      <!-- Data último movimento -->
      <span class="text-[10px] text-gray-400 dark:text-gray-500">
        {{ formatTimeAgo(card.ultimo_movimento_em) }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import {
  EllipsisVerticalIcon,
  UserIcon,
  UserPlusIcon,
  ClockIcon,
  TrashIcon
} from '@heroicons/vue/24/outline'
import CrmAcoes from './CrmAcoes.vue'

const props = defineProps({
  card: {
    type: Object,
    required: true
  },
  coluna: {
    type: Object,
    default: null
  },
  isDragging: {
    type: Boolean,
    default: false
  }
})

defineEmits(['click', 'acao', 'atribuir', 'historico', 'excluir'])

const showMenu = ref(false)

const clienteInicial = computed(() => {
  return props.card.cliente.nome.charAt(0).toUpperCase()
})

const formatPhone = (phone) => {
  if (!phone) return ''
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.length === 11) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`
  }
  return phone
}

const formatTimeAgo = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'agora'
  if (diffMins < 60) return `${diffMins}m`
  if (diffHours < 24) return `${diffHours}h`
  if (diffDays < 7) return `${diffDays}d`
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
}

// Fechar menu ao clicar fora
if (typeof window !== 'undefined') {
  window.addEventListener('click', () => {
    showMenu.value = false
  })
}
</script>
