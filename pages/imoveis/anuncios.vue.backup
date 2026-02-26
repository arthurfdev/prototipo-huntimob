<template>
  <div class="w-full max-w-full overflow-x-hidden">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Integrações</h1>
      <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Integre com Canal Pro para publicar em OLX, VivaReal e ZAP Imóveis</p>
    </div>

    <!-- Tabs -->
    <div class="border-b border-gray-200 dark:border-gray-800 mb-6">
      <nav class="-mb-px flex space-x-8">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="currentTab = tab.id"
          :class="[
            currentTab === tab.id
              ? 'border-blue-500 text-blue-600 dark:text-blue-400 dark:border-blue-400'
              : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300',
            'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors'
          ]"
        >
          <component :is="tab.icon" class="w-4 h-4 inline-block mr-2" />
          {{ tab.name }}
        </button>
      </nav>
    </div>

    <!-- Tab Integrações -->
    <div v-if="currentTab === 'integracoes'" class="space-y-6">
      <!-- Canal Pro -->
      <div class="bg-white dark:bg-brand-navy rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-800">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <LinkIcon class="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 class="text-lg font-bold text-gray-900 dark:text-white">Canal Pro</h2>
              <p class="text-sm text-gray-500 dark:text-gray-400">Integração com portais imobiliários</p>
              <div class="flex items-center gap-2 mt-2">
                <span class="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded">OLX</span>
                <span class="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded">VivaReal</span>
                <span class="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded">ZAP Imóveis</span>
              </div>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <span 
              class="px-3 py-1 rounded-full text-xs font-medium"
              :class="canalProConectado ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'"
            >
              {{ canalProConectado ? 'Conectado' : 'Desconectado' }}
            </span>
            <button
              @click="toggleCanalPro"
              :class="[
                'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                canalProConectado 
                  ? 'bg-red-500 hover:bg-red-600 text-white' 
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              ]"
            >
              {{ canalProConectado ? 'Desconectar' : 'Conectar' }}
            </button>
          </div>
        </div>
        <div v-if="canalProConectado" class="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <p class="text-sm text-blue-800 dark:text-blue-300 mb-2">
            <strong>Status:</strong> Conectado e sincronizando imóveis automaticamente.
          </p>
          <p class="text-xs text-blue-700 dark:text-blue-400">
            Seus imóveis serão publicados automaticamente em: <strong>OLX</strong>, <strong>VivaReal</strong> e <strong>ZAP Imóveis</strong>
          </p>
        </div>
      </div>

      <!-- Site -->
      <div class="bg-white dark:bg-brand-navy rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-800">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
              <GlobeAltIcon class="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 class="text-lg font-bold text-gray-900 dark:text-white">Site</h2>
              <p class="text-sm text-gray-500 dark:text-gray-400">Site fornecido pela HuntImob</p>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <span class="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
              Sempre Ativo
            </span>
          </div>
        </div>
        <div class="mt-4 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
          <p class="text-sm text-emerald-800 dark:text-emerald-300">
            <strong>Status:</strong> O site é fornecido pela HuntImob e está sempre conectado. 
            Seus imóveis são sincronizados automaticamente.
          </p>
        </div>
      </div>
    </div>

    <!-- Tab Tutorial -->
    <div v-if="currentTab === 'tutorial'" class="space-y-6">
      <div class="bg-white dark:bg-brand-navy rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-800">
        <h2 class="text-lg font-bold text-gray-900 dark:text-white mb-4">Como fazer a integração</h2>
        
        <div class="space-y-6">
          <!-- Canal Pro -->
          <div class="border-l-4 border-blue-500 pl-4">
            <h3 class="text-base font-semibold text-gray-900 dark:text-white mb-2">Canal Pro</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">
              O Canal Pro permite publicar seus imóveis automaticamente nos principais portais:
            </p>
            <div class="flex items-center gap-2 mb-3">
              <span class="text-xs px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg font-medium">OLX</span>
              <span class="text-xs px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg font-medium">VivaReal</span>
              <span class="text-xs px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg font-medium">ZAP Imóveis</span>
            </div>
            <ol class="list-decimal list-inside space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>Acesse o painel do Canal Pro em <a href="https://canalpro.com.br" target="_blank" class="text-blue-600 dark:text-blue-400 hover:underline">canalpro.com.br</a></li>
              <li>Faça login na sua conta</li>
              <li>Vá em "Configurações" → "Integrações"</li>
              <li>Copie sua chave de API</li>
              <li>Volte para esta página e clique em "Conectar"</li>
              <li>Cole a chave de API quando solicitado</li>
              <li>Pronto! Sua integração estará ativa e seus imóveis serão publicados automaticamente nos portais</li>
            </ol>
          </div>

          <!-- Site -->
          <div class="border-l-4 border-emerald-500 pl-4">
            <h3 class="text-base font-semibold text-gray-900 dark:text-white mb-2">Site HuntImob</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">
              O site é fornecido pela HuntImob e está sempre conectado. Não é necessária nenhuma configuração adicional.
            </p>
            <ul class="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400">
              <li>Os imóveis são sincronizados automaticamente</li>
              <li>Não é necessário conectar ou configurar</li>
              <li>Funciona de forma integrada com o sistema</li>
            </ul>
          </div>

          <div class="mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
            <div class="flex items-start gap-3">
              <InformationCircleIcon class="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <p class="text-sm font-medium text-amber-800 dark:text-amber-300 mb-1">Dica importante</p>
                <p class="text-sm text-amber-700 dark:text-amber-400">
                  Após conectar as integrações, você poderá selecionar imóveis cadastrados e publicá-los nos portais. 
                  Certifique-se de que os imóveis tenham todas as informações necessárias antes de publicar.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  LinkIcon,
  GlobeAltIcon,
  InformationCircleIcon
} from '@heroicons/vue/24/outline'

const currentTab = ref('integracoes')

const tabs = [
  { id: 'integracoes', name: 'Integrações', icon: LinkIcon },
  { id: 'tutorial', name: 'Tutorial', icon: InformationCircleIcon }
]

// Estados das integrações
const canalProConectado = ref(false)
const siteConectado = ref(true) // Site sempre conectado (fornecido pela HuntImob)

const toggleCanalPro = () => {
  if (canalProConectado.value) {
    ElMessageBox.confirm(
      'Tem certeza que deseja desconectar o Canal Pro? Os anúncios serão removidos dos portais.',
      'Desconectar Canal Pro',
      {
        confirmButtonText: 'Desconectar',
        cancelButtonText: 'Cancelar',
        type: 'warning'
      }
    ).then(() => {
      canalProConectado.value = false
      ElMessage.success('Canal Pro desconectado')
    }).catch(() => {})
  } else {
    // Simular conexão
    canalProConectado.value = true
    ElMessage.success('Canal Pro conectado com sucesso!')
  }
}

// Site não precisa de toggle - sempre conectado
</script>
