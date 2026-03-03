<template>
  <div class="w-full max-w-full overflow-x-hidden">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Anúncios</h1>
      <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Gerencie e aprove anúncios de imóveis para publicação</p>
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
          <span v-if="tab.id === 'aprovar' && anunciosPendentes.length > 0" class="ml-2 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
            {{ anunciosPendentes.length }}
          </span>
        </button>
      </nav>
    </div>

    <!-- Tab Anunciar Imóvel -->
    <div v-if="currentTab === 'anunciar'" class="space-y-6">
      <div class="glass-card-light dark:glass-card rounded-xl shadow-sm p-6">
        <h2 class="text-lg font-bold text-gray-900 dark:text-white mb-4">Anunciar Imóvel</h2>
        
        <!-- Seleção de Imóvel -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Selecione o Imóvel <span class="text-red-500">*</span>
          </label>
          <select
            v-model="imovelSelecionado"
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-brand-navy-dark dark:text-white"
          >
            <option value="">Selecione um imóvel...</option>
            <option 
              v-for="imovel in todosImoveis"
              :key="imovel.id"
              :value="imovel.id"
            >
              {{ imovel.codigo }} - {{ imovel.tipo }} - {{ imovel.endereco }}
            </option>
          </select>
        </div>

        <!-- Formulário de Anúncio -->
        <div v-if="imovelSelecionado" class="space-y-6">
          <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 class="text-base font-semibold text-gray-900 dark:text-white mb-4">Informações do Anúncio</h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Título do Anúncio <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="formAnuncio.titulo"
                  type="text"
                  placeholder="Ex: Apartamento 2 quartos no Centro"
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-brand-navy-dark dark:text-white"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Subtítulo
                </label>
                <input
                  v-model="formAnuncio.subtitulo"
                  type="text"
                  placeholder="Ex: Com varanda e vaga de garagem"
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-brand-navy-dark dark:text-white"
                />
              </div>
            </div>

            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Descrição Detalhada <span class="text-red-500">*</span>
              </label>
              <textarea
                v-model="formAnuncio.descricao"
                rows="6"
                placeholder="Descreva o imóvel com detalhes: localização, características, diferenciais..."
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-brand-navy-dark dark:text-white"
              ></textarea>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Valor de Venda
                </label>
                <input
                  v-model="formAnuncio.valor_venda"
                  type="number"
                  placeholder="0,00"
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-brand-navy-dark dark:text-white"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Valor de Aluguel
                </label>
                <input
                  v-model="formAnuncio.valor_aluguel"
                  type="number"
                  placeholder="0,00"
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-brand-navy-dark dark:text-white"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Condomínio
                </label>
                <input
                  v-model="formAnuncio.condominio"
                  type="number"
                  placeholder="0,00"
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-brand-navy-dark dark:text-white"
                />
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Quartos
                </label>
                <input
                  v-model="formAnuncio.quartos"
                  type="number"
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-brand-navy-dark dark:text-white"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Banheiros
                </label>
                <input
                  v-model="formAnuncio.banheiros"
                  type="number"
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-brand-navy-dark dark:text-white"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Vagas
                </label>
                <input
                  v-model="formAnuncio.vagas"
                  type="number"
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-brand-navy-dark dark:text-white"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Área Total (m²)
                </label>
                <input
                  v-model="formAnuncio.area_total"
                  type="number"
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-brand-navy-dark dark:text-white"
                />
              </div>
            </div>

            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Características e Diferenciais
              </label>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                <label v-for="caracteristica in caracteristicas" :key="caracteristica.id" class="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    :value="caracteristica.id"
                    v-model="formAnuncio.caracteristicas"
                    class="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span class="text-sm text-gray-700 dark:text-gray-300">{{ caracteristica.nome }}</span>
                </label>
              </div>
            </div>

            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Portais para Publicar
              </label>
              <div class="space-y-3">
                <div>
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      v-model="formAnuncio.portais"
                      value="canal_pro"
                      :disabled="!canalProConectado"
                      class="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 disabled:opacity-50"
                    />
                    <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Canal Pro</span>
                  </label>
                  <p class="text-xs text-gray-500 dark:text-gray-400 ml-6 mt-1">
                    Publica em: OLX, VivaReal e ZAP Imóveis
                  </p>
                </div>
                <div class="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
                  <div class="flex items-center gap-2">
                    <CheckIcon class="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    <span class="text-sm font-medium text-emerald-800 dark:text-emerald-300">Site HuntImob</span>
                    <span class="text-xs text-emerald-600 dark:text-emerald-400 ml-2">(Sempre ativo)</span>
                  </div>
                  <p class="text-xs text-emerald-700 dark:text-emerald-400 ml-7 mt-1">
                    Site fornecido pela HuntImob - sempre sincronizado automaticamente
                  </p>
                </div>
              </div>
            </div>

            <div class="flex justify-end gap-3">
              <button
                @click="limparFormulario"
                class="px-4 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-brand-navy-dark border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                Limpar
              </button>
              <button
                @click="solicitarAprovacao"
                :disabled="!podePublicar"
                class="btn-gradient px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Solicitar Aprovação
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tab Gerenciar Anúncios -->
    <div v-if="currentTab === 'gerenciar'" class="space-y-6">
      <div class="glass-card-light dark:glass-card rounded-xl shadow-sm p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-bold text-gray-900 dark:text-white">Anúncios Publicados</h2>
          <div class="flex items-center gap-3">
            <input
              v-model="filtroAnuncios"
              type="text"
              placeholder="Buscar anúncio..."
              class="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-brand-navy-dark dark:text-white text-sm"
            />
            <select
              v-model="filtroPortal"
              class="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-brand-navy-dark dark:text-white text-sm"
            >
              <option value="">Todos os portais</option>
              <option value="canal">Canal Pro</option>
              <option value="site">Site HuntImob</option>
            </select>
          </div>
        </div>

        <div v-if="anunciosAprovadosFiltrados.length === 0" class="text-center py-12">
          <DocumentTextIcon class="h-16 w-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Nenhum anúncio encontrado</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Nenhum anúncio foi publicado ainda
          </p>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="anuncio in anunciosAprovadosFiltrados"
            :key="anuncio.id"
            class="glass-card-light dark:glass-card rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 group"
          >
            <!-- Imagem do Imóvel -->
            <div class="relative h-48 bg-gray-200 dark:bg-gray-800 overflow-hidden">
              <img
                v-if="getImagemAnuncio(anuncio.imovel_id) && !imageErrors[anuncio.id]"
                :src="getImagemAnuncio(anuncio.imovel_id)"
                :alt="anuncio.titulo"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
                decoding="async"
                @error="() => imageErrors[anuncio.id] = true"
              />
              <div v-else class="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
                <BuildingOfficeIcon class="w-16 h-16 text-gray-400 dark:text-gray-600" />
              </div>
              
              <!-- Badge de Status -->
              <div class="absolute top-3 right-3">
                <span 
                  class="px-3 py-1 rounded-full text-xs font-medium shadow-md bg-green-500 text-white"
                >
                  {{ anuncio.status }}
                </span>
              </div>
            </div>

            <!-- Conteúdo do Card -->
            <div class="p-5">
              <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                {{ anuncio.titulo }}
              </h3>
              
              <div class="space-y-2 mb-4">
                <p class="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                  <span class="font-medium">{{ anuncio.imovel_codigo }}</span>
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-500 line-clamp-1">
                  {{ anuncio.imovel_endereco }}
                </p>
              </div>

              <!-- Portais -->
              <div class="mb-4">
                <p class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Publicado em:</p>
                <div class="flex flex-wrap gap-2">
                  <span
                    v-for="(portal, idx) in anuncio.portais"
                    :key="idx"
                    class="px-2 py-1 text-xs rounded-md"
                    :class="portal.includes('Canal Pro') 
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' 
                      : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'"
                  >
                    {{ portal }}
                  </span>
                </div>
              </div>

              <!-- Data de Publicação -->
              <p class="text-xs text-gray-500 dark:text-gray-400 mb-4">
                Publicado em: {{ formatDate(anuncio.data_publicacao) }}
              </p>

              <!-- Ações -->
              <div class="flex items-center gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  @click="editarAnuncio(anuncio)"
                  class="flex-1 px-3 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                >
                  Editar
                </button>
                <button
                  @click="removerAnuncio(anuncio.id)"
                  class="flex-1 px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  Remover
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tab Aprovar Anúncios -->
    <div v-if="currentTab === 'aprovar'" class="space-y-6">
      <div class="glass-card-light dark:glass-card rounded-xl shadow-sm p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-bold text-gray-900 dark:text-white">Anúncios Pendentes de Aprovação</h2>
          <div class="flex items-center gap-3">
            <input
              v-model="filtroPendentes"
              type="text"
              placeholder="Buscar anúncio..."
              class="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-brand-navy-dark dark:text-white text-sm"
            />
            <select
              v-model="filtroCorretor"
              class="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-brand-navy-dark dark:text-white text-sm"
            >
              <option value="">Todos os corretores</option>
              <option 
                v-for="corretor in corretores"
                :key="corretor.id"
                :value="corretor.id"
              >
                {{ corretor.nome }}
              </option>
            </select>
          </div>
        </div>

        <div v-if="anunciosPendentesFiltrados.length === 0" class="text-center py-12">
          <CheckCircleIcon class="h-16 w-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Nenhum anúncio pendente</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Todos os anúncios foram aprovados ou não há anúncios aguardando aprovação
          </p>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="anuncio in anunciosPendentesFiltrados"
            :key="anuncio.id"
            class="glass-card-light dark:glass-card rounded-xl shadow-sm border-2 border-amber-200/50 dark:border-amber-800/50 overflow-hidden hover:shadow-lg transition-all duration-300 group"
          >
            <!-- Imagem do Imóvel -->
            <div class="relative h-48 bg-gray-200 dark:bg-gray-800 overflow-hidden">
              <img
                v-if="getImagemAnuncio(anuncio.imovel_id) && !imageErrors[anuncio.id]"
                :src="getImagemAnuncio(anuncio.imovel_id)"
                :alt="anuncio.titulo"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
                decoding="async"
                @error="() => imageErrors[anuncio.id] = true"
              />
              <div v-else class="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
                <BuildingOfficeIcon class="w-16 h-16 text-gray-400 dark:text-gray-600" />
              </div>
              
              <!-- Badge de Status -->
              <div class="absolute top-3 right-3">
                <span class="px-3 py-1 rounded-full text-xs font-medium shadow-md bg-amber-500 text-white">
                  Pendente
                </span>
              </div>
            </div>

            <!-- Conteúdo do Card -->
            <div class="p-5">
              <div class="mb-2">
                <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  Solicitado por: <span class="font-medium text-gray-700 dark:text-gray-300">{{ anuncio.corretor_nome }}</span>
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  Em: {{ formatDate(anuncio.data_solicitacao) }}
                </p>
              </div>

              <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                {{ anuncio.titulo }}
              </h3>
              
              <div class="space-y-2 mb-4">
                <p class="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                  <span class="font-medium">{{ anuncio.imovel_codigo }}</span>
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-500 line-clamp-1">
                  {{ anuncio.imovel_endereco }}
                </p>
              </div>

              <!-- Portais Solicitados -->
              <div class="mb-4">
                <p class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Portais solicitados:</p>
                <div class="flex flex-wrap gap-2">
                  <span
                    v-for="(portal, idx) in anuncio.portais"
                    :key="idx"
                    class="px-2 py-1 text-xs rounded-md"
                    :class="portal.includes('Canal Pro') 
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' 
                      : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'"
                  >
                    {{ portal }}
                  </span>
                </div>
              </div>

              <!-- Ações -->
              <div class="flex items-center gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  @click="rejeitarAnuncio(anuncio.id)"
                  class="flex-1 px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  Rejeitar
                </button>
                <button
                  @click="aprovarAnuncio(anuncio.id)"
                  class="flex-1 px-3 py-2 text-sm font-medium text-white bg-green-500 hover:bg-green-600 rounded-lg transition-colors"
                >
                  Aprovar
                </button>
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
  DocumentTextIcon,
  CheckIcon,
  BuildingOfficeIcon,
  CheckCircleIcon
} from '@heroicons/vue/24/outline'

