<template>
  <div class="w-full max-w-full overflow-x-hidden">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Gestão de Imóveis</h1>
      <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Gerencie lançamentos, captações e visualize métricas importantes</p>
    </div>

    <!-- Dashboard de Métricas -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div class="glass-card-light dark:glass-card rounded-xl shadow-sm p-5">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Total de Imóveis</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">{{ totalImoveis }}</p>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ imoveisDisponiveis }} disponíveis</p>
          </div>
          <div class="icon-glass w-12 h-12 rounded-lg flex items-center justify-center">
            <BuildingOfficeIcon class="w-6 h-6 text-cyan-500 dark:text-cyan-400 relative z-10 stroke-2" />
          </div>
        </div>
      </div>

      <div class="glass-card-light dark:glass-card rounded-xl shadow-sm p-5">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">VGV Total</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">{{ formatPrice(vgvTotal) }}</p>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Valor geral de vendas</p>
          </div>
          <div class="icon-glass w-12 h-12 rounded-lg flex items-center justify-center">
            <CurrencyDollarIcon class="w-6 h-6 text-emerald-500 dark:text-emerald-400 relative z-10 stroke-2" />
          </div>
        </div>
      </div>

      <div class="glass-card-light dark:glass-card rounded-xl shadow-sm p-5">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Taxa de Ocupação</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">{{ taxaOcupacao }}%</p>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ imoveisVendidos }} vendidos</p>
          </div>
          <div class="icon-glass w-12 h-12 rounded-lg flex items-center justify-center">
            <ChartBarIcon class="w-6 h-6 text-amber-500 dark:text-amber-400 relative z-10 stroke-2" />
          </div>
        </div>
      </div>

      <div class="glass-card-light dark:glass-card rounded-xl shadow-sm p-5">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Captações Ativas</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">{{ captacoesAtivas }}</p>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ captacoesPendentes }} pendentes</p>
          </div>
          <div class="icon-glass w-12 h-12 rounded-lg flex items-center justify-center">
            <HomeModernIcon class="w-6 h-6 text-cyan-500 dark:text-cyan-400 relative z-10 stroke-2" />
          </div>
        </div>
      </div>
    </div>
    
    <!-- Tabs -->
    <div class="border-b border-gray-200 dark:border-brand-navy-dark mb-6">
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
          {{ tab.name }}
        </button>
      </nav>
    </div>

    <!-- Tab Lançamentos -->
    <div v-if="currentTab === 'lancamentos'" class="space-y-6">
      <div class="flex justify-between items-center">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Lançamentos</h2>
        
        <button 
          @click="openCreateImovel" 
          class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-sm transition-colors flex items-center space-x-2"
        >
          <BuildingOfficeIcon class="h-5 w-5" />
          <span>Novo Lançamento</span>
        </button>
      </div>

      <!-- Filtros -->
      <div class="glass-card-light dark:glass-card rounded-lg shadow p-4 sm:p-6 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Buscar</label>
            <input
              v-model="filtersImoveis.search"
              type="text"
              placeholder="Código, endereço..."
              class="w-full px-4 py-2 border border-gray-300 dark:border-brand-navy-dark rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-brand-navy-dark dark:text-white"
              @input="handleSearchImoveis"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tipo</label>
            <select
              v-model="filtersImoveis.tipo"
              class="w-full px-4 py-2 border border-gray-300 dark:border-brand-navy-dark rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-brand-navy-dark dark:text-white"
              @change="handleSearchImoveis"
            >
              <option value="">Todos</option>
              <option value="Apartamento">Apartamento</option>
              <option value="Casa">Casa</option>
              <option value="Terreno">Terreno</option>
              <option value="Comercial">Comercial</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
            <select
              v-model="filtersImoveis.status"
              class="w-full px-4 py-2 border border-gray-300 dark:border-brand-navy-dark rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-brand-navy-dark dark:text-white"
              @change="handleSearchImoveis"
            >
              <option value="">Todos</option>
              <option value="Disponível">Disponível</option>
              <option value="Vendido">Vendido</option>
              <option value="Reservado">Reservado</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Grid de Lançamentos -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="imovel in paginatedImoveis" 
          :key="imovel.id" 
          class="glass-card-light dark:glass-card rounded-lg shadow overflow-hidden hover:shadow-md cursor-pointer"
          @click="openEditImovel(imovel)"
        >
          <div class="h-48 bg-gray-200 dark:bg-brand-navy-dark overflow-hidden relative">
            <img 
              v-if="imovel.imagem"
              :src="imovel.imagem" 
              :alt="imovel.codigo"
              loading="lazy"
              decoding="async"
              class="w-full h-full object-cover"
            />
            <div v-else class="w-full h-full flex items-center justify-center">
              <BuildingOfficeIcon class="h-16 w-16 text-gray-400" />
            </div>
          </div>
          <div class="p-4">
            <div class="flex items-start justify-between mb-2">
              <div class="flex-1">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ imovel.tipo }} - {{ imovel.codigo }}</h3>
                <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">{{ imovel.endereco }}</p>
              </div>
              <span 
                class="px-2 py-1 text-xs font-medium rounded-full ml-2 flex-shrink-0"
                :class="{
                  'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400': imovel.status === 'Disponível',
                  'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400': imovel.status === 'Vendido',
                  'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400': imovel.status === 'Reservado'
                }"
              >
                {{ imovel.status }}
              </span>
            </div>
            <div class="space-y-2 mt-3">
              <div class="flex items-center justify-between">
                <span class="text-lg font-bold text-blue-600 dark:text-blue-400">{{ formatPrice(imovel.preco) }}</span>
              </div>
              <div class="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                <span v-if="imovel.quartos">{{ imovel.quartos }} quartos</span>
                <span v-if="imovel.banheiros">{{ imovel.banheiros }} banheiros</span>
                <span v-if="imovel.area">{{ imovel.area }} m²</span>
              </div>
              <div v-if="imovel.corretor" class="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                <UserIcon class="w-4 h-4" />
                <span>{{ imovel.corretor }}</span>
              </div>
              <div v-if="imovel.data_cadastro" class="text-xs text-gray-500 dark:text-gray-400">
                Cadastrado em {{ formatDate(imovel.data_cadastro) }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Paginação Lançamentos -->
      <div v-if="totalPagesImoveis > 1" class="mt-6 glass-card-light dark:glass-card px-4 py-3 border-t border-white/10 sm:px-6">
        <div class="flex items-center justify-between">
          <div class="text-sm text-gray-700 dark:text-gray-300">
            Mostrando <span class="font-medium">{{ startIndexImoveis + 1 }}</span> até 
            <span class="font-medium">{{ endIndexImoveis }}</span> de 
            <span class="font-medium">{{ totalItemsImoveis }}</span> resultados
          </div>
          <div class="flex space-x-2">
            <button
              @click="currentPageImoveis--"
              :disabled="currentPageImoveis === 1"
              class="px-3 py-2 border border-gray-300 dark:border-brand-navy-dark rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-brand-navy-dark hover:bg-gray-50 dark:hover:bg-brand-navy disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>
            <button
              @click="currentPageImoveis++"
              :disabled="currentPageImoveis >= totalPagesImoveis"
              class="px-3 py-2 border border-gray-300 dark:border-brand-navy-dark rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-brand-navy-dark hover:bg-gray-50 dark:hover:bg-brand-navy disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Próximo
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Tab Captações Venda -->
    <div v-if="currentTab === 'captacoes_venda'" class="space-y-6">
      <div class="flex justify-between items-center">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Captações Venda</h2>
        <button 
          @click="openCreateCaptacao" 
          class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-sm transition-colors flex items-center space-x-2"
        >
          <BuildingOfficeIcon class="h-5 w-5" />
          <span>Nova Captação</span>
        </button>
      </div>

      <!-- Filtros Captações Venda -->
      <div class="glass-card-light dark:glass-card rounded-lg shadow p-4 sm:p-6 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Buscar</label>
            <input
              v-model="filtersCaptacoes.search"
              type="text"
              placeholder="Nome do imóvel, endereço..."
              class="w-full px-4 py-2 border border-gray-300 dark:border-brand-navy-dark rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-brand-navy-dark dark:text-white"
              @input="handleSearchCaptacoes"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
            <select
              v-model="filtersCaptacoes.status"
              class="w-full px-4 py-2 border border-gray-300 dark:border-brand-navy-dark rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-brand-navy-dark dark:text-white"
              @change="handleSearchCaptacoes"
            >
              <option value="">Todos</option>
              <option value="Ativo">Ativo</option>
              <option value="Inativo">Inativo</option>
              <option value="Pendente">Pendente</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Grid de Captações Venda -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="captacao in paginatedCaptacoes" 
          :key="captacao.id" 
          class="glass-card-light dark:glass-card rounded-lg shadow overflow-hidden hover:shadow-md cursor-pointer"
          @click="openEditCaptacao(captacao)"
        >
          <div class="h-48 bg-gray-200 dark:bg-brand-navy-dark overflow-hidden relative">
            <img 
              v-if="captacao.imagem"
              :src="captacao.imagem" 
              :alt="captacao.nome"
              loading="lazy"
              decoding="async"
              class="w-full h-full object-cover"
            />
            <div v-else class="w-full h-full flex items-center justify-center">
              <BuildingOfficeIcon class="h-16 w-16 text-gray-400" />
            </div>
          </div>
          <div class="p-4">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">{{ captacao.nome }}</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">{{ captacao.endereco }}</p>
            <div class="flex justify-between items-center text-sm">
              <span 
                class="px-2 py-1 rounded-full text-xs font-medium"
                :class="getStatusClass(captacao.status)"
              >
                {{ captacao.status }}
              </span>
              <span class="text-gray-500 dark:text-gray-400">{{ captacao.viabilizador }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Paginação Captações Venda -->
      <div v-if="totalPagesCaptacoes > 1" class="mt-6 glass-card-light dark:glass-card px-4 py-3 border-t border-white/10 sm:px-6">
        <div class="flex items-center justify-between">
          <div class="text-sm text-gray-700 dark:text-gray-300">
            Mostrando <span class="font-medium">{{ startIndexCaptacoes + 1 }}</span> até 
            <span class="font-medium">{{ endIndexCaptacoes }}</span> de 
            <span class="font-medium">{{ totalItemsCaptacoes }}</span> resultados
          </div>
          <div class="flex space-x-2">
            <button
              @click="currentPageCaptacoes--"
              :disabled="currentPageCaptacoes === 1"
              class="px-3 py-2 border border-gray-300 dark:border-brand-navy-dark rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-brand-navy-dark hover:bg-gray-50 dark:hover:bg-brand-navy disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>
            <button
              @click="currentPageCaptacoes++"
              :disabled="currentPageCaptacoes >= totalPagesCaptacoes"
              class="px-3 py-2 border border-gray-300 dark:border-brand-navy-dark rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-brand-navy-dark hover:bg-gray-50 dark:hover:bg-brand-navy disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Próximo
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Tab Captações Aluguel -->
    <div v-if="currentTab === 'captacoes_aluguel'" class="space-y-6">
      <div class="flex justify-between items-center">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Captações Aluguel</h2>
        <button 
          @click="openCreateCaptacao" 
          class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-sm transition-colors flex items-center space-x-2"
        >
          <BuildingOfficeIcon class="h-5 w-5" />
          <span>Nova Captação</span>
        </button>
      </div>

      <!-- Filtros Captações Aluguel -->
      <div class="glass-card-light dark:glass-card rounded-lg shadow p-4 sm:p-6 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Buscar</label>
            <input
              v-model="filtersCaptacoesAluguel.search"
              type="text"
              placeholder="Nome do imóvel, endereço..."
              class="w-full px-4 py-2 border border-gray-300 dark:border-brand-navy-dark rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-brand-navy-dark dark:text-white"
              @input="handleSearchCaptacoesAluguel"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
            <select
              v-model="filtersCaptacoesAluguel.status"
              class="w-full px-4 py-2 border border-gray-300 dark:border-brand-navy-dark rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-brand-navy-dark dark:text-white"
              @change="handleSearchCaptacoesAluguel"
            >
              <option value="">Todos</option>
              <option value="Ativo">Ativo</option>
              <option value="Inativo">Inativo</option>
              <option value="Pendente">Pendente</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Grid de Captações Aluguel -->
      <div v-if="paginatedCaptacoesAluguel.length === 0" class="glass-card-light dark:glass-card rounded-lg shadow p-12">
        <div class="text-center">
          <BuildingOfficeIcon class="h-16 w-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Nenhuma captação de aluguel encontrada</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Clique em "Nova Captação" para adicionar uma nova captação de aluguel.
          </p>
        </div>
      </div>
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="captacao in paginatedCaptacoesAluguel" 
          :key="captacao.id" 
          class="glass-card-light dark:glass-card rounded-lg shadow overflow-hidden hover:shadow-md cursor-pointer"
          @click="openEditCaptacao(captacao)"
        >
          <div class="h-48 bg-gray-200 dark:bg-brand-navy-dark overflow-hidden relative">
            <img 
              v-if="captacao.imagem"
              :src="captacao.imagem" 
              :alt="captacao.nome"
              loading="lazy"
              decoding="async"
              class="w-full h-full object-cover"
            />
            <div v-else class="w-full h-full flex items-center justify-center">
              <BuildingOfficeIcon class="h-16 w-16 text-gray-400" />
            </div>
          </div>
          <div class="p-4">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">{{ captacao.nome }}</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">{{ captacao.endereco }}</p>
            <div class="flex justify-between items-center text-sm">
              <span 
                class="px-2 py-1 rounded-full text-xs font-medium"
                :class="getStatusClass(captacao.status)"
              >
                {{ captacao.status }}
              </span>
              <span class="text-gray-500 dark:text-gray-400">{{ captacao.viabilizador }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Paginação Captações Aluguel -->
      <div v-if="totalPagesCaptacoesAluguel > 1" class="mt-6 bg-white dark:bg-brand-navy px-4 py-3 border-t border-gray-200 dark:border-brand-navy-dark sm:px-6">
        <div class="flex items-center justify-between">
          <div class="text-sm text-gray-700 dark:text-gray-300">
            Mostrando <span class="font-medium">{{ startIndexCaptacoesAluguel + 1 }}</span> até 
            <span class="font-medium">{{ endIndexCaptacoesAluguel }}</span> de 
            <span class="font-medium">{{ totalItemsCaptacoesAluguel }}</span> resultados
          </div>
          <div class="flex space-x-2">
            <button
              @click="currentPageCaptacoesAluguel--"
              :disabled="currentPageCaptacoesAluguel === 1"
              class="px-3 py-2 border border-gray-300 dark:border-brand-navy-dark rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-brand-navy-dark hover:bg-gray-50 dark:hover:bg-brand-navy disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>
            <button
              @click="currentPageCaptacoesAluguel++"
              :disabled="currentPageCaptacoesAluguel >= totalPagesCaptacoesAluguel"
              class="px-3 py-2 border border-gray-300 dark:border-brand-navy-dark rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-brand-navy-dark hover:bg-gray-50 dark:hover:bg-brand-navy disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Próximo
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Lançamento -->
    <el-dialog
      v-model="showImovelModal"
      :title="isEditingImovel ? 'Editar Lançamento' : 'Novo Lançamento'"
      width="800px"
      @close="handleImovelModalClose"
    >
      <div class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Código <span class="text-red-500">*</span>
            </label>
            <input
              v-model="formImovel.codigo"
              type="text"
              required
              class="w-full px-4 py-2 border border-gray-300 dark:border-brand-navy-dark rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-brand-navy-dark dark:text-white"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tipo <span class="text-red-500">*</span>
            </label>
            <select
              v-model="formImovel.tipo"
              required
              class="w-full px-4 py-2 border border-gray-300 dark:border-brand-navy-dark rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-brand-navy-dark dark:text-white"
            >
              <option value="">Selecione...</option>
              <option value="Apartamento">Apartamento</option>
              <option value="Casa">Casa</option>
              <option value="Terreno">Terreno</option>
              <option value="Comercial">Comercial</option>
            </select>
          </div>
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Endereço <span class="text-red-500">*</span>
            </label>
            <input
              v-model="formImovel.endereco"
              type="text"
              required
              class="w-full px-4 py-2 border border-gray-300 dark:border-brand-navy-dark rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-brand-navy-dark dark:text-white"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Preço <span class="text-red-500">*</span>
            </label>
            <input
              v-model="formImovel.preco"
              type="number"
              required
              class="w-full px-4 py-2 border border-gray-300 dark:border-brand-navy-dark rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-brand-navy-dark dark:text-white"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
            <select
              v-model="formImovel.status"
              class="w-full px-4 py-2 border border-gray-300 dark:border-brand-navy-dark rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-brand-navy-dark dark:text-white"
            >
              <option value="Disponível">Disponível</option>
              <option value="Vendido">Vendido</option>
              <option value="Reservado">Reservado</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Quartos</label>
            <input
              v-model="formImovel.quartos"
              type="number"
              class="w-full px-4 py-2 border border-gray-300 dark:border-brand-navy-dark rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-brand-navy-dark dark:text-white"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Banheiros</label>
            <input
              v-model="formImovel.banheiros"
              type="number"
              class="w-full px-4 py-2 border border-gray-300 dark:border-brand-navy-dark rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-brand-navy-dark dark:text-white"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Área (m²)</label>
            <input
              v-model="formImovel.area"
              type="number"
              class="w-full px-4 py-2 border border-gray-300 dark:border-brand-navy-dark rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-brand-navy-dark dark:text-white"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Corretor Responsável</label>
            <select
              v-model="formImovel.corretor"
              class="w-full px-4 py-2 border border-gray-300 dark:border-brand-navy-dark rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-brand-navy-dark dark:text-white"
            >
              <option value="">Selecione...</option>
              <option value="Carlos Mendes">Carlos Mendes</option>
              <option value="Ana Costa">Ana Costa</option>
              <option value="Roberto Alves">Roberto Alves</option>
              <option value="Mariana Silva">Mariana Silva</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Data de Cadastro</label>
            <input
              v-model="formImovel.data_cadastro"
              type="date"
              class="w-full px-4 py-2 border border-gray-300 dark:border-brand-navy-dark rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-brand-navy-dark dark:text-white"
            />
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">URL da Imagem</label>
          <input
            v-model="formImovel.imagem"
            type="text"
            placeholder="/images/imoveis/imovel-1.jpg ou URL"
            class="w-full px-4 py-2 border border-gray-300 dark:border-brand-navy-dark rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-brand-navy-dark dark:text-white"
          />
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Coloque as imagens em /public/images/imoveis/</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Descrição</label>
          <textarea
            v-model="formImovel.descricao"
            rows="4"
            class="w-full px-4 py-2 border border-gray-300 dark:border-brand-navy-dark rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-brand-navy-dark dark:text-white"
          ></textarea>
        </div>
      </div>
      <template #footer>
        <div class="flex justify-end space-x-3">
          <button
            @click="showImovelModal = false"
            class="px-4 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-brand-navy-dark border border-gray-300 dark:border-brand-navy-dark rounded-lg hover:bg-gray-50 dark:hover:bg-brand-navy"
          >
            Cancelar
          </button>
          <button
            @click="handleSubmitImovel"
            class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Salvar
          </button>
        </div>
      </template>
    </el-dialog>

    <!-- Modal Captação -->
    <el-dialog
      v-model="showCaptacaoModal"
      :title="isEditingCaptacao ? 'Editar Captação' : 'Nova Captação'"
      width="700px"
      @close="handleCaptacaoModalClose"
    >
      <div class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nome da Captação <span class="text-red-500">*</span>
            </label>
            <input
              v-model="formCaptacao.nome"
              type="text"
              required
              class="w-full px-4 py-2 border border-gray-300 dark:border-brand-navy-dark rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-brand-navy-dark dark:text-white"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Captador <span class="text-red-500">*</span>
            </label>
            <input
              v-model="formCaptacao.viabilizador"
              type="text"
              required
              class="w-full px-4 py-2 border border-gray-300 dark:border-brand-navy-dark rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-brand-navy-dark dark:text-white"
            />
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Endereço Completo
          </label>
          <input
            v-model="formCaptacao.endereco"
            type="text"
            class="w-full px-4 py-2 border border-gray-300 dark:border-brand-navy-dark rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-brand-navy-dark dark:text-white"
          />
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Contato do Captador
            </label>
            <input
              v-model="maskedContatoViabilizador"
              type="text"
              maxlength="16"
              @input="formatarTelefoneViabilizador"
              class="w-full px-4 py-2 border border-gray-300 dark:border-brand-navy-dark rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-brand-navy-dark dark:text-white"
              placeholder="(00) 00000-0000"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Captador Externo <span class="text-red-500">*</span>
            </label>
            <select
              v-model="formCaptacao.captador_externo"
              class="w-full px-4 py-2 border border-gray-300 dark:border-brand-navy-dark rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-brand-navy-dark dark:text-white"
            >
              <option :value="false">Não</option>
              <option :value="true">Sim</option>
            </select>
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">URL da Imagem</label>
          <input
            v-model="formCaptacao.imagem"
            type="text"
            placeholder="/images/imoveis/imovel-1.jpg ou URL"
            class="w-full px-4 py-2 border border-gray-300 dark:border-brand-navy-dark rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-brand-navy-dark dark:text-white"
          />
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Coloque as imagens em /public/images/imoveis/</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Observação
          </label>
          <textarea
            v-model="formCaptacao.observacao"
            rows="4"
            class="w-full px-4 py-2 border border-gray-300 dark:border-brand-navy-dark rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-brand-navy-dark dark:text-white"
            placeholder="Digite observações sobre a captação..."
          ></textarea>
        </div>
      </div>
      <template #footer>
        <div class="flex justify-end space-x-3">
          <button
            @click="showCaptacaoModal = false"
            class="px-4 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-brand-navy-dark border border-gray-300 dark:border-brand-navy-dark rounded-lg hover:bg-gray-50 dark:hover:bg-brand-navy"
          >
            Cancelar
          </button>
          <button
            @click="handleSubmitCaptacao"
            class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Salvar
          </button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { 
  BuildingOfficeIcon, 
  CurrencyDollarIcon, 
  ChartBarIcon, 
  HomeModernIcon,
  UserIcon
} from '@heroicons/vue/24/outline'

const currentTab = ref('lancamentos')

const tabs = [
  { id: 'lancamentos', name: 'Lançamentos' },
  { id: 'captacoes_venda', name: 'Captações Venda' },
  { id: 'captacoes_aluguel', name: 'Captações Aluguel' }
]

// Imagens de imóveis - referência às imagens na pasta /public/images/imoveis/
const imagensImoveis = [
  '/images/imoveis/imovel1.jpg',   // Lançamento 1
  '/images/imoveis/imovel2.jpg',   // Lançamento 2
  '/images/imoveis/imovel3.jpg',   // Lançamento 3
  '/images/imoveis/imovel4.jpg',   // Lançamento 4
  '/images/imoveis/imovel5.jpg',   // Lançamento 5
  '/images/imoveis/imovel6.jpg',   // Lançamento 6
  '/images/imoveis/imovel7.jpg',   // Lançamento 7
  '/images/imoveis/imovel8.jpg',   // Lançamento 8
  '/images/imoveis/imovel9.jpg',   // Lançamento 9
  '/images/imoveis/imovel10.jpg',  // Lançamento 10
  '/images/imoveis/imovel11.jpg',  // Lançamento 11
  '/images/imoveis/imovel12.jpg',  // Lançamento 12
  '/images/imoveis/imovel13.jpg',  // Captação 1
  '/images/imoveis/imovel14.jpg',  // Captação 2
  '/images/imoveis/imovel15.jpg',  // Captação 3
  '/images/imoveis/imovel16.jpg',  // Captação 4
  '/images/imoveis/imovel17.jpg',  // Captação 5
  '/images/imoveis/imovel18.jpg',  // Captação 6
  '/images/imoveis/imovel19.jpg',  // Captação 7
  '/images/imoveis/imovel20.jpg',  // Captação 8
  '/images/imoveis/imovel21.jpg',  // Captação 9
  '/images/imoveis/imovel22.jpg',  // Captação 10
  '/images/imoveis/imovel23.jpg',  // Captação 11
  '/images/imoveis/imovel24.jpg',  // Captação 12
]

// Função para obter imagem do imóvel (apenas imagens locais)
const getImagemImovel = (index) => {
  // Retorna a imagem do array se existir, senão retorna string vazia
  return imagensImoveis[index] || ''
}

// Dados mockados - Lançamentos (9 imóveis - removidos 3)
// As imagens serão adicionadas no array imagensImoveis acima
const mockImoveis = [
  { id: 1, codigo: 'APT-001', tipo: 'Apartamento', endereco: 'Rua das Flores, 123 - Centro', preco: 350000, status: 'Disponível', quartos: 2, banheiros: 2, area: 75, descricao: 'Apartamento moderno no centro', imagem: imagensImoveis[0] || '', corretor: 'Carlos Mendes', data_cadastro: '2024-01-15' },
  { id: 2, codigo: 'CASA-002', tipo: 'Casa', endereco: 'Av. Principal, 456 - Jardim', preco: 550000, status: 'Disponível', quartos: 3, banheiros: 2, area: 120, descricao: 'Casa com quintal', imagem: imagensImoveis[1] || '', corretor: 'Ana Costa', data_cadastro: '2024-01-20' },
  { id: 3, codigo: 'APT-003', tipo: 'Apartamento', endereco: 'Rua Nova, 789 - Bairro Novo', preco: 280000, status: 'Reservado', quartos: 1, banheiros: 1, area: 50, descricao: 'Apartamento compacto', imagem: imagensImoveis[2] || '', corretor: 'Roberto Alves', data_cadastro: '2024-02-01' },
  { id: 4, codigo: 'APT-004', tipo: 'Apartamento', endereco: 'Rua das Palmeiras, 100 - Centro', preco: 420000, status: 'Disponível', quartos: 3, banheiros: 2, area: 95, descricao: 'Apartamento amplo com varanda', imagem: imagensImoveis[3] || '', corretor: 'Mariana Silva', data_cadastro: '2024-02-10' },
  { id: 5, codigo: 'CASA-005', tipo: 'Casa', endereco: 'Av. dos Bandeirantes, 200 - Jardim América', preco: 680000, status: 'Disponível', quartos: 4, banheiros: 3, area: 180, descricao: 'Casa espaçosa com piscina', imagem: imagensImoveis[4] || '', corretor: 'Carlos Mendes', data_cadastro: '2024-02-15' },
  { id: 6, codigo: 'TER-006', tipo: 'Terreno', endereco: 'Rua Verde, 50 - Chácara', preco: 250000, status: 'Disponível', quartos: 0, banheiros: 0, area: 500, descricao: 'Terreno plano e regular', imagem: imagensImoveis[5] || '', corretor: 'Ana Costa', data_cadastro: '2024-02-20' },
  { id: 7, codigo: 'APT-007', tipo: 'Apartamento', endereco: 'Rua das Acácias, 300 - Centro', preco: 380000, status: 'Disponível', quartos: 2, banheiros: 2, area: 80, descricao: 'Apartamento com vista', imagem: imagensImoveis[6] || '', corretor: 'Roberto Alves', data_cadastro: '2024-03-01' },
  { id: 8, codigo: 'CASA-008', tipo: 'Casa', endereco: 'Av. Central, 150 - Vila Nova', preco: 520000, status: 'Vendido', quartos: 3, banheiros: 2, area: 140, descricao: 'Casa em condomínio fechado', imagem: imagensImoveis[7] || '', corretor: 'Mariana Silva', data_cadastro: '2024-03-05' },
  { id: 9, codigo: 'COM-009', tipo: 'Comercial', endereco: 'Rua Comercial, 80 - Centro', preco: 450000, status: 'Disponível', quartos: 0, banheiros: 2, area: 120, descricao: 'Sala comercial bem localizada', imagem: imagensImoveis[8] || '', corretor: 'Carlos Mendes', data_cadastro: '2024-03-10' },
]

// Dados mockados - Captações Venda (9 captações - removidos 3)
// As imagens serão adicionadas no array imagensImoveis acima (índices 9-17)
const mockCaptacoesVenda = [
  { id: 1, nome: 'Residencial Primavera', endereco: 'Rua das Flores, 100', viabilizador: 'João Silva', contato_viabilizador: '(11) 99999-9999', captador_externo: false, status: 'Ativo', observacao: '', imagem: imagensImoveis[9] || '' },
  { id: 2, nome: 'Condomínio Solar', endereco: 'Av. Principal, 200', viabilizador: 'Maria Santos', contato_viabilizador: '(11) 88888-8888', captador_externo: true, status: 'Pendente', observacao: '', imagem: imagensImoveis[10] || '' },
  { id: 3, nome: 'Edifício Central', endereco: 'Rua Central, 300', viabilizador: 'Pedro Oliveira', contato_viabilizador: '(11) 77777-7777', captador_externo: false, status: 'Ativo', observacao: '', imagem: imagensImoveis[11] || '' },
  { id: 4, nome: 'Residencial Horizonte', endereco: 'Av. Horizonte, 500', viabilizador: 'Ana Costa', contato_viabilizador: '(11) 66666-6666', captador_externo: false, status: 'Ativo', observacao: '', imagem: imagensImoveis[12] || '' },
  { id: 5, nome: 'Condomínio Vista Verde', endereco: 'Rua Verde, 150', viabilizador: 'Carlos Mendes', contato_viabilizador: '(11) 55555-5555', captador_externo: true, status: 'Ativo', observacao: '', imagem: imagensImoveis[13] || '' },
  { id: 6, nome: 'Edifício Premium', endereco: 'Av. Premium, 300', viabilizador: 'Fernanda Lima', contato_viabilizador: '(11) 44444-4444', captador_externo: false, status: 'Pendente', observacao: '', imagem: imagensImoveis[14] || '' },
  { id: 7, nome: 'Residencial Jardins', endereco: 'Rua dos Jardins, 250', viabilizador: 'Roberto Alves', contato_viabilizador: '(11) 33333-3333', captador_externo: false, status: 'Ativo', observacao: '', imagem: imagensImoveis[15] || '' },
  { id: 8, nome: 'Condomínio Elite', endereco: 'Av. Elite, 400', viabilizador: 'Juliana Souza', contato_viabilizador: '(11) 22222-2222', captador_externo: true, status: 'Ativo', observacao: '', imagem: imagensImoveis[16] || '' },
  { id: 9, nome: 'Edifício Moderno', endereco: 'Rua Moderna, 180', viabilizador: 'Lucas Pereira', contato_viabilizador: '(11) 11111-1111', captador_externo: false, status: 'Pendente', observacao: '', imagem: imagensImoveis[17] || '' },
]

// Dados mockados - Captações Aluguel (6 captações)
// As imagens serão adicionadas no array imagensImoveis acima (índices 18-23)
const mockCaptacoesAluguel = [
  { id: 1, nome: 'Apartamento Aluguel Centro', endereco: 'Rua Central, 100', viabilizador: 'Paula Silva', contato_viabilizador: '(11) 99999-8888', captador_externo: false, status: 'Ativo', observacao: '', imagem: imagensImoveis[18] || '' },
  { id: 2, nome: 'Casa Aluguel Jardim', endereco: 'Av. Jardim, 200', viabilizador: 'Ricardo Santos', contato_viabilizador: '(11) 88888-7777', captador_externo: true, status: 'Ativo', observacao: '', imagem: imagensImoveis[19] || '' },
  { id: 3, nome: 'Studio Aluguel Centro', endereco: 'Rua das Flores, 300', viabilizador: 'Mariana Costa', contato_viabilizador: '(11) 77777-6666', captador_externo: false, status: 'Pendente', observacao: '', imagem: imagensImoveis[20] || '' },
  { id: 4, nome: 'Apartamento Aluguel Bairro Novo', endereco: 'Av. Nova, 400', viabilizador: 'Felipe Oliveira', contato_viabilizador: '(11) 66666-5555', captador_externo: false, status: 'Ativo', observacao: '', imagem: imagensImoveis[21] || '' },
  { id: 5, nome: 'Casa Aluguel Vila', endereco: 'Rua da Vila, 500', viabilizador: 'Beatriz Lima', contato_viabilizador: '(11) 55555-4444', captador_externo: true, status: 'Ativo', observacao: '', imagem: imagensImoveis[22] || '' },
  { id: 6, nome: 'Apartamento Aluguel Premium', endereco: 'Av. Premium, 600', viabilizador: 'Gabriel Alves', contato_viabilizador: '(11) 44444-3333', captador_externo: false, status: 'Pendente', observacao: '', imagem: imagensImoveis[23] || '' },
]

const imoveis = ref([...mockImoveis])
const captacoesVenda = ref([...mockCaptacoesVenda])
const captacoesAluguel = ref([...mockCaptacoesAluguel])

// Estados dos modais
const showImovelModal = ref(false)
const showCaptacaoModal = ref(false)
const isEditingImovel = ref(false)
const isEditingCaptacao = ref(false)
const selectedImovel = ref(null)
const selectedCaptacao = ref(null)

// Filtros
const filtersImoveis = reactive({
  search: '',
  tipo: '',
  status: ''
})

const filtersCaptacoes = reactive({
  search: '',
  status: ''
})

const filtersCaptacoesAluguel = reactive({
  search: '',
  status: ''
})

// Formulários
const formImovel = reactive({
  codigo: '',
  tipo: '',
  endereco: '',
  preco: '',
  status: 'Disponível',
  quartos: '',
  banheiros: '',
  area: '',
  descricao: '',
  imagem: '',
  corretor: '',
  data_cadastro: ''
})

const formCaptacao = reactive({
  nome: '',
  endereco: '',
  viabilizador: '',
  contato_viabilizador: '',
  captador_externo: false,
  observacao: '',
  imagem: ''
})

const maskedContatoViabilizador = ref('')

// Paginação
const perPage = 6 // 6 itens por página

// Paginação Lançamentos
const currentPageImoveis = ref(1)

const filteredImoveis = computed(() => {
  let filtered = [...imoveis.value]
  
  if (filtersImoveis.search) {
    const search = filtersImoveis.search.toLowerCase()
    filtered = filtered.filter(i => 
      i.codigo.toLowerCase().includes(search) ||
      i.endereco.toLowerCase().includes(search)
    )
  }
  
  if (filtersImoveis.tipo) {
    filtered = filtered.filter(i => i.tipo === filtersImoveis.tipo)
  }
  
  if (filtersImoveis.status) {
    filtered = filtered.filter(i => i.status === filtersImoveis.status)
  }
  
  return filtered
})

const totalItemsImoveis = computed(() => filteredImoveis.value.length)
const totalPagesImoveis = computed(() => Math.ceil(totalItemsImoveis.value / perPage))
const startIndexImoveis = computed(() => (currentPageImoveis.value - 1) * perPage)
const endIndexImoveis = computed(() => Math.min(startIndexImoveis.value + perPage, totalItemsImoveis.value))

const paginatedImoveis = computed(() => {
  return filteredImoveis.value.slice(startIndexImoveis.value, endIndexImoveis.value)
})

// Paginação Captações Venda
const currentPageCaptacoes = ref(1)

const filteredCaptacoes = computed(() => {
  let filtered = [...captacoesVenda.value]
  
  if (filtersCaptacoes.search) {
    const search = filtersCaptacoes.search.toLowerCase()
    filtered = filtered.filter(c => 
      c.nome.toLowerCase().includes(search) ||
      c.endereco.toLowerCase().includes(search) ||
      c.viabilizador.toLowerCase().includes(search)
    )
  }
  
  if (filtersCaptacoes.status) {
    filtered = filtered.filter(c => c.status === filtersCaptacoes.status)
  }
  
  return filtered
})

const totalItemsCaptacoes = computed(() => filteredCaptacoes.value.length)
const totalPagesCaptacoes = computed(() => Math.ceil(totalItemsCaptacoes.value / perPage))
const startIndexCaptacoes = computed(() => (currentPageCaptacoes.value - 1) * perPage)
const endIndexCaptacoes = computed(() => Math.min(startIndexCaptacoes.value + perPage, totalItemsCaptacoes.value))

const paginatedCaptacoes = computed(() => {
  return filteredCaptacoes.value.slice(startIndexCaptacoes.value, endIndexCaptacoes.value)
})

// Paginação Captações Aluguel
const currentPageCaptacoesAluguel = ref(1)

const filteredCaptacoesAluguel = computed(() => {
  let filtered = [...captacoesAluguel.value]
  
  if (filtersCaptacoesAluguel.search) {
    const search = filtersCaptacoesAluguel.search.toLowerCase()
    filtered = filtered.filter(c => 
      c.nome.toLowerCase().includes(search) ||
      c.endereco.toLowerCase().includes(search) ||
      c.viabilizador.toLowerCase().includes(search)
    )
  }
  
  if (filtersCaptacoesAluguel.status) {
    filtered = filtered.filter(c => c.status === filtersCaptacoesAluguel.status)
  }
  
  return filtered
})

const totalItemsCaptacoesAluguel = computed(() => filteredCaptacoesAluguel.value.length)
const totalPagesCaptacoesAluguel = computed(() => Math.ceil(totalItemsCaptacoesAluguel.value / perPage))
const startIndexCaptacoesAluguel = computed(() => (currentPageCaptacoesAluguel.value - 1) * perPage)
const endIndexCaptacoesAluguel = computed(() => Math.min(startIndexCaptacoesAluguel.value + perPage, totalItemsCaptacoesAluguel.value))

const paginatedCaptacoesAluguel = computed(() => {
  return filteredCaptacoesAluguel.value.slice(startIndexCaptacoesAluguel.value, endIndexCaptacoesAluguel.value)
})

// Resetar paginação quando filtros mudarem
watch(() => filtersImoveis.search, () => {
  currentPageImoveis.value = 1
})

watch(() => filtersImoveis.tipo, () => {
  currentPageImoveis.value = 1
})

watch(() => filtersImoveis.status, () => {
  currentPageImoveis.value = 1
})

watch(() => filtersCaptacoes.search, () => {
  currentPageCaptacoes.value = 1
})

watch(() => filtersCaptacoes.status, () => {
  currentPageCaptacoes.value = 1
})

watch(() => filtersCaptacoesAluguel.search, () => {
  currentPageCaptacoesAluguel.value = 1
})

watch(() => filtersCaptacoesAluguel.status, () => {
  currentPageCaptacoesAluguel.value = 1
})

// Resetar paginação ao mudar de tab
watch(() => currentTab.value, () => {
  currentPageImoveis.value = 1
  currentPageCaptacoes.value = 1
  currentPageCaptacoesAluguel.value = 1
})

const formatPrice = (price) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price)
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR')
  } catch {
    return dateString
  }
}

