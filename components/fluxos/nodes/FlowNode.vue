<template>
  <div :class="['px-4 py-3 rounded-lg border-2 text-sm font-medium text-center min-w-[150px] relative', nodeClass]">
    <!-- Handles de entrada (target) -->
    <Handle
      type="target"
      position="top"
      class="!bg-green-500 dark:!bg-green-400 !border-2 !border-white dark:!border-gray-800"
      style="width: 10px; height: 10px;"
    />
    <Handle
      type="target"
      position="left"
      class="!bg-green-500 dark:!bg-green-400 !border-2 !border-white dark:!border-gray-800"
      style="width: 10px; height: 10px;"
    />
    
    <!-- Handles de saída (source) -->
    <Handle
      type="source"
      position="bottom"
      class="!bg-blue-500 dark:!bg-blue-400 !border-2 !border-white dark:!border-gray-800"
      style="width: 10px; height: 10px;"
    />
    <Handle
      type="source"
      position="right"
      class="!bg-blue-500 dark:!bg-blue-400 !border-2 !border-white dark:!border-gray-800"
      style="width: 10px; height: 10px;"
    />
    
    <div :class="['font-semibold mb-1', textColor]">{{ label }}</div>
    <div v-if="nodeType" :class="['text-xs opacity-75', textColor]">
      {{ nodeTypeLabel }}
    </div>
    <div v-if="isEntryPoint" class="mt-1 text-xs font-bold text-blue-600 dark:text-blue-300">
      Início
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Handle } from '@vue-flow/core'

const props = defineProps({
  data: {
    type: Object,
    default: () => ({})
  },
  id: {
    type: String,
    required: true
  }
})

const label = computed(() => props.data?.label || props.id)
const nodeType = computed(() => props.data?.type || 'generic_respond')
const isEntryPoint = computed(() => props.data?.isEntryPoint || false)

const nodeTypeLabel = computed(() => {
  const m = {
    generic_classify: 'Classificar Intenção',
    generic_respond: 'Responder',
    generic_extract: 'Extrair Dados',
    generic_fetch: 'Buscar Lista',
    generic_choice: 'Escolher Item',
    generic_clear: 'Limpar Dados',
    generic_api_call: 'Chamada API',
    noop: 'Sem Operação',
    conditional: 'Condição',
    END: 'FIM'
  }
  return m[nodeType.value] || nodeType.value
})

const nodeClass = computed(() => {
  const classes = {
    generic_classify: 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-900 dark:text-purple-100',
    generic_respond: 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-900 dark:text-blue-100',
    generic_extract: 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-900 dark:text-yellow-100',
    generic_fetch: 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-900 dark:text-indigo-100',
    generic_choice: 'border-pink-500 bg-pink-50 dark:bg-pink-900/20 text-pink-900 dark:text-pink-100',
    generic_clear: 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-900 dark:text-red-100',
    generic_api_call: 'border-cyan-500 bg-cyan-50 dark:bg-cyan-900/20 text-cyan-900 dark:text-cyan-100',
    conditional: 'border-orange-500 bg-orange-50 dark:bg-orange-900/20 text-orange-900 dark:text-orange-100',
    END: 'border-gray-500 bg-gray-50 dark:bg-gray-900/20 text-gray-900 dark:text-gray-100',
    noop: 'border-gray-400 bg-gray-50 dark:bg-gray-900/20 text-gray-700 dark:text-gray-300'
  }
  return classes[nodeType.value] || 'border-gray-300 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
})

const textColor = computed(() => {
  return 'text-gray-900 dark:text-white'
})
</script>
