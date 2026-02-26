<template>
  <div class="flex flex-wrap items-center gap-3">
    <!-- Busca por cliente -->
    <div class="relative flex-1 min-w-[200px] max-w-[300px]">
      <MagnifyingGlassIcon class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
      <input
        v-model="localFiltros.busca"
        type="text"
        placeholder="Buscar cliente..."
        class="w-full pl-9 pr-3 py-2 text-sm bg-white dark:bg-brand-navy-dark border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
        @input="debouncedEmit"
      />
    </div>

    <!-- Toggle: Apenas Meus -->
    <button
      @click="toggleApenasMeus"
      :class="[
        'flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors',
        localFiltros.apenas_meus
          ? 'bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/30'
          : 'bg-white dark:bg-brand-navy-dark text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
      ]"
    >
      <UserIcon class="h-4 w-4" />
      Meus Cards
    </button>

    <!-- Limpar Filtros -->
    <button
      v-if="hasActiveFilters"
      @click="limparFiltros"
      class="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
    >
      <XMarkIcon class="h-4 w-4" />
      Limpar
    </button>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { MagnifyingGlassIcon, UserIcon, XMarkIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  filtros: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update:filtros'])

// Estado local dos filtros
const localFiltros = ref({ ...props.filtros })

// Sincronizar quando props mudam
watch(() => props.filtros, (newFiltros) => {
  localFiltros.value = { ...newFiltros }
}, { deep: true })

// Verificar se há filtros ativos
const hasActiveFilters = computed(() => {
  return !!(
    localFiltros.value.busca ||
    localFiltros.value.apenas_meus
  )
})

// Debounce para busca
let debounceTimer = null
const debouncedEmit = () => {
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    emit('update:filtros', { ...localFiltros.value })
  }, 300)
}

const toggleApenasMeus = () => {
  localFiltros.value.apenas_meus = !localFiltros.value.apenas_meus
  emit('update:filtros', { ...localFiltros.value })
}

const limparFiltros = () => {
  localFiltros.value = {}
  emit('update:filtros', {})
}
</script>
