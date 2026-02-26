<template>
  <div :class="['flex items-center', compact ? 'gap-0.5' : 'gap-2']">
    <!-- WhatsApp -->
    <button
      v-if="acoesDisponiveis.includes('whatsapp')"
      @click.stop="$emit('acao', 'whatsapp')"
      :class="buttonClass"
      :title="compact ? 'WhatsApp' : ''"
      style="color: #25D366"
    >
      <ChatBubbleLeftEllipsisIcon :class="iconClass" />
      <span v-if="!compact">WhatsApp</span>
    </button>

    <!-- Observação -->
    <button
      v-if="acoesDisponiveis.includes('observacao')"
      @click.stop="$emit('acao', 'observacao')"
      :class="buttonClass"
      :title="compact ? 'Observação' : ''"
      style="color: #6B7280"
    >
      <DocumentTextIcon :class="iconClass" />
      <span v-if="!compact">Observação</span>
    </button>

    <!-- Lembrete -->
    <button
      v-if="acoesDisponiveis.includes('lembrete')"
      @click.stop="$emit('acao', 'lembrete')"
      :class="buttonClass"
      :title="compact ? 'Lembrete' : ''"
      style="color: #F59E0B"
    >
      <BellIcon :class="iconClass" />
      <span v-if="!compact">Lembrete</span>
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import {
  ChatBubbleLeftEllipsisIcon,
  DocumentTextIcon,
  BellIcon
} from '@heroicons/vue/24/outline'

const props = defineProps({
  card: {
    type: Object,
    required: true
  },
  acoesDisponiveis: {
    type: Array,
    default: () => []
  },
  compact: {
    type: Boolean,
    default: false
  }
})

defineEmits(['acao'])

const buttonClass = computed(() => {
  if (props.compact) {
    return 'p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors'
  }
  return 'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors'
})

const iconClass = computed(() => {
  return props.compact ? 'h-3.5 w-3.5' : 'h-4 w-4'
})
</script>
