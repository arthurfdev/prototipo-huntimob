<template>
  <span
    :class="[
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
      statusClasses
    ]"
  >
    <component
      v-if="showIcon"
      :is="statusIcon"
      class="w-3.5 h-3.5 mr-1"
    />
    {{ statusLabel }}
  </span>
</template>

<script setup>
import { computed } from 'vue'
import {
  ClockIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  XCircleIcon,
  NoSymbolIcon
} from '@heroicons/vue/24/outline'

const props = defineProps({
  status: {
    type: String,
    required: true
  },
  showIcon: {
    type: Boolean,
    default: true
  }
})

const statusConfig = {
  pendente: {
    label: 'Pendente',
    classes: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    icon: ClockIcon
  },
  processando: {
    label: 'Processando',
    classes: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    icon: ArrowPathIcon
  },
  autorizada: {
    label: 'Autorizada',
    classes: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    icon: CheckCircleIcon
  },
  rejeitada: {
    label: 'Rejeitada',
    classes: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    icon: XCircleIcon
  },
  cancelada: {
    label: 'Cancelada',
    classes: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
    icon: NoSymbolIcon
  }
}

const config = computed(() => statusConfig[props.status] || statusConfig.pendente)

const statusLabel = computed(() => config.value.label)
const statusClasses = computed(() => config.value.classes)
const statusIcon = computed(() => config.value.icon)
</script>
