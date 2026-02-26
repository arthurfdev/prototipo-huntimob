<template>
  <div class="space-y-6">
    <p class="text-sm text-gray-600 dark:text-gray-400">
      Adicione informações sobre a imobiliária para a IA usar nas conversas: história, equipe, nome do assistente, etc.
    </p>
    <div class="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-brand-navy-dark space-y-4">
      <div class="space-y-2">
        <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">História da Imobiliária</label>
        <textarea
          v-model="historia"
          rows="3"
          class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-navy-dark text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          placeholder="Ex.: Imobiliária fundada em 2010, especializada em imóveis residenciais e comerciais..."
        />
      </div>
      <div class="space-y-2">
        <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">Quem somos / sobre a equipe</label>
        <textarea
          v-model="quemSomos"
          rows="2"
          class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-navy-dark text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          placeholder="Ex.: Equipe de corretores experientes, especializados em vendas e locações..."
        />
      </div>
      <div class="space-y-2">
        <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">Nome do assistente (ou como a IA deve se apresentar)</label>
        <input
          v-model="nomeAssistente"
          type="text"
          class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-navy-dark text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Ex.: Assistente virtual da imobiliária"
        />
      </div>
      <div class="space-y-2">
        <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">Outras informações sobre a imobiliária</label>
        <textarea
          v-model="outras"
          rows="2"
          class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-navy-dark text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          placeholder="Ex.: Horário de funcionamento, diferenciais, localização, formas de pagamento..."
        />
      </div>
      <button
        type="button"
        :disabled="!podeAdicionar || isLoading"
        @click="adicionar"
        class="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold transition-all duration-200 hover:from-blue-600 hover:to-blue-700 disabled:opacity-45 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
      >
        Adicionar conhecimento da imobiliária
      </button>
    </div>
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

const historia = ref('')
const quemSomos = ref('')
const nomeAssistente = ref('')
const outras = ref('')
const podeAdicionar = ref(false)

watch([historia, quemSomos, nomeAssistente, outras], () => {
  const temHistoria = historia.value?.trim()
  const temQuemSomos = quemSomos.value?.trim()
  const temAssistente = nomeAssistente.value?.trim()
  const temOutras = outras.value?.trim()
  podeAdicionar.value = !!(temHistoria || temQuemSomos || temAssistente || temOutras)
}, { immediate: true })

function adicionar() {
  const parts = ['[IMOBILIÁRIA] Nome: Imobiliária']
  if (historia.value?.trim()) parts.push(`História: ${historia.value.trim()}`)
  if (quemSomos.value?.trim()) parts.push(`Quem somos: ${quemSomos.value.trim()}`)
  if (nomeAssistente.value?.trim()) parts.push(`Nome do assistente: ${nomeAssistente.value.trim()}`)
  if (outras.value?.trim()) parts.push(`Outras informações: ${outras.value.trim()}`)

  const textoOriginal = parts.join('\n')
  if (parts.length <= 1) return

  emit('add', { texto_original: textoOriginal })
  historia.value = ''
  quemSomos.value = ''
  nomeAssistente.value = ''
  outras.value = ''
}
</script>
