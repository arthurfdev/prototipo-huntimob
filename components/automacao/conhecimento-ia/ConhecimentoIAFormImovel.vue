<template>
  <div class="space-y-4">
    <div class="space-y-2">
      <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">Nome do Imóvel</label>
      <input
        v-model="nome"
        type="text"
        class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-navy-dark text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        placeholder="Ex.: Apartamento Centro - 3 quartos"
      />
    </div>
    <div class="space-y-2">
      <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">Valor (opcional)</label>
      <input
        v-model="valor"
        type="text"
        class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-navy-dark text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        placeholder="Ex.: R$ 450.000"
      />
    </div>
    <div class="space-y-2">
      <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">Descrição do Imóvel para a IA</label>
      <textarea
        v-model="descricao"
        rows="4"
        class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-navy-dark text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
        placeholder="Ex.: Apartamento de 3 quartos, 2 banheiros, área de 120m², localizado no centro da cidade, próximo ao shopping..."
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
const valor = ref('')
const descricao = ref('')
const podeAdicionar = ref(false)

watch([nome, descricao], () => {
  const temNome = nome.value?.trim()
  const temDescricao = descricao.value?.trim()
  podeAdicionar.value = !!(temNome || temDescricao)
}, { immediate: true })

function adicionar() {
  const nomeFinal = nome.value?.trim()
  const valorFinal = valor.value?.trim()
  const descricaoFinal = descricao.value?.trim()
  if (!nomeFinal && !descricaoFinal) return

  const parts = ['[IMÓVEL]']
  if (nomeFinal) parts.push(`Nome: ${nomeFinal}`)
  if (valorFinal) parts.push(`Valor: ${valorFinal}`)
  if (descricaoFinal) parts.push(`Descrição: ${descricaoFinal}`)
  const textoOriginal = parts.join('\n')

  emit('add', { texto_original: textoOriginal })
  nome.value = ''
  valor.value = ''
  descricao.value = ''
}
</script>
