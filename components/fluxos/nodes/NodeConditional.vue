<template>
  <div class="px-4 py-3 border-2 border-orange-500 bg-orange-50 dark:bg-orange-900/20 text-orange-900 dark:text-orange-100 rounded-lg text-sm font-medium text-center min-w-[120px] relative transform rotate-45" style="width: 100px; height: 100px;">
    <!-- Handles de entrada -->
    <Handle
      type="target"
      position="top"
      class="!bg-green-500 dark:!bg-green-400 !border-2 !border-white dark:!border-gray-800"
      style="width: 10px; height: 10px; top: -5px;"
    />
    
    <!-- Handles de saída -->
    <Handle
      type="source"
      position="right"
      class="!bg-blue-500 dark:!bg-blue-400 !border-2 !border-white dark:!border-gray-800"
      style="width: 10px; height: 10px; right: -5px;"
    />
    <Handle
      type="source"
      position="bottom"
      class="!bg-blue-500 dark:!bg-blue-400 !border-2 !border-white dark:!border-gray-800"
      style="width: 10px; height: 10px; bottom: -5px;"
    />
    
    <div class="transform -rotate-45 font-semibold text-xs">
      {{ label }}
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

const label = computed(() => {
  if (props.data?.variable && props.data?.caseValue) {
    return `${props.data.variable} = ${props.data.caseValue}`
  }
  return props.data?.label || 'Condição'
})
</script>
