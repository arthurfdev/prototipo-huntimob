<template>
  <div class="w-full">
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Certificado Digital</h1>
      <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Configure o certificado digital e dados fiscais</p>
    </div>

    <!-- Status atual -->
    <div class="glass-card-light dark:glass-card rounded-xl border border-white/10 p-5 sm:p-6 mb-6">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <div class="icon-glass w-12 h-12 rounded-xl flex items-center justify-center">
            <ShieldCheckIcon v-if="configurado" class="w-6 h-6 text-emerald-600 dark:text-emerald-400 relative z-10 stroke-2" />
            <ExclamationTriangleIcon v-else class="w-6 h-6 text-amber-600 dark:text-amber-400 relative z-10 stroke-2" />
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
    <div v-if="!configurado" class="glass-card-light dark:glass-card rounded-xl border border-white/10 p-4 sm:p-5 mb-6">
      <div class="flex items-start gap-3">
        <div class="icon-glass w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0">
          <InformationCircleIcon class="w-5 h-5 text-cyan-500 dark:text-cyan-400 relative z-10 stroke-2" />
        </div>
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
import { ShieldCheckIcon, ExclamationTriangleIcon, CheckIcon, InformationCircleIcon } from '@heroicons/vue/24/outline'
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
