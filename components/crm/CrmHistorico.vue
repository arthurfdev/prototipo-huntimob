<template>
  <div class="space-y-4">
    <h3 class="text-lg font-medium text-gray-900 dark:text-white">
      Histórico de Movimentações
    </h3>

    <!-- Loading -->
    <div v-if="isLoading" class="flex justify-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 border-t-transparent"></div>
    </div>

    <!-- Lista de Movimentações -->
    <div v-else-if="historico.length > 0" class="space-y-3">
      <div
        v-for="item in historico"
        :key="item.id"
        class="relative pl-6"
      >
        <!-- Linha vertical -->
        <div class="absolute left-2 top-3 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700"></div>
        
        <!-- Ponto -->
        <div
          :class="[
            'absolute left-0 top-2 w-4 h-4 rounded-full border-2 bg-white dark:bg-brand-navy',
            item.coluna_origem ? 'border-blue-500' : 'border-green-500'
          ]"
        />

        <!-- Conteúdo -->
        <div class="pb-4">
          <div class="flex items-start justify-between gap-2">
            <div class="flex-1">
              <!-- Tipo de Movimento -->
              <p class="text-sm text-gray-900 dark:text-white">
                <template v-if="!item.coluna_origem">
                  <span class="font-medium text-green-600 dark:text-green-400">Card criado</span>
                  na coluna
                  <span class="font-medium">{{ item.coluna_destino?.nome || 'N/A' }}</span>
                </template>
                <template v-else>
                  Movido de
                  <span class="font-medium">{{ item.coluna_origem?.nome || 'N/A' }}</span>
                  para
                  <span class="font-medium">{{ item.coluna_destino?.nome || 'N/A' }}</span>
                </template>
              </p>

              <!-- Mudança de Responsável -->
              <p v-if="houveMudancaResponsavel(item)" class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                <template v-if="!item.responsavel_anterior && item.responsavel_novo">
                  Responsável: <span class="font-medium">{{ item.responsavel_novo?.nome || 'N/A' }}</span>
                </template>
                <template v-else-if="item.responsavel_anterior && !item.responsavel_novo">
                  Removido responsável <span class="font-medium">{{ item.responsavel_anterior?.nome || 'N/A' }}</span>
                </template>
                <template v-else-if="item.responsavel_anterior && item.responsavel_novo">
                  De <span class="font-medium">{{ item.responsavel_anterior?.nome || 'N/A' }}</span>
                  para <span class="font-medium">{{ item.responsavel_novo?.nome || 'N/A' }}</span>
                </template>
              </p>

              <!-- Motivo -->
              <p v-if="item.motivo" class="text-xs text-gray-600 dark:text-gray-400 mt-1 italic">
                "{{ item.motivo }}"
              </p>
            </div>

            <!-- Data e Executor -->
            <div class="text-right flex-shrink-0">
              <p class="text-xs text-gray-500 dark:text-gray-400">
                {{ formatDate(item.criado_em) }}
              </p>
              <p v-if="item.colaborador_que_moveu" class="text-xs text-gray-400 dark:text-gray-500">
                por {{ item.colaborador_que_moveu?.nome || 'N/A' }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Estado Vazio -->
    <div
      v-else
      class="flex flex-col items-center justify-center py-8 text-center"
    >
      <ClockIcon class="h-12 w-12 text-gray-300 dark:text-gray-600 mb-3" />
      <p class="text-sm text-gray-500 dark:text-gray-400">
        Nenhuma movimentação registrada
      </p>
    </div>
  </div>
</template>

<script setup>
import { ClockIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  historico: {
    type: Array,
    default: () => []
  },
  isLoading: {
    type: Boolean,
    default: false
  }
})

const houveMudancaResponsavel = (item) => {
  return !!(item.responsavel_anterior || item.responsavel_novo)
}

const formatDate = (dateString) => {
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
</script>
