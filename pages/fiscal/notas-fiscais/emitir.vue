<template>
  <div class="w-full max-w-full overflow-x-hidden">
    <!-- Breadcrumb + Header -->
    <header class="flex flex-col gap-2 mb-6">
      <nav class="flex items-center gap-2 text-sm">
        <NuxtLink to="/fiscal/notas-fiscais" class="text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition">
          Notas Fiscais
        </NuxtLink>
        <span class="text-gray-400 dark:text-gray-600">/</span>
        <span class="text-gray-700 dark:text-gray-300 font-medium">Emitir</span>
      </nav>
      <div class="flex items-center gap-4">
        <NuxtLink
          to="/fiscal/notas-fiscais"
          class="inline-flex items-center justify-center w-10 h-10 rounded-xl border border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400 transition duration-200 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          <ArrowLeftIcon class="w-5 h-5" />
        </NuxtLink>
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
            Emitir Nota Fiscal
          </h1>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Preencha os dados para emitir uma nova nota fiscal
          </p>
        </div>
      </div>
    </header>

    <!-- Alerta de ambiente -->
    <div
      v-if="ambiente && !isProducao"
      class="bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800 p-4 sm:p-5 mb-6"
    >
      <div class="flex items-start gap-3">
        <ExclamationTriangleIcon class="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div>
          <p class="font-bold text-gray-900 dark:text-white">
            Ambiente de Homologação
          </p>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
            As notas emitidas neste ambiente são apenas para testes e não têm validade fiscal.
          </p>
        </div>
      </div>
    </div>

    <!-- Verificar se tem certificado configurado -->
    <div
      v-if="!configurado"
      class="bg-white dark:bg-brand-navy rounded-xl shadow p-8 sm:p-12 text-center border border-gray-200 dark:border-gray-800"
    >
      <ShieldExclamationIcon class="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
      <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2">
        Certificado não configurado
      </h3>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
        Configure o certificado digital antes de emitir notas fiscais.
      </p>
      <NuxtLink
        to="/fiscal/certificado"
        class="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white bg-blue-500 hover:bg-blue-600 transition duration-200 shadow-lg hover:shadow-xl"
      >
        <Cog6ToothIcon class="w-5 h-5" />
        Configurar Certificado
      </NuxtLink>
    </div>

    <!-- Formulário de emissão -->
    <div
      v-else
      class="bg-white dark:bg-brand-navy rounded-xl shadow p-6 border border-gray-200 dark:border-gray-800"
    >
      <div class="text-center py-12">
        <DocumentTextIcon class="h-16 w-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
        <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2">
          Formulário de Emissão
        </h3>
        <p class="text-gray-600 dark:text-gray-400 mb-6">
          O formulário de emissão de notas fiscais será implementado em breve.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ArrowLeftIcon, ExclamationTriangleIcon, ShieldExclamationIcon, Cog6ToothIcon, DocumentTextIcon } from '@heroicons/vue/24/outline'

const ambiente = ref(null)
const configurado = ref(false)

const isProducao = computed(() => ambiente.value === 1)

onMounted(async () => {
  // TODO: Substituir por chamada real à API
  // Carregar ambiente
  ambiente.value = 1
  
  // Verificar se tem certificado configurado
  configurado.value = false
})
</script>
