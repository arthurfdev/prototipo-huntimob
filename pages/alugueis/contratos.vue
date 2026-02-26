<template>
  <div class="w-full max-w-full overflow-x-hidden">
    <div class="flex justify-between items-center mb-6 flex-wrap gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Contratos</h1>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Gerencie contratos de locação</p>
      </div>
      
      <button 
        @click="openCreateModal" 
        class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-sm transition-colors flex items-center space-x-2"
      >
        <DocumentPlusIcon class="h-5 w-5" />
        <span>Novo Contrato</span>
      </button>
    </div>

    <!-- Filtros -->
    <div class="bg-white dark:bg-brand-navy rounded-lg shadow p-4 sm:p-6 mb-6 border border-gray-200 dark:border-gray-800">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Buscar</label>
          <input
            v-model="filters.search"
            type="text"
            placeholder="Código, Inquilino ou Imóvel..."
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-brand-navy-dark dark:text-white"
            @input="handleSearch"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
          <select
            v-model="filters.status"
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-brand-navy-dark dark:text-white"
            @change="handleSearch"
          >
            <option value="">Todos</option>
            <option value="Ativo">Ativo</option>
            <option value="Vencido">Vencido</option>
            <option value="Rescindido">Rescindido</option>
            <option value="Renovado">Renovado</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Período</label>
          <select
            v-model="filters.periodo"
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-brand-navy-dark dark:text-white"
            @change="handleSearch"
          >
            <option value="">Todos</option>
            <option value="vencendo_hoje">Vencendo Hoje</option>
            <option value="vencendo_7_dias">Vencendo em 7 dias</option>
            <option value="vencendo_30_dias">Vencendo em 30 dias</option>
            <option value="vencidos">Vencidos</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Mês/Ano</label>
          <input
            v-model="filters.mes_ano"
            type="month"
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-brand-navy-dark dark:text-white"
            @change="handleSearch"
          />
        </div>
      </div>
    </div>

    <!-- Tabela -->
    <div class="bg-white dark:bg-brand-navy rounded-lg shadow border border-gray-200 dark:border-gray-800 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Código
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Inquilino
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Imóvel
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Valor
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Início
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Vencimento
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-brand-navy divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-if="loading" class="bg-white dark:bg-brand-navy">
              <td colspan="8" class="px-6 py-12 text-center">
                <div class="flex justify-center">
                  <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              </td>
            </tr>
            <tr v-else-if="paginatedContratos.length === 0" class="bg-white dark:bg-brand-navy">
              <td colspan="8" class="px-6 py-12 text-center">
                <DocumentDuplicateIcon class="h-12 w-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
                <p class="text-gray-500 dark:text-gray-400">Nenhum contrato encontrado</p>
              </td>
            </tr>
            <tr
              v-else
              v-for="contrato in paginatedContratos"
              :key="contrato.id"
              class="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ contrato.codigo }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                    <span class="text-white font-semibold text-sm">{{ getInicial(contrato.inquilino_nome) }}</span>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900 dark:text-white">
                      {{ contrato.inquilino_nome }}
                    </div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">
                      {{ contrato.inquilino_cpf }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900 dark:text-white">{{ contrato.imovel_codigo }}</div>
                <div class="text-sm text-gray-500 dark:text-gray-400">{{ contrato.imovel_endereco }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ formatCurrency(contrato.valor_aluguel) }}
                </div>
                <div class="text-xs text-gray-500 dark:text-gray-400">
                  + {{ formatCurrency(contrato.valor_condominio || 0) }} cond.
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {{ formatDate(contrato.data_inicio) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900 dark:text-white">
                  {{ formatDate(contrato.data_vencimento) }}
                </div>
                <div v-if="isVencendo(contrato.data_vencimento)" class="text-xs text-red-600 dark:text-red-400">
                  {{ diasParaVencimento(contrato.data_vencimento) }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="getStatusClass(contrato.status)"
                >
                  {{ contrato.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex items-center justify-end gap-2">
                  <button
                    @click="openViewModal(contrato)"
                    class="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                    title="Visualizar"
                  >
                    <EyeIcon class="h-5 w-5" />
                  </button>
                  <button
                    @click="openEditModal(contrato)"
                    class="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                    title="Editar"
                  >
                    <PencilIcon class="h-5 w-5" />
                  </button>
                  <button
                    @click="handleDelete(contrato.id)"
                    class="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    title="Excluir"
                  >
                    <TrashIcon class="h-5 w-5" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Paginação -->
      <div class="bg-white dark:bg-brand-navy px-4 py-3 border-t border-gray-200 dark:border-gray-700 sm:px-6">
        <div class="flex items-center justify-between">
          <div class="text-sm text-gray-700 dark:text-gray-300">
            Mostrando <span class="font-medium">{{ startIndex + 1 }}</span> até 
            <span class="font-medium">{{ endIndex }}</span> de 
            <span class="font-medium">{{ totalItems }}</span> resultados
          </div>
          <div class="flex space-x-2">
            <button
              @click="currentPage--"
              :disabled="currentPage === 1"
              class="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-brand-navy-dark hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>
            <button
              @click="currentPage++"
              :disabled="currentPage >= totalPages"
              class="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-brand-navy-dark hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Próximo
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Criar/Editar -->
    <el-dialog
      v-model="showModal"
      :title="isEditing ? 'Editar Contrato' : 'Novo Contrato'"
      width="1000px"
      @close="handleModalClose"
    >
      <div class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Código do Contrato
            </label>
            <input
              v-model="form.codigo"
              type="text"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-brand-navy-dark dark:text-white"
              placeholder="CONTRATO-001"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Status <span class="text-red-500">*</span>
            </label>
            <select
              v-model="form.status"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-brand-navy-dark dark:text-white"
            >
              <option value="Ativo">Ativo</option>
              <option value="Vencido">Vencido</option>
              <option value="Rescindido">Rescindido</option>
              <option value="Renovado">Renovado</option>
            </select>
          </div>
        </div>

        <div class="border-t border-gray-200 dark:border-gray-700 pt-4">
          <h3 class="text-base font-semibold text-gray-900 dark:text-white mb-4">Dados do Inquilino</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Inquilino <span class="text-red-500">*</span>
              </label>
              <select
                v-model="form.inquilino_id"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-brand-navy-dark dark:text-white"
              >
                <option value="">Selecione um inquilino...</option>
                <option 
                  v-for="inquilino in inquilinosDisponiveis"
                  :key="inquilino.id"
                  :value="inquilino.id"
                >
                  {{ inquilino.nome }} - {{ inquilino.cpf }}
                </option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                CPF do Inquilino
              </label>
              <input
                :value="inquilinoSelecionado?.cpf || ''"
                type="text"
                disabled
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
              />
            </div>
          </div>
        </div>

        <div class="border-t border-gray-200 dark:border-gray-700 pt-4">
          <h3 class="text-base font-semibold text-gray-900 dark:text-white mb-4">Dados do Imóvel</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Imóvel <span class="text-red-500">*</span>
              </label>
              <select
                v-model="form.imovel_id"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-brand-navy-dark dark:text-white"
              >
                <option value="">Selecione um imóvel...</option>
                <option 
                  v-for="imovel in imoveisDisponiveis"
                  :key="imovel.id"
                  :value="imovel.id"
                >
                  {{ imovel.codigo }} - {{ imovel.endereco }}
                </option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Endereço do Imóvel
              </label>
              <input
                :value="imovelSelecionado?.endereco || ''"
                type="text"
                disabled
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
              />
            </div>
          </div>
        </div>

        <div class="border-t border-gray-200 dark:border-gray-700 pt-4">
          <h3 class="text-base font-semibold text-gray-900 dark:text-white mb-4">Valores e Prazos</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Valor do Aluguel (R$) <span class="text-red-500">*</span>
              </label>
              <input
                v-model.number="form.valor_aluguel"
                type="number"
                step="0.01"
                required
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-brand-navy-dark dark:text-white"
                placeholder="0,00"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Valor do Condomínio (R$)
              </label>
              <input
                v-model.number="form.valor_condominio"
                type="number"
                step="0.01"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-brand-navy-dark dark:text-white"
                placeholder="0,00"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Valor Total (R$)
              </label>
              <input
                :value="valorTotal"
                type="text"
                disabled
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-semibold"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Data de Início <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.data_inicio"
                type="date"
                required
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-brand-navy-dark dark:text-white"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Data de Vencimento <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.data_vencimento"
                type="date"
                required
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-brand-navy-dark dark:text-white"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Prazo (meses)
              </label>
              <input
                v-model.number="form.prazo_meses"
                type="number"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-brand-navy-dark dark:text-white"
                placeholder="12"
              />
            </div>
          </div>
        </div>

        <div class="border-t border-gray-200 dark:border-gray-700 pt-4">
          <h3 class="text-base font-semibold text-gray-900 dark:text-white mb-4">Informações Adicionais</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Dia de Vencimento
              </label>
              <input
                v-model.number="form.dia_vencimento"
                type="number"
                min="1"
                max="31"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-brand-navy-dark dark:text-white"
                placeholder="5"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Multa por Atraso (%)
              </label>
              <input
                v-model.number="form.multa_atraso"
                type="number"
                step="0.01"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-brand-navy-dark dark:text-white"
                placeholder="2,00"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Juros por Atraso (% ao mês)
              </label>
              <input
                v-model.number="form.juros_atraso"
                type="number"
                step="0.01"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-brand-navy-dark dark:text-white"
                placeholder="1,00"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Índice de Reajuste
              </label>
              <select
                v-model="form.indice_reajuste"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-brand-navy-dark dark:text-white"
              >
                <option value="">Selecione...</option>
                <option value="IGP-M">IGP-M</option>
                <option value="IPCA">IPCA</option>
                <option value="INCC">INCC</option>
                <option value="Fixo">Fixo</option>
              </select>
            </div>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Observações</label>
          <textarea
            v-model="form.observacao"
            rows="3"
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-brand-navy-dark dark:text-white"
            placeholder="Observações sobre o contrato..."
          ></textarea>
        </div>
      </div>
      <template #footer>
        <div class="flex justify-end space-x-3">
          <button
            @click="showModal = false"
            class="px-4 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-brand-navy-dark border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            Cancelar
          </button>
          <button
            @click="handleSubmit"
            class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Salvar
          </button>
        </div>
      </template>
    </el-dialog>

    <!-- Modal Visualizar -->
    <el-dialog
      v-model="showViewModal"
      title="Detalhes do Contrato"
      width="900px"
    >
      <div v-if="contratoVisualizando" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 class="text-base font-semibold text-gray-900 dark:text-white mb-4">Informações do Contrato</h3>
            <dl class="space-y-3">
              <div>
                <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Código</dt>
                <dd class="text-sm text-gray-900 dark:text-white">{{ contratoVisualizando.codigo }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Status</dt>
                <dd>
                  <span 
                    class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                    :class="getStatusClass(contratoVisualizando.status)"
                  >
                    {{ contratoVisualizando.status }}
                  </span>
                </dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Data de Início</dt>
                <dd class="text-sm text-gray-900 dark:text-white">{{ formatDate(contratoVisualizando.data_inicio) }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Data de Vencimento</dt>
                <dd class="text-sm text-gray-900 dark:text-white">{{ formatDate(contratoVisualizando.data_vencimento) }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Prazo</dt>
                <dd class="text-sm text-gray-900 dark:text-white">{{ contratoVisualizando.prazo_meses }} meses</dd>
              </div>
            </dl>
          </div>

          <div>
            <h3 class="text-base font-semibold text-gray-900 dark:text-white mb-4">Valores</h3>
            <dl class="space-y-3">
              <div>
                <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Aluguel</dt>
                <dd class="text-sm text-gray-900 dark:text-white">{{ formatCurrency(contratoVisualizando.valor_aluguel) }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Condomínio</dt>
                <dd class="text-sm text-gray-900 dark:text-white">{{ formatCurrency(contratoVisualizando.valor_condominio || 0) }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Total</dt>
                <dd class="text-sm font-semibold text-gray-900 dark:text-white">
                  {{ formatCurrency((contratoVisualizando.valor_aluguel || 0) + (contratoVisualizando.valor_condominio || 0)) }}
                </dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Multa por Atraso</dt>
                <dd class="text-sm text-gray-900 dark:text-white">{{ contratoVisualizando.multa_atraso || 0 }}%</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Juros por Atraso</dt>
                <dd class="text-sm text-gray-900 dark:text-white">{{ contratoVisualizando.juros_atraso || 0 }}% ao mês</dd>
              </div>
            </dl>
          </div>
        </div>

        <div class="border-t border-gray-200 dark:border-gray-700 pt-4">
          <h3 class="text-base font-semibold text-gray-900 dark:text-white mb-4">Inquilino</h3>
          <dl class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Nome</dt>
              <dd class="text-sm text-gray-900 dark:text-white">{{ contratoVisualizando.inquilino_nome }}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">CPF</dt>
              <dd class="text-sm text-gray-900 dark:text-white">{{ contratoVisualizando.inquilino_cpf }}</dd>
            </div>
          </dl>
        </div>

        <div class="border-t border-gray-200 dark:border-gray-700 pt-4">
          <h3 class="text-base font-semibold text-gray-900 dark:text-white mb-4">Imóvel</h3>
          <dl class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Código</dt>
              <dd class="text-sm text-gray-900 dark:text-white">{{ contratoVisualizando.imovel_codigo }}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Endereço</dt>
              <dd class="text-sm text-gray-900 dark:text-white">{{ contratoVisualizando.imovel_endereco }}</dd>
            </div>
          </dl>
        </div>

        <div v-if="contratoVisualizando.observacao" class="border-t border-gray-200 dark:border-gray-700 pt-4">
          <h3 class="text-base font-semibold text-gray-900 dark:text-white mb-4">Observações</h3>
          <p class="text-sm text-gray-700 dark:text-gray-300">{{ contratoVisualizando.observacao }}</p>
        </div>
      </div>
      <template #footer>
        <div class="flex justify-end">
          <button
            @click="showViewModal = false"
            class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Fechar
          </button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  DocumentPlusIcon,
  PencilIcon,
  TrashIcon,
  DocumentDuplicateIcon,
  EyeIcon
} from '@heroicons/vue/24/outline'

// Mock de inquilinos disponíveis
const inquilinosDisponiveis = ref([
  { id: 1, nome: 'João Silva', cpf: '123.456.789-00' },
  { id: 2, nome: 'Maria Santos', cpf: '987.654.321-00' },
  { id: 3, nome: 'Pedro Oliveira', cpf: '111.222.333-44' },
  { id: 4, nome: 'Ana Costa', cpf: '555.666.777-88' },
  { id: 5, nome: 'Carlos Mendes', cpf: '999.888.777-66' },
])

// Mock de imóveis disponíveis
const imoveisDisponiveis = ref([
  { id: 1, codigo: 'APT-001', endereco: 'Rua das Flores, 123 - Centro' },
  { id: 2, codigo: 'APT-002', endereco: 'Av. Principal, 456 - Jardim' },
  { id: 3, codigo: 'CASA-003', endereco: 'Rua Nova, 789 - Bairro Novo' },
  { id: 4, codigo: 'APT-004', endereco: 'Rua das Palmeiras, 100 - Centro' },
  { id: 5, codigo: 'CASA-005', endereco: 'Av. dos Bandeirantes, 200 - Jardim América' },
])

// Dados mockados
const mockContratos = [
  {
    id: 1,
    codigo: 'CONTRATO-001',
    inquilino_id: 1,
    inquilino_nome: 'João Silva',
    inquilino_cpf: '123.456.789-00',
    imovel_id: 1,
    imovel_codigo: 'APT-001',
    imovel_endereco: 'Rua das Flores, 123 - Centro',
    valor_aluguel: 1500.00,
    valor_condominio: 300.00,
    data_inicio: '2024-01-01',
    data_vencimento: '2024-05-05',
    prazo_meses: 12,
    dia_vencimento: 5,
    multa_atraso: 2.00,
    juros_atraso: 1.00,
    indice_reajuste: 'IGP-M',
    status: 'Ativo',
    observacao: ''
  },
  {
    id: 2,
    codigo: 'CONTRATO-002',
    inquilino_id: 2,
    inquilino_nome: 'Maria Santos',
    inquilino_cpf: '987.654.321-00',
    imovel_id: 2,
    imovel_codigo: 'APT-002',
    imovel_endereco: 'Av. Principal, 456 - Jardim',
    valor_aluguel: 2000.00,
    valor_condominio: 450.00,
    data_inicio: '2024-02-01',
    data_vencimento: '2024-05-05',
    prazo_meses: 24,
    dia_vencimento: 5,
    multa_atraso: 2.00,
    juros_atraso: 1.00,
    indice_reajuste: 'IPCA',
    status: 'Ativo',
    observacao: ''
  },
  {
    id: 3,
    codigo: 'CONTRATO-003',
    inquilino_id: 3,
    inquilino_nome: 'Pedro Oliveira',
    inquilino_cpf: '111.222.333-44',
    imovel_id: 3,
    imovel_codigo: 'CASA-003',
    imovel_endereco: 'Rua Nova, 789 - Bairro Novo',
    valor_aluguel: 2500.00,
    valor_condominio: 0,
    data_inicio: '2023-12-01',
    data_vencimento: '2024-04-03',
    prazo_meses: 12,
    dia_vencimento: 3,
    multa_atraso: 2.00,
    juros_atraso: 1.00,
    indice_reajuste: 'IGP-M',
    status: 'Vencido',
    observacao: 'Contrato vencido, aguardando renovação'
  },
  {
    id: 4,
    codigo: 'CONTRATO-004',
    inquilino_id: 4,
    inquilino_nome: 'Ana Costa',
    inquilino_cpf: '555.666.777-88',
    imovel_id: 4,
    imovel_codigo: 'APT-004',
    imovel_endereco: 'Rua das Palmeiras, 100 - Centro',
    valor_aluguel: 1800.00,
    valor_condominio: 250.00,
    data_inicio: '2023-06-01',
    data_vencimento: '2024-06-05',
    prazo_meses: 12,
    dia_vencimento: 5,
    multa_atraso: 2.00,
    juros_atraso: 1.00,
    indice_reajuste: 'Fixo',
    status: 'Renovado',
    observacao: 'Contrato renovado automaticamente'
  },
  {
    id: 5,
    codigo: 'CONTRATO-005',
    inquilino_id: 5,
    inquilino_nome: 'Carlos Mendes',
    inquilino_cpf: '999.888.777-66',
    imovel_id: 5,
    imovel_codigo: 'CASA-005',
    imovel_endereco: 'Av. dos Bandeirantes, 200 - Jardim América',
    valor_aluguel: 3000.00,
    valor_condominio: 0,
    data_inicio: '2023-01-01',
    data_vencimento: '2024-03-05',
    prazo_meses: 12,
    dia_vencimento: 5,
    multa_atraso: 2.00,
    juros_atraso: 1.00,
    indice_reajuste: 'IGP-M',
    status: 'Rescindido',
    observacao: 'Contrato rescindido em março/2024'
  },
]

const contratos = ref([...mockContratos])
const loading = ref(false)
const showModal = ref(false)
const showViewModal = ref(false)
const isEditing = ref(false)
const selectedContrato = ref(null)
const contratoVisualizando = ref(null)

const filters = reactive({
  search: '',
  status: '',
  periodo: '',
  mes_ano: ''
})

const form = reactive({
  codigo: '',
  inquilino_id: '',
  imovel_id: '',
  valor_aluguel: '',
  valor_condominio: '',
  data_inicio: '',
  data_vencimento: '',
  prazo_meses: 12,
  dia_vencimento: 5,
  multa_atraso: 2.00,
  juros_atraso: 1.00,
  indice_reajuste: 'IGP-M',
  status: 'Ativo',
  observacao: ''
})

// Paginação
const currentPage = ref(1)
const perPage = 10

const inquilinoSelecionado = computed(() => {
  return inquilinosDisponiveis.value.find(i => i.id === form.inquilino_id)
})

const imovelSelecionado = computed(() => {
  return imoveisDisponiveis.value.find(i => i.id === form.imovel_id)
})

const valorTotal = computed(() => {
  const aluguel = form.valor_aluguel || 0
  const condominio = form.valor_condominio || 0
  return formatCurrency(aluguel + condominio)
})

const filteredContratos = computed(() => {
  let filtered = [...contratos.value]
  
  if (filters.search) {
    const search = filters.search.toLowerCase()
    filtered = filtered.filter(c => 
      c.codigo.toLowerCase().includes(search) ||
      c.inquilino_nome.toLowerCase().includes(search) ||
      c.imovel_codigo.toLowerCase().includes(search)
    )
  }
  
  if (filters.status) {
    filtered = filtered.filter(c => c.status === filters.status)
  }
  
  if (filters.periodo) {
    const hoje = new Date()
    hoje.setHours(0, 0, 0, 0)
    
    filtered = filtered.filter(c => {
      const vencimento = new Date(c.data_vencimento)
      vencimento.setHours(0, 0, 0, 0)
      const diffTime = vencimento - hoje
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      
      switch (filters.periodo) {
        case 'vencendo_hoje':
          return diffDays === 0
        case 'vencendo_7_dias':
          return diffDays >= 0 && diffDays <= 7
        case 'vencendo_30_dias':
          return diffDays >= 0 && diffDays <= 30
        case 'vencidos':
          return diffDays < 0
        default:
          return true
      }
    })
  }
  
  if (filters.mes_ano) {
    const [ano, mes] = filters.mes_ano.split('-')
    filtered = filtered.filter(c => {
      const vencimento = new Date(c.data_vencimento)
      return vencimento.getFullYear() === parseInt(ano) && 
             (vencimento.getMonth() + 1) === parseInt(mes)
    })
  }
  
  return filtered
})

const totalItems = computed(() => filteredContratos.value.length)
const totalPages = computed(() => Math.ceil(totalItems.value / perPage))
const startIndex = computed(() => (currentPage.value - 1) * perPage)
const endIndex = computed(() => Math.min(startIndex.value + perPage, totalItems.value))

const paginatedContratos = computed(() => {
  return filteredContratos.value.slice(startIndex.value, endIndex.value)
})

const formatCurrency = (value) => {
  if (!value && value !== 0) return 'R$ 0,00'
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
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

const getInicial = (nome) => {
  if (!nome) return '?'
  return nome.charAt(0).toUpperCase()
}

const getStatusClass = (status) => {
  switch (status) {
    case 'Ativo':
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
    case 'Vencido':
      return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
    case 'Rescindido':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
    case 'Renovado':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
  }
}

const isVencendo = (dataVencimento) => {
  if (!dataVencimento) return false
  const hoje = new Date()
  hoje.setHours(0, 0, 0, 0)
  const vencimento = new Date(dataVencimento)
  vencimento.setHours(0, 0, 0, 0)
  const diffTime = vencimento - hoje
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays >= 0 && diffDays <= 7
}

const diasParaVencimento = (dataVencimento) => {
  if (!dataVencimento) return ''
  const hoje = new Date()
  hoje.setHours(0, 0, 0, 0)
  const vencimento = new Date(dataVencimento)
  vencimento.setHours(0, 0, 0, 0)
  const diffTime = vencimento - hoje
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays < 0) {
    return `${Math.abs(diffDays)} dias vencido`
  } else if (diffDays === 0) {
    return 'Vence hoje'
  } else if (diffDays === 1) {
    return 'Vence amanhã'
  } else {
    return `Vence em ${diffDays} dias`
  }
}

const handleSearch = () => {
  currentPage.value = 1
}

const openCreateModal = () => {
  isEditing.value = false
  selectedContrato.value = null
  resetForm()
  showModal.value = true
}

const openEditModal = (contrato) => {
  isEditing.value = true
  selectedContrato.value = contrato
  form.codigo = contrato.codigo
  form.inquilino_id = contrato.inquilino_id
  form.imovel_id = contrato.imovel_id
  form.valor_aluguel = contrato.valor_aluguel
  form.valor_condominio = contrato.valor_condominio || ''
  form.data_inicio = contrato.data_inicio
  form.data_vencimento = contrato.data_vencimento
  form.prazo_meses = contrato.prazo_meses
  form.dia_vencimento = contrato.dia_vencimento
  form.multa_atraso = contrato.multa_atraso
  form.juros_atraso = contrato.juros_atraso
  form.indice_reajuste = contrato.indice_reajuste
  form.status = contrato.status
  form.observacao = contrato.observacao || ''
  showModal.value = true
}

const openViewModal = (contrato) => {
  contratoVisualizando.value = contrato
  showViewModal.value = true
}

const resetForm = () => {
  form.codigo = ''
  form.inquilino_id = ''
  form.imovel_id = ''
  form.valor_aluguel = ''
  form.valor_condominio = ''
  form.data_inicio = ''
  form.data_vencimento = ''
  form.prazo_meses = 12
  form.dia_vencimento = 5
  form.multa_atraso = 2.00
  form.juros_atraso = 1.00
  form.indice_reajuste = 'IGP-M'
  form.status = 'Ativo'
  form.observacao = ''
}

const handleModalClose = () => {
  resetForm()
  selectedContrato.value = null
}

const handleSubmit = () => {
  if (!form.inquilino_id || !form.imovel_id || !form.valor_aluguel || !form.data_inicio || !form.data_vencimento) {
    ElMessage.warning('Preencha todos os campos obrigatórios')
    return
  }

  const inquilino = inquilinosDisponiveis.value.find(i => i.id === form.inquilino_id)
  const imovel = imoveisDisponiveis.value.find(i => i.id === form.imovel_id)
  
  if (isEditing.value) {
    const index = contratos.value.findIndex(c => c.id === selectedContrato.value.id)
    if (index !== -1) {
      contratos.value[index] = {
        ...contratos.value[index],
        ...form,
        inquilino_nome: inquilino?.nome || '',
        inquilino_cpf: inquilino?.cpf || '',
        imovel_codigo: imovel?.codigo || '',
        imovel_endereco: imovel?.endereco || ''
      }
      ElMessage.success('Contrato atualizado com sucesso!')
    }
  } else {
    if (!form.codigo) {
      form.codigo = `CONTRATO-${String(contratos.value.length + 1).padStart(3, '0')}`
    }
    
    const novoContrato = {
      id: contratos.value.length + 1,
      ...form,
      inquilino_nome: inquilino?.nome || '',
      inquilino_cpf: inquilino?.cpf || '',
      imovel_codigo: imovel?.codigo || '',
      imovel_endereco: imovel?.endereco || ''
    }
    contratos.value.push(novoContrato)
    ElMessage.success('Contrato cadastrado com sucesso!')
  }

  showModal.value = false
  resetForm()
}

const handleDelete = (id) => {
  ElMessageBox.confirm(
    'Tem certeza que deseja excluir este contrato?',
    'Excluir Contrato',
    {
      confirmButtonText: 'Excluir',
      cancelButtonText: 'Cancelar',
      type: 'warning'
    }
  ).then(() => {
    const index = contratos.value.findIndex(c => c.id === id)
    if (index !== -1) {
      contratos.value.splice(index, 1)
      ElMessage.success('Contrato excluído com sucesso!')
    }
  }).catch(() => {})
}
</script>
