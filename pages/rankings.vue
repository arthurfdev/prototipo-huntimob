<template>
  <div class="w-full">
    <div class="mb-6">
      <div class="flex items-center justify-between flex-wrap gap-4">
        <div class="flex flex-col gap-2 mb-12">
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Ranking de Vendas</h1>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Competição de Equipes e Corretores</p>
        </div>
        
        <!-- Tabs -->
        <div class="flex gap-3">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="currentTab = tab.id"
            :class="[
              'px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center gap-2',
              currentTab === tab.id
                ? 'btn-gradient shadow-lg scale-105'
                : 'glass-card-light dark:glass-card border border-white/10 hover:bg-white/10'
            ]"
          >
            <component :is="tab.icon === 'TrophyIcon' ? TrophyIcon : UserGroupIcon" class="h-5 w-5 stroke-2" />
            {{ tab.name }}
          </button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center min-h-[400px]">
      <div class="text-center glass-card-light dark:glass-card rounded-xl p-8 border border-white/10">
        <div class="animate-spin rounded-full h-16 w-16 border-b-4 border-cyan-500 border-t-transparent mx-auto mb-4"></div>
        <p class="text-gray-500 dark:text-gray-400">Carregando ranking...</p>
      </div>
    </div>

    <!-- Content -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-5 gap-6">
      <!-- Painel Esquerdo - Top 3 -->
      <div class="lg:col-span-3 space-y-6">
        <!-- Top 3 Pódio -->
        <div>
          <div class="flex items-end justify-center gap-4 flex-wrap">
          <!-- 2º Lugar -->
          <div v-if="currentTab === 'equipes' && rankingEquipes.length > 1" class="flex flex-col items-center" style="width: 280px;">
            <div class="glass-card-light dark:glass-card rounded-3xl p-6 shadow-xl border border-white/10 relative overflow-hidden hover:shadow-2xl transition-all duration-300 mb-2">
              <div class="w-36 h-36 mx-auto mb-4 rounded-2xl overflow-hidden border-4 border-slate-400/50 shadow-xl bg-gray-200 dark:bg-gray-700 transform hover:scale-105 transition-transform duration-300">
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
              
              <div class="glass-card-light dark:glass-card rounded-xl p-4 border border-white/10">
                <div class="text-center">
                  <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ formatMoney(rankingEquipes[1].vgv_total) }}</p>
                  <p class="text-xs text-gray-600 dark:text-gray-400 font-medium mt-1">{{ rankingEquipes[1].total_propostas }} vendas</p>
                </div>
              </div>
            </div>
            <!-- Pódio 2º lugar -->
            <div class="glass-card-light dark:glass-card rounded-t-2xl border border-white/10 w-full" style="height: 80px;">
              <div class="h-full flex items-center justify-center">
                <span class="text-2xl font-bold text-gray-700 dark:text-gray-300">2º</span>
              </div>
            </div>
          </div>

          <!-- 1º Lugar -->
          <div v-if="currentTab === 'equipes' && rankingEquipes.length > 0" class="flex flex-col items-center transform scale-105 z-10" style="width: 320px;">
            <div class="glass-card-light dark:glass-card rounded-3xl p-8 shadow-2xl border-2 border-cyan-400/50 relative overflow-hidden hover:shadow-cyan-500/20 transition-all duration-300 mb-2">
              <!-- Efeito de brilho animado -->
              <div class="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent animate-shimmer"></div>
              
              <div class="relative z-10">
                <div class="w-44 h-44 mx-auto mb-4 rounded-2xl overflow-hidden border-4 border-cyan-400/50 shadow-2xl bg-gray-200 dark:bg-gray-700 transform hover:scale-105 transition-transform duration-300">
                  <img
                    :src="rankingEquipes[0].photo_url || '/images/placeholder-avatar.png'"
                    :alt="rankingEquipes[0].equipe_nome"
                    class="w-full h-full object-cover"
                    loading="eager"
                    @error="handleImageError"
                  />
                </div>
                
                <h3 class="text-2xl font-bold text-center mb-2 text-gray-900 dark:text-white">{{ rankingEquipes[0].equipe_nome }}</h3>
                <p class="text-sm text-gray-600 dark:text-gray-400 text-center mb-4 font-medium">Gerente: {{ rankingEquipes[0].gerente_nome }}</p>
                
                <div class="glass-card-light dark:glass-card rounded-xl p-4 border border-white/10">
                  <div class="text-center">
                    <p class="text-3xl font-bold bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">{{ formatMoney(rankingEquipes[0].vgv_total) }}</p>
                    <p class="text-sm text-gray-600 dark:text-gray-400 font-medium mt-1">{{ rankingEquipes[0].total_propostas }} vendas</p>
                  </div>
                </div>
              </div>
            </div>
            <!-- Pódio 1º lugar -->
            <div class="glass-card-light dark:glass-card rounded-t-2xl border-2 border-cyan-400/50 w-full" style="height: 120px;">
              <div class="h-full flex items-center justify-center">
                <span class="text-3xl font-bold bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">1º</span>
              </div>
            </div>
          </div>

          <!-- 3º Lugar -->
          <div v-if="currentTab === 'equipes' && rankingEquipes.length > 2" class="flex flex-col items-center" style="width: 280px;">
            <div class="glass-card-light dark:glass-card rounded-3xl p-6 shadow-xl border border-white/10 relative overflow-hidden hover:shadow-2xl transition-all duration-300 mb-2">
              <div class="w-36 h-36 mx-auto mb-4 rounded-2xl overflow-hidden border-4 border-amber-400/50 shadow-xl bg-gray-200 dark:bg-gray-700 transform hover:scale-105 transition-transform duration-300">
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
              
              <div class="glass-card-light dark:glass-card rounded-xl p-4 border border-white/10">
                <div class="text-center">
                  <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ formatMoney(rankingEquipes[2].vgv_total) }}</p>
                  <p class="text-xs text-gray-600 dark:text-gray-400 font-medium mt-1">{{ rankingEquipes[2].total_propostas }} vendas</p>
                </div>
              </div>
            </div>
            <!-- Pódio 3º lugar -->
            <div class="glass-card-light dark:glass-card rounded-t-2xl border border-white/10 w-full" style="height: 60px;">
              <div class="h-full flex items-center justify-center">
                <span class="text-xl font-bold text-gray-700 dark:text-gray-300">3º</span>
              </div>
            </div>
          </div>

          <!-- Ranking de Corretores - Top 3 -->
          <template v-if="currentTab === 'corretores'">
            <!-- 2º Lugar -->
            <div v-if="rankingCorretores.length > 1" class="flex flex-col items-center" style="width: 280px;">
              <div class="glass-card-light dark:glass-card rounded-3xl p-6 shadow-xl border border-white/10 relative overflow-hidden hover:shadow-2xl transition-all duration-300 mb-2">
                <div class="w-36 h-36 mx-auto mb-4 rounded-2xl overflow-hidden border-4 border-slate-400/50 shadow-xl bg-gray-200 dark:bg-gray-700 transform hover:scale-105 transition-transform duration-300">
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
                
                <div class="glass-card-light dark:glass-card rounded-xl p-4 border border-white/10">
                  <div class="text-center">
                    <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ formatMoney(rankingCorretores[1].vgv_total) }}</p>
                    <p class="text-xs text-gray-600 dark:text-gray-400 font-medium mt-1">{{ rankingCorretores[1].total_propostas }} vendas</p>
                  </div>
                </div>
              </div>
              <!-- Pódio 2º lugar -->
              <div class="glass-card-light dark:glass-card rounded-t-2xl border border-white/10 w-full" style="height: 80px;">
                <div class="h-full flex items-center justify-center">
                  <span class="text-2xl font-bold text-gray-700 dark:text-gray-300">2º</span>
                </div>
              </div>
            </div>

            <!-- 1º Lugar -->
            <div v-if="rankingCorretores.length > 0" class="flex flex-col items-center transform scale-105 z-10" style="width: 320px;">
              <div class="glass-card-light dark:glass-card rounded-3xl p-8 shadow-2xl border-2 border-cyan-400/50 relative overflow-hidden hover:shadow-cyan-500/20 transition-all duration-300 mb-2">
                <!-- Efeito de brilho animado -->
                <div class="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent animate-shimmer"></div>
                
                <div class="relative z-10">
                  <div class="w-44 h-44 mx-auto mb-4 rounded-2xl overflow-hidden border-4 border-cyan-400/50 shadow-2xl bg-gray-200 dark:bg-gray-700 transform hover:scale-105 transition-transform duration-300">
                    <img
                      :src="rankingCorretores[0].photo_url || '/images/placeholder-avatar.png'"
                      :alt="rankingCorretores[0].nome"
                      class="w-full h-full object-cover"
                      loading="eager"
                      @error="handleImageError"
                    />
                  </div>
                  
                  <h3 class="text-2xl font-bold text-center mb-2 text-gray-900 dark:text-white">{{ rankingCorretores[0].nome }}</h3>
                  <p class="text-sm text-gray-600 dark:text-gray-400 text-center mb-4 font-medium">{{ rankingCorretores[0].funcao }}</p>
                  
                  <div class="glass-card-light dark:glass-card rounded-xl p-4 border border-white/10">
                    <div class="text-center">
                      <p class="text-3xl font-bold bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">{{ formatMoney(rankingCorretores[0].vgv_total) }}</p>
                      <p class="text-sm text-gray-600 dark:text-gray-400 font-medium mt-1">{{ rankingCorretores[0].total_propostas }} vendas</p>
                    </div>
                  </div>
                </div>
              </div>
              <!-- Pódio 1º lugar -->
              <div class="glass-card-light dark:glass-card rounded-t-2xl border-2 border-cyan-400/50 w-full" style="height: 120px;">
                <div class="h-full flex items-center justify-center">
                  <span class="text-3xl font-bold bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">1º</span>
                </div>
              </div>
            </div>

            <!-- 3º Lugar -->
            <div v-if="rankingCorretores.length > 2" class="flex flex-col items-center" style="width: 280px;">
              <div class="glass-card-light dark:glass-card rounded-3xl p-6 shadow-xl border border-white/10 relative overflow-hidden hover:shadow-2xl transition-all duration-300 mb-2">
                <div class="w-36 h-36 mx-auto mb-4 rounded-2xl overflow-hidden border-4 border-amber-400/50 shadow-xl bg-gray-200 dark:bg-gray-700 transform hover:scale-105 transition-transform duration-300">
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
                
                <div class="glass-card-light dark:glass-card rounded-xl p-4 border border-white/10">
                  <div class="text-center">
                    <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ formatMoney(rankingCorretores[2].vgv_total) }}</p>
                    <p class="text-xs text-gray-600 dark:text-gray-400 font-medium mt-1">{{ rankingCorretores[2].total_propostas }} vendas</p>
                  </div>
                </div>
              </div>
              <!-- Pódio 3º lugar -->
              <div class="glass-card-light dark:glass-card rounded-t-2xl border border-white/10 w-full" style="height: 60px;">
                <div class="h-full flex items-center justify-center">
                  <span class="text-xl font-bold text-gray-700 dark:text-gray-300">3º</span>
                </div>
              </div>
            </div>
          </template>
          </div>
        </div>
      </div>

      <!-- Painel Direito - Lista Completa -->
      <div class="lg:col-span-2">
        <div class="glass-card-light dark:glass-card rounded-xl shadow-lg p-6 border border-white/10 sticky top-6 max-h-[calc(100vh-8rem)] overflow-y-auto">
        <div class="space-y-3">
          <div
            v-for="(item, index) in (currentTab === 'equipes' ? rankingEquipes : rankingCorretores)"
            :key="item.id"
            :class="[
              'flex items-center p-3 rounded-lg transition-all duration-300 hover:bg-white/5',
              'glass-card-light dark:glass-card border border-white/10',
              index === 0 ? 'border-cyan-400/50' : '',
              index === 1 ? 'border-slate-400/50' : '',
              index === 2 ? 'border-amber-400/50' : ''
            ]"
          >
            <!-- Posição -->
            <div class="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center font-bold text-base mr-3"
              :class="{
                'icon-glass': index < 3,
                'glass-card-light dark:glass-card border border-white/10 text-gray-700 dark:text-gray-300': index >= 3
              }"
            >
              <TrophyIcon v-if="index === 0" class="w-5 h-5 text-amber-500 dark:text-amber-400 relative z-10 stroke-2" />
              <TrophyIcon v-else-if="index === 1" class="w-5 h-5 text-gray-400 dark:text-gray-500 relative z-10 stroke-2" />
              <span v-else :class="index < 3 ? 'relative z-10 text-white' : ''">{{ index + 1 }}</span>
            </div>

            <!-- Foto -->
            <div class="flex-shrink-0 w-12 h-12 rounded-full overflow-hidden border-2 mr-3 bg-gray-200 dark:bg-gray-700"
              :class="{
                'border-cyan-400/50': index === 0,
                'border-slate-400/50': index === 1,
                'border-amber-400/50': index === 2,
                'border-white/10': index > 2
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
              <h4 class="text-sm font-bold text-gray-900 dark:text-white truncate">
                {{ currentTab === 'equipes' ? item.equipe_nome : item.nome }}
              </h4>
              <div class="text-xs text-gray-500 dark:text-gray-400 space-y-0.5">
                <p>Metas: {{ item.meta || 20 }} Vendas: {{ item.vendas || item.total_propostas }}</p>
                <p>Faltam: {{ Math.max(0, (item.meta || 20) - (item.vendas || item.total_propostas)) }}</p>
                <p class="font-semibold text-cyan-500 dark:text-cyan-400">{{ Math.round(((item.vendas || item.total_propostas) / (item.meta || 20)) * 100) }}%</p>
              </div>
            </div>
          </div>

          <div v-if="(currentTab === 'equipes' ? rankingEquipes : rankingCorretores).length === 0" class="text-center py-12 glass-card-light dark:glass-card rounded-xl p-8 border border-white/10">
            <TrophyIcon class="h-16 w-16 mx-auto text-gray-300 dark:text-gray-600 mb-4 stroke-2" />
            <p class="text-gray-500 dark:text-gray-400 font-medium">Nenhum registro encontrado</p>
          </div>
        </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { TrophyIcon, UserGroupIcon, StarIcon } from '@heroicons/vue/24/outline'

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
  { id: 'equipes', name: 'Equipes', icon: 'TrophyIcon' },
  { id: 'corretores', name: 'Corretores', icon: 'UserGroupIcon' }
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
      { id: 1, equipe_nome: 'Equipe Lion', gerente_nome: 'João Silva', vgv_total: 2500000, total_propostas: 15, meta: 20, vendas: 15, photo_url: '/images/equipes/equipe_lion.avif' },
      { id: 2, equipe_nome: 'Equipe Shark', gerente_nome: 'Maria Santos', vgv_total: 1800000, total_propostas: 12, meta: 20, vendas: 12, photo_url: '/images/equipes/equipe_shark.avif' },
      { id: 3, equipe_nome: 'Equipe Elite', gerente_nome: 'Pedro Oliveira', vgv_total: 1500000, total_propostas: 10, meta: 20, vendas: 10, photo_url: '/images/equipes/Gemini_Generated_Image_oyb3kboyb3kboyb3.png' },
      { id: 4, equipe_nome: 'Equipe Alpha', gerente_nome: 'Ana Costa', vgv_total: 1200000, total_propostas: 8, meta: 20, vendas: 8, photo_url: '/images/equipes/equipe_lion.avif' },
      { id: 5, equipe_nome: 'Equipe Beta', gerente_nome: 'Carlos Mendes', vgv_total: 1000000, total_propostas: 7, meta: 20, vendas: 7, photo_url: '/images/equipes/equipe_shark.avif' },
      { id: 6, equipe_nome: 'Equipe Gamma', gerente_nome: 'Fernanda Lima', vgv_total: 900000, total_propostas: 6, meta: 20, vendas: 6, photo_url: '/images/equipes/Gemini_Generated_Image_oyb3kboyb3kboyb3.png' },
      { id: 7, equipe_nome: 'Equipe Delta', gerente_nome: 'Lucas Almeida', vgv_total: 800000, total_propostas: 5, meta: 20, vendas: 5, photo_url: '/images/equipes/equipe_lion.avif' },
      { id: 8, equipe_nome: 'Equipe Omega', gerente_nome: 'Juliana Rocha', vgv_total: 700000, total_propostas: 4, meta: 20, vendas: 4, photo_url: '/images/equipes/equipe_shark.avif' },
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
      { id: 1, nome: 'Arthur', funcao: 'Corretor', vgv_total: 1200000, total_propostas: 8, meta: 20, vendas: 8, photo_url: '/images/corretores/corretor_arthur.jpg' },
      { id: 2, nome: 'Beet', funcao: 'Corretor', vgv_total: 950000, total_propostas: 6, meta: 20, vendas: 6, photo_url: '/images/corretores/corretor_beet.png' },
      { id: 3, nome: 'Eduardo', funcao: 'Corretor', vgv_total: 800000, total_propostas: 5, meta: 20, vendas: 5, photo_url: '/images/corretores/corretor_eduardo.png' },
      { id: 4, nome: 'Thaísso Necamurra', funcao: 'Corretor', vgv_total: 700000, total_propostas: 4, meta: 20, vendas: 10, photo_url: '/images/corretores/corretor_arthur.jpg' },
      { id: 5, nome: 'Maria Silva', funcao: 'Corretor', vgv_total: 600000, total_propostas: 3, meta: 20, vendas: 3, photo_url: '/images/corretores/corretor_beet.png' },
      { id: 6, nome: 'Pedro Santos', funcao: 'Corretor', vgv_total: 500000, total_propostas: 2, meta: 20, vendas: 2, photo_url: '/images/corretores/corretor_eduardo.png' },
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
