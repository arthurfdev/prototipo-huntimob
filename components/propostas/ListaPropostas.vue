<template>
  <div class="glass-card-light dark:glass-card rounded-xl shadow-sm w-full overflow-hidden">
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
        <thead class="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th class="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Cliente</th>
            <th class="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Produto</th>
            <th class="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Corretor</th>
            <th class="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
            <th class="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">VGV</th>
            <th class="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Ações</th>
          </tr>
        </thead>
        <tbody class="bg-white dark:bg-brand-navy divide-y divide-gray-200 dark:divide-gray-800">
          <tr v-for="proposta in propostas" :key="proposta.id" class="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
            <td class="px-4 sm:px-6 py-4">
              <div class="text-sm font-medium text-gray-900 dark:text-white">{{ proposta.cliente_nome }}</div>
            </td>
            <td class="px-4 sm:px-6 py-4">
              <div class="text-sm font-medium text-gray-900 dark:text-white">{{ proposta.produto_nome }}</div>
              <div class="text-sm text-gray-500 dark:text-gray-400">
                {{ proposta.unidade }} - {{ proposta.edificio_torre }}
              </div>
            </td>
            <td class="px-4 sm:px-6 py-4">
              <div class="text-sm font-medium text-gray-900 dark:text-white">{{ proposta.corretor_nome }}</div>
              <div class="text-sm text-gray-500 dark:text-gray-400">{{ proposta.gerente_nome }}</div>
            </td>
            <td class="px-4 sm:px-6 py-4 whitespace-nowrap">
              <span :class="getStatusClass(proposta.status)">
                {{ formatarStatus(proposta.status) }}
              </span>
            </td>
            <td class="px-4 sm:px-6 py-4 whitespace-nowrap">
              {{ formatarMoeda(proposta.vgv) }}
            </td>
            <td class="px-4 sm:px-6 py-4 whitespace-nowrap">
              <div class="flex space-x-2">
                <button
                  @click="$emit('edit', proposta)"
                  class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                  title="Editar"
                >
                  <PencilIcon class="h-5 w-5" />
                </button>
                <button 
                  v-if="proposta.status !== 'aprovada'"
                  @click="$emit('delete', proposta.id)"
                  class="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                  title="Excluir"
                >
                  <TrashIcon class="h-5 w-5" />
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="propostas.length === 0">
            <td colspan="6" class="px-4 sm:px-6 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
              Nenhuma proposta encontrada
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { PencilIcon, TrashIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  propostas: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['edit', 'delete', 'status-updated'])

const formatarStatus = (status) => {
  const statusMap = {
    'aguardando aprovação': 'Aguardando aprovação',
    'aprovada': 'Aprovada',
    'recusada': 'Reprovada',
    'cancelada': 'Cancelada',
    'aguardando pagamento': 'Aguardando pagamento'
  }
  return statusMap[status] || status
}

const getStatusClass = (status) => {
  const classes = {
    'aguardando aprovação': 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400',
    'aprovada': 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400',
    'recusada': 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400',
    'cancelada': 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-400',
    'aguardando pagamento': 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400'
  }
  return `px-2 py-1 text-xs font-medium rounded-full ${classes[status] || ''}`
}

const formatarMoeda = (valor) => {
  if (!valor) return 'R$ 0,00'
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valor)
}
</script>