// Métricas do Dashboard
const totalImoveis = computed(() => imoveis.value.length)
const imoveisDisponiveis = computed(() => imoveis.value.filter(i => i.status === 'Disponível').length)
const imoveisVendidos = computed(() => imoveis.value.filter(i => i.status === 'Vendido').length)
const vgvTotal = computed(() => imoveis.value.reduce((sum, i) => sum + (i.preco || 0), 0))
const taxaOcupacao = computed(() => {
  if (totalImoveis.value === 0) return 0
  return Math.round((imoveisVendidos.value / totalImoveis.value) * 100)
})
const captacoesAtivas = computed(() => {
  return captacoesVenda.value.filter(c => c.status === 'Ativo').length + 
         captacoesAluguel.value.filter(c => c.status === 'Ativo').length
})
const captacoesPendentes = computed(() => {
  return captacoesVenda.value.filter(c => c.status === 'Pendente').length + 
         captacoesAluguel.value.filter(c => c.status === 'Pendente').length
})

const getStatusClass = (status) => {
  const statusClasses = {
    'Ativo': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    'Inativo': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    'Pendente': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    'Em Análise': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
  }
  return statusClasses[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
}

// Handlers - Imóveis
const handleSearchImoveis = () => {
  // Filtro já é reativo
  currentPageImoveis.value = 1 // Reset página ao buscar
}

const openCreateImovel = () => {
  isEditingImovel.value = false
  selectedImovel.value = null
  resetFormImovel()
  showImovelModal.value = true
}

const openEditImovel = (imovel) => {
  isEditingImovel.value = true
  selectedImovel.value = imovel
  formImovel.codigo = imovel.codigo
  formImovel.tipo = imovel.tipo
  formImovel.endereco = imovel.endereco
  formImovel.preco = imovel.preco
  formImovel.status = imovel.status
  formImovel.quartos = imovel.quartos
  formImovel.banheiros = imovel.banheiros
  formImovel.area = imovel.area
  formImovel.descricao = imovel.descricao
  formImovel.imagem = imovel.imagem || ''
  formImovel.corretor = imovel.corretor || ''
  formImovel.data_cadastro = imovel.data_cadastro || ''
  showImovelModal.value = true
}

const resetFormImovel = () => {
  formImovel.codigo = ''
  formImovel.tipo = ''
  formImovel.endereco = ''
  formImovel.preco = ''
  formImovel.status = 'Disponível'
  formImovel.quartos = ''
  formImovel.banheiros = ''
  formImovel.area = ''
  formImovel.descricao = ''
  formImovel.imagem = ''
  formImovel.corretor = ''
  formImovel.data_cadastro = new Date().toISOString().split('T')[0]
}

const handleImovelModalClose = () => {
  resetFormImovel()
  showImovelModal.value = false
}

const handleSubmitImovel = () => {
  if (isEditingImovel.value) {
    const index = imoveis.value.findIndex(i => i.id === selectedImovel.value.id)
    if (index !== -1) {
      imoveis.value[index] = { ...selectedImovel.value, ...formImovel, preco: parseFloat(formImovel.preco) }
    }
    ElMessage.success('Lançamento atualizado com sucesso')
  } else {
    const newId = Math.max(...imoveis.value.map(i => i.id), 0) + 1
    imoveis.value.push({ id: newId, ...formImovel, preco: parseFloat(formImovel.preco) })
    ElMessage.success('Lançamento criado com sucesso')
  }
  showImovelModal.value = false
  resetFormImovel()
}

// Handlers - Captações
const handleSearchCaptacoes = () => {
  // Filtro já é reativo
  currentPageCaptacoes.value = 1 // Reset página ao buscar
}

const handleSearchCaptacoesAluguel = () => {
  // Filtro já é reativo
  currentPageCaptacoesAluguel.value = 1 // Reset página ao buscar
}

const formatarTelefoneViabilizador = () => {
  let value = maskedContatoViabilizador.value.replace(/\D/g, '')
  
  if (value.length > 11) {
    value = value.slice(0, 11)
  }
  
  if (value.length > 0) {
    value = value.replace(/^(\d{2})(\d)/g, '($1) $2')
    if (value.length > 10) {
      value = value.replace(/^\((\d{2})\) (\d{5})(\d)/g, '($1) $2-$3')
    } else {
      value = value.replace(/^\((\d{2})\) (\d{4})(\d)/g, '($1) $2-$3')
    }
  }
  
  maskedContatoViabilizador.value = value
  formCaptacao.contato_viabilizador = value.replace(/\D/g, '')
}

const openCreateCaptacao = () => {
  isEditingCaptacao.value = false
  selectedCaptacao.value = null
  resetFormCaptacao()
  showCaptacaoModal.value = true
}

const openEditCaptacao = (captacao) => {
  isEditingCaptacao.value = true
  selectedCaptacao.value = captacao
  formCaptacao.nome = captacao.nome
  formCaptacao.endereco = captacao.endereco
  formCaptacao.viabilizador = captacao.viabilizador
  formCaptacao.contato_viabilizador = captacao.contato_viabilizador
  formCaptacao.captador_externo = captacao.captador_externo
  formCaptacao.observacao = captacao.observacao
  formCaptacao.imagem = captacao.imagem || ''
  
  // Formatar telefone
  if (captacao.contato_viabilizador) {
    let telefone = captacao.contato_viabilizador.replace(/\D/g, '')
    if (telefone.length > 0) {
      telefone = telefone.replace(/^(\d{2})(\d)/g, '($1) $2')
      if (telefone.length > 10) {
        telefone = telefone.replace(/^\((\d{2})\) (\d{5})(\d)/g, '($1) $2-$3')
      } else {
        telefone = telefone.replace(/^\((\d{2})\) (\d{4})(\d)/g, '($1) $2-$3')
      }
    }
    maskedContatoViabilizador.value = telefone
  }
  
  showCaptacaoModal.value = true
}

const resetFormCaptacao = () => {
  formCaptacao.nome = ''
  formCaptacao.endereco = ''
  formCaptacao.viabilizador = ''
  formCaptacao.contato_viabilizador = ''
  formCaptacao.captador_externo = false
  formCaptacao.observacao = ''
  formCaptacao.imagem = ''
  maskedContatoViabilizador.value = ''
}

const handleCaptacaoModalClose = () => {
  resetFormCaptacao()
  showCaptacaoModal.value = false
}

const handleSubmitCaptacao = () => {
  const captacoesArray = currentTab.value === 'captacoes_venda' ? captacoesVenda.value : captacoesAluguel.value
  
  if (isEditingCaptacao.value) {
    const index = captacoesArray.findIndex(c => c.id === selectedCaptacao.value.id)
    if (index !== -1) {
      captacoesArray[index] = { ...selectedCaptacao.value, ...formCaptacao }
    }
    ElMessage.success('Captação atualizada com sucesso')
  } else {
    const newId = Math.max(...captacoesArray.map(c => c.id), 0) + 1
    captacoesArray.push({ id: newId, ...formCaptacao, status: 'Ativo' })
    ElMessage.success('Captação criada com sucesso')
  }
  showCaptacaoModal.value = false
  resetFormCaptacao()
}
</script>
