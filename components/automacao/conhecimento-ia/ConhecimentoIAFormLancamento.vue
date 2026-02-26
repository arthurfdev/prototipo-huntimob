<template>
  <div class="space-y-4">
    <div class="space-y-2">
      <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">Nome do Lançamento</label>
      <input
        v-model="nome"
        type="text"
        class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-navy-dark text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        placeholder="Ex.: Residencial Jardim das Flores"
      />
    </div>
    <div class="space-y-2">
      <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">Construtora (opcional)</label>
      <input
        v-model="construtora"
        type="text"
        class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-navy-dark text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        placeholder="Ex.: Construtora ABC"
      />
    </div>
    <div class="space-y-2">
      <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">Descrição do Lançamento para a IA</label>
      <textarea
        v-model="descricao"
        rows="4"
        class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-navy-dark text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
        placeholder="Ex.: Novo empreendimento com apartamentos de 2 e 3 quartos, área de lazer completa, localizado na região nobre..."
      />
    </div>
    <button
      type="button"
      :disabled="!podeAdicionar || isLoading"
      @click="adicionar"
      class="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold transition-all duration-200 hover:from-blue-600 hover:to-blue-700 disabled:opacity-45 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
    >
      Adicionar ao conhecimento
    </button>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  isLoading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['add'])

const nome = ref('')
const construtora = ref('')
const descricao = ref('')
const podeAdicionar = ref(false)

watch([nome, descricao], () => {
  const temNome = nome.value?.trim()
  const temDescricao = descricao.value?.trim()
  podeAdicionar.value = !!(temNome || temDescricao)
}, { immediate: true })

function adicionar() {
  const nomeFinal = nome.value?.trim()
  const construtoraFinal = construtora.value?.trim()
  const descricaoFinal = descricao.value?.trim()
  if (!nomeFinal && !descricaoFinal) return

  const parts = ['[LANÇAMENTO]']
  if (nomeFinal) parts.push(`Nome: ${nomeFinal}`)
  if (construtoraFinal) parts.push(`Construtora: ${construtoraFinal}`)
  if (descricaoFinal) parts.push(`Descrição: ${descricaoFinal}`)
  const textoOriginal = parts.join('\n')

  emit('add', { texto_original: textoOriginal })
  nome.value = ''
  construtora.value = ''
  descricao.value = ''
}
</script>
