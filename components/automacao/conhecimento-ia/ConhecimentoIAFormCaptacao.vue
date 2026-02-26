<template>
  <div class="space-y-4">
    <div class="space-y-2">
      <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">Nome da Captação</label>
      <input
        v-model="nome"
        type="text"
        class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-navy-dark text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        placeholder="Ex.: Casa com Piscina - Jardim Goiás"
      />
    </div>
    <div class="space-y-2">
      <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">Endereço (opcional)</label>
      <input
        v-model="endereco"
        type="text"
        class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-navy-dark text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        placeholder="Ex.: Rua Exemplo, 123 - Jardim Goiás"
      />
    </div>
    <div class="space-y-2">
      <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">Descrição da Captação para a IA</label>
      <textarea
        v-model="descricao"
        rows="4"
        class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-navy-dark text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
        placeholder="Ex.: Casa de 4 quartos, 3 banheiros, piscina, área de 200m², terreno de 500m²..."
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
const endereco = ref('')
const descricao = ref('')
const podeAdicionar = ref(false)

watch([nome, descricao], () => {
  const temNome = nome.value?.trim()
  const temDescricao = descricao.value?.trim()
  podeAdicionar.value = !!(temNome || temDescricao)
}, { immediate: true })

function adicionar() {
  const nomeFinal = nome.value?.trim()
  const enderecoFinal = endereco.value?.trim()
  const descricaoFinal = descricao.value?.trim()
  if (!nomeFinal && !descricaoFinal) return

  const parts = ['[CAPTAÇÃO]']
  if (nomeFinal) parts.push(`Nome: ${nomeFinal}`)
  if (enderecoFinal) parts.push(`Endereço: ${enderecoFinal}`)
  if (descricaoFinal) parts.push(`Descrição: ${descricaoFinal}`)
  const textoOriginal = parts.join('\n')

  emit('add', { texto_original: textoOriginal })
  nome.value = ''
  endereco.value = ''
  descricao.value = ''
}
</script>