const currentTab = ref('anunciar')

const tabs = [
  { id: 'anunciar', name: 'Anunciar Imóvel', icon: DocumentTextIcon },
  { id: 'gerenciar', name: 'Gerenciar Anúncios', icon: DocumentTextIcon },
  { id: 'aprovar', name: 'Aprovar Anúncios', icon: CheckCircleIcon }
]

// Verificar status do Canal Pro (mock - em produção viria de uma store)
const canalProConectado = ref(false)

// Array de imagens dos imóveis
const imagensImoveis = [
  '/images/imoveis/imovel1.jpg',
  '/images/imoveis/imovel2.jpg',
  '/images/imoveis/imovel3.jpg',
  '/images/imoveis/imovel4.jpg',
  '/images/imoveis/imovel5.jpg',
  '/images/imoveis/imovel6.jpg',
  '/images/imoveis/imovel7.jpg',
  '/images/imoveis/imovel8.jpg',
  '/images/imoveis/imovel9.jpg',
  '/images/imoveis/imovel10.jpg',
  '/images/imoveis/imovel11.jpg',
  '/images/imoveis/imovel12.jpg',
  '/images/imoveis/imovel13.jpg',
  '/images/imoveis/imovel14.jpg',
  '/images/imoveis/imovel15.jpg',
  '/images/imoveis/imovel16.jpg',
  '/images/imoveis/imovel17.jpg',
  '/images/imoveis/imovel18.jpg',
  '/images/imoveis/imovel19.jpg',
  '/images/imoveis/imovel20.jpg',
  '/images/imoveis/imovel21.jpg',
  '/images/imoveis/imovel22.jpg',
  '/images/imoveis/imovel23.jpg',
  '/images/imoveis/imovel24.jpg',
]

