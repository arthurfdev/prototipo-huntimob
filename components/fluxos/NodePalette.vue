<template>
  <div class="space-y-3">
    <h3 class="text-[11px] font-bold text-gray-500 dark:text-gray-400 mb-4 uppercase tracking-[0.06em]">
      TIPOS DE NÓS
    </h3>
    
    <div class="space-y-2">
      <div
        v-for="nodeType in nodeTypes"
        :key="nodeType.type"
        draggable="true"
        @dragstart="onDragStart($event, nodeType)"
        class="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-grab active:cursor-grabbing transition-all duration-200 hover:-translate-y-0.5 bg-slate-800/50 dark:bg-slate-800/50 border border-white/10 hover:bg-slate-800/70 dark:hover:bg-slate-800/70"
      >
        <div class="icon-glass w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0">
          <component :is="nodeType.icon" class="h-4 w-4 flex-shrink-0 relative z-10 stroke-2" :class="nodeType.iconColor" />
        </div>
        <span class="text-sm font-medium text-white">
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
    bgColor: '',
    iconColor: 'text-purple-600 dark:text-purple-400'
  },
  {
    type: 'generic_respond',
    label: 'Responder',
    icon: ChatBubbleLeftRightIcon,
    bgColor: '',
    iconColor: 'text-blue-600 dark:text-blue-400'
  },
  {
    type: 'generic_extract',
    label: 'Extrair Dados',
    icon: DocumentTextIcon,
    bgColor: '',
    iconColor: 'text-yellow-600 dark:text-yellow-400'
  },
  {
    type: 'generic_fetch',
    label: 'Buscar Lista',
    icon: LinkIcon,
    bgColor: '',
    iconColor: 'text-indigo-600 dark:text-indigo-400'
  },
  {
    type: 'generic_choice',
    label: 'Escolher Item',
    icon: HandRaisedIcon,
    bgColor: '',
    iconColor: 'text-pink-600 dark:text-pink-400'
  },
  {
    type: 'generic_clear',
    label: 'Limpar Dados',
    icon: TrashIcon,
    bgColor: '',
    iconColor: 'text-red-600 dark:text-red-400'
  },
  {
    type: 'generic_api_call',
    label: 'Chamada API',
    icon: BoltIcon,
    bgColor: '',
    iconColor: 'text-cyan-600 dark:text-cyan-400'
  },
  {
    type: 'END',
    label: 'FIM',
    icon: StopIcon,
    bgColor: '',
    iconColor: 'text-gray-600 dark:text-gray-400'
  },
  {
    type: 'noop',
    label: 'Sem Operação',
    icon: MinusIcon,
    bgColor: '',
    iconColor: 'text-gray-600 dark:text-gray-400'
  },
  {
    type: 'conditional',
    label: 'Condição',
    icon: FunnelIcon,
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
