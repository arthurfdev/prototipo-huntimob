<template>
  <div class="w-full max-w-full overflow-x-hidden">
    <div class="mb-8">
      <div class="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
            Ranking de Vendas 🏆
          </h1>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Competição de Equipes e Corretores
          </p>
        </div>
      </div>
    </div>

    <!-- Tabs -->
    <div class="mb-6 border-b border-gray-200 dark:border-gray-800">
      <nav class="-mb-px flex space-x-4">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="currentTab = tab.id"
          :class="[
            'px-6 py-3 border-b-2 font-medium text-sm transition-colors',
            currentTab === tab.id
              ? 'border-blue-500 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
          ]"
        >
          {{ tab.name }}
        </button>
      </nav>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center min-h-[400px]">
      <div class="text-center">
        <div class="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto mb-4"></div>
        <p class="text-gray-500 dark:text-gray-400">Carregando ranking...</p>
      </div>
    </div>

    <!-- Content -->
    <div v-else>
      <!-- Top 3 Pódio -->
      <div class="mb-12">
        <div class="text-center mb-8">
          <h2 class="text-3xl sm:text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent">
            🏆 TOP 3 🏆
          </h2>
          <p class="text-gray-500 dark:text-gray-400 text-sm">Os melhores desempenhos do período</p>
        </div>
        
        <div class="flex items-end justify-center space-x-4 max-w-6xl mx-auto flex-wrap gap-6">
          <!-- 2º Lugar -->
          <div v-if="currentTab === 'equipes' && rankingEquipes.length > 1" class="flex-1 min-w-[280px] max-w-xs">
            <div class="bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 rounded-3xl p-6 shadow-xl border-2 border-slate-300 dark:border-slate-700 relative overflow-hidden">
              <div class="text-center mb-4">
                <div class="w-20 h-20 mx-auto bg-gradient-to-br from-slate-400 to-slate-600 rounded-full flex items-center justify-center text-3xl font-bold text-white shadow-lg">
                  2
                </div>
              </div>
              
              <div class="w-36 h-36 mx-auto mb-4 rounded-2xl overflow-hidden border-4 border-slate-400 shadow-xl bg-gray-200 dark:bg-gray-700 transform hover:scale-105 transition-transform duration-300">
                <img
                  :src="rankingEquipes[1].photo_url || '/images/placeholder-avatar.png'"
                  :alt="rankingEquipes[1].equipe_nome"
                  class="w-full h-full object-cover"
                  loading="eager"
                  @error="handleImageError"
                />
              </div>
              
              <h3 class="text-xl font-bold text-center mb-2 text-gray-900 dark:text-white">{{ rankingEquipes[1].equipe_nome }}</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400 text-center mb-4 font-medium">Gerente: {{ rankingEquipes[1].gerente_nome }}</p>
              
              <div class="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-3 shadow-lg">
                <div class="text-center">
                  <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ formatMoney(rankingEquipes[1].vgv_total) }}</p>
                  <p class="text-xs text-gray-600 dark:text-gray-400 font-medium">{{ rankingEquipes[1].total_propostas }} propostas</p>
                </div>
              </div>
            </div>
          </div>

          <!-- 1º Lugar -->
          <div v-if="currentTab === 'equipes' && rankingEquipes.length > 0" class="flex-1 min-w-[320px] max-w-sm transform scale-105 z-10">
            <div class="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-3xl p-8 shadow-2xl border-4 border-blue-400 relative overflow-hidden">
              <!-- Efeito de brilho animado -->
              <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
              
              <div class="relative z-10">
                <div class="text-center mb-4">
                  <div class="w-24 h-24 mx-auto bg-white rounded-full flex items-center justify-center text-4xl font-bold text-blue-600 shadow-2xl animate-bounce">
                    👑
                  </div>
                </div>
                
                <div class="w-44 h-44 mx-auto mb-4 rounded-2xl overflow-hidden border-4 border-white shadow-2xl bg-gray-200 transform hover:scale-105 transition-transform duration-300">
                  <img
                    :src="rankingEquipes[0].photo_url || '/images/placeholder-avatar.png'"
                    :alt="rankingEquipes[0].equipe_nome"
                    class="w-full h-full object-cover"
                    loading="eager"
                    @error="handleImageError"
                  />
                </div>
                
                <h3 class="text-2xl font-bold text-center mb-2 text-white drop-shadow-lg">{{ rankingEquipes[0].equipe_nome }}</h3>
                <p class="text-sm text-blue-100 text-center mb-4 font-medium">Gerente: {{ rankingEquipes[0].gerente_nome }}</p>
                
                <div class="bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-xl">
                  <div class="text-center">
                    <p class="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{{ formatMoney(rankingEquipes[0].vgv_total) }}</p>
                    <p class="text-sm text-gray-600 font-medium mt-1">{{ rankingEquipes[0].total_propostas }} propostas</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 3º Lugar -->
          <div v-if="currentTab === 'equipes' && rankingEquipes.length > 2" class="flex-1 min-w-[280px] max-w-xs">
            <div class="bg-gradient-to-br from-amber-50 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 rounded-3xl p-6 shadow-xl border-2 border-amber-300 dark:border-amber-700 relative overflow-hidden">
              <div class="text-center mb-4">
                <div class="w-20 h-20 mx-auto bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center text-3xl font-bold text-white shadow-lg">
                  3
                </div>
              </div>
              
              <div class="w-36 h-36 mx-auto mb-4 rounded-2xl overflow-hidden border-4 border-amber-400 shadow-xl bg-gray-200 dark:bg-gray-700 transform hover:scale-105 transition-transform duration-300">
                <img
                  :src="rankingEquipes[2].photo_url || '/images/placeholder-avatar.png'"
                  :alt="rankingEquipes[2].equipe_nome"
                  class="w-full h-full object-cover"
                  loading="eager"
                  @error="handleImageError"
                />
              </div>
              
              <h3 class="text-xl font-bold text-center mb-2 text-gray-900 dark:text-white">{{ rankingEquipes[2].equipe_nome }}</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400 text-center mb-4 font-medium">Gerente: {{ rankingEquipes[2].gerente_nome }}</p>
              
              <div class="bg-white/80 dark:bg-amber-900/50 backdrop-blur-sm rounded-xl p-3 shadow-lg">
                <div class="text-center">
                  <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ formatMoney(rankingEquipes[2].vgv_total) }}</p>
                  <p class="text-xs text-gray-600 dark:text-gray-400 font-medium">{{ rankingEquipes[2].total_propostas }} propostas</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Ranking de Corretores - Top 3 -->
          <template v-if="currentTab === 'corretores'">
            <!-- 2º Lugar -->
            <div v-if="rankingCorretores.length > 1" class="flex-1 min-w-[280px] max-w-xs">
              <div class="bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 rounded-3xl p-6 shadow-xl border-2 border-slate-300 dark:border-slate-700 relative overflow-hidden">
                <div class="text-center mb-4">
                  <div class="w-20 h-20 mx-auto bg-gradient-to-br from-slate-400 to-slate-600 rounded-full flex items-center justify-center text-3xl font-bold text-white shadow-lg">
                    2
                  </div>
                </div>
                
                <div class="w-36 h-36 mx-auto mb-4 rounded-2xl overflow-hidden border-4 border-slate-400 shadow-xl bg-gray-200 dark:bg-gray-700 transform hover:scale-105 transition-transform duration-300">
                  <img
                    :src="rankingCorretores[1].photo_url || '/images/placeholder-avatar.png'"
                    :alt="rankingCorretores[1].nome"
                    class="w-full h-full object-cover"
                    loading="eager"
                    @error="handleImageError"
                  />
                </div>
                
                <h3 class="text-xl font-bold text-center mb-2 text-gray-900 dark:text-white">{{ rankingCorretores[1].nome }}</h3>
                <p class="text-sm text-gray-600 dark:text-gray-400 text-center mb-4 font-medium">{{ rankingCorretores[1].funcao }}</p>
                
                <div class="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-3 shadow-lg">
                  <div class="text-center">
                    <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ formatMoney(rankingCorretores[1].vgv_total) }}</p>
                    <p class="text-xs text-gray-600 dark:text-gray-400 font-medium">{{ rankingCorretores[1].total_propostas }} propostas</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- 1º Lugar -->
            <div v-if="rankingCorretores.length > 0" class="flex-1 min-w-[320px] max-w-sm transform scale-105 z-10">
              <div class="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-3xl p-8 shadow-2xl border-4 border-blue-400 relative overflow-hidden">
                <!-- Efeito de brilho animado -->
                <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
                
                <div class="relative z-10">
                  <div class="text-center mb-4">
                    <div class="w-24 h-24 mx-auto bg-white rounded-full flex items-center justify-center text-4xl font-bold text-blue-600 shadow-2xl animate-bounce">
                      👑
                    </div>
                  </div>
                  
                  <div class="w-44 h-44 mx-auto mb-4 rounded-2xl overflow-hidden border-4 border-white shadow-2xl bg-gray-200 transform hover:scale-105 transition-transform duration-300">
                    <img
                      :src="rankingCorretores[0].photo_url || '/images/placeholder-avatar.png'"
                      :alt="rankingCorretores[0].nome"
                      class="w-full h-full object-cover"
                      loading="eager"
                      @error="handleImageError"
                    />
                  </div>
                  
                  <h3 class="text-2xl font-bold text-center mb-2 text-white drop-shadow-lg">{{ rankingCorretores[0].nome }}</h3>
                  <p class="text-sm text-blue-100 text-center mb-4 font-medium">{{ rankingCorretores[0].funcao }}</p>
                  
                  <div class="bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-xl">
                    <div class="text-center">
                      <p class="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{{ formatMoney(rankingCorretores[0].vgv_total) }}</p>
                      <p class="text-sm text-gray-600 font-medium mt-1">{{ rankingCorretores[0].total_propostas }} propostas</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 3º Lugar -->
            <div v-if="rankingCorretores.length > 2" class="flex-1 min-w-[280px] max-w-xs">
              <div class="bg-gradient-to-br from-amber-50 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 rounded-3xl p-6 shadow-xl border-2 border-amber-300 dark:border-amber-700 relative overflow-hidden">
                <div class="text-center mb-4">
                  <div class="w-20 h-20 mx-auto bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center text-3xl font-bold text-white shadow-lg">
                    3
                  </div>
                </div>
                
                <div class="w-36 h-36 mx-auto mb-4 rounded-2xl overflow-hidden border-4 border-amber-400 shadow-xl bg-gray-200 dark:bg-gray-700 transform hover:scale-105 transition-transform duration-300">
                  <img
                    :src="rankingCorretores[2].photo_url || '/images/placeholder-avatar.png'"
                    :alt="rankingCorretores[2].nome"
                    class="w-full h-full object-cover"
                    loading="eager"
                    @error="handleImageError"
                  />
                </div>
                
                <h3 class="text-xl font-bold text-center mb-2 text-gray-900 dark:text-white">{{ rankingCorretores[2].nome }}</h3>
                <p class="text-sm text-gray-600 dark:text-gray-400 text-center mb-4 font-medium">{{ rankingCorretores[2].funcao }}</p>
                
                <div class="bg-white/80 dark:bg-amber-900/50 backdrop-blur-sm rounded-xl p-3 shadow-lg">
                  <div class="text-center">
                    <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ formatMoney(rankingCorretores[2].vgv_total) }}</p>
                    <p class="text-xs text-gray-600 dark:text-gray-400 font-medium">{{ rankingCorretores[2].total_propostas }} propostas</p>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>

      <!-- Lista Completa -->
      <div class="glass-card-light dark:glass-card rounded-2xl shadow-lg p-6 sm:p-8">
        <div class="mb-6 pb-4 border-b border-gray-200 dark:border-gray-800">
          <h3 class="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <TrophyIcon class="h-7 w-7 mr-3 text-blue-500" />
            Ranking Completo
          </h3>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-2 ml-10">Todas as posições do ranking</p>
        </div>

        <div class="space-y-3">
          <div
            v-for="(item, index) in (currentTab === 'equipes' ? rankingEquipes : rankingCorretores)"
            :key="item.id"
            :class="[
              'flex items-center p-4 sm:p-5 rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-[1.02]',
              index < 3 
                ? 'bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 border-2 shadow-md' 
                : 'glass-card-light dark:glass-card hover:border-emerald-500/50 dark:hover:border-emerald-500/50',
              index === 0 ? 'border-blue-400 shadow-blue-200 dark:shadow-blue-900/50' : '',
              index === 1 ? 'border-slate-400 shadow-slate-200 dark:shadow-slate-700' : '',
              index === 2 ? 'border-amber-400 shadow-amber-200 dark:shadow-amber-700' : ''
            ]"
          >
            <!-- Posição -->
            <div class="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center font-bold text-lg sm:text-xl mr-4 shadow-md"
              :class="{
                'bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-blue-300 dark:shadow-blue-900': index === 0,
                'bg-gradient-to-br from-slate-400 to-slate-600 text-white shadow-slate-300 dark:shadow-slate-700': index === 1,
                'bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-amber-300 dark:shadow-amber-700': index === 2,
                'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300': index > 2
              }"
            >
              {{ index + 1 }}
            </div>

            <!-- Foto -->
            <div class="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 mr-4 bg-gray-200 dark:bg-gray-700 shadow-md transform transition-transform duration-300 hover:scale-110"
              :class="{
                'border-blue-400 shadow-blue-200 dark:shadow-blue-900': index === 0,
                'border-slate-400 shadow-slate-200 dark:shadow-slate-700': index === 1,
                'border-amber-400 shadow-amber-200 dark:shadow-amber-700': index === 2,
                'border-gray-300 dark:border-gray-600': index > 2
              }"
            >
              <img
                :src="currentTab === 'equipes' ? item.photo_url : item.photo_url"
                :alt="currentTab === 'equipes' ? item.equipe_nome : item.nome"
                class="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
                @error="handleImageError"
              />
            </div>

            <!-- Info -->
            <div class="flex-1 min-w-0">
              <h4 class="text-lg font-bold text-gray-900 dark:text-white truncate">
                {{ currentTab === 'equipes' ? item.equipe_nome : item.nome }}
              </h4>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                {{ currentTab === 'equipes' ? `Gerente: ${item.gerente_nome}` : item.funcao }}
              </p>
            </div>

            <!-- Estatísticas -->
            <div class="flex-shrink-0 text-right mr-4">
              <p class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{{ formatMoney(item.vgv_total) }}</p>
              <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium">{{ item.total_propostas }} propostas</p>
            </div>

            <!-- Medalha -->
            <div v-if="index < 3" class="flex-shrink-0">
              <TrophyIcon class="w-8 h-8 sm:w-10 sm:h-10" :class="{
                'text-blue-500': index === 0,
                'text-slate-400': index === 1,
                'text-amber-500': index === 2
              }" />
            </div>
          </div>

          <div v-if="(currentTab === 'equipes' ? rankingEquipes : rankingCorretores).length === 0" class="text-center py-12">
            <p class="text-gray-500 dark:text-gray-400">Nenhum registro encontrado</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { TrophyIcon } from '@heroicons/vue/24/solid'

