<template>
  <div
    class="glass-card-light dark:glass-card rounded-xl p-5 border border-white/10 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
    @click="$emit('click', nota)"
  >
    <div class="flex items-start justify-between">
      <!-- Informações principais -->
      <div class="flex-1 min-w-0">
        <div class="flex items-center space-x-3 mb-2">
          <!-- Ícone do tipo -->
          <div class="icon-glass w-10 h-10 rounded-xl flex items-center justify-center">
            <DocumentTextIcon class="h-5 w-5 text-cyan-500 dark:text-cyan-400 relative z-10 stroke-2" />
          </div>

          <div>
            <div class="flex items-center gap-2">
              <span class="font-semibold text-gray-900 dark:text-white">
                {{ nota.tipo }}
              </span>
              <span v-if="nota.numero" class="text-sm text-gray-500 dark:text-gray-400">
                #{{ nota.numero }}
              </span>
            </div>
            <p class="text-xs text-gray-500 dark:text-gray-400">
              {{ formatDate(nota.data_emissao) }}
            </p>
          </div>
        </div>

        <!-- Tomador -->
        <div class="mb-3">
          <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
            {{ nota.tomador?.razao_social || 'Tomador não informado' }}
          </p>
          <p v-if="nota.tomador?.cnpj || nota.tomador?.cpf" class="text-xs text-gray-500 dark:text-gray-400">
            {{ formatDocument(nota.tomador.cnpj || nota.tomador.cpf) }}
          </p>
        </div>

        <!-- Valor e Status -->
        <div class="flex items-center justify-between">
          <span class="text-lg font-bold text-gray-900 dark:text-white">
            R$ {{ formatCurrency(nota.valor_total) }}
          </span>
          <StatusBadge :status="nota.status" />
        </div>
      </div>

      <!-- Ações -->
      <div class="flex flex-col items-end ml-4 space-y-2">
        <!-- Ambiente -->
        <span :class="[
          'inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold',
          nota.ambiente === 1 
            ? 'bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20'
            : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
        ]">
          {{ nota.ambiente === 1 ? 'Produção' : 'Homologação' }}
        </span>
      </div>
    </div>

    <!-- Loading indicator para notas em processamento -->
    <div v-if="nota.status === 'processando'" class="mt-3">
      <div class="flex items-center gap-2">
        <ArrowPathIcon class="h-4 w-4 animate-spin text-blue-500" />
        <span class="text-xs text-blue-500 dark:text-blue-400">
          Aguardando processamento...
        </span>
      </div>
      <div class="mt-2 w-full glass-card-light dark:glass-card rounded-full h-1 border border-white/10">
        <div class="bg-cyan-500 h-1 rounded-full animate-pulse" style="width: 60%"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { DocumentTextIcon, ArrowPathIcon } from '@heroicons/vue/24/outline'
import StatusBadge from './StatusBadge.vue'

const props = defineProps({
  nota: {
    type: Object,
    required: true
  }
})

defineEmits(['click'])

function formatDate(dateString) {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function formatCurrency(value) {
  const num = typeof value === 'string' ? parseFloat(value) : value
  return num.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

function formatDocument(doc) {
  if (!doc) return ''
  const cleaned = doc.replace(/\D/g, '')
  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  } else if (cleaned.length === 14) {
    return cleaned.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
  }
  return doc
}
</script>