// Dados para anúncios
const imovelSelecionado = ref('')
const todosImoveis = ref([
  { id: 1, codigo: 'APT-001', tipo: 'Apartamento', endereco: 'Rua das Flores, 123 - Centro', preco: 350000, imagem: imagensImoveis[0] || '' },
  { id: 2, codigo: 'CASA-002', tipo: 'Casa', endereco: 'Av. Principal, 456 - Jardim', preco: 550000, imagem: imagensImoveis[1] || '' },
  { id: 3, codigo: 'APT-003', tipo: 'Apartamento', endereco: 'Rua Nova, 789 - Bairro Novo', preco: 280000, imagem: imagensImoveis[2] || '' },
  { id: 4, codigo: 'APT-004', tipo: 'Apartamento', endereco: 'Rua das Palmeiras, 100 - Centro', preco: 420000, imagem: imagensImoveis[3] || '' },
  { id: 5, codigo: 'CASA-005', tipo: 'Casa', endereco: 'Av. dos Bandeirantes, 200 - Jardim América', preco: 680000, imagem: imagensImoveis[4] || '' },
  { id: 6, codigo: 'TER-006', tipo: 'Terreno', endereco: 'Rua Verde, 50 - Chácara', preco: 250000, imagem: imagensImoveis[5] || '' },
  { id: 7, codigo: 'APT-007', tipo: 'Apartamento', endereco: 'Rua das Acácias, 300 - Centro', preco: 380000, imagem: imagensImoveis[6] || '' },
  { id: 8, codigo: 'CASA-008', tipo: 'Casa', endereco: 'Av. Central, 150 - Vila Nova', preco: 520000, imagem: imagensImoveis[7] || '' },
  { id: 9, codigo: 'COM-009', tipo: 'Comercial', endereco: 'Rua Comercial, 80 - Centro', preco: 450000, imagem: imagensImoveis[8] || '' },
])

