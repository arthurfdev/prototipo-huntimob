<template>
  <ClientOnly>
    <div v-if="configValido" class="flex flex-col flex-1 min-h-[calc(100vh-8rem)]">
      <RelatorioGerador :tipo="tipo" />
    </div>
    <div v-else class="min-h-[calc(100vh-8rem)] flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div class="glass-card-light dark:glass-card rounded-2xl shadow-sm p-8 text-center max-w-md">
        <ExclamationCircleIcon class="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
        <h2 class="text-lg font-bold text-gray-900 dark:text-white">Relatório não encontrado</h2>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">
          O tipo de relatório solicitado não existe ou não está disponível.
        </p>
        <NuxtLink
          to="/gestao/relatorios"
          class="mt-6 inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold bg-gradient-to-r from-blue-500 to-blue-600 text-white transition duration-200 hover:from-blue-600 hover:to-blue-700 shadow-sm hover:shadow-md"
        >
          Voltar aos Relatórios
        </NuxtLink>
      </div>
    </div>
    <template #fallback>
      <div class="min-h-[calc(100vh-8rem)] flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div class="animate-spin h-8 w-8 border-2 border-gray-300 dark:border-gray-600 border-t-blue-500 rounded-full" />
      </div>
    </template>
  </ClientOnly>
</template>

<script setup>
import { computed } from 'vue'
import RelatorioGerador from '../../../components/relatorios/RelatorioGerador.vue'
import { getRelatorioConfig, getTiposRelatorio } from '../../../utils/configRelatorios'
import { ExclamationCircleIcon } from '@heroicons/vue/24/outline'

definePageMeta({ keepalive: false })

const route = useRoute()
const tipo = computed(() => String(route.params.tipo || ''))

const configValido = computed(() => {
  if (!tipo.value) return false
  const config = getRelatorioConfig(tipo.value)
  return !!config && getTiposRelatorio().includes(tipo.value)
})
</script>
