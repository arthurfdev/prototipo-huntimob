<template>
  <div class="rounded-lg border border-gray-200/50 dark:border-gray-800/50 bg-gray-50/30 dark:bg-gray-900/30 overflow-hidden">
    <div class="px-4 py-3 border-b border-gray-200/50 dark:border-gray-800/50 bg-white/50 dark:bg-gray-900/50">
      <h3 class="text-xs font-semibold text-gray-900 dark:text-white uppercase tracking-wide">Adicionar conhecimento</h3>
      <p class="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">
        Esses dados alimentam o contexto da IA para conversar com o cliente sobre imóveis.
      </p>
    </div>
    <div class="p-4">
      <div class="flex gap-1 mb-4 border-b border-gray-200/50 dark:border-gray-800/50 overflow-x-auto -mx-4 px-4">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          :class="[
            'px-2.5 py-1.5 text-xs font-medium border-b-2 transition-colors whitespace-nowrap',
            aba === tab.id
              ? 'border-blue-500 text-blue-600 dark:text-blue-400 font-semibold'
              : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          ]"
          @click="aba = tab.id"
        >
          {{ tab.label }}
        </button>
      </div>

      <ConhecimentoIAFormImovel
        v-if="aba === 'imovel'"
        :is-loading="isLoading"
        @add="onAdd"
      />
      <ConhecimentoIAFormLancamento
        v-if="aba === 'lancamento'"
        :is-loading="isLoading"
        @add="onAdd"
      />
      <ConhecimentoIAFormCaptacao
        v-if="aba === 'captacao'"
        :is-loading="isLoading"
        @add="onAdd"
      />
      <ConhecimentoIAFormImobiliaria
        v-if="aba === 'imobiliaria'"
        :is-loading="isLoading"
        @add="onAdd"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useConhecimentosStore } from '@/stores/conhecimentos'
import ConhecimentoIAFormImovel from './ConhecimentoIAFormImovel.vue'
import ConhecimentoIAFormLancamento from './ConhecimentoIAFormLancamento.vue'
import ConhecimentoIAFormCaptacao from './ConhecimentoIAFormCaptacao.vue'
import ConhecimentoIAFormImobiliaria from './ConhecimentoIAFormImobiliaria.vue'

const props = defineProps({
  isLoading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['saved'])

const conhecimentosStore = useConhecimentosStore()
const aba = ref('imovel')

const tabs = [
  { id: 'imovel', label: 'Imóvel' },
  { id: 'lancamento', label: 'Lançamento' },
  { id: 'captacao', label: 'Captação' },
  { id: 'imobiliaria', label: 'Imobiliária' }
]

async function onAdd(payload) {
  try {
    await conhecimentosStore.criarConhecimento(undefined, payload)
    emit('saved')
  } catch (e) {
    console.error('Erro ao adicionar conhecimento:', e)
  }
}
</script>