const formAnuncio = reactive({
  titulo: '',
  subtitulo: '',
  descricao: '',
  valor_venda: '',
  valor_aluguel: '',
  condominio: '',
  quartos: '',
  banheiros: '',
  vagas: '',
  area_total: '',
  caracteristicas: [],
  portais: []
})

const caracteristicas = ref([
  { id: 'piscina', nome: 'Piscina' },
  { id: 'garagem', nome: 'Garagem' },
  { id: 'elevador', nome: 'Elevador' },
  { id: 'portaria', nome: 'Portaria 24h' },
  { id: 'academia', nome: 'Academia' },
  { id: 'playground', nome: 'Playground' },
  { id: 'churrasqueira', nome: 'Churrasqueira' },
  { id: 'area_lazer', nome: 'Área de Lazer' },
  { id: 'seguranca', nome: 'Segurança' },
  { id: 'varanda', nome: 'Varanda' },
  { id: 'sacada', nome: 'Sacada' },
  { id: 'vista', nome: 'Vista' }
])

// Anúncios pendentes de aprovação
const anunciosPendentes = ref([
  {
    id: 1,
    imovel_id: 1,
    imovel_codigo: 'APT-001',
    imovel_endereco: 'Rua das Flores, 123 - Centro',
    titulo: 'Apartamento 2 quartos no Centro',
    status: 'Pendente',
    portais: ['Canal Pro (OLX, VivaReal, ZAP)', 'Site HuntImob'],
    data_solicitacao: '2024-03-20',
    corretor_id: 1,
    corretor_nome: 'Carlos Mendes'
  },
  {
    id: 2,
    imovel_id: 2,
    imovel_codigo: 'CASA-002',
    imovel_endereco: 'Av. Principal, 456 - Jardim',
    titulo: 'Casa com quintal e área de lazer',
    status: 'Pendente',
    portais: ['Site HuntImob'],
    data_solicitacao: '2024-03-21',
    corretor_id: 2,
    corretor_nome: 'Ana Costa'
  }
])