const formatMoney = (value) => {
  if (!value) return 'R$ 0,00'
  const num = parseFloat(value)
  return num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

const currentTab = ref('equipes')
const loading = ref(false)
const rankingEquipes = ref([])
const rankingCorretores = ref([])

const tabs = [
  { id: 'equipes', name: '🏆 Equipes' },
  { id: 'corretores', name: '👥 Corretores' }
]

const handleImageError = (event) => {
  // Fallback para placeholder baseado no tipo
  if (currentTab.value === 'equipes') {
    event.target.src = '/images/equipes/equipe_lion.avif'
  } else {
    event.target.src = '/images/corretores/corretor_beet.png'
  }
}

// Carregar ranking de equipes
const carregarRankingEquipes = async () => {
  loading.value = true
  try {
    // TODO: Substituir por chamada real à API
    // const response = await rankingService.getEquipes()
    // rankingEquipes.value = response.data
    
    // Mock data com imagens reais
    rankingEquipes.value = [
      { id: 1, equipe_nome: 'Equipe Lion', gerente_nome: 'João Silva', vgv_total: 2500000, total_propostas: 15, photo_url: '/images/equipes/equipe_lion.avif' },
      { id: 2, equipe_nome: 'Equipe Shark', gerente_nome: 'Maria Santos', vgv_total: 1800000, total_propostas: 12, photo_url: '/images/equipes/equipe_shark.avif' },
      { id: 3, equipe_nome: 'Equipe Elite', gerente_nome: 'Pedro Oliveira', vgv_total: 1500000, total_propostas: 10, photo_url: '/images/equipes/Gemini_Generated_Image_oyb3kboyb3kboyb3.png' },
    ]
  } catch (error) {
    console.error('Erro ao carregar ranking de equipes:', error)
  } finally {
    loading.value = false
  }
}

// Carregar ranking de corretores
const carregarRankingCorretores = async () => {
  loading.value = true
  try {
    // TODO: Substituir por chamada real à API
    // const response = await rankingService.getCorretores()
    // rankingCorretores.value = response.data
    
    // Mock data com imagens reais
    rankingCorretores.value = [
      { id: 1, nome: 'Arthur', funcao: 'Corretor', vgv_total: 1200000, total_propostas: 8, photo_url: '/images/corretores/corretor_arthur.jpg' },
      { id: 2, nome: 'Beet', funcao: 'Corretor', vgv_total: 950000, total_propostas: 6, photo_url: '/images/corretores/corretor_beet.png' },
      { id: 3, nome: 'Eduardo', funcao: 'Corretor', vgv_total: 800000, total_propostas: 5, photo_url: '/images/corretores/corretor_eduardo.png' },
    ]
  } catch (error) {
    console.error('Erro ao carregar ranking de corretores:', error)
  } finally {
    loading.value = false
  }
}

// Watch para mudanças de tab
watch(currentTab, (newTab) => {
  if (newTab === 'equipes') {
    carregarRankingEquipes()
  } else {
    carregarRankingCorretores()
  }
})

// Carregar dados iniciais
onMounted(() => {
  carregarRankingEquipes()
})
</script>

<style scoped>
@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.animate-shimmer {
  animation: shimmer 3s infinite;
}
</style>
