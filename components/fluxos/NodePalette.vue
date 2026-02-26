<template>
  <div class="space-y-3">
    <h3 class="text-[11px] font-bold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-[0.06em]">
      Tipos de Nós
    </h3>
    
    <div class="space-y-2">
      <div
        v-for="nodeType in nodeTypes"
        :key="nodeType.type"
        draggable="true"
        @dragstart="onDragStart($event, nodeType)"
        class="flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 cursor-grab active:cursor-grabbing transition-all duration-200 hover:-translate-y-0.5 bg-white dark:bg-brand-navy-dark"
        :class="nodeType.borderColor"
      >
        <component :is="nodeType.icon" class="h-5 w-5 flex-shrink-0" :class="nodeType.iconColor" />
        <span class="text-sm font-medium text-gray-900 dark:text-white">
          {{ nodeType.label }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { 
  SparklesIcon, 
  ChatBubbleLeftRightIcon, 
  DocumentTextIcon, 
  LinkIcon, 
  HandRaisedIcon, 
  TrashIcon, 
  BoltIcon, 
  StopIcon, 
  MinusIcon,
  FunnelIcon
} from '@heroicons/vue/24/outline'

const nodeTypes = [
  {
    type: 'generic_classify',
    label: 'Classificar Intenção',
    icon: SparklesIcon,
    borderColor: 'border-purple-500/70 dark:border-purple-400/70',
    iconColor: 'text-purple-600 dark:text-purple-400'
  },
  {
    type: 'generic_respond',
    label: 'Responder',
    icon: ChatBubbleLeftRightIcon,
    borderColor: 'border-blue-500/70 dark:border-blue-400/70',
    iconColor: 'text-blue-600 dark:text-blue-400'
  },
  {
    type: 'generic_extract',
    label: 'Extrair Dados',
    icon: DocumentTextIcon,
    borderColor: 'border-yellow-500/70 dark:border-yellow-400/70',
    iconColor: 'text-yellow-600 dark:text-yellow-400'
  },
  {
    type: 'generic_fetch',
    label: 'Buscar Lista',
    icon: LinkIcon,
    borderColor: 'border-indigo-500/70 dark:border-indigo-400/70',
    iconColor: 'text-indigo-600 dark:text-indigo-400'
  },
  {
    type: 'generic_choice',
    label: 'Escolher Item',
    icon: HandRaisedIcon,
    borderColor: 'border-pink-500/70 dark:border-pink-400/70',
    iconColor: 'text-pink-600 dark:text-pink-400'
  },
  {
    type: 'generic_clear',
    label: 'Limpar Dados',
    icon: TrashIcon,
    borderColor: 'border-red-500/70 dark:border-red-400/70',
    iconColor: 'text-red-600 dark:text-red-400'
  },
  {
    type: 'generic_api_call',
    label: 'Chamada API',
    icon: BoltIcon,
    borderColor: 'border-cyan-500/70 dark:border-cyan-400/70',
    iconColor: 'text-cyan-600 dark:text-cyan-400'
  },
  {
    type: 'END',
    label: 'FIM',
    icon: StopIcon,
    borderColor: 'border-gray-500/70 dark:border-gray-400/70',
    iconColor: 'text-gray-600 dark:text-gray-400'
  },
  {
    type: 'noop',
    label: 'Sem Operação',
    icon: MinusIcon,
    borderColor: 'border-gray-500/70 dark:border-gray-400/70',
    iconColor: 'text-gray-600 dark:text-gray-400'
  },
  {
    type: 'conditional',
    label: 'Condição',
    icon: FunnelIcon,
    borderColor: 'border-orange-500/70 dark:border-orange-400/70',
    iconColor: 'text-orange-600 dark:text-orange-400'
  }
]

const emit = defineEmits(['dragStart'])

function onDragStart(event, nodeType) {
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'copy'
    event.dataTransfer.setData('application/vueflow', JSON.stringify({
      type: nodeType.type,
      label: nodeType.label
    }))
  }
  emit('dragStart', nodeType)
}
</script>
