<template>
  <CrmModal
    :visible="visible"
    title="Adicionar Cliente ao Pipeline"
    width="500px"
    @update:visible="emit('update:visible', $event)"
    @close="onClose"
  >
    <div class="space-y-4">
      <!-- Busca de Cliente -->
      <div class="space-y-2">
        <label class="block text-[11px] font-bold tracking-[0.06em] uppercase text-gray-500 dark:text-gray-400">
          Cliente *
        </label>
        <div class="relative">
          <MagnifyingGlassIcon class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
          <input
            v-model="busca"
            type="text"
            class="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-navy-dark text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Buscar por nome ou telefone..."
            @input="debouncedSearch"
          />
        </div>

        <!-- Lista de Resultados -->
        <div
          v-if="isSearching"
          class="mt-2 p-4 flex justify-center"
        >
          <div class="animate-spin rounded-full h-6 w-6 border-2 border-gray-300 dark:border-gray-700 border-t-blue-500"></div>
        </div>

        <div
          v-else-if="resultados.length > 0 && !clienteSelecionado"
          class="mt-2 max-h-48 overflow-y-auto rounded-xl border border-gray-300 dark:border-gray-700 divide-y divide-gray-200 dark:divide-gray-700"
        >
          <button
            v-for="cliente in resultados"
            :key="cliente.id"
            @click="selecionarCliente(cliente)"
            class="w-full flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 text-left transition-colors"
          >
            <div class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-blue-500">
              <span class="text-white font-bold text-xs">
                {{ cliente.name.charAt(0).toUpperCase() }}
              </span>
            </div>
            <div class="min-w-0 flex-1">
              <p class="text-sm font-semibold text-gray-900 dark:text-white truncate">
                {{ cliente.name }}
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                {{ formatPhone(cliente.phone || '') }}
              </p>
            </div>
          </button>
        </div>

        <!-- Cliente Selecionado -->
        <div
          v-if="clienteSelecionado"
          class="mt-2 flex items-center gap-3 p-3 rounded-xl border border-blue-500/30 bg-blue-50 dark:bg-blue-900/20"
        >
          <div class="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-blue-500">
            <span class="text-white font-bold text-sm">
              {{ clienteSelecionado.name.charAt(0).toUpperCase() }}
            </span>
          </div>
          <div class="min-w-0 flex-1">
            <p class="text-sm font-semibold text-gray-900 dark:text-white">
              {{ clienteSelecionado.name }}
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-400">
              {{ formatPhone(clienteSelecionado.phone || '') }}
            </p>
          </div>
          <button
            @click="clienteSelecionado = null; busca = ''"
            class="p-1 rounded-lg text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <XMarkIcon class="h-5 w-5" />
          </button>
        </div>
      </div>

      <!-- Coluna -->
      <div class="space-y-2">
        <label class="block text-[11px] font-bold tracking-[0.06em] uppercase text-gray-500 dark:text-gray-400">
          Coluna *
        </label>
        <select
          v-model="colunaId"
          class="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-navy-dark text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Selecione uma coluna</option>
          <option
            v-for="coluna in colunas"
            :key="coluna.id"
            :value="coluna.id"
          >
            {{ coluna.nome }}
          </option>
        </select>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-end gap-2">
        <button
          @click="onClose"
          class="inline-flex items-center justify-center rounded-xl px-3 py-1.5 text-xs font-semibold border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition duration-200"
        >
          Cancelar
        </button>
        <button
          @click="onSubmit"
          :disabled="!isFormValid || isLoading"
          class="inline-flex items-center justify-center rounded-xl px-3 py-1.5 text-xs font-semibold text-white bg-blue-500 hover:bg-blue-600 transition duration-200 disabled:opacity-45 disabled:cursor-not-allowed"
        >
          <span v-if="isLoading">Adicionando...</span>
          <span v-else>Adicionar ao Pipeline</span>
        </button>
      </div>
    </template>
  </CrmModal>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import {
  MagnifyingGlassIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline'
import CrmModal from './CrmModal.vue'

const props = defineProps({
  visible: {
    type: Boolean,
    required: true
  },
  colunas: {
    type: Array,
    default: () => []
  },
  colunaInicial: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:visible', 'submit'])

const isLoading = ref(false)
const isSearching = ref(false)
const busca = ref('')
const resultados = ref([])
const clienteSelecionado = ref(null)
const colunaId = ref('')

// Reset quando modal abre
watch(() => props.visible, (visible) => {
  if (visible) {
    busca.value = ''
    resultados.value = []
    clienteSelecionado.value = null
    colunaId.value = props.colunaInicial || (props.colunas[0]?.id || '')
  }
})

const isFormValid = computed(() => {
  return clienteSelecionado.value && colunaId.value
})

// Debounce para busca
let debounceTimer = null
const debouncedSearch = () => {
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(async () => {
    if (busca.value.length < 2) {
      resultados.value = []
      return
    }

    isSearching.value = true
    try {
      // TODO: Substituir por chamada real à API
      await new Promise(resolve => setTimeout(resolve, 500))
      resultados.value = [
        { id: '1', name: 'João Silva', phone: '11999999999' },
        { id: '2', name: 'Maria Santos', phone: '11888888888' },
        { id: '3', name: 'Pedro Oliveira', phone: '11777777777' },
      ].filter(c => 
        c.name.toLowerCase().includes(busca.value.toLowerCase()) ||
        c.phone.includes(busca.value.replace(/\D/g, ''))
      )
    } catch (error) {
      console.error('Erro ao buscar clientes:', error)
      resultados.value = []
    } finally {
      isSearching.value = false
    }
  }, 300)
}

const selecionarCliente = (cliente) => {
  clienteSelecionado.value = cliente
  resultados.value = []
  busca.value = cliente.name
}

const formatPhone = (phone) => {
  if (!phone) return ''
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.length === 11) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`
  }
  return phone
}

const onClose = () => {
  emit('update:visible', false)
}

const onSubmit = async () => {
  if (!isFormValid.value || !clienteSelecionado.value) return

  isLoading.value = true
  try {
    emit('submit', {
      cliente_id: clienteSelecionado.value.id,
      coluna_id: colunaId.value
    })
    onClose()
  } finally {
    isLoading.value = false
  }
}
</script>
