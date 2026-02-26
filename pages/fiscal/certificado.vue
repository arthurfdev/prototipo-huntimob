<template>
  <div class="w-full max-w-full overflow-x-hidden">
    <!-- Breadcrumb + Header -->
    <header class="flex flex-col gap-2 mb-6">
      <nav class="flex items-center gap-2 text-sm">
        <NuxtLink to="/fiscal/notas-fiscais" class="text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition">
          Notas Fiscais
        </NuxtLink>
        <span class="text-gray-400 dark:text-gray-600">/</span>
        <span class="text-gray-700 dark:text-gray-300 font-medium">Certificado</span>
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
            Configuração Fiscal
          </h1>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Configure o certificado digital e dados fiscais
          </p>
        </div>
      </div>
    </header>

    <!-- Status atual -->
    <div class="bg-white dark:bg-brand-navy rounded-xl shadow p-5 sm:p-6 mb-6 border border-gray-200 dark:border-gray-800">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <div :class="[
            'w-12 h-12 rounded-xl flex items-center justify-center',
            configurado
              ? 'bg-green-500/10 border border-green-500/20'
              : 'bg-amber-500/10 border border-amber-500/20'
          ]">
            <ShieldCheckIcon v-if="configurado" class="w-6 h-6 text-green-600 dark:text-green-400" />
            <ExclamationTriangleIcon v-else class="w-6 h-6 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <p class="font-bold text-gray-900 dark:text-white">
              {{ configurado ? 'Certificado Configurado' : 'Certificado Pendente' }}
            </p>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
              {{ configurado 
                ? 'A empresa está pronta para emitir notas fiscais' 
                : 'Configure o certificado digital para emitir notas' 
              }}
            </p>
          </div>
        </div>
        <span v-if="configurado" class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20">
          <CheckIcon class="w-4 h-4" />
          Ativo
        </span>
      </div>
    </div>

    <!-- Informação sobre o fluxo -->
    <div v-if="!configurado" class="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 sm:p-5 mb-6 border border-blue-200 dark:border-blue-800">
      <div class="flex items-start gap-3">
        <InformationCircleIcon class="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
        <div>
          <h4 class="text-sm font-bold text-gray-900 dark:text-white">
            Como configurar
          </h4>
          <p class="mt-2 text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <span class="block"><strong class="text-gray-900 dark:text-white">Passo 1:</strong> Preencha todos os dados da empresa (CNPJ/CPF, Razão Social, Endereço, etc.)</span>
            <span class="block"><strong class="text-gray-900 dark:text-white">Passo 2:</strong> Faça upload do certificado digital (.pfx ou .p12) e informe a senha</span>
            <span class="block"><strong class="text-gray-900 dark:text-white">Passo 3:</strong> Clique em "Salvar Configuração" para cadastrar tudo de uma vez</span>
          </p>
        </div>
      </div>
    </div>

    <!-- Formulário -->
    <CertificadoForm
      :initial-data="dadosIniciais"
      @success="handleSuccess"
      @cancel="$router.push('/fiscal/notas-fiscais')"
      @error="handleError"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeftIcon, ShieldCheckIcon, ExclamationTriangleIcon, CheckIcon, InformationCircleIcon } from '@heroicons/vue/24/outline'
import CertificadoForm from '@/components/fiscal/CertificadoForm.vue'

const router = useRouter()
const configurado = ref(false)
const dadosIniciais = ref(null)

function handleSuccess(response) {
  alert(response.message || 'Certificado cadastrado com sucesso!')
  router.push('/fiscal/notas-fiscais')
}

function handleError(error) {
  alert(error.response?.data?.message || 'Erro ao cadastrar certificado')
}

onMounted(async () => {
  // TODO: Substituir por chamada real à API
  // Verificar se já existe configuração
  configurado.value = false
})
</script>
