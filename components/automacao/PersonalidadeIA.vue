<template>
  <div class="glass-card-light dark:glass-card rounded-2xl shadow-sm border border-white/10 mb-6 overflow-hidden">
    <!-- Header sutil -->
    <div class="px-6 py-4 border-b border-white/10 bg-white/5 dark:bg-white/5 backdrop-blur-sm">
      <div>
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Personalidade da IA</h2>
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Configure como o assistente deve se comportar</p>
      </div>
    </div>
    
    <!-- Conteúdo -->
    <div class="p-6">
      <div class="space-y-4">
        <div>
          <label for="personalidade-textarea" class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">
            Como a IA deve se comportar e responder aos clientes?
          </label>
          <div class="relative">
            <textarea
              id="personalidade-textarea"
              v-model="personalidade"
              :disabled="carregando"
              rows="6"
              placeholder="Ex: Seja sempre educada, use linguagem profissional mas amigável, foque em ajudar o cliente a encontrar o imóvel ideal..."
              class="w-full px-4 py-3 glass-card-light dark:glass-card border border-white/10 rounded-lg focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500/70 resize-none disabled:opacity-50 transition-all duration-200 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 text-sm leading-relaxed"
            ></textarea>
            <div v-if="carregando" class="absolute inset-0 flex items-center justify-center bg-black/40 dark:bg-black/50 backdrop-blur-sm rounded-lg">
              <div class="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                <div class="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
                <span class="text-xs font-medium">Carregando...</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="flex justify-end pt-2">
          <button
            @click="salvarPersonalidade"
            :disabled="salvando || carregando"
            class="btn-gradient px-5 py-2.5 flex items-center gap-2 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div v-if="salvando" class="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
            <CheckIcon v-else class="w-4 h-4" />
            {{ salvando ? 'Salvando...' : 'Salvar' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { CheckIcon } from '@heroicons/vue/24/outline'

// Estados
const personalidade = ref('')
const salvando = ref(false)
const carregando = ref(false)

// Funções
const salvarPersonalidade = async () => {
  try {
    salvando.value = true
    // TODO: Substituir por chamada real à API
    // await api.post('/personalidade', { personalidade: personalidade.value })
    await new Promise(resolve => setTimeout(resolve, 1000))
    alert('Personalidade salva com sucesso!')
  } catch (error) {
    console.error('Erro ao salvar personalidade:', error)
    alert('Erro ao salvar personalidade')
  } finally {
    salvando.value = false
  }
}

const carregarPersonalidade = async () => {
  try {
    carregando.value = true
    // TODO: Substituir por chamada real à API
    // const response = await api.get('/personalidade')
    // personalidade.value = response.data.personalidade || ''
    await new Promise(resolve => setTimeout(resolve, 500))
    personalidade.value = 'Seja sempre educada, use linguagem profissional mas amigável, foque em ajudar o cliente a encontrar o imóvel ideal...'
  } catch (error) {
    console.error('Erro ao carregar personalidade:', error)
    alert('Erro ao carregar personalidade')
  } finally {
    carregando.value = false
  }
}

// Carregar dados iniciais
onMounted(() => {
  carregarPersonalidade()
})
</script>
