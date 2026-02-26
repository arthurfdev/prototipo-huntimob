<template>
  <div class="glass-card-light dark:glass-card rounded-2xl shadow-sm mb-6 overflow-hidden">
    <!-- Header sutil -->
    <div class="px-6 py-4 border-b border-gray-100 dark:border-gray-800/50 bg-gray-50/50 dark:bg-gray-900/30">
      <div>
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Conexão WhatsApp</h2>
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Conecte seu número do WhatsApp Business para ativar o assistente</p>
      </div>
    </div>

    <!-- Conteúdo -->
    <div class="p-6">

      <!-- Estado inicial - Botão para gerar QR Code -->
      <div v-if="!qrCodeData && !loading && !isConnected" class="text-center">
        <div class="bg-gray-50/50 dark:bg-gray-900/30 rounded-lg p-6 mb-4 border border-gray-200/50 dark:border-gray-800/50">
          <div class="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl flex items-center justify-center">
            <ChatBubbleLeftRightIcon class="w-8 h-8 text-blue-500 dark:text-blue-400" />
          </div>
          <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-1.5">Conectar WhatsApp</h3>
          <p class="text-xs text-gray-500 dark:text-gray-400 mb-5">
            Clique no botão abaixo para gerar um QR Code e conectar seu WhatsApp Business
          </p>
          <button 
            @click="generateQRCode"
            class="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg transition-all duration-200 flex items-center mx-auto shadow-sm hover:shadow-md text-sm font-semibold"
            :disabled="loading"
          >
            <LinkIcon class="w-4 h-4 mr-1.5" />
            {{ loading ? 'Gerando...' : 'Gerar QR Code' }}
          </button>
        </div>
      </div>

      <!-- Loading state -->
      <div v-if="loading" class="text-center">
        <div class="bg-gray-50/50 dark:bg-gray-900/30 rounded-lg p-6 mb-4 border border-gray-200/50 dark:border-gray-800/50">
          <div class="w-64 h-64 mx-auto glass-card-light dark:glass-card p-6 rounded-lg shadow-sm mb-4 flex items-center justify-center">
            <div class="text-center">
              <div class="relative mb-6">
                <div class="animate-spin rounded-full h-16 w-16 border-3 border-gray-200 dark:border-gray-700 mx-auto"></div>
                <div class="absolute top-0 left-1/2 transform -translate-x-1/2 animate-spin rounded-full h-16 w-16 border-3 border-transparent border-t-blue-500 border-r-blue-600"></div>
                <div class="absolute top-1.5 left-1/2 transform -translate-x-1/2 animate-pulse rounded-full h-12 w-12 bg-blue-500/20 border border-white dark:border-brand-navy"></div>
                <div class="icon-glass absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-lg flex items-center justify-center">
                  <ChatBubbleLeftRightIcon class="w-3.5 h-3.5 text-cyan-500 dark:text-cyan-400 relative z-10 stroke-2" />
                </div>
              </div>
              <div class="space-y-3">
                <h4 class="text-sm font-semibold text-gray-800 dark:text-white">Gerando QR Code</h4>
                <div class="flex items-center justify-center space-x-2">
                  <p class="text-xs text-gray-500 dark:text-gray-400 font-medium">Preparando conexão</p>
                  <div class="flex space-x-1">
                    <div class="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style="animation-delay: 0ms"></div>
                    <div class="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce" style="animation-delay: 150ms"></div>
                    <div class="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style="animation-delay: 300ms"></div>
                  </div>
                </div>
                <p class="text-[10px] text-gray-400 dark:text-gray-500">Isso pode levar alguns segundos</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- QR Code Area -->
      <div v-if="qrCodeData && !isConnected" class="text-center">
        <div class="bg-gray-50/50 dark:bg-gray-900/30 rounded-lg p-4 mb-4 border border-gray-200/50 dark:border-gray-800/50">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 items-center">
            <!-- Instruções à esquerda -->
            <div class="order-2 lg:order-1">
              <div class="glass-card-light dark:glass-card rounded-lg p-4">
                <h4 class="text-sm font-semibold text-gray-800 dark:text-white mb-4 text-center lg:text-left">Como conectar:</h4>
                <div class="space-y-3">
                  <div class="flex items-center space-x-2.5">
                    <div class="w-5 h-5 bg-blue-500 text-white rounded-md flex items-center justify-center text-[10px] font-bold flex-shrink-0">1</div>
                    <p class="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">Abra o <span class="font-semibold text-gray-900 dark:text-white">WhatsApp Business</span> no seu celular</p>
                  </div>
                  <div class="flex items-center space-x-2.5">
                    <div class="w-5 h-5 bg-blue-500 text-white rounded-md flex items-center justify-center text-[10px] font-bold flex-shrink-0">2</div>
                    <p class="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">Toque em <span class="font-semibold text-gray-900 dark:text-white">Menu (⋮)</span> → <span class="font-semibold text-gray-900 dark:text-white">Dispositivos conectados</span></p>
                  </div>
                  <div class="flex items-center space-x-2.5">
                    <div class="w-5 h-5 bg-blue-500 text-white rounded-md flex items-center justify-center text-[10px] font-bold flex-shrink-0">3</div>
                    <p class="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">Toque em <span class="font-semibold text-gray-900 dark:text-white">"Conectar um dispositivo"</span></p>
                  </div>
                  <div class="flex items-center space-x-2.5">
                    <div class="w-5 h-5 bg-blue-500 text-white rounded-md flex items-center justify-center text-[10px] font-bold flex-shrink-0">4</div>
                    <p class="text-xs text-gray-600 dark:text-gray-400 leading-relaxed"><span class="font-semibold text-gray-900 dark:text-white">Aponte a câmera</span> para este código QR</p>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- QR Code à direita -->
            <div class="order-1 lg:order-2 flex justify-center">
              <div class="relative">
                <div class="w-56 h-56 bg-gradient-to-br from-white to-blue-50 dark:from-brand-navy-dark dark:to-blue-900/20 p-1 rounded-lg shadow-sm flex items-center justify-center">
                  <div class="glass-card-light dark:glass-card rounded-lg p-2">
                    <img 
                      :src="qrCodeImageSrc"
                      alt="QR Code WhatsApp"
                      class="w-full h-full object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="flex justify-center space-x-2">
          <button 
            @click="generateQRCode"
            class="px-4 py-2 text-blue-600 dark:text-blue-400 border border-blue-500/50 rounded-lg hover:bg-blue-500 hover:text-white transition-all duration-200 text-xs flex items-center font-medium"
          >
            <ArrowPathIcon class="w-3.5 h-3.5 mr-1.5" />
            Gerar Novo QR Code
          </button>
          
          <button 
            @click="resetQRCode"
            class="px-4 py-2 text-gray-600 dark:text-gray-400 border border-gray-300/50 dark:border-gray-700/50 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 text-xs font-medium"
          >
            Cancelar
          </button>
        </div>
      </div>

      <!-- Estado Conectado -->
      <div v-if="isConnected" class="text-center">
        <div class="bg-blue-50/50 dark:bg-blue-900/20 rounded-lg p-5 mb-4 shadow-sm border border-blue-200/50 dark:border-blue-800/30">
          <div class="icon-glass w-12 h-12 mx-auto mb-3 rounded-lg flex items-center justify-center shadow-sm">
            <CheckCircleIcon class="w-6 h-6 text-emerald-500 dark:text-emerald-400 relative z-10 stroke-2" />
          </div>
          <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-1.5">WhatsApp Conectado!</h3>
          <p class="text-xs text-gray-500 dark:text-gray-400 mb-4">
            Seu WhatsApp Business está conectado e ativo.<br>
            O assistente já pode atender seus clientes.
          </p>
          
          <div class="glass-card-light dark:glass-card rounded-lg p-3 mb-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div class="text-left">
                <p class="text-gray-500 dark:text-gray-400 font-medium mb-0.5">Instância:</p>
                <p class="text-blue-600 dark:text-blue-400 font-semibold">{{ instanceName }}</p>
              </div>
              <div class="text-left">
                <p class="text-gray-500 dark:text-gray-400 font-medium mb-0.5">Status:</p>
                <div class="flex items-center gap-1.5">
                  <div class="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
                  <p class="text-blue-600 dark:text-blue-400 font-semibold">Conectado e ativo</p>
                </div>
              </div>
            </div>
          </div>
          
          <button 
            @click="disconnectInstance"
            class="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 flex items-center mx-auto text-xs font-semibold shadow-sm hover:shadow-md"
          >
            <LinkSlashIcon class="w-3.5 h-3.5 mr-1.5" />
            Desconectar WhatsApp
          </button>
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="errorMessage" class="mt-4 p-3 bg-red-50/80 dark:bg-red-900/20 border border-red-200/50 dark:border-red-800/30 rounded-lg">
        <div class="flex items-center">
          <ExclamationTriangleIcon class="w-4 h-4 text-red-500 mr-2" />
          <span class="text-red-700 dark:text-red-400 text-xs font-medium">{{ errorMessage }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { 
  ChatBubbleLeftRightIcon, 
  LinkIcon, 
  ArrowPathIcon, 
  CheckCircleIcon, 
  LinkSlashIcon, 
  ExclamationTriangleIcon 
} from '@heroicons/vue/24/outline'

// Estados
const loading = ref(false)
const isConnected = ref(false)
const qrCodeData = ref('')
const statusInterval = ref(null)
const errorMessage = ref('')
const instanceName = ref('WhatsApp Business')

// Computed para converter base64 em data URL
const qrCodeImageSrc = computed(() => {
  if (!qrCodeData.value) return ''
  
  // Se já contém data:image, retorna como está
  if (qrCodeData.value.startsWith('data:image')) {
    return qrCodeData.value
  }
  
  // Se é apenas base64, adiciona o prefixo data URL
  return `data:image/png;base64,${qrCodeData.value}`
})

// Funções QR Code
const generateQRCode = async () => {
  try {
    loading.value = true
    errorMessage.value = ''
    // TODO: Substituir por chamada real à API
    // const response = await api.post('/whatsapp/qr-code')
    // qrCodeData.value = response.data.qrCode
    
    // Mock para demonstração
    await new Promise(resolve => setTimeout(resolve, 2000))
    qrCodeData.value = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
    
    // Iniciar verificação automática do status
    iniciarVerificacaoStatus()
  } catch (error) {
    console.error('Erro ao gerar QR Code:', error)
    errorMessage.value = 'Erro ao gerar QR Code'
  } finally {
    loading.value = false
  }
}

const checkConnection = async () => {
  try {
    // TODO: Substituir por chamada real à API
    // const response = await api.get('/whatsapp/status')
    // const wasConnected = isConnected.value
    // isConnected.value = response.data.connected
    
    // Mock - simular conexão após 10 segundos
    const wasConnected = isConnected.value
    // isConnected.value = false // Para teste, manter false
    
    // Se acabou de conectar, parar a verificação e mostrar sucesso
    if (!wasConnected && isConnected.value) {
      pararVerificacaoStatus()
      qrCodeData.value = ''
    }
  } catch (error) {
    console.error('Erro ao verificar conexão WhatsApp:', error)
  }
}

// Função para iniciar verificação automática
const iniciarVerificacaoStatus = () => {
  // Limpar intervalo anterior se existir
  if (statusInterval.value) {
    clearInterval(statusInterval.value)
  }
  
  // Verificar status a cada 2 segundos
  statusInterval.value = setInterval(() => {
    checkConnection()
  }, 2000)
}

// Função para parar verificação automática
const pararVerificacaoStatus = () => {
  if (statusInterval.value) {
    clearInterval(statusInterval.value)
    statusInterval.value = null
  }
}

const resetQRCode = () => {
  qrCodeData.value = ''
  pararVerificacaoStatus()
}

const disconnectInstance = async () => {
  try {
    // TODO: Substituir por chamada real à API
    // await api.post('/whatsapp/disconnect')
    isConnected.value = false
    instanceName.value = ''
    errorMessage.value = ''
  } catch (error) {
    console.error('Erro ao desconectar WhatsApp:', error)
    errorMessage.value = 'Erro ao desconectar WhatsApp'
  }
}

// Carregar dados iniciais
onMounted(() => {
  checkConnection()
})

// Limpar intervalo quando o componente for desmontado
onUnmounted(() => {
  pararVerificacaoStatus()
})
</script>