// Anúncios aprovados e publicados
const anunciosAprovados = ref([
  {
    id: 3,
    imovel_id: 3,
    imovel_codigo: 'APT-003',
    imovel_endereco: 'Rua Nova, 789 - Bairro Novo',
    titulo: 'Apartamento compacto e moderno',
    status: 'Ativo',
    portais: ['Canal Pro (OLX, VivaReal, ZAP)', 'Site HuntImob'],
    data_publicacao: '2024-03-17'
  }
])

const corretores = ref([
  { id: 1, nome: 'Carlos Mendes' },
  { id: 2, nome: 'Ana Costa' },
  { id: 3, nome: 'Roberto Alves' },
  { id: 4, nome: 'Mariana Silva' }
])

const filtroAnuncios = ref('')
const filtroPortal = ref('')
const filtroPendentes = ref('')
const filtroCorretor = ref('')
const imageErrors = ref({})

const podePublicar = computed(() => {
  const temPortais = formAnuncio.portais.length > 0 || true // Site sempre disponível
  return imovelSelecionado.value && 
         formAnuncio.titulo && 
         formAnuncio.descricao && 
         temPortais
})

const anunciosPendentesFiltrados = computed(() => {
  let filtered = [...anunciosPendentes.value]
  
  if (filtroPendentes.value) {
    const search = filtroPendentes.value.toLowerCase()
    filtered = filtered.filter(a => 
      a.titulo.toLowerCase().includes(search) ||
      a.imovel_codigo.toLowerCase().includes(search) ||
      a.imovel_endereco.toLowerCase().includes(search) ||
      a.corretor_nome.toLowerCase().includes(search)
    )
  }
  
  if (filtroCorretor.value) {
    filtered = filtered.filter(a => a.corretor_id === parseInt(filtroCorretor.value))
  }
  
  return filtered
})

const anunciosAprovadosFiltrados = computed(() => {
  let filtered = [...anunciosAprovados.value]
  
  if (filtroAnuncios.value) {
    const search = filtroAnuncios.value.toLowerCase()
    filtered = filtered.filter(a => 
      a.titulo.toLowerCase().includes(search) ||
      a.imovel_codigo.toLowerCase().includes(search) ||
      a.imovel_endereco.toLowerCase().includes(search)
    )
  }
  
  if (filtroPortal.value) {
    if (filtroPortal.value === 'canal') {
      filtered = filtered.filter(a => 
        a.portais.some(p => p.toLowerCase().includes('canal'))
      )
    } else if (filtroPortal.value === 'site') {
      filtered = filtered.filter(a => 
        a.portais.some(p => p.toLowerCase().includes('site'))
      )
    }
  }
  
  return filtered
})

const formatDate = (dateString) => {
  if (!dateString) return ''
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR')
  } catch {
    return dateString
  }
}

const getImagemAnuncio = (imovelId) => {
  const imovel = todosImoveis.value.find(i => i.id === imovelId)
  return imovel?.imagem || ''
}

const solicitarAprovacao = () => {
  if (!podePublicar.value) {
    ElMessage.warning('Preencha todos os campos obrigatórios')
    return
  }
  
  const imovel = todosImoveis.value.find(i => i.id === parseInt(imovelSelecionado.value))
  if (!imovel) return
  
  // Mock: obter corretor atual (em produção viria de uma store de autenticação)
  const corretorAtual = corretores.value[0]
  
  const portaisPublicados = ['Site HuntImob']
  if (formAnuncio.portais.includes('canal_pro')) {
    portaisPublicados.push('Canal Pro (OLX, VivaReal, ZAP)')
  }
  
  const novoAnuncio = {
    id: anunciosPendentes.value.length + anunciosAprovados.value.length + 1,
    imovel_id: imovel.id,
    imovel_codigo: imovel.codigo,
    imovel_endereco: imovel.endereco,
    titulo: formAnuncio.titulo,
    status: 'Pendente',
    portais: portaisPublicados,
    data_solicitacao: new Date().toISOString().split('T')[0],
    corretor_id: corretorAtual.id,
    corretor_nome: corretorAtual.nome
  }
  
  anunciosPendentes.value.push(novoAnuncio)
  ElMessage.success('Anúncio enviado para aprovação!')
  limparFormulario()
}

const aprovarAnuncio = (id) => {
  ElMessageBox.confirm(
    'Tem certeza que deseja aprovar este anúncio? Ele será publicado nos portais selecionados.',
    'Aprovar Anúncio',
    {
      confirmButtonText: 'Aprovar',
      cancelButtonText: 'Cancelar',
      type: 'success'
    }
  ).then(() => {
    const index = anunciosPendentes.value.findIndex(a => a.id === id)
    if (index !== -1) {
      const anuncio = anunciosPendentes.value[index]
      anunciosPendentes.value.splice(index, 1)
      
      // Mover para aprovados
      anunciosAprovados.value.push({
        ...anuncio,
        status: 'Ativo',
        data_publicacao: new Date().toISOString().split('T')[0]
      })
      
      ElMessage.success('Anúncio aprovado e publicado com sucesso!')
    }
  }).catch(() => {})
}

const rejeitarAnuncio = (id) => {
  ElMessageBox.confirm(
    'Tem certeza que deseja rejeitar este anúncio? O corretor será notificado.',
    'Rejeitar Anúncio',
    {
      confirmButtonText: 'Rejeitar',
      cancelButtonText: 'Cancelar',
      type: 'warning',
      inputPlaceholder: 'Motivo da rejeição (opcional)',
      showInput: true
    }
  ).then(({ value }) => {
    const index = anunciosPendentes.value.findIndex(a => a.id === id)
    if (index !== -1) {
      anunciosPendentes.value.splice(index, 1)
      ElMessage.success('Anúncio rejeitado. O corretor será notificado.')
    }
  }).catch(() => {})
}

const limparFormulario = () => {
  imovelSelecionado.value = ''
  formAnuncio.titulo = ''
  formAnuncio.subtitulo = ''
  formAnuncio.descricao = ''
  formAnuncio.valor_venda = ''
  formAnuncio.valor_aluguel = ''
  formAnuncio.condominio = ''
  formAnuncio.quartos = ''
  formAnuncio.banheiros = ''
  formAnuncio.vagas = ''
  formAnuncio.area_total = ''
  formAnuncio.caracteristicas = []
  formAnuncio.portais = []
}

const editarAnuncio = (anuncio) => {
  currentTab.value = 'anunciar'
  imovelSelecionado.value = anuncio.imovel_id.toString()
  
  const anuncioCompleto = anunciosAprovados.value.find(a => a.id === anuncio.id)
  if (anuncioCompleto) {
    formAnuncio.titulo = anuncioCompleto.titulo || ''
    formAnuncio.portais = anuncioCompleto.portais
      .filter(p => p.includes('Canal Pro'))
      .map(() => 'canal_pro')
  }
  
  ElMessage.info('Carregando dados do anúncio...')
}

const removerAnuncio = (id) => {
  ElMessageBox.confirm(
    'Tem certeza que deseja remover este anúncio? Ele será removido de todos os portais.',
    'Remover Anúncio',
    {
      confirmButtonText: 'Remover',
      cancelButtonText: 'Cancelar',
      type: 'warning'
    }
  ).then(() => {
    const index = anunciosAprovados.value.findIndex(a => a.id === id)
    if (index !== -1) {
      anunciosAprovados.value.splice(index, 1)
      ElMessage.success('Anúncio removido com sucesso')
    }
  }).catch(() => {})
}

// Preencher dados do imóvel quando selecionado
watch(() => imovelSelecionado.value, (newValue) => {
  if (newValue) {
    const imovel = todosImoveis.value.find(i => i.id === parseInt(newValue))
    if (imovel) {
      if (!formAnuncio.titulo) {
        formAnuncio.titulo = `${imovel.tipo} - ${imovel.codigo}`
      }
      if (!formAnuncio.subtitulo) {
        formAnuncio.subtitulo = imovel.endereco
      }
      if (imovel.preco && !formAnuncio.valor_venda) {
        formAnuncio.valor_venda = imovel.preco
      }
    }
  }
})
</script>
